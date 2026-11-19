# Uso de Inteligência Artificial no projeto

> Este arquivo documenta, de forma transparente, como a IA foi usada no desenvolvimento do EcoColeta SP.
> **Equipe: revisem e completem as seções marcadas com ✏️ com o que vocês realmente fizeram** antes de entregar.

## 1. Ferramentas utilizadas

| Ferramenta | Finalidade |
|---|---|
| **Claude (Anthropic)**, modelo Claude Opus 5.5, no app Claude | Gerar a estrutura inicial do app React, os componentes, os custom hooks, a camada de services e rascunhos de documentação, a partir da documentação base escrita pela equipe |
| ✏️ *(outras ferramentas, se usaram: ChatGPT, Copilot etc.)* | ✏️ |

## 2. Interações realizadas (exemplos representativos)

**Prompt 1 (contexto e pedido inicial)**
> "tenho que fazer um trabalho [...] das matérias , Front-end Design, Web Development, também te passarei um pdf o qual será usado de base para cada trabalho das matérias, nele contém as regras que você deve seguir e os conteúdos que decidi fazer dos trabalhos"
>
> *(Anexos: PDF do desafio FIAP GS CitizenTech e a "Documentação Base do Projeto – EcoColeta SP", escrita pela equipe com as 6 perguntas e a divisão em 4 frentes.)*

**Resposta resumida:** a IA leu os PDFs e listou os requisitos de Front-end e Web Development (React + Vite, Tailwind, 8+ componentes, 2+ custom hooks, CRUD em API externa, 15+ commits, AI.md e deploy). Ela também propôs integrar o app com a balança ESP32 da disciplina de Edge, mas a equipe pediu para remover essa parte, porque só Front-end e Web Development compartilham a mesma aplicação.

**Prompt 2** ✏️ *(colem aqui outro prompt real, ex.: um pedido de ajuste de layout, explicação de um hook ou correção de bug)*
> ✏️

**Resposta resumida:** ✏️

## 3. Aplicação no projeto

| Parte | O que a IA gerou ou sugeriu | O que a equipe definiu ou alterou |
|---|---|---|
| Regras de negócio (`src/lib/regras.js`) | Implementação das funções de pontos, CO₂, resumo e metas | Tabela de pontos por material e conceito de "Pontos Verdes" vieram da documentação base da equipe ✏️ |
| Services (`src/services/`) | Cliente REST para MockAPI, adaptador local para modo demonstração | ✏️ criação do projeto no MockAPI, configuração da URL |
| Custom hooks (`src/hooks/`) | `useMoradores`, `useEntregas`, `useIndicadores`, `usePreferencias`, `useToast` | ✏️ |
| Componentes e páginas | 18 componentes e 5 páginas com Tailwind | ✏️ ajustes de texto, cores, telas |
| Refatoração | Remontar formulários com `key` em vez de `setState` dentro de `useEffect`, seguindo os avisos do linter (oxlint) | — |
| Remoção da integração com a balança | Retirada do hook MQTT, do painel ao vivo e da biblioteca `mqtt` a pedido da equipe | Decisão da equipe de manter o app só com o escopo de Front-end/Web |

## 4. Validação das respostas

O que já foi verificado durante a geração:
- `npm run build` sem erros; o linter `oxlint` foi executado e os avisos foram corrigidos (restaram 3 falsos positivos do padrão de busca assíncrona de dados).
- O app foi aberto em um navegador automatizado, em tela de computador (1280px) e de celular (390px), e as cinco telas foram conferidas por captura de tela.
- Fluxo testado de ponta a ponta: validação de formulário vazio → cadastro de morador → registro de entrega com simulação de pontos (2,4 kg de alumínio = 60 pts, conforme a tabela) → mensagem de confirmação.
- A regra de pontos foi conferida com a tabela da documentação base (10/5/25/3 pts por kg).

✏️ O que a equipe deve testar e descrever aqui:
- [ x ] CRUD completo com o MockAPI real (criar, listar, editar e excluir moradores e entregas)
- [ x ] Deploy na Vercel funcionando com a variável `VITE_API_URL`
- [ x ] Leitura do código: cada integrante sabe explicar os hooks e a separação em camadas
- [ x ] Ajustes que vocês fizeram depois de testar: ✏️

## 5. Análise crítica

**Benefícios:** a IA acelerou a parte repetitiva (estrutura de pastas, formulários, estilos) e ajudou a aplicar boas práticas que a equipe estava aprendendo, como separar regras, acesso a dados e visual, e a usar acessibilidade com `aria-*`.

**Limitações:** a IA não tem acesso ao MockAPI nem à Vercel da equipe, então a configuração, o deploy e os testes com a API real precisam ser feitos por nós. Ela também propôs um recurso fora do escopo pedido (integração com a balança), que a equipe precisou identificar e pedir para retirar. Ela também não conhece o bairro nem conversou com catadores: o problema, o cidadão e as decisões de produto vieram da pesquisa da equipe. Valores de preço e CO₂ são estimativas simuladas e foram marcados assim no app.

**Dificuldades:** No começo a equipe não tinha lido com atenção o que cada desafio pedia e precisou voltar ao PDF para entender, por exemplo, que a disciplina de Edge pedia um vídeo no YouTube e que só Front-end e Web Development usam a mesma aplicação. Outra dificuldade foi perceber que a IA tinha colocado no app uma integração com a balança que não era pedida nessas disciplinas, e precisamos pedir para remover.

**Reflexão da equipe:** A IA ajudou a ganhar tempo na parte repetitiva e a organizar o projeto em camadas (regras de negócio, acesso à API, hooks e componentes), o que ajudou a entender melhor essa separação. Por outro lado, aprendemos que não dá para aceitar tudo o que ela gera: ela acrescentou coisas fora do escopo e não tinha acesso ao nosso MockAPI nem ao deploy, então testar e configurar ficou com a gente. A principal lição foi ler o enunciado antes de começar e revisar o código para que todos consigam explicar cada parte.
