import { useMemo } from 'react'
import { CartaoIndicador } from '../components/indicadores/CartaoIndicador'
import { GraficoMateriais } from '../components/indicadores/GraficoMateriais'
import { BarraProgresso } from '../components/indicadores/BarraProgresso'
import { PainelBalanca } from '../components/balanca/PainelBalanca'
import { TabelaEntregas } from '../components/entregas/TabelaEntregas'
import { Carregando } from '../components/ui/Carregando'
import { AvisoErro } from '../components/ui/AvisoErro'
import { EstadoVazio } from '../components/ui/EstadoVazio'
import { formatarKg, formatarReais } from '../lib/regras'

export function Cooperativa({ moradores, entregas, indicadores, balanca }) {
  const { geral, doMes, meta, ranking } = indicadores

  const nomes = useMemo(() => Object.fromEntries(moradores.moradores.map((m) => [m.id, m.nome])), [moradores.moradores])

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-4xl font-extrabold text-mata-900">Painel da cooperativa</h1>
        <p className="mt-1 text-lg text-tinta/75">Estoque por material, valor estimado de venda e situação do ponto de coleta.</p>
      </header>

      {entregas.erro && <AvisoErro mensagem={entregas.erro} aoTentarNovamente={entregas.recarregar} />}

      {entregas.carregando ? (
        <Carregando texto="Carregando estoque..." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CartaoIndicador rotulo="Estoque total" valor={formatarKg(geral.totalKg)} detalhe="material triado" tom="escuro" />
            <CartaoIndicador rotulo="Valor estimado" valor={formatarReais(geral.valorEstimado)} detalhe="venda direta à indústria" tom="destaque" />
            <CartaoIndicador rotulo="Neste mês" valor={formatarKg(doMes.totalKg)} detalhe={`${doMes.quantidade} entregas`} />
            <CartaoIndicador rotulo="Pontos emitidos" valor={geral.totalPontos} detalhe="para moradores" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <section className="flex flex-col gap-5 rounded-2xl border-2 border-mata-100 bg-white p-5" aria-labelledby="titulo-estoque">
              <h2 id="titulo-estoque" className="font-display text-2xl font-semibold text-mata-900">
                Estoque por material
              </h2>
              <GraficoMateriais porMaterial={geral.porMaterial} mostrarValor />
              <p className="text-sm text-tinta/70">Preços por kg simulados (referência de mercado para o protótipo).</p>
              <BarraProgresso rotulo="Meta mensal do bairro" valor={meta.pct} textoValor={`${formatarKg(meta.atingidoKg)} / ${formatarKg(meta.alvoKg)}`} />
            </section>

            <div className="flex flex-col gap-6">
              <PainelBalanca conexao={balanca.conexao} telemetria={balanca.telemetria} pesagens={balanca.pesagens} compacto />

              <section className="rounded-2xl border-2 border-mata-100 bg-white p-5" aria-labelledby="titulo-ranking">
                <h2 id="titulo-ranking" className="font-display text-2xl font-semibold text-mata-900">
                  Quem mais recicla
                </h2>
                <ol className="mt-3 flex flex-col gap-2">
                  {ranking.slice(0, 5).map((m, i) => (
                    <li key={m.id} className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-full bg-mata-100 font-bold text-mata-900">{i + 1}</span>
                      <span className="flex-1 truncate">{m.nome}</span>
                      <strong className="tabular-nums text-mata-700">{m.pontos} pts</strong>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>

          <section className="flex flex-col gap-3" aria-labelledby="titulo-ultimas">
            <h2 id="titulo-ultimas" className="font-display text-2xl font-semibold text-mata-900">
              Últimas entregas
            </h2>
            {entregas.entregas.length === 0 ? (
              <EstadoVazio titulo="Sem entregas registradas" />
            ) : (
              <TabelaEntregas entregas={entregas.entregas.slice(0, 8)} nomeMorador={(id) => nomes[id] ?? 'Morador removido'} />
            )}
          </section>
        </>
      )}
    </div>
  )
}
