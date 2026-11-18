import { useEffect, useState } from 'react'

const URL_MQTT = import.meta.env.VITE_MQTT_URL || 'wss://broker.hivemq.com:8884/mqtt'
const TOPICO = import.meta.env.VITE_MQTT_TOPICO || 'ecocoleta/sp/pev01/#'

/**
 * Custom hook: conecta no broker MQTT (camada IoT Cloud) e recebe, ao vivo,
 * a telemetria e as entregas publicadas pela balança ESP32 (edge/sketch.ino).
 *
 * Estados de conexão: 'conectando' | 'conectado' | 'offline'
 */
export function useBalancaAoVivo() {
  const [conexao, setConexao] = useState('conectando')
  const [telemetria, setTelemetria] = useState(null)
  const [pesagens, setPesagens] = useState([])

  useEffect(() => {
    let cliente = null
    let cancelado = false

    // Import dinâmico: a biblioteca MQTT só é baixada quando o hook é usado.
    import('mqtt')
      .then(({ default: mqtt }) => {
        if (cancelado) return
        cliente = mqtt.connect(URL_MQTT, {
          clientId: `ecocoleta-web-${Math.random().toString(16).slice(2, 10)}`,
          reconnectPeriod: 5000,
          connectTimeout: 8000,
        })
        cliente.on('connect', () => {
          setConexao('conectado')
          cliente.subscribe(TOPICO)
        })
        cliente.on('offline', () => setConexao('offline'))
        cliente.on('error', () => setConexao('offline'))
        cliente.on('message', (topico, mensagem) => {
          let dados
          try {
            dados = JSON.parse(mensagem.toString())
          } catch {
            return // mensagem fora do formato esperado: ignora
          }
          const recebidoEm = new Date().toISOString()
          if (topico.endsWith('/telemetria')) setTelemetria({ ...dados, recebidoEm })
          if (topico.endsWith('/entrega')) {
            setPesagens((atual) => [{ ...dados, recebidoEm, idLocal: `${recebidoEm}-${dados.pesoKg}` }, ...atual].slice(0, 10))
          }
        })
      })
      .catch(() => setConexao('offline'))

    return () => {
      cancelado = true
      cliente?.end(true)
    }
  }, [])

  /** Remove uma pesagem da lista depois que ela foi vinculada a um morador. */
  const descartarPesagem = (idLocal) => setPesagens((atual) => atual.filter((p) => p.idLocal !== idLocal))

  return { conexao, telemetria, pesagens, descartarPesagem }
}
