import Image from "next/image";
import { cn } from "@/lib/utils";
import { RAKSHAK_LOGO_ALT, RAKSHAK_LOGO_SRC } from "@/lib/brand";

type BrandVariant = "sidebar" | "light" | "dark";

interface RakshakBrandMarkProps {
  variant?: BrandVariant;
  className?: string;
  /** @deprecated Logo image includes full wordmark */
  showTagline?: boolean;
  priority?: boolean;
}

const variantStyles: Record<
  BrandVariant,
  { wrapper: string; image: string }
> = {
  /** White / light headers (marketing nav, auth, employee portal) */
  dark: {
    wrapper: "",
    image: "max-h-12 sm:max-h-14 lg:max-h-[4.25rem]",
  },
  /** Navy sidebar */
  sidebar: {
    wrapper: "px-0.5 py-1.5",
    image: "max-h-[62px] sm:max-h-[68px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]",
  },
  /** Dark footer / on-primary backgrounds */
  light: {
    wrapper: "px-0.5 py-1.5",
    image: "max-h-14 sm:max-h-16 brightness-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
  },
};

export function RakshakBrandMark({
  variant = "dark",
  className,
  priority = false,
}: RakshakBrandMarkProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative inline-flex w-full max-w-full items-center",
        styles.wrapper,
        className
      )}
    >
      <Image
        src={RAKSHAK_LOGO_SRC}
        alt={RAKSHAK_LOGO_ALT}
        width={640}
        height={140}
        priority={priority || variant === "sidebar"}
        className={cn(
          "h-auto w-full object-contain object-left",
          styles.image
        )}
      />
    </div>
  );
}
