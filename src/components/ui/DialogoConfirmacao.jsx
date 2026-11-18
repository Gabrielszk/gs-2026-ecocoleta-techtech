import { useEffect, useRef } from 'react'
import { Botao } from './Botao'

/**
 * Diálogo de confirmação acessível usando o elemento nativo <dialog>
 * (fecha com Esc e prende o foco dentro dele).
 */
export function DialogoConfirmacao({ aberto, titulo, mensagem, textoConfirmar = 'Confirmar', processando, aoConfirmar, aoCancelar }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (aberto && !dialogo.open) dialogo.showModal()
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault()
        aoCancelar()
      }}
      className="m-auto w-[min(92vw,28rem)] rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-mata-900/50"
    >
      <div className="flex flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-semibold text-mata-900">{titulo}</h2>
        <p className="text-tinta/80">{mensagem}</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Botao variante="secundario" onClick={aoCancelar} disabled={processando}>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={aoConfirmar} disabled={processando}>
            {processando ? 'Excluindo...' : textoConfirmar}
          </Botao>
        </div>
      </div>
    </dialog>
  )
}
