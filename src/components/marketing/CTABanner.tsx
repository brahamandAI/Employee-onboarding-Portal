import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTABannerProps {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function CTABanner({
  title = "Ready to Secure Your Premises?",
  description = "Speak with our security consultants for a customized protection plan tailored to your facility.",
  primaryHref = "/contact",
  primaryLabel = "Contact Us",
  secondaryHref = "/apply",
  secondaryLabel = "Employee Registration",
}: CTABannerProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,162,39,0.15)_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={primaryHref}>
            <Button variant="accent" size="lg" className="gap-2">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={secondaryHref}>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              {secondaryLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
