import { useState } from 'react'
import { Botao } from '../ui/Botao'
import { Campo, classeInput } from '../ui/Campo'
import { temErros, validarMorador } from '../../lib/validacao'

const VAZIO = { nome: '', bairro: '' }

/**
 * Formulário de cadastro/edição de morador.
 * Se receber `emEdicao`, preenche os campos e muda o texto do botão.
 */
export function FormMorador({ emEdicao, aoSalvar, aoCancelarEdicao }) {
  // O componente é remontado (prop key) quando muda o morador em edição.
  const [valores, setValores] = useState(() => (emEdicao ? { nome: emEdicao.nome, bairro: emEdicao.bairro } : VAZIO))
  const [erros, setErros] = useState({})
  const [salvando, setSalvando] = useState(false)

  const alterar = (campo) => (e) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }))
    if (erros[campo]) setErros((er) => ({ ...er, [campo]: undefined }))
  }

  async function enviar(e) {
    e.preventDefault()
    const encontrados = validarMorador(valores)
    setErros(encontrados)
    if (temErros(encontrados)) return
    setSalvando(true)
    try {
      await aoSalvar(valores)
      if (!emEdicao) setValores(VAZIO)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4 rounded-2xl border-2 border-mata-100 bg-white p-5">
      <h2 className="font-display text-2xl font-semibold text-mata-900">{emEdicao ? 'Editar cadastro' : 'Novo morador'}</h2>
      <Campo rotulo="Nome ou apelido" erro={erros.nome} dica="Pode ser só o primeiro nome.">
        {(p) => <input {...p} className={classeInput} value={valores.nome} onChange={alterar('nome')} autoComplete="off" maxLength={60} />}
      </Campo>
      <Campo rotulo="Bairro" erro={erros.bairro} dica="Ex.: Jardim Pery">
        {(p) => <input {...p} className={classeInput} value={valores.bairro} onChange={alterar('bairro')} list="bairros-sp" />}
      </Campo>
      <datalist id="bairros-sp">
        <option value="Jardim Pery" />
        <option value="Vila Nova Cachoeirinha" />
        <option value="Brasilândia" />
        <option value="Capão Redondo" />
      </datalist>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Botao type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : emEdicao ? 'Salvar alterações' : 'Cadastrar morador'}
        </Botao>
        {emEdicao && (
          <Botao variante="secundario" onClick={aoCancelarEdicao} disabled={salvando}>
            Cancelar edição
          </Botao>
        )}
      </div>
    </form>
  )
}
