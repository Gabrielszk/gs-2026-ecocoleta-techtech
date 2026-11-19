import { useState } from 'react'
import { Botao } from '../ui/Botao'
import { Campo, classeInput } from '../ui/Campo'
import { CHAVES_MATERIAIS, MATERIAIS, PEVS, PESO_MAX_KG, calcularCo2Evitado, calcularPontos } from '../../lib/regras'
import { paraNumero, temErros, validarEntrega } from '../../lib/validacao'

const vazio = (moradorId = '') => ({ moradorId, material: 'plastico', pesoKg: '', pev: PEVS[0] })

/**
 * Formulário de entrega de recicláveis com simulação de pontos em tempo real.
 * - `inicial`: preenche o formulário (usado na correção de uma entrega).
 *   Para trocar os valores iniciais, a página remonta o componente com outra `key`.
 */
export function FormEntrega({ moradores, inicial, titulo = 'Registrar entrega', textoBotao = 'Registrar entrega', aoSalvar, aoCancelar }) {
  const [valores, setValores] = useState(() => ({ ...vazio(), ...inicial }))
  const [erros, setErros] = useState({})
  const [salvando, setSalvando] = useState(false)

  const alterar = (campo, valor) => {
    setValores((v) => ({ ...v, [campo]: valor }))
    if (erros[campo]) setErros((er) => ({ ...er, [campo]: undefined }))
  }

  const peso = paraNumero(valores.pesoKg)
  const pesoValido = Number.isFinite(peso) && peso > 0 && peso <= PESO_MAX_KG
  const pontosPrevistos = pesoValido ? calcularPontos(valores.material, peso) : 0
  const co2Previsto = pesoValido ? calcularCo2Evitado(valores.material, peso) : 0

  async function enviar(e) {
    e.preventDefault()
    const encontrados = validarEntrega(valores)
    setErros(encontrados)
    if (temErros(encontrados)) return
    setSalvando(true)
    try {
      await aoSalvar(valores)
      if (!inicial?.id) setValores(vazio(valores.moradorId))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5 rounded-2xl border-2 border-mata-100 bg-white p-5">
      <h2 className="font-display text-2xl font-semibold text-mata-900">{titulo}</h2>

      <Campo rotulo="Quem está entregando?" erro={erros.moradorId}>
        {(p) => (
          <select {...p} className={classeInput} value={valores.moradorId} onChange={(e) => alterar('moradorId', e.target.value)}>
            <option value="">Escolha o morador</option>
            {moradores.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} — {m.bairro}
              </option>
            ))}
          </select>
        )}
      </Campo>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 font-bold text-mata-900">Tipo de material</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CHAVES_MATERIAIS.map((m) => {
            const marcado = valores.material === m
            return (
              <label
                key={m}
                className={`flex min-h-16 cursor-pointer flex-col justify-center rounded-xl border-2 px-3 py-2 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-mata-500 ${
                  marcado ? 'border-mata-700 bg-mata-50' : 'border-mata-100 hover:border-mata-200'
                }`}
              >
                <input type="radio" name="material" value={m} checked={marcado} onChange={() => alterar('material', m)} className="sr-only" />
                <span className="flex items-center gap-2 font-bold">
                  <span className={`size-3 rounded-full ${MATERIAIS[m].cor}`} aria-hidden />
                  {MATERIAIS[m].nome}
                </span>
                <span className="text-sm text-tinta/70">{MATERIAIS[m].pontosPorKg} pts por kg</span>
              </label>
            )
          })}
        </div>
        {erros.material && <p className="text-sm font-bold text-red-800">{erros.material}</p>}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="Peso (kg)" erro={erros.pesoKg} dica={`De 0,01 a ${PESO_MAX_KG} kg.`}>
          {(p) => (
            <input
              {...p}
              className={classeInput}
              inputMode="decimal"
              placeholder="Ex.: 2,5"
              value={valores.pesoKg}
              onChange={(e) => alterar('pesoKg', e.target.value)}
            />
          )}
        </Campo>
        <Campo rotulo="Ponto de entrega">
          {(p) => (
            <select {...p} className={classeInput} value={valores.pev} onChange={(e) => alterar('pev', e.target.value)}>
              {PEVS.map((pev) => (
                <option key={pev}>{pev}</option>
              ))}
            </select>
          )}
        </Campo>
      </div>

      <output className="grid grid-cols-2 gap-3 rounded-xl bg-mata-900 p-4 text-white" aria-live="polite">
        <span>
          <span className="block text-sm text-mata-200">Você vai ganhar</span>
          <strong className="font-display text-3xl">{pontosPrevistos} pts</strong>
        </span>
        <span>
          <span className="block text-sm text-mata-200">CO₂ evitado (estimativa)</span>
          <strong className="font-display text-3xl">{co2Previsto.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg</strong>
        </span>
      </output>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Botao type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : textoBotao}
        </Botao>
        {aoCancelar && (
          <Botao variante="secundario" onClick={aoCancelar} disabled={salvando}>
            Cancelar
          </Botao>
        )}
      </div>
    </form>
  )
}
