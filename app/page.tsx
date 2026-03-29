import HeroSection from '@/components/home/HeroSection';
import BestsellersSection from '@/components/home/BestsellersSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import DiscoverySection from '@/components/home/DiscoverySection';
import ImpactSection from '@/components/home/ImpactSection';
import FooterSection from '@/components/home/FooterSection';

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
