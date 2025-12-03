import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  Building2,
  Filter,
  Plus
} from "lucide-react";

const categories = [
  "All",
  "Education",
  "Healthcare",
  "Environment",
  "Women Empowerment",
  "Child Welfare",
  "Rural Development",
  "Animal Welfare",
  "Disability Support",
];

const ngos = [
  {
    id: 1,
    name: "Green Earth Foundation",
    category: "Environment",
    description: "Working towards a greener Belagavi through tree plantation, waste management, and conservation programs.",
    location: "Tilakwadi, Belagavi",
    phone: "+91 98765 43210",
    email: "contact@greenearthbgm.org",
    website: "#",
  },
  {
    id: 2,
    name: "Vidya Prabodhini Trust",
    category: "Education",
    description: "Providing quality education to underprivileged children through free schools and scholarship programs.",
    location: "Camp Area, Belagavi",
    phone: "+91 98765 43211",
    email: "info@vidyaprabodhini.org",
    website: "#",
  },
  {
    id: 3,
    name: "Arogya Setu",
    category: "Healthcare",
    description: "Free health services and medical camps for rural communities across Belagavi district.",
    location: "Khanapur Road, Belagavi",
    phone: "+91 98765 43212",
    email: "help@arogyasetu.org",
    website: "#",
  },
  {
    id: 4,
    name: "Nari Shakti Foundation",
    category: "Women Empowerment",
    description: "Empowering women through skill development, self-help groups, and entrepreneurship support.",
    location: "Shahapur, Belagavi",
    phone: "+91 98765 43213",
    email: "contact@narishakti.org",
    website: "#",
  },
  {
    id: 5,
    name: "Little Hearts Orphanage",
    category: "Child Welfare",
    description: "Providing shelter, education, and care for orphaned and abandoned children.",
    location: "Vadgaon, Belagavi",
    phone: "+91 98765 43214",
    email: "info@littlehearts.org",
    website: "#",
  },
  {
    id: 6,
    name: "Gramin Vikas Sangha",
    category: "Rural Development",
    description: "Holistic rural development focusing on agriculture, infrastructure, and community welfare.",
    location: "Gokak, Belagavi District",
    phone: "+91 98765 43215",
    email: "contact@graminvikas.org",
    website: "#",
  },
  {
    id: 7,
    name: "Animal Care Belagavi",
    category: "Animal Welfare",
    description: "Rescuing, treating, and rehabilitating stray and injured animals in Belagavi.",
    location: "Hindwadi, Belagavi",
    phone: "+91 98765 43216",
    email: "help@animalcarebgm.org",
    website: "#",
  },
  {
    id: 8,
    name: "Samarthya Foundation",
    category: "Disability Support",
    description: "Supporting persons with disabilities through rehabilitation, education, and employment.",
    location: "College Road, Belagavi",
    phone: "+91 98765 43217",
    email: "info@samarthya.org",
    website: "#",
  },
  {
    id: 9,
    name: "Belagavi Blood Bank Society",
    category: "Healthcare",
    description: "Organizing blood donation camps and maintaining emergency blood supply for hospitals.",
    location: "Udyambag, Belagavi",
    phone: "+91 98765 43218",
    email: "donate@bgmbloodbank.org",
    website: "#",
  },
  {
    id: 10,
    name: "Bal Kalyan Sanstha",
    category: "Child Welfare",
    description: "Working for child rights, education, and protection against child labor and abuse.",
    location: "Angol, Belagavi",
    phone: "+91 98765 43219",
    email: "contact@balkalyan.org",
    website: "#",
  },
  {
    id: 11,
    name: "Swachh Belagavi Abhiyan",
    category: "Environment",
    description: "Citizen-led cleanliness and waste management initiative for a cleaner Belagavi.",
    location: "Sadashiv Nagar, Belagavi",
    phone: "+91 98765 43220",
    email: "team@swachhbgm.org",
    website: "#",
  },
  {
    id: 12,
    name: "Kiran Learning Center",
    category: "Education",
    description: "Free coaching and skill development for students from economically weaker sections.",
    location: "Goaves, Belagavi",
    phone: "+91 98765 43221",
    email: "info@kiranlearning.org",
    website: "#",
  },
];

export default function NGODirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ngo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              NGOs Directory
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
              Belagavi's Network of{" "}
              <span className="text-primary">Change Makers</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover NGOs working across different sectors in Belagavi. 
              Connect, collaborate, and contribute to social change.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search NGOs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NGO List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredNGOs.length}</span> organizations
            </p>
            <Button onClick={() => setShowRegisterForm(true)} variant="outline">
              <Plus className="w-4 h-4" />
              Register Your NGO
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNGOs.map((ngo) => (
              <div
                key={ngo.id}
                className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors truncate">
                      {ngo.name}
                    </h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mt-1">
                      {ngo.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {ngo.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{ngo.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{ngo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{ngo.email}</span>
                  </div>
                </div>
                
                <a
                  href={ngo.website}
                  className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>

          {filteredNGOs.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">No NGOs Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Register Form Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-elevated">
            <h2 className="font-display text-2xl text-foreground mb-6">Register Your NGO</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">NGO Name</label>
                <Input placeholder="Enter NGO name" className="h-12" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select className="w-full h-12 rounded-lg border border-input bg-background px-4">
                  {categories.filter(c => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea 
                  placeholder="Brief description of your NGO's work"
                  className="w-full h-24 rounded-lg border border-input bg-background px-4 py-3 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <Input placeholder="Area, City" className="h-12" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contact Phone</label>
                <Input placeholder="+91 XXXXX XXXXX" className="h-12" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input type="email" placeholder="contact@ngo.org" className="h-12" />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowRegisterForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
