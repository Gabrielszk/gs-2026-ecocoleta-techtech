import { MATERIAIS, PESO_MAX_KG } from './regras'

/** Valida o cadastro de morador. Retorna um objeto { campo: mensagem }. */
export function validarMorador({ nome, bairro }) {
  const erros = {}
  const nomeLimpo = (nome ?? '').trim()
  if (nomeLimpo.length < 3) erros.nome = 'Digite um nome com pelo menos 3 letras.'
  else if (nomeLimpo.length > 60) erros.nome = 'Use no máximo 60 caracteres.'
  if (!(bairro ?? '').trim()) erros.bairro = 'Informe o bairro.'
  return erros
}

/** Valida uma entrega de recicláveis. */
export function validarEntrega({ moradorId, material, pesoKg }) {
  const erros = {}
  const peso = Number(String(pesoKg).replace(',', '.'))
  if (!moradorId) erros.moradorId = 'Escolha o morador.'
  if (!MATERIAIS[material]) erros.material = 'Escolha o tipo de material.'
  if (!Number.isFinite(peso) || peso <= 0) erros.pesoKg = 'O peso precisa ser maior que zero.'
  else if (peso > PESO_MAX_KG) erros.pesoKg = `A balança aceita até ${PESO_MAX_KG} kg por entrega.`
  return erros
}

export const temErros = (erros) => Object.keys(erros).length > 0

export const paraNumero = (valor) => Number(String(valor).replace(',', '.'))
