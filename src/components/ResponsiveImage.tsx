import type { ImgHTMLAttributes } from 'react';
import { imageVariants } from '../data/image-variants';
export function ResponsiveImage({ src, alt, sizes = '100vw', ...props }: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const variant = imageVariants[src];
  return <picture>{variant && <source type="image/webp" srcSet={variant.srcSet} sizes={sizes} />}<img {...props} alt={alt} src={src} width={variant?.width ?? props.width} height={variant?.height ?? props.height} /></picture>;
}
