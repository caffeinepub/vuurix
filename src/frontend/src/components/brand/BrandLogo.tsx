interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = 'h-8' }: BrandLogoProps) {
  return (
    <img
      src="/assets/generated/vuurix-logo.dim_512x512.png"
      alt="VUURIX"
      className={className}
    />
  );
}

