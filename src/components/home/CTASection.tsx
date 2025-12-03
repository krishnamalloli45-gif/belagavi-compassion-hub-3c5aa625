import { Link } from "react-router-dom";
import { Heart, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 bg-hero-pattern opacity-50" />
          
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-accent/30 rounded-full blur-2xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 py-16 md:py-24 px-8 md:px-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-8">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-primary-foreground">
                  Join the Movement
                </span>
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary-foreground mb-6 leading-tight">
                Be Part of the Change
              </h2>
              
              <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
                Whether you donate, volunteer, or spread the word, every action 
                counts. Together, we can build a brighter future for Belagavi.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild variant="hero" size="xl">
                  <Link to="/donate">
                    <Heart className="w-5 h-5" />
                    Make a Donation
                  </Link>
                </Button>
                <Button asChild variant="hero-outline" size="xl">
                  <Link to="/get-involved">
                    <Users className="w-5 h-5" />
                    Become a Volunteer
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
