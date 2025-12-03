import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { InitiativesPreview } from "@/components/home/InitiativesPreview";
import { NGODirectoryPreview } from "@/components/home/NGODirectoryPreview";
import { ImpactSection } from "@/components/home/ImpactSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutPreview />
      <InitiativesPreview />
      <NGODirectoryPreview />
      <ImpactSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
