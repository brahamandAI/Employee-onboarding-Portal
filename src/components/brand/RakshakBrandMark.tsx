import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  RAKSHAK_LOGO_ALT,
  RAKSHAK_LOGO_SIDEBAR_SRC,
  RAKSHAK_LOGO_SRC,
} from "@/lib/brand";

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
  { wrapper: string; image: string; src: string }
> = {
  /** White / light headers (marketing nav, auth, employee portal) */
  dark: {
    wrapper: "",
    image: "max-h-12 sm:max-h-14 lg:max-h-[4.25rem] object-center",
    src: RAKSHAK_LOGO_SRC,
  },
  /**
   * Dark navy sidebar — transparent PNG sits directly on navy.
   * Soft lift so maroon / cyan lockup stays crisp (no black plate).
   */
  sidebar: {
    wrapper: "",
    image:
      "max-h-[54px] sm:max-h-[60px] brightness-[1.1] contrast-[1.06] drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]",
    src: RAKSHAK_LOGO_SIDEBAR_SRC,
  },
  /** Dark footer / on-primary backgrounds */
  light: {
    wrapper: "px-0.5 py-1.5",
    image:
      "max-h-14 sm:max-h-16 brightness-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
    src: RAKSHAK_LOGO_SIDEBAR_SRC,
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
        src={styles.src}
        alt={RAKSHAK_LOGO_ALT}
        width={variant === "sidebar" ? 940 : 640}
        height={variant === "sidebar" ? 265 : 140}
        priority={priority || variant === "sidebar"}
        className={cn(
          "h-auto w-full object-contain object-left",
          styles.image
        )}
      />
    </div>
  );
}
