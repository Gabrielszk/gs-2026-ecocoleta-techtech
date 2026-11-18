import { useMemo, useState } from 'react'
import { FormMorador } from '../components/moradores/FormMorador'
import { CartaoMorador } from '../components/moradores/CartaoMorador'
import { DialogoConfirmacao } from '../components/ui/DialogoConfirmacao'
import { Carregando } from '../components/ui/Carregando'
import { EstadoVazio } from '../components/ui/EstadoVazio'
import { AvisoErro } from '../components/ui/AvisoErro'
import { classeInput } from '../components/ui/Campo'

export function Moradores({ moradores, entregas, indicadores, mostrarToast, irPara }) {
  const [emEdicao, setEmEdicao] = useState(null)
  const [paraExcluir, setParaExcluir] = useState(null)
  const [excluindo, setExcluindo] = useState(false)
  const [busca, setBusca] = useState('')

  const pontos = useMemo(() => Object.fromEntries(indicadores.ranking.map((m) => [m.id, m.pontos])), [indicadores.ranking])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return moradores.moradores
    return moradores.moradores.filter((m) => `${m.nome} ${m.bairro}`.toLowerCase().includes(termo))
  }, [busca, moradores.moradores])

  async function salvar(dados) {
    try {
      if (emEdicao) {
        await moradores.atualizar(emEdicao.id, dados)
        mostrarToast('Cadastro atualizado.')
        setEmEdicao(null)
      } else {
        await moradores.criar(dados)
        mostrarToast('Morador cadastrado! Já pode registrar entregas.')
      }
    } catch (e) {
      mostrarToast(e.message, 'erro')
    }
  }

  async function confirmarExclusao() {
    setExcluindo(true)
    try {
      await entregas.excluirDoMorador(paraExcluir.id)
      await moradores.excluir(paraExcluir.id)
      mostrarToast('Cadastro excluído.')
      if (emEdicao?.id === paraExcluir.id) setEmEdicao(null)
      setParaExcluir(null)
    } catch (e) {
      mostrarToast(e.message, 'erro')
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-4xl font-extrabold text-mata-900">Moradores</h1>
        <p className="mt-1 text-lg text-tinta/75">Cadastro simples: só nome ou apelido e bairro. Sem CPF, sem telefone.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <FormMorador emEdicao={emEdicao} aoSalvar={salvar} aoCancelarEdicao={() => setEmEdicao(null)} />
        </div>

        <section className="flex flex-col gap-4" aria-labelledby="titulo-lista">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="titulo-lista" className="font-display text-2xl font-semibold text-mata-900">
              {moradores.moradores.length} cadastrados
            </h2>
            <label className="sm:w-72">
              <span className="sr-only">Buscar morador</span>
              <input type="search" placeholder="Buscar por nome ou bairro" className={classeInput} value={busca} onChange={(e) => setBusca(e.target.value)} />
            </label>
          </div>

          {moradores.erro && <AvisoErro mensagem={moradores.erro} aoTentarNovamente={moradores.recarregar} />}
          {moradores.carregando ? (
            <Carregando texto="Carregando moradores..." />
          ) : filtrados.length === 0 ? (
            <EstadoVazio
              titulo={busca ? 'Ninguém encontrado' : 'Nenhum morador ainda'}
              descricao={busca ? 'Tente outro nome ou bairro.' : 'Cadastre o primeiro morador no formulário ao lado.'}
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {filtrados.map((m) => (
                <CartaoMorador
                  key={m.id}
                  morador={m}
                  pontos={pontos[m.id] ?? 0}
                  aoVerExtrato={() => irPara('extrato', { moradorId: m.id })}
                  aoEditar={() => {
                    setEmEdicao(m)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  aoExcluir={() => setParaExcluir(m)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <DialogoConfirmacao
        aberto={!!paraExcluir}
        titulo="Excluir cadastro?"
        mensagem={paraExcluir ? `O cadastro de ${paraExcluir.nome} e todo o histórico de entregas serão apagados. Isso não pode ser desfeito.` : ''}
        textoConfirmar="Excluir cadastro"
        processando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setParaExcluir(null)}
      />
    </div>
  )
}
