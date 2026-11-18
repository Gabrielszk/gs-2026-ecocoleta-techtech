import { useState } from 'react'
import { FormEntrega } from '../components/entregas/FormEntrega'
import { PainelBalanca } from '../components/balanca/PainelBalanca'
import { EstadoVazio } from '../components/ui/EstadoVazio'
import { Botao } from '../components/ui/Botao'
import { Carregando } from '../components/ui/Carregando'

export function Entregar({ moradores, entregas, balanca, mostrarToast, irPara }) {
  const [inicial, setInicial] = useState(null)
  const [pesagemEmUso, setPesagemEmUso] = useState(null)

  function usarPesagem(p) {
    setPesagemEmUso(p.idLocal)
    setInicial({ material: p.material, pesoKg: String(p.pesoKg).replace('.', ','), origem: 'balanca' })
    mostrarToast('Pesagem carregada. Agora escolha o morador.')
  }

  async function salvar(dados) {
    try {
      const nova = await entregas.criar(dados)
      if (pesagemEmUso) balanca.descartarPesagem(pesagemEmUso)
      setPesagemEmUso(null)
      setInicial(null)
      mostrarToast(`Entrega registrada: +${nova.pontos} pontos!`)
    } catch (e) {
      mostrarToast(e.message, 'erro')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-4xl font-extrabold text-mata-900">Registrar entrega</h1>
        <p className="mt-1 text-lg text-tinta/75">Use o peso da balança inteligente ou digite o peso para simular quantos pontos a entrega rende.</p>
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
          <FormEntrega moradores={moradores.moradores} inicial={inicial} aoSalvar={salvar} />
          <PainelBalanca conexao={balanca.conexao} telemetria={balanca.telemetria} pesagens={balanca.pesagens} aoUsarPesagem={usarPesagem} />
        </div>
      )}
    </div>
  )
}
