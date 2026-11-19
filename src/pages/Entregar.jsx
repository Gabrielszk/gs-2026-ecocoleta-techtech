import { FormEntrega } from '../components/entregas/FormEntrega'
import { EstadoVazio } from '../components/ui/EstadoVazio'
import { Botao } from '../components/ui/Botao'
import { Carregando } from '../components/ui/Carregando'
import { MATERIAIS } from '../lib/regras'

export function Entregar({ moradores, entregas, mostrarToast, irPara }) {
  async function salvar(dados) {
    try {
      const nova = await entregas.criar(dados)
      mostrarToast(`Entrega registrada: +${nova.pontos} pontos!`)
    } catch (e) {
      mostrarToast(e.message, 'erro')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-4xl font-extrabold text-mata-900">Registrar entrega</h1>
        <p className="mt-1 text-lg text-tinta/75">Informe o peso pesado no ponto de entrega e veja na hora quantos pontos a entrega rende.</p>
      </header>

      {moradores.carregando ? (
        <Carregando />
      ) : moradores.moradores.length === 0 ? (
        <EstadoVazio
          titulo="Cadastre um morador primeiro"
          descricao="Toda entrega fica vinculada a um morador para somar os pontos."
          acao={<Botao onClick={() => irPara('moradores')}>Ir para cadastro</Botao>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <FormEntrega moradores={moradores.moradores} aoSalvar={salvar} />
          <aside className="flex flex-col gap-4 rounded-2xl border-2 border-mata-100 bg-white p-5" aria-labelledby="titulo-tabela">
            <h2 id="titulo-tabela" className="font-display text-2xl font-semibold text-mata-900">
              Quanto vale cada material
            </h2>
            <ul className="flex flex-col divide-y-2 divide-mata-50">
              {Object.entries(MATERIAIS).map(([chave, m]) => (
                <li key={chave} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2 font-bold">
                    <span className={`size-3 rounded-full ${m.cor}`} aria-hidden />
                    {m.nome}
                  </span>
                  <span className="tabular-nums">
                    <strong className="text-mata-700">{m.pontosPorKg} pts</strong> por kg
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-tinta/70">
              Dica: limpe e seque o material antes de entregar. O alumínio vale mais porque tem o maior valor de venda para a indústria.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
