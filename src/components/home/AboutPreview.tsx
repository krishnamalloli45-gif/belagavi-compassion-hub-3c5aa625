import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To uplift communities in Belagavi through sustainable development programs focused on education, health, and social welfare.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description: "A Belagavi where every individual has access to quality education, healthcare, and opportunities for growth.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "Compassion, integrity, transparency, and community-driven action guide everything we do.",
  },
];

export function AboutPreview() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              Creating Lasting Change in{" "}
              <span className="text-primary">Belagavi</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Founded in 2025, Step Towards Welfare has been at the forefront of
              social transformation in Belagavi. We believe in empowering communities 
              through education, healthcare initiatives, and sustainable development 
              programs that create lasting impact.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our dedicated team of volunteers and staff work tirelessly to address 
              the most pressing needs of our community, from supporting underprivileged 
              children's education to organizing blood donation camps and environmental 
              conservation drives.
            </p>
            <Button asChild size="lg">
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          {/* Values Cards */}
          <div className="space-y-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <value.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
