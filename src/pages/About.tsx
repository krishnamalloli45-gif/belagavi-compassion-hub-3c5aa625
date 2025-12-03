import { Layout } from "@/components/layout/Layout";
import { Target, Eye, Heart, Award, Users, Calendar, MapPin } from "lucide-react";

const values = [
  { icon: Heart, title: "Compassion", description: "We lead with empathy and genuine care for every individual we serve." },
  { icon: Award, title: "Integrity", description: "Transparency and honesty guide all our actions and decisions." },
  { icon: Users, title: "Community", description: "We believe in the power of collective action and inclusive participation." },
  { icon: Target, title: "Impact", description: "Every initiative is designed to create meaningful, lasting change." },
];

const milestones = [
  { year: "2010", title: "Foundation", description: "Step Towards Welfare was established by a group of dedicated social workers in Belagavi." },
  { year: "2013", title: "First Education Center", description: "Opened our first learning center for underprivileged children." },
  { year: "2016", title: "Health Initiative Launch", description: "Started organizing monthly health camps across Belagavi district." },
  { year: "2019", title: "Environmental Focus", description: "Launched green Belagavi initiative with tree plantation drives." },
  { year: "2022", title: "NGO Network", description: "Established partnerships with 50+ local NGOs for collaborative impact." },
  { year: "2024", title: "Digital Expansion", description: "Launched digital platforms to reach more communities." },
];

const team = [
  { name: "Dr. Ramesh Joshi", role: "Founder & President", description: "Social activist with 20+ years of community service experience." },
  { name: "Sneha Kulkarni", role: "Executive Director", description: "Former corporate professional turned social entrepreneur." },
  { name: "Anil Desai", role: "Operations Head", description: "Expert in NGO management and community mobilization." },
  { name: "Meera Patil", role: "Program Coordinator", description: "Passionate educator dedicated to children's welfare." },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
              Our Story of Hope and{" "}
              <span className="text-primary">Transformation</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              For over a decade, Step Towards Welfare has been at the heart of 
              social change in Belagavi, touching thousands of lives through 
              compassion and dedicated service.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To uplift communities in Belagavi and surrounding areas through sustainable 
                development programs focused on education, healthcare, environmental conservation, 
                and social welfare. We aim to empower individuals and create lasting positive 
                change through collaborative action and grassroots initiatives.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-display text-2xl text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Belagavi where every individual, regardless of their background, has 
                access to quality education, healthcare, and opportunities for growth. 
                We envision a community where compassion drives action and where sustainable 
                development ensures prosperity for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Our Journey
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-foreground">
                The Story Behind Our Mission
              </h2>
            </div>
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Step Towards Welfare was born in 2010 from a simple belief: that every small 
                act of kindness can create ripples of change. Our founder, Dr. Ramesh Joshi, 
                witnessed the struggles of underprivileged communities in Belagavi and decided 
                that action was needed, not just sympathy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                What started as weekend teaching sessions for street children has now grown 
                into a comprehensive organization addressing education, healthcare, environmental 
                conservation, and community development. Our journey has been marked by 
                challenges, but the smiles on the faces of those we serve make every effort 
                worthwhile.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we work with a network of 50+ partner NGOs, hundreds of volunteers, 
                and countless community members who share our vision of a better Belagavi. 
                Our story is not just ours—it belongs to everyone who has contributed to 
                this mission of hope and transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Values
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground">
              Principles That Guide Us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
              Our Journey
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-primary-foreground">
              Milestones Along the Way
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-foreground/20 -translate-x-1/2" />
              
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-16 md:pl-0`}>
                    <div className="glass-dark rounded-2xl p-6">
                      <span className="text-accent font-display text-2xl">{milestone.year}</span>
                      <h3 className="font-display text-lg text-primary-foreground mt-2 mb-2">{milestone.title}</h3>
                      <p className="text-primary-foreground/70 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-accent border-4 border-primary -translate-x-1/2" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Our Team
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4">
              Meet the People Behind the Mission
            </h2>
            <p className="text-muted-foreground">
              Dedicated individuals who work tirelessly to make our vision a reality.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary text-3xl font-display">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-display text-lg text-foreground mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
