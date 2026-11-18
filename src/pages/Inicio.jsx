import { CartaoIndicador } from '../components/indicadores/CartaoIndicador'
import { BarraProgresso } from '../components/indicadores/BarraProgresso'
import { Botao } from '../components/ui/Botao'
import { formatarKg } from '../lib/regras'

const PASSOS = [
  ['Separe', 'Plástico, papelão, alumínio e vidro, limpos e secos.'],
  ['Leve ao PEV', 'Entregue no ponto parceiro mais perto da sua casa.'],
  ['Pese na balança', 'A balança inteligente registra o peso exato, sem papel.'],
  ['Ganhe pontos', 'Troque por descontos na padaria, farmácia e mercado do bairro.'],
]

export function Inicio({ indicadores, irPara }) {
  const { geral, meta, moradoresAtivos } = indicadores

  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-6 rounded-3xl bg-mata-900 p-6 text-white sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div className="flex flex-col gap-5">
          <p className="w-fit rounded-full bg-mata-700 px-3 py-1 text-sm font-bold text-mata-100">Bairro piloto · Jardim Pery, Zona Norte</p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Seu reciclável vale pontos. <span className="text-mata-200">E vale renda para quem cata.</span>
          </h1>
          <p className="max-w-xl text-lg text-white/85">
            Menos de 3% do lixo de São Paulo passa pela coleta seletiva. O EcoColeta SP liga moradores às cooperativas do bairro com uma balança
            inteligente: você ganha pontos, o catador sabe quanto material tem para vender direto à indústria.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Botao className="bg-white !text-mata-900 hover:bg-mata-100" onClick={() => irPara('entregar')}>
              Registrar uma entrega
            </Botao>
            <Botao variante="fantasma" className="!text-white hover:!bg-mata-700" onClick={() => irPara('extrato')}>
              Ver meus pontos
            </Botao>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 text-tinta">
          <BarraProgresso rotulo="Meta do bairro neste mês" valor={meta.pct} tamanho="lg" />
          <p className="text-tinta/80">
            <strong className="text-mata-900">{formatarKg(meta.atingidoKg)}</strong> de {formatarKg(meta.alvoKg)} desviados do aterro em{' '}
            {new Date().toLocaleDateString('pt-BR', { month: 'long' })}.
          </p>
        </div>
      </section>

      <section aria-labelledby="titulo-impacto" className="flex flex-col gap-4">
        <h2 id="titulo-impacto" className="font-display text-3xl font-semibold text-mata-900">
          Impacto acumulado
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CartaoIndicador rotulo="Reciclado" valor={formatarKg(geral.totalKg)} detalhe="fora do aterro sanitário" tom="destaque" />
          <CartaoIndicador rotulo="CO₂ evitado" valor={formatarKg(geral.co2Kg)} detalhe="estimativa por tipo de material" />
          <CartaoIndicador rotulo="Entregas" valor={geral.quantidade} detalhe="registradas nos PEVs" />
          <CartaoIndicador rotulo="Moradores ativos" valor={moradoresAtivos} detalhe="com pelo menos 1 entrega" />
        </div>
      </section>

      <section aria-labelledby="titulo-como" className="flex flex-col gap-4">
        <h2 id="titulo-como" className="font-display text-3xl font-semibold text-mata-900">
          Como funciona
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map(([titulo, texto], i) => (
            <li key={titulo} className="flex flex-col gap-2 rounded-2xl border-2 border-mata-100 bg-white p-5">
              <span className="grid size-10 place-items-center rounded-full bg-mata-700 font-display text-lg font-extrabold text-white" aria-hidden>
                {i + 1}
              </span>
              <h3 className="text-xl font-bold">{titulo}</h3>
              <p className="text-tinta/75">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="titulo-ods" className="grid gap-4 sm:grid-cols-2">
        <h2 id="titulo-ods" className="sr-only">
          Objetivos de Desenvolvimento Sustentável
        </h2>
        <div className="rounded-2xl border-l-8 border-[#e5243b] bg-white p-5">
          <p className="font-display text-xl font-semibold">ODS 10 · Redução das desigualdades</p>
          <p className="mt-1 text-tinta/75">O catador vende maior volume direto à indústria, sem atravessador, e tem registro transparente da sua produção.</p>
        </div>
        <div className="rounded-2xl border-l-8 border-[#fd9d24] bg-white p-5">
          <p className="font-display text-xl font-semibold">ODS 11 · Cidades e comunidades sustentáveis</p>
          <p className="mt-1 text-tinta/75">Mais resíduos reciclados em bairros com pouca coleta seletiva, e PEVs que não transbordam.</p>
        </div>
      </section>
    </div>
  )
}
