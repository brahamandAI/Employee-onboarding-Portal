import Link from "next/link";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import {
  CORPORATE_OFFICE,
  getMapUrls,
} from "@/features/marketing/contact-content";

export function ContactMapSection() {
  const mapUrls = getMapUrls(CORPORATE_OFFICE.mapQuery);

  return (
    <section id="contact-map" className="scroll-mt-32 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <MotionReveal>
          <SectionHeading
            eyebrow="Find Us"
            title="Corporate Office Location"
            description="Visit our registered corporate office in Dwarka, New Delhi."
          />
        </MotionReveal>

        <MotionReveal delay={80} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-lg">
            <div className="relative aspect-[16/9] w-full lg:aspect-[21/9]">
              <iframe
                title="Rakshak Securitas corporate office location"
                src={mapUrls.embed}
                className="absolute inset-0 h-full w-full border-0"
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="flex flex-col gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <p className="text-sm text-[#64748B]">
                  {CORPORATE_OFFICE.lines.join(", ")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={mapUrls.directions} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </Button>
                </Link>
                <Link href={mapUrls.open} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    Open in Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
