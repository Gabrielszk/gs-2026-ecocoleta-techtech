import { useEffect, useState } from 'react'
import { Cabecalho } from './components/layout/Cabecalho'
import { NavAbas } from './components/layout/NavAbas'
import { ABAS } from './lib/navegacao'
import { Rodape } from './components/layout/Rodape'
import { Toast } from './components/ui/Toast'
import { Inicio } from './pages/Inicio'
import { Entregar } from './pages/Entregar'
import { Extrato } from './pages/Extrato'
import { Moradores } from './pages/Moradores'
import { Cooperativa } from './pages/Cooperativa'
import { useMoradores } from './hooks/useMoradores'
import { useEntregas } from './hooks/useEntregas'
import { useIndicadores } from './hooks/useIndicadores'
import { useBalancaAoVivo } from './hooks/useBalancaAoVivo'
import { usePreferencias } from './hooks/usePreferencias'
import { useToast } from './hooks/useToast'
import { modoDemonstracao } from './services/apiClient'

const abaDaUrl = () => {
  const hash = window.location.hash.replace('#', '')
  return ABAS.some((a) => a.id === hash) ? hash : 'inicio'
}

export default function App() {
  const [aba, setAba] = useState(abaDaUrl)
  const [moradorId, setMoradorId] = useState(null)

  // Lógica e dados ficam nos custom hooks; App só distribui para as páginas.
  const moradores = useMoradores()
  const entregas = useEntregas()
  const balanca = useBalancaAoVivo()
  const indicadores = useIndicadores(entregas.entregas, moradores.moradores, moradorId)
  const { fonteGrande, alternarFonte } = usePreferencias()
  const { toast, mostrar, fechar } = useToast()

  // Sincroniza a aba com o endereço (#extrato), para o botão "voltar" funcionar.
  useEffect(() => {
    const aoMudarHash = () => setAba(abaDaUrl())
    window.addEventListener('hashchange', aoMudarHash)
    return () => window.removeEventListener('hashchange', aoMudarHash)
  }, [])

  useEffect(() => {
    const titulo = ABAS.find((a) => a.id === aba)?.rotulo
    document.title = `${titulo} · EcoColeta SP`
  }, [aba])

  function irPara(novaAba, params = {}) {
    if (params.moradorId) setMoradorId(params.moradorId)
    window.location.hash = novaAba
    window.scrollTo({ top: 0 })
  }

  const comum = { moradores, entregas, indicadores, balanca, mostrarToast: mostrar, irPara }

  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:p-3 focus:font-bold">
        Pular para o conteúdo
      </a>
      <Cabecalho fonteGrande={fonteGrande} aoAlternarFonte={alternarFonte} modoDemonstracao={modoDemonstracao} />
      <NavAbas abaAtual={aba} aoMudar={irPara} />

      <main id="conteudo" className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {modoDemonstracao && (
          <p className="mb-6 rounded-xl bg-amber-100 p-3 text-sm text-amber-900 sm:hidden">
            Modo demonstração: dados salvos só neste aparelho.
          </p>
        )}
        {aba === 'inicio' && <Inicio indicadores={indicadores} irPara={irPara} />}
        {aba === 'entregar' && <Entregar {...comum} />}
        {aba === 'extrato' && <Extrato {...comum} moradorId={moradorId} aoEscolherMorador={setMoradorId} />}
        {aba === 'moradores' && <Moradores {...comum} />}
        {aba === 'cooperativa' && <Cooperativa {...comum} />}
      </main>

      <Rodape />
      <Toast toast={toast} aoFechar={fechar} />
    </>
  )
}
