import HeroSection from '@/components/HeroSection';
import BestsellersSection from '@/components/BestsellersSection';
import ReviewsSection from '@/components/ReviewsSection';
import DiscoverySection from '@/components/DiscoverySection';
import ImpactSection from '@/components/ImpactSection';
import FooterSection from '@/components/FooterSection';

export default function Home() {
  return (
    <main className="bg-white min-h-screen pb-24">
      <HeroSection />
      <BestsellersSection />
      <ReviewsSection />
      <DiscoverySection />
      <ImpactSection />
      <FooterSection />
    </main>
  );
}
