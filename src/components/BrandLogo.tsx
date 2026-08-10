import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
  variant: "pi" | "pi-terminal" | "pi-terminal-mark" | "actinver";
}

const brandAssets = {
  pi: {
    alt: "Pi",
    height: 58,
    src: "/brand/pi-logo.png",
    width: 78,
  },
  "pi-terminal": {
    alt: "PI Web V2 金融运营控制台",
    height: 72,
    src: "/brand/pi-web-v2-terminal.svg",
    width: 252,
  },
  "pi-terminal-mark": {
    alt: "PI Web V2",
    height: 72,
    src: "/brand/pi-terminal-mark.svg",
    width: 72,
  },
  actinver: {
    alt: "Actinver",
    height: 289,
    src: "/brand/actinver-logo-hd-final.png",
    width: 1080,
  },
} as const;

export function BrandLogo({
  className = "",
  priority = false,
  variant,
}: BrandLogoProps) {
  const asset = brandAssets[variant];

  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={`object-contain ${className}`.trim()}
    />
  );
}
