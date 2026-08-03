"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PORTAL_ROLES } from "@/features/marketing/site-content";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PortalRolesSection() {
  return (
    <section className="bg-gradient-to-br from-primary via-[#0d2847] to-primary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Portals
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
            Built for Every Role
          </h2>
          <p className="mt-4 text-white/70">
            Separate secure portals for applicants, reviewers, approvers, and administrators —
            each with the tools they need.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PORTAL_ROLES.map((portal, index) => (
            <motion.div
              key={portal.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg",
                  portal.accent
                )}
              >
                <MarketingIcon name={portal.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading font-semibold text-white">{portal.role}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">
                {portal.description}
              </p>
              <Link href={portal.href} className="mt-5">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/20 bg-white/5 text-white hover:bg-white/15"
                >
                  {portal.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
