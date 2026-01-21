-- Create food_inventory table
CREATE TABLE public.food_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  expiry_date DATE,
  category TEXT,
  minimum_stock INTEGER DEFAULT 10,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medicine_inventory table
CREATE TABLE public.medicine_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  batch_number TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'tablets',
  expiry_date DATE,
  manufacturer TEXT,
  minimum_stock INTEGER DEFAULT 20,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff table
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'Volunteer',
  department TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'present',
  check_in_time TIME,
  check_out_time TIME,
  notes TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(staff_id, date)
);

-- Create usage_logs table for audit trail
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_type TEXT NOT NULL,
  item_id UUID,
  item_name TEXT,
  quantity_change INTEGER,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.food_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for food_inventory
CREATE POLICY "Staff can view food inventory"
ON public.food_inventory FOR SELECT
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert food inventory"
ON public.food_inventory FOR INSERT
WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can update food inventory"
ON public.food_inventory FOR UPDATE
USING (is_staff(auth.uid()));

CREATE POLICY "Admin can delete food inventory"
ON public.food_inventory FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for medicine_inventory
CREATE POLICY "Staff can view medicine inventory"
ON public.medicine_inventory FOR SELECT
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert medicine inventory"
ON public.medicine_inventory FOR INSERT
WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can update medicine inventory"
ON public.medicine_inventory FOR UPDATE
USING (is_staff(auth.uid()));

CREATE POLICY "Admin can delete medicine inventory"
ON public.medicine_inventory FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for staff
CREATE POLICY "Staff can view staff records"
ON public.staff FOR SELECT
USING (is_staff(auth.uid()));

CREATE POLICY "Admin can insert staff"
ON public.staff FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update staff"
ON public.staff FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete staff"
ON public.staff FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for attendance
CREATE POLICY "Staff can view attendance"
ON public.attendance FOR SELECT
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert attendance"
ON public.attendance FOR INSERT
WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can update attendance"
ON public.attendance FOR UPDATE
USING (is_staff(auth.uid()));

CREATE POLICY "Admin can delete attendance"
ON public.attendance FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for usage_logs
CREATE POLICY "Staff can view usage logs"
ON public.usage_logs FOR SELECT
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can insert usage logs"
ON public.usage_logs FOR INSERT
WITH CHECK (is_staff(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_food_inventory_updated_at
BEFORE UPDATE ON public.food_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicine_inventory_updated_at
BEFORE UPDATE ON public.medicine_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();