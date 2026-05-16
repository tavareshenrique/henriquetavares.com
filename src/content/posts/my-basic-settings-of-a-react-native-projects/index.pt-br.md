---
title: Minhas configurações básicas em projetos React Native
date: '2019-08-18'
spoiler: Algumas configurações essenciais para os meus projetos em React Native.
updateDate: '2019-09-26'
tags: ["React Native","JavaScript"]
---

## Faaaaala Codeeeeers!!

Hoje eu quero mostrar as minhas principais configurações básicas que uso ao iniciar um projeto em React Native do zero.

## ESLint e Prettier
---

Pra começar, vamos com eles, os nossos amiguinhos ESLint e Prettier que você já viu aqui no blog, então é só seguir os passos do tutorial anterior, [Configurando ESlint e o Prettier no ReactJS e React Native](https://henriquetavares.com/pt-br/setting-eslint-on-reactjs-and-react-native/).

## Reactotron
---

Se você não sabe o que é o Reactotron, ele é usado para inspecionar códigos no ReactJS e no React Native, eu acredito que ainda consegue ser muito mais útil pro React Native do que para o ReactJS, e pra mim é essencial ele nos meus projetos. Se mesmo assim você ainda teve essa dificuldade para entender por alto o que é o Reactotron, pode ser que mais pra frente eu venha trazer um artigo sobre ele.

Tá, agora vamos codificar:

> **Passo 1**: Pra começar, adicione as dependências do Reactotron, isso inclui não só o próprio, mas as dependências do Reactotron com o Redux e Redux Saga. Então certifique de ter o Redux e o Redux Saga instalado, caso não tenha, instale eles antes dessa forma:

```jsx
yarn add redux redux-saga react-redux
```

Agora sim, as dependências do Reacotron + Redux + Redux Saga:

```jsx
yarn add reactotron-react-native reactotron-redux reactotron-redux-saga
```

> **Passo 2**: Crie uma pasta `config` dentro da pasta `src` do seu projeto;

> **Passo 3**: Dentro da pasta `config` crie um arquivo chamado `ReactotronConfig.js`, a estrutura deve ficar desse jeito:

```
seu-projeto-rn
├── src/
│   ├── config/
│   │   └── ReactotronConfig.js
```
> **Passo 4**: Dentro do arquivo `ReactotronConfig.js` cole o seguinte código:

```jsx
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import reactotronSaga from 'reactotron-redux-saga';

if (__DEV__) {
  const tron = Reactotron.configure()
    .useReactNative()
    .use(reactotronRedux())
    .use(reactotronSaga())
    .connect();

  tron.clear();

  console.tron = tron;
}
```
**Obs.:** Aviso aos amigos do Android, se por acaso, as informações do seu projeto não estiver aparecendo no seu Reactotron do Desktop, adicione o ip do seu computador no `Reactotron.configure()`, ficando dessa maneira:

```jsx{4}
import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({ host: 'seu-ip' })
    .useReactNative()
    .use(reactotronRedux())
    .use(reactotronSaga())
    .connect();

  console.tron = tron;

  tron.clear();
}
```

> **Passo 5**: Importe o ReactotronConfig no `index` do projeto, dessa forma:

```jsx{4}
import React from 'react';
import { StatusBar } from 'react-native';

import './config/ReactotronConfig';

import Routes from './routes';

export default function App() {
  return (
      <Routes />
  );
}

```

**Obs.:** Lembre de importar ele antes de **TODAS** as importações que não sejam do React.

## React Native Gesture Handler
---

Gesture Handler é uma biblioteca muito famosa e utilizada para reconhecer os gestos feito no celular pelo React Native, como o movimento de pinça etc.

> **Passo 1**: Instalando:

```jsx
yarn add react-navigation react-native-gesture-handler
```

> **Passo 2**: Fazendo o Link:

```jsx
react-native link react-native-gesture-handler
```

> **Passo 3**: Para o Android tem um passo a mais, então deixei o link que te leva direto na página do React Native Gesture Handler com os passos que você tem que fazer, é recomendado fazer o que é passado no site oficial, porque essas informações podem sofrer alterações, por isso não vou copiar e colar aqui. 

**Abaixo o link:**

> https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html#android

## Styled-Components
---
Bom, pra começar, quero deixar bem claro a minha grande paixão pelos Styled-Components, eu já não consigo ~~quero~~ mais estilizar nada sem utilziar Styled-Components. Eu não quero entrar muito em detalhes porque pretendo trazer um artigo exclusivo sobre ele, mas resumindo, o Styled-Components é utilizado para fazer estilizações usando arquivos JS.

> **Passo 1**: Instalando:

```jsx
yarn add styled-components
```

## Vector Icons
---
Como o próprio nome já diz, é uma maneira fácil de trabalhar com Icone no React Native.

> **Passo 1**: Instalando:

```jsx
yarn add react-native-vector-icons
```

> **Passo 2**: Fazendo o Link:

```jsx
react-native link react-native-vector-icons
```

>**Passo 3**: Como usar:

```jsx{4,9}
import React from 'react';
import { View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Main({ navigation }) {
  return (
    <View>
      <Icon name="add" size={20} color="#FFF" />
    </View>
  );
}
```

## Async Storage
---

Async Storage é o `Local Storage` do React Native, é como se fosse um `"banco de dados"` local para deixar alguns dados salvos, mas usando o armazenamento do próprio celular.

> **Passo 1**: Instalando:

```jsx
yarn add @react-native-community/async-storage
```

> **Passo 2**: Fazendo o Link:

```jsx
react-native link @react-native-community/async-storage
```
## Finalizando
---
Então coders, é isso, na medida que eu for aumentando essa lista eu vou adicionando aqui, e em breve pretendo adicionar a parte do Redux aqui, mais a organização das minhas pastas. 

Mas espero que isso tudo ajude de alguma forma, até uma próxima! 

![think-different](./think.gif)
