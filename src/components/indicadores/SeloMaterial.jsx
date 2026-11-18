import { MATERIAIS } from '../../lib/regras'

/** Etiqueta colorida do tipo de material (cor + texto, nunca só cor). */
export function SeloMaterial({ material }) {
  const info = MATERIAIS[material]
  if (!info) return <span>—</span>
  return (
    <span className="inline-flex items-center gap-2 font-bold">
      <span className={`size-3 rounded-full ${info.cor}`} aria-hidden />
      {info.nome}
    </span>
  )
}
