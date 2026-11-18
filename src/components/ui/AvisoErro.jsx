import { Botao } from './Botao'

export function AvisoErro({ mensagem, aoTentarNovamente }) {
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-red-900 sm:flex-row sm:items-center sm:justify-between">
      <p>
        <strong>Não foi possível carregar os dados.</strong> {mensagem}
      </p>
      {aoTentarNovamente && (
        <Botao variante="perigo" tamanho="sm" onClick={aoTentarNovamente}>
          Tentar novamente
        </Botao>
      )}
    </div>
  )
}
