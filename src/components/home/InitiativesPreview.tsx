import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Leaf, 
  HeartPulse, 
  Users, 
  Dog,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const initiatives = [
  {
    icon: GraduationCap,
    title: "Education Support",
    description: "Providing scholarships, learning materials, and educational infrastructure to underprivileged children in Belagavi.",
    color: "bg-blue-500/10 text-blue-600",
    hoverColor: "group-hover:bg-blue-500",
  },
  {
    icon: Leaf,
    title: "Environment Drives",
    description: "Organizing tree plantation drives, cleanliness campaigns, and waste management initiatives across Belagavi.",
    color: "bg-green-500/10 text-green-600",
    hoverColor: "group-hover:bg-green-500",
  },
  {
    icon: HeartPulse,
    title: "Health Camps",
    description: "Conducting free health checkups, blood donation camps, and medical assistance programs for the community.",
    color: "bg-red-500/10 text-red-600",
    hoverColor: "group-hover:bg-red-500",
  },
  {
    icon: Users,
    title: "Youth Development",
    description: "Empowering young people through skill development workshops, career guidance, and leadership programs.",
    color: "bg-purple-500/10 text-purple-600",
    hoverColor: "group-hover:bg-purple-500",
  },
  {
    icon: Dog,
    title: "Animal Welfare",
    description: "Rescuing and rehabilitating stray animals, promoting animal rights awareness, and providing veterinary care.",
    color: "bg-amber-500/10 text-amber-600",
    hoverColor: "group-hover:bg-amber-500",
  },
];

export function InitiativesPreview() {
  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Our Initiatives
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
            Building a Stronger Community
          </h2>
          <p className="text-muted-foreground text-lg">
            Through our diverse range of initiatives, we address the most pressing 
            needs of Belagavi's communities while fostering sustainable development.
          </p>
        </div>
        
        {/* Initiatives Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {initiatives.map((initiative, index) => (
            <div
              key={initiative.title}
              className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${initiative.color} flex items-center justify-center mb-6 ${initiative.hoverColor} transition-colors duration-300`}
              >
                <initiative.icon className="w-8 h-8 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-3">
                {initiative.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {initiative.description}
              </p>
            </div>
          ))}
          
          {/* CTA Card */}
          <div className="group bg-primary rounded-2xl p-8 flex flex-col justify-center items-center text-center hover:shadow-elevated transition-all duration-300 hover:-translate-y-2">
            <h3 className="font-display text-2xl text-primary-foreground mb-4">
              Explore All Initiatives
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Discover how you can contribute to our mission
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/initiatives">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
