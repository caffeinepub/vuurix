interface ProductImageProps {
  imageUrl: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ imageUrl, alt, className = '' }: ProductImageProps) {
  const placeholders = [
    '/assets/generated/vuurix-product-placeholder.dim_800x800.png',
    '/assets/generated/vuurix-product-placeholder-2.dim_800x800.png',
    '/assets/generated/vuurix-product-placeholder-3.dim_800x800.png'
  ];

  // Use a consistent placeholder based on product name hash
  const getPlaceholder = () => {
    if (!imageUrl || imageUrl.trim() === '') {
      const hash = alt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return placeholders[hash % placeholders.length];
    }
    return imageUrl;
  };

  return (
    <img
      src={getPlaceholder()}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = placeholders[0];
      }}
    />
  );
}

