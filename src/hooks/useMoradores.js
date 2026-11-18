import { useCallback, useEffect, useState } from 'react'
import { moradoresService } from '../services/moradoresService'

/**
 * Custom hook: estado e operações CRUD de moradores.
 * Os componentes só chamam criar/atualizar/excluir — não sabem nada da API.
 */
export function useMoradores() {
  const [moradores, setMoradores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const recarregar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const lista = await moradoresService.listar()
      setMoradores([...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  const criar = useCallback(async (dados) => {
    const novo = await moradoresService.criar(dados)
    setMoradores((atual) => [...atual, novo].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
    return novo
  }, [])

  const atualizar = useCallback(async (id, dados) => {
    const salvo = await moradoresService.atualizar(id, dados)
    setMoradores((atual) => atual.map((m) => (m.id === id ? salvo : m)))
    return salvo
  }, [])

  const excluir = useCallback(async (id) => {
    await moradoresService.excluir(id)
    setMoradores((atual) => atual.filter((m) => m.id !== id))
  }, [])

  return { moradores, carregando, erro, recarregar, criar, atualizar, excluir }
}
