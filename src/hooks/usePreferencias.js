import { useEffect, useState } from 'react'

const CHAVE = 'ecocoleta:fonte'

function lerPreferencia() {
  try {
    return localStorage.getItem(CHAVE) === 'grande'
  } catch {
    return false
  }
}

/**
 * Custom hook de acessibilidade: guarda a preferência de fonte grande
 * e aplica no <html> (o CSS aumenta todo o texto proporcionalmente).
 */
export function usePreferencias() {
  const [fonteGrande, setFonteGrande] = useState(lerPreferencia)

  useEffect(() => {
    document.documentElement.dataset.fonte = fonteGrande ? 'grande' : 'normal'
    try {
      localStorage.setItem(CHAVE, fonteGrande ? 'grande' : 'normal')
    } catch {
      /* sem storage: vale só nesta visita */
    }
  }, [fonteGrande])

  return { fonteGrande, alternarFonte: () => setFonteGrande((v) => !v) }
}
