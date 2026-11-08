# LEGIO LATINA

Aplicativo web/PWA de latim clássico em português brasileiro. Uma campanha original com estética de legião romana, 6 capítulos, 24 lições e 144 atividades principais.

## Abrir e desenvolver

```sh
npm ci
npm run dev
```

Abra o endereço local mostrado pelo Vite. Para verificar: `npm test` e `npm run build`. O conteúdo está em `src/data.js`; a geração e avaliação das atividades, revisão e persistência ficam em `src/engine.js`; a interface, em `src/main.js`.

## O que funciona

- Progressão sequencial por lições; instruções de gramática e vocabulário por tópico.
- Múltipla escolha, montagem de frase, tradução digitada, lacuna e associação.
- Tabelas consultáveis de quatro modelos de declinação e do presente de `esse`, `amāre` e `vidēre`.
- XP, níveis, patentes, sequência diária, conquistas, missões e corações. Um coração regenera a cada 20 minutos. Três acertos numa prática recuperam um; revisão e prática não consomem corações.
- Revisão espaçada por atividade: 1, 3, 7, 14 e 30 dias após acertos; erro vence imediatamente.
- Salvamento local, retomada de lição, exportação/importação de JSON com validação.
- PWA instalável após publicação HTTPS, com ícones PNG de 192/512 px, app e lições no cache para uso offline após o primeiro carregamento. Sem conta ou servidor.
- Controles por teclado, rótulos, foco visível e preferência por movimento reduzido.

## Voz e pronúncia

O app usa `speechSynthesis.getVoices()` para detectar as vozes **do dispositivo**. Prefere uma voz com idioma `la-*` quando disponível; em outros casos usa uma voz italiana ou portuguesa, identificada como **aproximação**, nunca como pronúncia clássica garantida. O botão de microfone tenta o reconhecimento do navegador com `la-VA`, mostra a transcrição e não atribui nota, pois o suporte é incerto. Áudio e reconhecimento dependem do navegador e podem não funcionar offline.

[A documentação do navegador](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices) confirma que as vozes dependem do dispositivo. [Google Cloud Gemini TTS](https://docs.cloud.google.com/text-to-speech/docs/gemini-tts) lista `la-VA` em *Preview*, mas uma integração de nuvem exige serviço, custos e proteção de credenciais; ela não está ativada neste projeto. Uma voz latina `la-VA` também pode seguir convenção eclesiástica. A [referência de pronúncia clássica do DCC](https://dcc.dickinson.edu/grammar/latin/vowel-and-consonant-pronunciation) descreve, por exemplo, `c` duro e `v` consonantal como /w/.

## Conteúdo, fontes e limites

Frases, dicas e exercícios foram escritos para este projeto. A gramática foi conferida com [Allen and Greenough via Dickinson College Commentaries](https://dcc.dickinson.edu/grammar/latin), um recurso de consulta; nenhum exercício foi copiado. Código e conteúdo autoral deste repositório têm licença MIT. Ícones SVG também são originais. As fontes tipográficas Cinzel e DM Sans são servidas pelo Google Fonts quando há rede e substituídas por fontes locais offline; consulte as licenças [Cinzel](https://fonts.google.com/specimen/Cinzel/license) e [DM Sans](https://fonts.google.com/specimen/DM+Sans/license).

Esta versão ensina fundamentos até casos e presente verbal. **Não é um curso exaustivo da língua**: faltam tempos adicionais, modos, voz passiva, quarta e quinta declinações, sintaxe avançada, textos literários graduados e uma revisão editorial por latinista. A correção da tradução digitada compara uma resposta modelo com normalização de caixa, pontuação e acentos; paráfrases corretas ainda podem ser recusadas. Não há sincronização, conta, placar público, notificações ou voz neural clássica verificada.

## Publicação

O fluxo `.github/workflows/deploy.yml` testa, constrói com base `/legio-latina/` e publica `dist` no GitHub Pages a cada envio à `main`. No repositório, configure **Settings → Pages → Build and deployment → GitHub Actions** uma vez. O `manifest.webmanifest` e o service worker usam caminhos relativos ao escopo do Pages. Para testar offline, visite o site uma vez, espere o service worker instalar, desconecte e recarregue.

## Privacidade

O progresso fica em `localStorage`. A exportação é um arquivo local. Nenhuma chave de API deve ser colocada no cliente ou no repositório. Para uma futura voz neural em nuvem, use um servidor que proteja a chave e obtenha autorização explícita para custos.
