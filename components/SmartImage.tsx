import Image from "next/image";

/**
 * Image optimisée par Next.js (redimensionnée, compressée en WebP, adaptée à l'écran)
 * quand elle vient de Supabase Storage. Sinon, simple <img> : aucune image externe
 * ne peut faire planter la page.
 */
function isOptimizable(src: string) {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** remplit le parent (qui doit être en position relative et avoir une taille) */
  fill?: boolean;
  width?: number;
  height?: number;
  /** largeur affichée, pour choisir la bonne taille d'image (ex. "(max-width: 1023px) 90vw, 320px") */
  sizes?: string;
  /** à mettre sur l'image visible dès l'ouverture (photo du hero) */
  priority?: boolean;
};

export default function SmartImage({ src, alt, className = "", fill = false, width, height, sizes, priority = false }: Props) {
  if (isOptimizable(src)) {
    return fill ? (
      <Image src={src} alt={alt} fill sizes={sizes ?? "100vw"} priority={priority} className={className} />
    ) : (
      <Image src={src} alt={alt} width={width ?? 400} height={height ?? 400} sizes={sizes} priority={priority} className={className} />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
    />
  );
}
