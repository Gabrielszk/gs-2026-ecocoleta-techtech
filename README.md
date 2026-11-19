# EcoColeta SP · Interface do Cidadão e Painel da Cooperativa

> Global Solution 2026.2 · CitizenTech · Engenharia de Software 1º ano
> Disciplinas: **Front-end Design** e **Web Development** (mesma aplicação, entregas separadas)

## Ficha da CitizenTech

| Campo | Resposta |
|---|---|
| **Nome da CitizenTech** | EcoColeta SP-techtech |
| **Cidade e bairro** | São Paulo · bairro piloto Jardim Pery (Zona Norte) |
| **Cidadão beneficiado** | Catadores de cooperativas de reciclagem (direto) e moradores de bairros com pouca coleta seletiva (indireto) |
| **Problema, em uma frase** | Menos de 3% do lixo de SP passa pela coleta seletiva porque o morador não tem incentivo nem ponto claro de entrega, e a cooperativa pesa tudo à mão, sem previsão de estoque. |
| **Como funciona** | O morador leva o reciclável a um PEV, a balança inteligente (ESP32) pesa e identifica o material, o sistema converte o peso em Pontos Verdes, trocados no comércio do bairro, e a cooperativa acompanha o estoque para vender direto à indústria. |
| **O que cada parte faz** | **Sensor (Edge):** balança ESP32 + nível do contêiner, decide e alerta sozinha · **Lógica (Python):** regras de pontos e relatórios · **Matemática:** taxas de pico e massa acumulada desviada do aterro · **Interface/Interação (este repositório):** app web do morador e painel da cooperativa · **Experiência:** jornada e requisitos · **Pitch:** vídeo de 3 min |
| **Link do repositório** | `https://github.com/[usuario]/ecocoleta-web` *(substituir)* |
| **Deploy** | `https://[projeto].vercel.app` *(substituir)* |
| **Indicador de impacto** | kg de resíduos desviados do aterro por mês (meta piloto: 500 kg/mês), moradores recorrentes e receita estimada da cooperativa |
| **ODS conectados** | **ODS 11** (cidades sustentáveis: mais reciclagem e PEVs que não transbordam) e **ODS 10** (redução das desigualdades: renda e transparência para catadores) |

### Equipe

| Nome | RM |
|---|---|
• Willian Barboza Pontes Fernandes— | [569736] 
• Caio Portela do Nascimento — | [572562] 
• Gabriel Suarez Kulisauskas — | [569893] 
• Paulo Henrique Franca da Silva— | [573174]

---

## O que a aplicação faz

| Tela | Para quem | Funcionalidades |
|---|---|---|
| **Início** | Morador | Meta mensal do bairro (barra de progresso), impacto acumulado (kg, CO₂, entregas, moradores ativos), passo a passo e ODS |
| **Entregar** | Morador / operador do PEV | Registro de entrega (**Create**) com **simulador de pontos em tempo real** e tabela de quanto vale cada material |
| **Meus pontos** | Morador | Extrato (**Read**), saldo, CO₂ evitado, progresso até a próxima recompensa, **correção** (**Update**) e **exclusão** (**Delete**) de entregas |
| **Moradores** | Cooperativa | CRUD completo de moradores com busca e confirmação antes de excluir |
| **Cooperativa** | Catadores | Dashboard de estoque por material, valor estimado de venda, meta do bairro, ranking e últimas entregas |

### Acessibilidade e cuidado com o cidadão
- Fonte **Atkinson Hyperlegible** (feita para baixa visão) e botão **A+** que aumenta todo o texto
- Contraste AA, foco visível, rótulos em todos os campos, mensagens de erro ligadas ao campo (`aria-describedby`)
- Navegação inferior no celular (alcance do polegar), áreas de toque ≥ 44px
- Cor nunca é a única informação (todo selo tem texto)
- **Nenhum dado pessoal real:** cadastro só com nome/apelido e bairro; dados de exemplo são fictícios

---

## Requisitos técnicos atendidos

| Requisito | Onde está |
|---|---|
| React com **Vite** | `vite.config.js` |
| **Tailwind CSS** (v4) | `src/index.css` (tema com paleta própria) |
| **≥ 8 componentes** reutilizáveis | 18 componentes em `src/components/` (ui, layout, indicadores, moradores, entregas) + 5 páginas em `src/pages/` |
| **useState e useEffect** | Em todos os hooks e páginas (ex.: `useMoradores.js`, `App.jsx`) |
| **≥ 2 Custom Hooks** | 5 hooks em `src/hooks/`: `useMoradores`, `useEntregas`, `useIndicadores`, `usePreferencias`, `useToast` |
| **Separação de responsabilidades** | `lib/` = regras de negócio puras · `services/` = acesso à API · `hooks/` = estado · `components/` e `pages/` = visual |
| **API externa com CRUD** | MockAPI.io: `services/apiClient.js` (GET, POST, PUT, DELETE) em `moradores` e `entregas` |
| **Funcionalidades reais** | Cálculo de pontos, CO₂ evitado, metas do bairro, extrato, recompensas, ranking |
| **Git ≥ 15 commits** | `git log --oneline` |
| **AI.md** | Raiz do projeto |

### Estrutura de pastas

```
src/
├── lib/            # regras de negócio (pontos, CO2, metas) e validações — funções puras
├── services/       # acesso a dados: cliente REST do MockAPI + adaptador local
├── hooks/          # custom hooks: estado + CRUD + indicadores + preferências
├── components/
│   ├── ui/         # Botao, Campo, Carregando, EstadoVazio, AvisoErro, Toast, DialogoConfirmacao
│   ├── layout/     # Cabecalho, NavAbas, Rodape
│   ├── indicadores/# CartaoIndicador, BarraProgresso, GraficoMateriais, SeloMaterial
│   ├── moradores/  # FormMorador, CartaoMorador
│   └── entregas/   # FormEntrega, TabelaEntregas
├── pages/          # Inicio, Entregar, Extrato, Moradores, Cooperativa
└── App.jsx         # navegação por abas (#hash) e distribuição dos hooks
```

### Regra de negócio

| Material | Pontos/kg | Preço estimado/kg* | CO₂ evitado/kg* |
|---|---|---|---|
| Plástico | 10 | R$ 1,80 | 1,5 kg |
| Papelão | 5 | R$ 0,60 | 0,9 kg |
| Alumínio | 25 | R$ 6,50 | 9,0 kg |
| Vidro | 3 | R$ 0,20 | 0,3 kg |

\* Valores **simulados** para o protótipo, na ordem de grandeza de referências públicas do setor de reciclagem.

---

## Pré-requisitos

- **Node.js 20+** e npm
- Conta gratuita no **[MockAPI.io](https://mockapi.io)** (API externa)

## Configurar a API externa (MockAPI)

1. Crie um projeto no MockAPI.io.
2. Crie o recurso **`moradores`** com os campos: `nome` (string), `bairro` (string), `criadoEm` (string).
3. Crie o recurso **`entregas`** com os campos: `moradorId` (string), `material` (string), `pesoKg` (number), `pontos` (number), `pev` (string), `criadoEm` (string).
4. Copie a URL base do projeto (ex.: `https://xxxxxxxx.mockapi.io/api/v1`).
5. Crie o arquivo `.env` na raiz (veja `.env.example`):

```
VITE_API_URL=https://xxxxxxxx.mockapi.io/api/v1
```

> Sem `VITE_API_URL` o app entra em **modo demonstração** (aviso amarelo no topo) e guarda os dados no navegador, com a mesma interface REST. Para a avaliação, configure a API.

## Instalação e execução

```bash
npm install
npm run dev        # abre em http://localhost:5173
npm run build      # gera a versão de produção em dist/
npm run preview    # testa a build localmente
```

## Deploy (Vercel)

1. Suba o repositório no GitHub (privado) e importe na [Vercel](https://vercel.com).
2. Framework: **Vite** (detectado automaticamente).
3. Em *Settings → Environment Variables*, adicione `VITE_API_URL` com a URL do MockAPI.
4. Faça o deploy e coloque o link na ficha acima.

## Fontes dos dados
- Moradores, entregas, parceiros e preços: **simulados**.
- Percentual de coleta seletiva em SP: documentação base do projeto (dado público municipal citado pela equipe).
