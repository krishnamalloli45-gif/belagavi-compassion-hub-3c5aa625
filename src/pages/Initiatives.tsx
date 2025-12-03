import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Leaf, 
  HeartPulse, 
  Users, 
  Dog,
  Home,
  Droplets,
  Briefcase,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const initiatives = [
  {
    icon: GraduationCap,
    title: "Education Support",
    description: "Empowering underprivileged children through quality education and skill development programs.",
    color: "bg-blue-500",
    details: [
      "Scholarships for meritorious students from low-income families",
      "Free tuition centers in underserved areas of Belagavi",
      "Distribution of books, uniforms, and school supplies",
      "Computer literacy and digital skills training",
      "Career counseling and guidance programs",
    ],
    impact: "2,500+ students supported annually",
  },
  {
    icon: Leaf,
    title: "Environment Conservation",
    description: "Creating a greener, cleaner Belagavi through sustainable environmental initiatives.",
    color: "bg-green-500",
    details: [
      "Tree plantation drives across Belagavi district",
      "Waste management and recycling awareness campaigns",
      "River and lake cleanup initiatives",
      "Plastic-free community awareness programs",
      "Urban gardening and composting workshops",
    ],
    impact: "50,000+ trees planted",
  },
  {
    icon: HeartPulse,
    title: "Healthcare Initiatives",
    description: "Providing accessible healthcare services to communities in need.",
    color: "bg-red-500",
    details: [
      "Free health checkup camps in rural areas",
      "Blood donation drives and blood bank partnerships",
      "Mental health awareness and counseling",
      "Maternal and child health programs",
      "Medicine distribution to the underprivileged",
    ],
    impact: "15,000+ beneficiaries served",
  },
  {
    icon: Users,
    title: "Women Empowerment",
    description: "Enabling women to become financially independent and confident leaders.",
    color: "bg-purple-500",
    details: [
      "Self-help groups and microfinance support",
      "Skill development workshops (tailoring, handicrafts)",
      "Women's safety and legal awareness programs",
      "Entrepreneurship training and mentorship",
      "Support for victims of domestic violence",
    ],
    impact: "1,200+ women empowered",
  },
  {
    icon: Briefcase,
    title: "Youth Development",
    description: "Preparing young people for a successful future through skill-building programs.",
    color: "bg-indigo-500",
    details: [
      "Vocational training and job-ready skills",
      "Leadership development workshops",
      "Sports and cultural activities",
      "Internship and employment connections",
      "Youth volunteer engagement programs",
    ],
    impact: "800+ youth trained",
  },
  {
    icon: Dog,
    title: "Animal Welfare",
    description: "Caring for stray and abandoned animals in Belagavi.",
    color: "bg-amber-500",
    details: [
      "Rescue and rehabilitation of injured animals",
      "Free vaccination and sterilization camps",
      "Animal shelter support and adoption drives",
      "Awareness programs against animal cruelty",
      "Feeding programs for street animals",
    ],
    impact: "3,000+ animals rescued",
  },
  {
    icon: Home,
    title: "Rural Development",
    description: "Improving living standards in villages around Belagavi.",
    color: "bg-teal-500",
    details: [
      "Infrastructure development support",
      "Agricultural assistance and training",
      "Rural sanitation and hygiene programs",
      "Community center establishment",
      "Traditional craft preservation",
    ],
    impact: "25 villages transformed",
  },
  {
    icon: Droplets,
    title: "Water & Sanitation",
    description: "Ensuring access to clean water and proper sanitation facilities.",
    color: "bg-cyan-500",
    details: [
      "Borewell installation in water-scarce areas",
      "Rainwater harvesting systems",
      "Public toilet construction and maintenance",
      "Water purification and testing",
      "Hygiene education programs",
    ],
    impact: "10,000+ people benefited",
  },
];

export default function Initiatives() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Initiatives
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
              Creating Impact Across{" "}
              <span className="text-primary">Multiple Sectors</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Through our diverse range of initiatives, we address the most pressing 
              needs of Belagavi's communities while fostering sustainable development.
            </p>
          </div>
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {initiatives.map((initiative, index) => (
              <div 
                key={initiative.title}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-16 h-16 rounded-2xl ${initiative.color} flex items-center justify-center mb-6`}>
                    <initiative.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-display text-3xl text-foreground mb-4">
                    {initiative.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {initiative.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {initiative.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-full bg-primary/10">
                      <span className="text-primary font-semibold">{initiative.impact}</span>
                    </div>
                    <Button asChild variant="outline">
                      <Link to="/get-involved">
                        Support This Initiative
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} bg-muted rounded-3xl p-8 h-80 flex items-center justify-center`}>
                  <initiative.icon className={`w-32 h-32 ${initiative.color.replace('bg-', 'text-').replace('-500', '-300')}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-primary-foreground mb-6">
            Want to Support Our Initiatives?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Your contribution can help us expand our reach and impact more lives in Belagavi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="hero" size="xl">
              <Link to="/donate">Donate Now</Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/get-involved">Volunteer With Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
