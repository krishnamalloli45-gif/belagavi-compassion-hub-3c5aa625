-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'finance', 'project_manager', 'volunteer', 'auditor');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Create income_categories table
CREATE TABLE public.income_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create expense_categories table
CREATE TABLE public.expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create income_records table
CREATE TABLE public.income_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.income_categories(id),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  source TEXT,
  receipt_number TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  recorded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create expense_records table
CREATE TABLE public.expense_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.expense_categories(id),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  vendor TEXT,
  invoice_number TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  recorded_by UUID REFERENCES auth.users(id) NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create fund_accounts table
CREATE TABLE public.fund_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  balance DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_accounts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user has any staff role
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User roles policies (only admins can manage)
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Category policies (staff can view, admin/finance can manage)
CREATE POLICY "Staff can view income categories"
  ON public.income_categories FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin/Finance can manage income categories"
  ON public.income_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Staff can view expense categories"
  ON public.expense_categories FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin/Finance can manage expense categories"
  ON public.expense_categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

-- Income records policies
CREATE POLICY "Staff can view income records"
  ON public.income_records FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Finance/Admin can insert income"
  ON public.income_records FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Finance/Admin can update income"
  ON public.income_records FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Admin can delete income"
  ON public.income_records FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Expense records policies
CREATE POLICY "Staff can view expense records"
  ON public.expense_records FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can insert expenses"
  ON public.expense_records FOR INSERT
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Finance/Admin can update expenses"
  ON public.expense_records FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Admin can delete expenses"
  ON public.expense_records FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Fund accounts policies
CREATE POLICY "Staff can view fund accounts"
  ON public.fund_accounts FOR SELECT
  USING (public.is_staff(auth.uid()));

CREATE POLICY "Admin/Finance can manage fund accounts"
  ON public.fund_accounts FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_income_records_updated_at
  BEFORE UPDATE ON public.income_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expense_records_updated_at
  BEFORE UPDATE ON public.expense_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fund_accounts_updated_at
  BEFORE UPDATE ON public.fund_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.income_categories (name, description) VALUES
  ('Donations', 'General donations from individuals'),
  ('Corporate Sponsorship', 'Donations from corporate entities'),
  ('Grants', 'Government or foundation grants'),
  ('Fundraising Events', 'Income from fundraising activities'),
  ('Membership Fees', 'Annual membership contributions'),
  ('Interest Income', 'Bank interest and investment returns'),
  ('Other Income', 'Miscellaneous income sources');

INSERT INTO public.expense_categories (name, description) VALUES
  ('Salaries & Wages', 'Staff compensation'),
  ('Office Expenses', 'Rent, utilities, supplies'),
  ('Program Expenses', 'Direct program delivery costs'),
  ('Travel & Transport', 'Staff travel and logistics'),
  ('Marketing & Outreach', 'Promotional activities'),
  ('Professional Services', 'Legal, accounting, consulting'),
  ('Equipment & Assets', 'Capital expenditures'),
  ('Other Expenses', 'Miscellaneous expenses');

INSERT INTO public.fund_accounts (name, description, balance) VALUES
  ('General Fund', 'Unrestricted general operating fund', 0),
  ('Project Fund', 'Restricted funds for specific projects', 0),
  ('Emergency Fund', 'Reserve for emergencies', 0);