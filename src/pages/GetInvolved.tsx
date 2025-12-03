import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Building2, 
  Heart, 
  Calendar, 
  CheckCircle2,
  ArrowRight,
  Handshake,
  GraduationCap,
  Clock
} from "lucide-react";
import { toast } from "sonner";

const volunteerOpportunities = [
  {
    icon: GraduationCap,
    title: "Teaching & Tutoring",
    description: "Help underprivileged children with their education by teaching at our learning centers.",
    commitment: "4-6 hours/week",
  },
  {
    icon: Heart,
    title: "Health Camp Support",
    description: "Assist in organizing and conducting health camps in rural areas.",
    commitment: "Event-based",
  },
  {
    icon: Users,
    title: "Community Outreach",
    description: "Spread awareness about our initiatives and engage with local communities.",
    commitment: "Flexible",
  },
  {
    icon: Calendar,
    title: "Event Management",
    description: "Help plan and execute fundraising events, awareness campaigns, and community gatherings.",
    commitment: "Project-based",
  },
];

const partnershipTypes = [
  {
    title: "Corporate Partnership",
    description: "CSR collaborations, employee volunteering programs, and cause-related marketing.",
    benefits: ["Tax benefits under Section 80G", "Employee engagement opportunities", "Brand visibility and goodwill"],
  },
  {
    title: "Institutional Partnership",
    description: "Collaborations with schools, colleges, and other educational institutions.",
    benefits: ["Student internship programs", "Research collaborations", "Community service projects"],
  },
  {
    title: "NGO Partnership",
    description: "Collaborative initiatives with other NGOs for greater collective impact.",
    benefits: ["Resource sharing", "Joint programs", "Expanded reach"],
  },
];

export default function GetInvolved() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your interest! We'll contact you soon.");
    setFormData({ name: "", email: "", phone: "", interest: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Get Involved
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
              Join the Movement for{" "}
              <span className="text-primary">Positive Change</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              There are many ways to contribute to our mission. Whether you volunteer 
              your time, partner with us, or support our initiatives, every contribution 
              makes a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
              Become a Volunteer
            </h2>
            <p className="text-muted-foreground">
              Join our team of dedicated volunteers making a real difference in Belagavi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {volunteerOpportunities.map((opportunity) => (
              <div
                key={opportunity.title}
                className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                  <opportunity.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">
                  {opportunity.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {opportunity.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Clock className="w-4 h-4" />
                  <span>{opportunity.commitment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Registration Form */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl text-foreground mb-6">
                  Register as a Volunteer
                </h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form and our team will get in touch with you to discuss 
                  how you can contribute based on your skills and interests.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">Flexible volunteering hours</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">Certificate of appreciation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">Skill development opportunities</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">Be part of a caring community</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 shadow-card">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <Input 
                      placeholder="Your name" 
                      className="h-12"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="h-12"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <Input 
                      placeholder="+91 XXXXX XXXXX" 
                      className="h-12"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Area of Interest</label>
                    <select 
                      className="w-full h-12 rounded-lg border border-input bg-background px-4"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      required
                    >
                      <option value="">Select an area</option>
                      <option value="education">Education & Tutoring</option>
                      <option value="health">Health Camps</option>
                      <option value="environment">Environment</option>
                      <option value="events">Event Management</option>
                      <option value="outreach">Community Outreach</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message (Optional)</label>
                    <textarea 
                      placeholder="Tell us about yourself and your motivation..."
                      className="w-full h-24 rounded-lg border border-input bg-background px-4 py-3 resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Submit Application
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
              Partner With Us
            </h2>
            <p className="text-muted-foreground">
              Collaborate with us to create greater social impact through corporate 
              partnerships, institutional collaborations, and NGO alliances.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {partnershipTypes.map((partnership) => (
              <div
                key={partnership.title}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border"
              >
                <h3 className="font-display text-xl text-foreground mb-3">
                  {partnership.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {partnership.description}
                </p>
                <h4 className="text-sm font-semibold text-foreground mb-3">Benefits:</h4>
                <ul className="space-y-2">
                  {partnership.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <a href="/contact">
                Discuss Partnership
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
