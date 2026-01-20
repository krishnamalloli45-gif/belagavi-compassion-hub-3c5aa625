import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Initiatives from "./pages/Initiatives";
import NGODirectory from "./pages/NGODirectory";
import GetInvolved from "./pages/GetInvolved";
import Donate from "./pages/Donate";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FinanceOverview from "./pages/admin/finance/FinanceOverview";
import IncomeManagement from "./pages/admin/finance/IncomeManagement";
import ExpenseManagement from "./pages/admin/finance/ExpenseManagement";
import FundAccounts from "./pages/admin/finance/FundAccounts";
import FinanceReports from "./pages/admin/finance/FinanceReports";
import UserManagement from "./pages/admin/UserManagement";
import FoodInventory from "./pages/admin/inventory/FoodInventory";
import MedicineInventory from "./pages/admin/inventory/MedicineInventory";
import StaffManagement from "./pages/admin/staff/StaffManagement";
import AttendanceManagement from "./pages/admin/staff/AttendanceManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/initiatives" element={<Initiatives />} />
            <Route path="/ngos" element={<NGODirectory />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="finance" element={<FinanceOverview />} />
              <Route path="finance/income" element={<IncomeManagement />} />
              <Route path="finance/expenses" element={<ExpenseManagement />} />
              <Route path="finance/funds" element={<FundAccounts />} />
              <Route path="finance/reports" element={<FinanceReports />} />
              <Route path="inventory/food" element={<FoodInventory />} />
              <Route path="inventory/medicine" element={<MedicineInventory />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="staff/attendance" element={<AttendanceManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
