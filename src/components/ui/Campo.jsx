import { useId } from 'react'

/**
 * Campo de formulário com rótulo visível, dica e mensagem de erro
 * ligadas ao input por aria-describedby (leitores de tela).
 */
export function Campo({ rotulo, erro, dica, children }) {
  const id = useId()
  const idAjuda = `${id}-ajuda`
  const filho = typeof children === 'function' ? children({ id, 'aria-describedby': idAjuda, 'aria-invalid': !!erro }) : children

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-bold text-mata-900">
        {rotulo}
      </label>
      {filho}
      <p id={idAjuda} className={`text-sm ${erro ? 'font-bold text-red-800' : 'text-tinta/70'}`} role={erro ? 'alert' : undefined}>
        {erro || dica}
      </p>
    </div>
  )
}

export const classeInput =
  'min-h-11 w-full rounded-xl border-2 border-mata-200 bg-white px-4 py-2.5 text-base text-tinta placeholder:text-tinta/45 focus:border-mata-500 aria-[invalid=true]:border-red-500'
