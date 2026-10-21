// Dans GitHub Codespaces, le navigateur passe par une adresse du type
// https://<nom>-3000.app.github.dev alors que le serveur se voit sur localhost:3000 :
// sans cette autorisation, Next.js bloque les formulaires (« Invalid Server Actions request »).
// Ne s'applique QUE dans Codespaces (variable CODESPACES), jamais sur Vercel.
const codespaceOrigins =
  process.env.CODESPACES === "true"
    ? [
        "localhost:3000",
        `${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ?? "app.github.dev"}`,
        "*.app.github.dev"
      ]
    : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
    // Les fichiers déposés ont un nom unique (horodaté) : remplacer une image crée une
    // nouvelle adresse. On peut donc garder les images optimisées en cache 1 an.
    minimumCacheTTL: 31536000
  },
  ...(codespaceOrigins.length > 0 && {
    experimental: {
      serverActions: { allowedOrigins: codespaceOrigins }
    }
  })
};

export default nextConfig;
