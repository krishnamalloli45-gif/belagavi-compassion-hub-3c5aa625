import { Link } from "react-router-dom";
import { ArrowRight, Building2, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredNGOs = [
  {
    name: "Green Earth Foundation",
    category: "Environment",
    description: "Working towards a greener Belagavi through tree plantation and conservation.",
    location: "Tilakwadi, Belagavi",
  },
  {
    name: "Vidya Prabodhini Trust",
    category: "Education",
    description: "Providing quality education to underprivileged children since 1995.",
    location: "Camp Area, Belagavi",
  },
  {
    name: "Arogya Setu",
    category: "Healthcare",
    description: "Free health services and medical camps for rural communities.",
    location: "Khanapur Road, Belagavi",
  },
];

export function NGODirectoryPreview() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6">
              NGOs Directory
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              Belagavi's Network of{" "}
              <span className="text-primary">Change Makers</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Discover and connect with NGOs working across different sectors in 
              Belagavi. From education to healthcare, environment to rural development, 
              find organizations aligned with your passion for social change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/ngos">
                  Browse All NGOs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/ngos#register">
                  Register Your NGO
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Featured NGOs */}
          <div className="space-y-4">
            {featuredNGOs.map((ngo, index) => (
              <div
                key={ngo.name}
                className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border hover:border-primary/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                        {ngo.name}
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        {ngo.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {ngo.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{ngo.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Link
              to="/ngos"
              className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-300"
            >
              <span className="font-medium">View 50+ More NGOs</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
