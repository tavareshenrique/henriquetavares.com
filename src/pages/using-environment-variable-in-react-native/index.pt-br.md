---
title: Utilizando .ENV no React Native
date: '2020-01-08'
spoiler: Saiba como utilizar variável de ambiente no React Native.
tags: ["React Native", "Env", "Variável de Ambiente", "JavaScript"]
---

## Faaaaaaala Codeeeers!!!

Estou de volta...

![Back](./john.gif)

Bom, na verdade, eu nunca fui, só não encontrava um tempinho para escrever, mas nesse ano de 2020 que se inicia, eu espero poder escrever muito mais aqui. ~~não prometo nada~~

Por falar nisso, feliz ano novo coders, que 2020 seja um ano de conquista para todos nós. 🍾🎉🥳

## Introdução
---
Vocês já se depararam alguma vez nos seus projetos em React Native com alguma secret key, chave de API ou qualquer outra informação sigilosa toda exposta no seu código fonte, ao invés de "escondida"?

Então...eu já!

![Yes](./yes.gif)

Acontece que não é bem uma boa prática deixar nenhum dado que seja confidencial exposto no código fonte, seja seu projeto open-source ou não.

No meu caso em especifico, eu precisei fazer uma requisição na API do Youtube, e para isso, era necessário gerar uma chave de API no Google para que conseguisse fazer essa requisição.

Eu gerei a chave de API, e ao invés de deixar ela totalmente exposta lá no código fonte, dessa maneira:

```jsx
<YouTube
   apiKey="pRk6rydvxWrA4?xGNrZzwgs1_BGCuY"
/>
```

Eu criei um arquivo **.env** e salvei a minha chave da API lá dentro, dessa forma:

```js
// .env

GOOGLE_API_KEY=pRk6rydvxWrA4?xGNrZzwgs1_BGCuY
```

E eu importo ele em qualquer lugar do meu projeto dessa maneira:

```jsx{1,4}
import { GOOGLE_API_KEY } from 'react-native-dotenv';

<YouTube
  apiKey={GOOGLE_API_KEY}
/>
```

É só isso, é sério, e você consegue importar em qualquer lugar mesmo, é muito simples.

Mas antes de prosseguir....

## Você sabe o que é .env?
---
Pra inicio de conversa se pronuncia **DOT ENV** e não **PONTO ENV**, para de falar errado...igual eu. Mentira, fala do jeito que quiser, o mundo é livre hahaha

O **.env** é basicamente um arquivo que você cria na raiz do seu projeto, com esse mesmo nome **(.env)**, e ele fica responsável por armazenar as suas variáveis de ambiente, ou seja, variáveis que você pode usar em TODO o seu projeto.

Basicamente, as variáveis que você cria dentro do **.env** são variáveis de informações sensíveis, informações que são secretas, como, informações de banco de dados, secret keys e chaves de API's, como foi o meu caso. Ou seja, tudo que for segredo, ~~me conta,~~ você joga pra dentro do **.env**.

Lembrando que é extremamente importante você colocar o **.env** dentro do **.gitignore** para não enviar ele para o repositório no servidor, porque se você não fizer isso, é o mesmo que está contando um segredo para aquela sua tia fofoqueira.

![Secrets](./secrets.gif)

## Bora Codar
---
Pra inicio de conversa, você precisa ter um projeto em React Native configurado aí.

**Passo 1:** Instale o **react-native-dotenv**, esse carinha será o responsável por tudo:

`Se você usa NPM:`
```
npm install react-native-dotenv --save-dev
```

`Se você usa YARN:`
```
yarn add react-native-dotenv
```

**Passo 2:** Dentro do se arquivo `babel.config.js`, será necessário acrescentar `'module:react-native-dotenv'` dentro de `presets`. Dessa forma:

```js{4}
module.exports = {
   presets: [
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv'
   ]
}
```

**Passo 3:** Agora crie na raiz do seu projeto, como eu tinha mencionado, um arquivo chamado `.env`, e dentro dele, você vai criar sua variável de ambiente, como por exemplo, dessa forma:

```js
// .env

TESTE_KEY=escreva_seu_segredo
```

Repare que mesmo se o conteúdo da sua variável de ambiente for uma string, você não precisa por entre aspas, o **.env** subentende isso já.

Bom, agora é só usar, por que está pronto!!!!

![OMG](./omg.gif)

## Como usar?
---
Acesse qualquer arquivo do seu projeto, pode ser o `App.js` para testar, e dentro dele você vai importar através do `react-native-dotenv` a variável que você declarou dentro **.env**, dessa maneira:

```jsx{4,7}
import React from 'react';
import { Text } from 'react-native';

import { TESTE_KEY } from 'react-native-dotenv';

export default function App() {
   return <Text>{`essa é minha variável ambiente: ${TESTE_KEY}`}</Text>
}
```

## Finalizando
---
É isso coders, espero que essa dica seja útil para vocês de alguma forma e lembre-se...

![cfc](./cfc.gif)

Abraços e até uma próxima!

![Think Different](./think.gif)