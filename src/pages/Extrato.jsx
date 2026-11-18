import { useState } from 'react'
import { CartaoIndicador } from '../components/indicadores/CartaoIndicador'
import { BarraProgresso } from '../components/indicadores/BarraProgresso'
import { TabelaEntregas } from '../components/entregas/TabelaEntregas'
import { FormEntrega } from '../components/entregas/FormEntrega'
import { DialogoConfirmacao } from '../components/ui/DialogoConfirmacao'
import { EstadoVazio } from '../components/ui/EstadoVazio'
import { Carregando } from '../components/ui/Carregando'
import { AvisoErro } from '../components/ui/AvisoErro'
import { Botao } from '../components/ui/Botao'
import { Campo, classeInput } from '../components/ui/Campo'
import { RECOMPENSAS, formatarKg, percentual } from '../lib/regras'

export function Extrato({ moradores, entregas, indicadores, moradorId, aoEscolherMorador, mostrarToast, irPara }) {
  const [emEdicao, setEmEdicao] = useState(null)
  const [paraExcluir, setParaExcluir] = useState(null)
  const [excluindo, setExcluindo] = useState(false)

  const morador = moradores.moradores.find((m) => m.id === moradorId)
  const dados = indicadores.morador

  async function salvarCorrecao(valores) {
    try {
      await entregas.atualizar(emEdicao.id, { ...valores, criadoEm: emEdicao.criadoEm })
      mostrarToast('Entrega corrigida e pontos recalculados.')
      setEmEdicao(null)
    } catch (e) {
      mostrarToast(e.message, 'erro')
    }
  }

  async function confirmarExclusao() {
    setExcluindo(true)
    try {
      await entregas.excluir(paraExcluir.id)
      mostrarToast('Entrega removida do extrato.')
      setParaExcluir(null)
    } catch (e) {
      mostrarToast(e.message, 'erro')
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-mata-900">Meus pontos</h1>
          <p className="mt-1 text-lg text-tinta/75">Saldo, impacto e histórico de cada morador.</p>
        </div>
        <div className="sm:w-80">
          <Campo rotulo="Morador">
            {(p) => (
              <select {...p} className={classeInput} value={moradorId ?? ''} onChange={(e) => aoEscolherMorador(e.target.value || null)}>
                <option value="">Escolha um morador</option>
                {moradores.moradores.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>
            )}
          </Campo>
        </div>
      </header>

      {entregas.erro && <AvisoErro mensagem={entregas.erro} aoTentarNovamente={entregas.recarregar} />}

      {moradores.carregando || entregas.carregando ? (
        <Carregando texto="Carregando extrato..." />
      ) : !morador ? (
        <EstadoVazio titulo="Escolha um morador" descricao="Selecione acima para ver o saldo de pontos e o histórico de entregas." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <CartaoIndicador rotulo="Saldo" valor={`${dados.totalPontos} pts`} detalhe={`${morador.nome} · ${morador.bairro}`} tom="escuro" />
            <CartaoIndicador rotulo="Você reciclou" valor={formatarKg(dados.totalKg)} detalhe={`em ${dados.quantidade} entrega(s)`} tom="destaque" />
            <CartaoIndicador rotulo="CO₂ evitado" valor={formatarKg(dados.co2Kg)} detalhe="estimativa" />
          </div>

          <section className="grid gap-4 rounded-2xl border-2 border-mata-100 bg-white p-5 lg:grid-cols-[1fr_1.2fr]" aria-labelledby="titulo-recompensas">
            <div className="flex flex-col gap-3">
              <h2 id="titulo-recompensas" className="font-display text-2xl font-semibold text-mata-900">
                Troque no comércio do bairro
              </h2>
              {dados.proxima ? (
                <BarraProgresso
                  rotulo={`Próximo: ${dados.proxima.nome}`}
                  valor={percentual(dados.totalPontos, dados.proxima.custo)}
                  textoValor={`${dados.totalPontos}/${dados.proxima.custo} pts`}
                  tamanho="lg"
                />
              ) : (
                <p className="font-bold text-mata-700">Você já pode trocar por qualquer benefício!</p>
              )}
              <p className="text-sm text-tinta/70">Benefícios e parceiros simulados para o protótipo.</p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {RECOMPENSAS.map((r) => {
                const liberada = dados.totalPontos >= r.custo
                return (
                  <li key={r.id} className={`rounded-xl border-2 p-3 ${liberada ? 'border-mata-500 bg-mata-50' : 'border-mata-100'}`}>
                    <p className="font-bold">{r.nome}</p>
                    <p className="text-sm text-tinta/70">{r.parceiro}</p>
                    <p className={`mt-1 text-sm font-bold ${liberada ? 'text-mata-700' : 'text-tinta/60'}`}>
                      {r.custo} pts {liberada ? '· disponível' : ''}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>

          {emEdicao && (
            <FormEntrega
              key={emEdicao.id}
              moradores={moradores.moradores}
              inicial={{ ...emEdicao, pesoKg: String(emEdicao.pesoKg).replace('.', ',') }}
              titulo="Corrigir entrega"
              textoBotao="Salvar correção"
              aoSalvar={salvarCorrecao}
              aoCancelar={() => setEmEdicao(null)}
            />
          )}

          <section className="flex flex-col gap-3" aria-labelledby="titulo-historico">
            <h2 id="titulo-historico" className="font-display text-2xl font-semibold text-mata-900">
              Histórico
            </h2>
            {dados.entregas.length === 0 ? (
              <EstadoVazio
                titulo="Nenhuma entrega ainda"
                descricao="Leve seus recicláveis a um PEV parceiro para começar a juntar pontos."
                acao={<Botao onClick={() => irPara('entregar')}>Registrar entrega</Botao>}
              />
            ) : (
              <TabelaEntregas
                entregas={dados.entregas}
                aoEditar={(e) => {
                  setEmEdicao(e)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                aoExcluir={setParaExcluir}
              />
            )}
          </section>
        </>
      )}

      <DialogoConfirmacao
        aberto={!!paraExcluir}
        titulo="Excluir esta entrega?"
        mensagem={paraExcluir ? `Os ${paraExcluir.pontos} pontos desta entrega serão descontados do saldo.` : ''}
        textoConfirmar="Excluir entrega"
        processando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setParaExcluir(null)}
      />
    </div>
  )
}
