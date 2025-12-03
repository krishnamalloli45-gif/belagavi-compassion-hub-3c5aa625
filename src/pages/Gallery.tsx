import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", "Education", "Health Camps", "Environment", "Events", "Community"];

const galleryImages = [
  { id: 1, category: "Education", title: "Annual Day Celebration", description: "Students performing at the annual day event" },
  { id: 2, category: "Health Camps", title: "Blood Donation Camp", description: "Community blood donation drive at Belagavi" },
  { id: 3, category: "Environment", title: "Tree Plantation Drive", description: "Volunteers planting trees in rural Belagavi" },
  { id: 4, category: "Events", title: "Charity Marathon", description: "Annual charity run for a cause" },
  { id: 5, category: "Community", title: "Food Distribution", description: "Distributing food to underprivileged families" },
  { id: 6, category: "Education", title: "Computer Lab Inauguration", description: "New computer lab for rural school" },
  { id: 7, category: "Health Camps", title: "Eye Checkup Camp", description: "Free eye checkup for senior citizens" },
  { id: 8, category: "Environment", title: "River Cleanup", description: "Volunteers cleaning Markandey River" },
  { id: 9, category: "Events", title: "Award Ceremony", description: "Recognizing outstanding volunteers" },
  { id: 10, category: "Community", title: "Women's Day Event", description: "Celebrating women achievers of Belagavi" },
  { id: 11, category: "Education", title: "Scholarship Distribution", description: "Annual scholarship ceremony" },
  { id: 12, category: "Health Camps", title: "Vaccination Drive", description: "COVID-19 vaccination awareness camp" },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const currentImageIndex = selectedImage !== null 
    ? filteredImages.findIndex(img => img.id === selectedImage)
    : -1;

  const navigateImage = (direction: "prev" | "next") => {
    if (currentImageIndex === -1) return;
    
    if (direction === "prev") {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredImages.length - 1;
      setSelectedImage(filteredImages[newIndex].id);
    } else {
      const newIndex = currentImageIndex < filteredImages.length - 1 ? currentImageIndex + 1 : 0;
      setSelectedImage(filteredImages[newIndex].id);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Gallery
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
              Moments of{" "}
              <span className="text-primary">Impact</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              A visual journey through our initiatives, events, and the lives we've touched 
              across Belagavi.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
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
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image.id)}
                className="group cursor-pointer relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                {/* Placeholder with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 flex items-center justify-center">
                  <span className="font-display text-6xl text-primary/30">{index + 1}</span>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block px-2 py-1 rounded bg-primary/80 text-primary-foreground text-xs mb-2">
                      {image.category}
                    </span>
                    <h3 className="font-display text-lg text-primary-foreground">
                      {image.title}
                    </h3>
                    <p className="text-primary-foreground/80 text-sm">
                      {image.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-foreground/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-primary-foreground" />
          </button>
          
          <button
            onClick={() => navigateImage("prev")}
            className="absolute left-6 w-12 h-12 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-primary-foreground" />
          </button>
          
          <button
            onClick={() => navigateImage("next")}
            className="absolute right-6 w-12 h-12 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-primary-foreground" />
          </button>
          
          <div className="max-w-4xl w-full">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/30 via-accent/20 to-primary/40 flex items-center justify-center mb-4">
              <span className="font-display text-8xl text-primary-foreground/30">
                {filteredImages[currentImageIndex]?.id}
              </span>
            </div>
            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/80 text-primary-foreground text-sm mb-2">
                {filteredImages[currentImageIndex]?.category}
              </span>
              <h3 className="font-display text-2xl text-primary-foreground mb-2">
                {filteredImages[currentImageIndex]?.title}
              </h3>
              <p className="text-primary-foreground/70">
                {filteredImages[currentImageIndex]?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
