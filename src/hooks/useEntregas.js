import { useCallback, useEffect, useState } from 'react'
import { entregasService } from '../services/entregasService'

const maisRecentesPrimeiro = (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)

/**
 * Custom hook: estado e operações CRUD das entregas de recicláveis.
 */
export function useEntregas() {
  const [entregas, setEntregas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  // Busca os dados; só altera o estado depois da resposta da API.
  const buscar = useCallback(async () => {
    try {
      const lista = await entregasService.listar()
      setEntregas([...lista].sort(maisRecentesPrimeiro))
      setErro(null)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [])

  /** Recarrega mostrando o indicador de carregamento (botão "Tentar novamente"). */
  const recarregar = useCallback(() => {
    setCarregando(true)
    return buscar()
  }, [buscar])

  useEffect(() => {
    buscar()
  }, [buscar])

  const criar = useCallback(async (dados) => {
    const nova = await entregasService.criar(dados)
    setEntregas((atual) => [nova, ...atual])
    return nova
  }, [])

  const atualizar = useCallback(async (id, dados) => {
    const salva = await entregasService.atualizar(id, dados)
    setEntregas((atual) => atual.map((e) => (e.id === id ? salva : e)).sort(maisRecentesPrimeiro))
    return salva
  }, [])

  const excluir = useCallback(async (id) => {
    await entregasService.excluir(id)
    setEntregas((atual) => atual.filter((e) => e.id !== id))
  }, [])

  /** Exclui todas as entregas de um morador (usado ao remover o cadastro). */
  const excluirDoMorador = useCallback(
    async (moradorId) => {
      const doMorador = entregas.filter((e) => e.moradorId === moradorId)
      for (const e of doMorador) await entregasService.excluir(e.id)
      setEntregas((atual) => atual.filter((e) => e.moradorId !== moradorId))
    },
    [entregas],
  )

  return { entregas, carregando, erro, recarregar, criar, atualizar, excluir, excluirDoMorador }
}
