import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  CreditCard, 
  Building2, 
  QrCode,
  CheckCircle2,
  Shield,
  Users,
  GraduationCap,
  HeartPulse,
  Leaf
} from "lucide-react";
import { toast } from "sonner";

const donationAmounts = [500, 1000, 2500, 5000, 10000, 25000];

const impactItems = [
  { amount: 500, impact: "Provides school supplies for 1 child for a year" },
  { amount: 1000, impact: "Feeds a family of 4 for one month" },
  { amount: 2500, impact: "Sponsors a health checkup camp for 50 people" },
  { amount: 5000, impact: "Plants 100 trees in Belagavi" },
  { amount: 10000, impact: "Supports skill training for 5 women" },
  { amount: 25000, impact: "Funds a rural school for one month" },
];

const fundAllocation = [
  { icon: GraduationCap, label: "Education", percentage: 35 },
  { icon: HeartPulse, label: "Healthcare", percentage: 25 },
  { icon: Leaf, label: "Environment", percentage: 20 },
  { icon: Users, label: "Community", percentage: 15 },
  { icon: Building2, label: "Operations", percentage: 5 },
];

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    panCard: "",
  });

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    toast.success(`Thank you for your generous donation of ₹${amount}!`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-6">
              <Heart className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground">
                Every Contribution Matters
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary-foreground mb-6">
              Your Generosity Can
              <span className="block text-accent">Transform Lives</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              100% of your donation goes directly to our initiatives. 
              Join hundreds of donors making a difference in Belagavi.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
                  <h2 className="font-display text-2xl text-foreground mb-6">
                    Make a Donation
                  </h2>

                  <form onSubmit={handleDonate} className="space-y-6">
                    {/* Amount Selection */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-4">
                        Select Amount (₹)
                      </label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {donationAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount("");
                            }}
                            className={`py-4 px-4 rounded-xl font-semibold transition-all duration-300 ${
                              selectedAmount === amount && !customAmount
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "bg-muted text-foreground hover:bg-primary/10"
                            }`}
                          >
                            ₹{amount.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                        <Input
                          type="number"
                          placeholder="Enter custom amount"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                          className="pl-8 h-12"
                        />
                      </div>
                    </div>

                    {/* Donor Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Your Information</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                          <Input 
                            placeholder="Your name" 
                            className="h-12"
                            value={donorInfo.name}
                            onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                          <Input 
                            type="email"
                            placeholder="your@email.com" 
                            className="h-12"
                            value={donorInfo.email}
                            onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                          <Input 
                            placeholder="+91 XXXXX XXXXX" 
                            className="h-12"
                            value={donorInfo.phone}
                            onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">PAN Card (for 80G)</label>
                          <Input 
                            placeholder="ABCDE1234F" 
                            className="h-12"
                            value={donorInfo.panCard}
                            onChange={(e) => setDonorInfo({ ...donorInfo, panCard: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-primary text-primary-foreground font-medium"
                        >
                          <CreditCard className="w-5 h-5" />
                          Card/UPI
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-muted text-foreground font-medium hover:bg-primary/10 transition-colors"
                        >
                          <Building2 className="w-5 h-5" />
                          Bank Transfer
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-muted text-foreground font-medium hover:bg-primary/10 transition-colors"
                        >
                          <QrCode className="w-5 h-5" />
                          QR Code
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="xl" variant="hero">
                      <Heart className="w-5 h-5" />
                      Donate ₹{(customAmount ? parseInt(customAmount) : selectedAmount || 0).toLocaleString()}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Secure payment powered by Razorpay</span>
                    </div>
                  </form>
                </div>
              </div>

              {/* Impact Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                {/* Your Impact */}
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                  <h3 className="font-display text-lg text-foreground mb-4">Your Impact</h3>
                  <div className="space-y-3">
                    {impactItems.map((item) => (
                      <div key={item.amount} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">₹{item.amount.toLocaleString()}</span> – {item.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fund Allocation */}
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                  <h3 className="font-display text-lg text-foreground mb-4">How Funds Are Used</h3>
                  <div className="space-y-4">
                    {fundAllocation.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">{item.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax Benefits */}
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                  <h3 className="font-display text-lg text-foreground mb-3">Tax Benefits</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All donations to Step Towards Welfare are eligible for tax deduction 
                    under Section 80G of the Income Tax Act.
                  </p>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>80G certificate will be emailed within 24 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
