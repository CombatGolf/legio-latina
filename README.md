# LEGIO LATINA · Opus Magnum

Curso interativo de latim clássico em português brasileiro, para navegador e Android. São 9 capítulos, 36 lições, 324 atividades da campanha e 31 desafios de compreensão em 11 leituras guiadas.

## Campanha e biblioteca

- A campanha começa pelas saudações e avança pelas cinco declinações, quatro conjugações, concordância, imperativo, tempos do indicativo, voz passiva e orações relativas.
- As lições trazem explicação, exemplos, glossário, dicas e nove atividades. O treino misto combina questões pendentes e exercícios de lições já vistas.
- Traduções digitadas aceitam variantes cadastradas por frase, com tolerância a maiúsculas, acentos e pontuação. Quando uma tradução fica fora da lista, o app mostra a resposta modelo e permite reescrever, confirmar o erro ou guardar a atividade para revisão sem perder coração nem ganhar XP.
- O leitor de filosofia traz dois trechos de Sêneca com 181 ocorrências anotadas. Cada palavra tem forma de dicionário, significado geral, sentido naquele trecho e análise sintática ou morfológica. A tradução de cada parágrafo abre separadamente.
- O progresso é local. A versão web anterior conserva o progresso e as sessões. Use exportação e importação de JSON para levar o progresso entre navegador e APK.

## Executar e testar

```sh
npm ci
npm run dev
npm test
npm run build
```

O GitHub Pages usa `GITHUB_PAGES=1 npm run build` para publicar na base `/legio-latina/`. A versão web pode ser instalada como PWA e ficar offline após o primeiro carregamento.

## Android

Requisitos de build: JDK 17, Node 22, Android SDK Platform 35, Build Tools 35.0.0 e os utilitários `zip` e `bash`.

```sh
npm ci
npm test
ANDROID_SDK_ROOT=/caminho/do/sdk bash android/build.sh
```

O APK fica em `android/out/Legio-Latina-Opus-Magnum.apk`. Requer Android 8 ou posterior com Android System WebView atualizado. As lições e leituras já vêm dentro do app e podem ser abertas sem internet.

O build padrão gera uma assinatura de teste. A mesma chave local é reutilizada nos próximos builds daquele checkout. Para assinar com sua própria chave, defina `LEGIO_KEYSTORE`, `LEGIO_KEY_ALIAS`, `LEGIO_STORE_PASSWORD` e, se necessário, `LEGIO_KEY_PASSWORD`. Atualizações instaladas sobre uma cópia existente precisam da mesma chave de assinatura. O fluxo GitHub Actions gera um artefato de teste por execução.

O Android usa as vozes locais do sintetizador do sistema. O navegador usa Web Speech quando disponível. Voz italiana ou portuguesa é uma aproximação quando não há voz latina.

## Fontes

As explicações foram preparadas com apoio da gramática [Allen and Greenough, Dickinson College Commentaries](https://dcc.dickinson.edu/grammar/latin). As traduções, as análises e as atividades foram escritas para o projeto. Cada trecho antigo traz sua referência no leitor.

- [Sêneca, Epistulae morales 1](https://www.yorku.ca/pswarney/Texts/seneca/epistula/epistula-1.htm)
- [Sêneca, De brevitate vitae 1.3–4](https://atlas.perseus.tufts.edu/library/passage/urn:cts:latinLit:stoa0255.stoa004.perseus-lat2:1.3-1.4/)
- [César, De bello Gallico 1.1](https://www.perseus.tufts.edu/hopper/text?doc=Caes.+Gal.+1.1)
- [Catulo, Carmen 85](https://www.perseus.tufts.edu/hopper/text?doc=Catul.+85)

Código e conteúdo autoral sob licença MIT. O texto latino de autores antigos está em domínio público.
