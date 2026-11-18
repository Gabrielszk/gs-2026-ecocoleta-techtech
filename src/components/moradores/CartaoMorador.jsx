import { Botao } from '../ui/Botao'

/** Item da lista de moradores com saldo de pontos e ações. */
export function CartaoMorador({ morador, pontos, aoVerExtrato, aoEditar, aoExcluir }) {
  const iniciais = morador.nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  return (
    <li className="flex flex-col gap-4 rounded-2xl border-2 border-mata-100 bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mata-100 font-display text-lg font-extrabold text-mata-900" aria-hidden>
          {iniciais}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{morador.nome}</p>
          <p className="text-tinta/70">{morador.bairro}</p>
        </div>
        <p className="ml-auto text-right">
          <span className="block font-display text-2xl font-extrabold text-mata-700 tabular-nums">{pontos}</span>
          <span className="text-sm text-tinta/70">pontos</span>
        </p>
      </div>
      <div className="flex gap-2">
        <Botao tamanho="sm" variante="secundario" onClick={aoVerExtrato} className="flex-1 sm:flex-none">
          Extrato
        </Botao>
        <Botao tamanho="sm" variante="fantasma" onClick={aoEditar} aria-label={`Editar ${morador.nome}`}>
          Editar
        </Botao>
        <Botao tamanho="sm" variante="perigo" onClick={aoExcluir} aria-label={`Excluir ${morador.nome}`}>
          Excluir
        </Botao>
      </div>
    </li>
  )
}
