import { AppShowcase } from "@/components/landing/AppShowcase";
import { ClosingCta } from "@/components/landing/ClosingCta";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";

export function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHeader />
      <main>
        <LandingHero />
        <FeatureGrid />
        <AppShowcase />
        <ClosingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
