import Link from "next/link";
import { Phone, Mail, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HR_CONTACT } from "@/features/marketing/contact-content";

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#0f2d4a] to-[#0a1f38] py-20 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.15)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('/marketing/hero-pattern.svg')] bg-cover opacity-[0.04]" />

      <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          Need Help?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
          Our HR team is ready to assist you.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href={`tel:${HR_CONTACT.mobile.replace(/\s/g, "")}`}>
            <Button variant="accent" size="lg" className="gap-2">
              <Phone className="h-4 w-4" />
              Call HR
            </Button>
          </Link>
          <Link href={`mailto:${HR_CONTACT.recruitmentEmail}`}>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/30 bg-white/5 text-white hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
              Email Recruitment Team
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/30 bg-white/5 text-white hover:bg-white/10"
            >
              <LogIn className="h-4 w-4" />
              Employee Login
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
