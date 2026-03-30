import { LandingHero } from "@/components/LandingHero";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    <main className="min-h-screen bg-tech-dark relative overflow-hidden">
      {/* Circuit pattern background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(59,130,246,0.15) 1px, transparent 0), radial-gradient(circle at 75px 75px, rgba(139,92,246,0.15) 1px, transparent 0)",
          backgroundSize: "100px 100px",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-tech-dark via-brand-cyan/10 to-brand-purple/10" />
      
      <div className="relative z-10">
        <LandingHero />
        <Features />
      </div>
    </main>
  );
}
