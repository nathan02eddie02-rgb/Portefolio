/** Illustration générique d'un schéma en étoile (affichée tant qu'aucun schéma n'est téléversé). */
export default function StarSchemaSvg() {
  const dim = (x: number, y: number, label: string) => (
    <g>
      <rect x={x} y={y} width="104" height="40" rx="8" fill="rgba(77,179,255,0.12)" stroke="rgba(77,179,255,0.6)" />
      <text x={x + 52} y={y + 24} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#BFE3FF">
        {label}
      </text>
    </g>
  );

  return (
    <svg viewBox="0 0 380 230" className="h-full w-full" role="img" aria-label="Schéma en étoile">
      <g stroke="rgba(167,180,200,0.55)" strokeWidth="1.5">
        <line x1="62" y1="50" x2="150" y2="95" />
        <line x1="318" y1="50" x2="230" y2="95" />
        <line x1="62" y1="180" x2="150" y2="135" />
        <line x1="318" y1="180" x2="230" y2="135" />
      </g>
      <rect x="140" y="88" width="100" height="54" rx="10" fill="rgba(129,140,248,0.18)" stroke="rgba(165,180,252,0.8)" strokeWidth="1.5" />
      <text x="190" y="112" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#E0E7FF">
        FAITS
      </text>
      <text x="190" y="128" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#C7D2FE">
        mesures
      </text>
      {dim(10, 10, "Dim_Temps")}
      {dim(266, 10, "Dim_Produit")}
      {dim(10, 180, "Dim_Client")}
      {dim(266, 180, "Dim_Lieu")}
    </svg>
  );
}
