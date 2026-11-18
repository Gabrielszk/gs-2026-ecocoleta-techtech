import { BarraProgresso } from '../indicadores/BarraProgresso'
import { SeloMaterial } from '../indicadores/SeloMaterial'
import { Botao } from '../ui/Botao'
import { formatarKg } from '../../lib/regras'

// Estados publicados pelo firmware (edge/sketch.ino) traduzidos para o cidadão
const ESTADOS = {
  OCIOSO: { texto: 'Pronta para receber', cor: 'bg-mata-500' },
  ESTABILIZANDO: { texto: 'Pesando...', cor: 'bg-amber-500' },
  PRONTO: { texto: 'Aguardando confirmação', cor: 'bg-amber-500' },
  REGISTRADO: { texto: 'Entrega registrada', cor: 'bg-mata-500' },
  ALERTA_NIVEL: { texto: 'Contêiner quase cheio', cor: 'bg-amber-600' },
  BLOQUEADO: { texto: 'Contêiner cheio — bloqueado', cor: 'bg-red-600' },
  ERRO_SENSOR: { texto: 'Falha no sensor', cor: 'bg-red-600' },
}

const CONEXAO = {
  conectando: 'Conectando à balança...',
  conectado: 'Conectado ao broker MQTT',
  offline: 'Sem conexão com a balança',
}

/**
 * Painel ao vivo da estação de pesagem (camada de aplicação da arquitetura IoT).
 * `aoUsarPesagem` (opcional) mostra o botão para vincular uma pesagem a um morador.
 */
export function PainelBalanca({ conexao, telemetria, pesagens, aoUsarPesagem, compacto = false }) {
  const estado = telemetria ? ESTADOS[telemetria.estado] ?? { texto: telemetria.estado, cor: 'bg-tinta' } : null

  return (
    <section className="flex flex-col gap-4 rounded-2xl border-2 border-mata-100 bg-white p-5" aria-labelledby="titulo-balanca">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="titulo-balanca" className="font-display text-2xl font-semibold text-mata-900">
          Balança ao vivo
        </h2>
        <span className="inline-flex items-center gap-2 text-sm font-bold">
          <span className={`size-2.5 rounded-full ${conexao === 'conectado' ? 'bg-mata-500 animate-pulse' : conexao === 'offline' ? 'bg-red-600' : 'bg-amber-500'}`} aria-hidden />
          {CONEXAO[conexao]}
        </span>
      </div>

      {!telemetria ? (
        <p className="rounded-xl bg-mata-50 p-4 text-tinta/80">
          Nenhuma leitura recebida ainda. Inicie a simulação da estação de pesagem no Wokwi para ver os dados aqui.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 font-bold text-white ${estado.cor}`}>{estado.texto}</span>
            <span className="text-sm text-tinta/70">{telemetria.pev}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-mata-50 p-3">
              <span className="block text-sm font-bold text-mata-700">Na balança agora</span>
              <span className="font-display text-3xl font-extrabold tabular-nums">{formatarKg(telemetria.pesoKg)}</span>
            </div>
            <div className="rounded-xl bg-mata-50 p-3">
              <span className="block text-sm font-bold text-mata-700">Material selecionado</span>
              <span className="text-lg">
                <SeloMaterial material={telemetria.material} />
              </span>
            </div>
          </div>
          <BarraProgresso rotulo="Nível do contêiner" valor={telemetria.nivelPct} alertas={{ atencao: 80, critico: 95 }} tamanho="lg" />
          {telemetria.filaOffline > 0 && (
            <p className="text-sm font-bold text-amber-800">{telemetria.filaOffline} entrega(s) guardadas offline no dispositivo, aguardando rede.</p>
          )}
        </>
      )}

      {!compacto && aoUsarPesagem && pesagens.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-mata-900">Pesagens confirmadas na balança</h3>
          <ul className="flex flex-col gap-2">
            {pesagens.map((p) => (
              <li key={p.idLocal} className="flex items-center justify-between gap-3 rounded-xl border-2 border-mata-100 p-3">
                <span>
                  <SeloMaterial material={p.material} /> · <strong className="tabular-nums">{formatarKg(p.pesoKg)}</strong>
                </span>
                <Botao tamanho="sm" onClick={() => aoUsarPesagem(p)}>
                  Usar esta pesagem
                </Botao>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
