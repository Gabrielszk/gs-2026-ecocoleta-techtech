import { SeloMaterial } from '../indicadores/SeloMaterial'
import { Botao } from '../ui/Botao'
import { formatarData, formatarKg } from '../../lib/regras'

/**
 * Lista de entregas. No celular cada linha vira um cartão;
 * no computador aparece como tabela.
 */
export function TabelaEntregas({ entregas, nomeMorador, aoEditar, aoExcluir }) {
  const comAcoes = Boolean(aoEditar || aoExcluir)

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-mata-100 bg-white">
      <table className="w-full text-left">
        <caption className="sr-only">Histórico de entregas</caption>
        <thead className="hidden bg-mata-50 text-sm uppercase tracking-wide text-mata-700 sm:table-header-group">
          <tr>
            <th className="px-4 py-3">Data</th>
            {nomeMorador && <th className="px-4 py-3">Morador</th>}
            <th className="px-4 py-3">Material</th>
            <th className="px-4 py-3 text-right">Peso</th>
            <th className="px-4 py-3 text-right">Pontos</th>
            <th className="px-4 py-3">Origem</th>
            {comAcoes && <th className="px-4 py-3"><span className="sr-only">Ações</span></th>}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-mata-50">
          {entregas.map((e) => (
            <tr key={e.id} className="grid grid-cols-2 gap-x-4 gap-y-1 p-4 sm:table-row sm:p-0">
              <td className="col-span-2 text-sm text-tinta/70 sm:px-4 sm:py-3 sm:text-base sm:text-tinta">{formatarData(e.criadoEm)}</td>
              {nomeMorador && <td className="col-span-2 font-bold sm:px-4 sm:py-3 sm:font-normal">{nomeMorador(e.moradorId)}</td>}
              <td className="sm:px-4 sm:py-3">
                <SeloMaterial material={e.material} />
              </td>
              <td className="text-right tabular-nums sm:px-4 sm:py-3">{formatarKg(e.pesoKg)}</td>
              <td className="font-bold text-mata-700 tabular-nums sm:px-4 sm:py-3 sm:text-right">+{e.pontos} pts</td>
              <td className="text-right text-sm sm:px-4 sm:py-3 sm:text-left">
                {e.origem === 'balanca' ? (
                  <span className="rounded-full bg-mata-100 px-2 py-0.5 font-bold text-mata-900">Balança</span>
                ) : (
                  <span className="text-tinta/70">Manual</span>
                )}
              </td>
              {comAcoes && (
                <td className="col-span-2 flex gap-2 pt-2 sm:table-cell sm:px-4 sm:py-3 sm:text-right">
                  {aoEditar && (
                    <Botao tamanho="sm" variante="fantasma" onClick={() => aoEditar(e)}>
                      Corrigir
                    </Botao>
                  )}
                  {aoExcluir && (
                    <Botao tamanho="sm" variante="perigo" onClick={() => aoExcluir(e)}>
                      Excluir
                    </Botao>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
