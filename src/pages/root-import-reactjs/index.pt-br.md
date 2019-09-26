---
title: Utilizando Babel Root Import no ReactJS
date: '2019-09-16'
spoiler: Como facilitar as importações nos seus projetos em ReactJS.
updateDate: '2019-09-26'
tags: ["ReactJS","JavaScript", "Babel", "ESLint"]
---

## Faaaaala Codeeeeeers!!

Está cansado de quando ter que importar algum arquivo e você tem que ir voltando, e voltando, navegando dentro das subpastas até chegar no destino, dessa maneira aqui?

```js
import IconBlog from '../../../../assets/images/IconBlog.svg';
```

Sim??

![sim](./sim.gif)

Então vem comigo que vou te mostrar como facilitar isso.

## Iniciando
---

> **Passo 1**: Pra começo de conversa, instale as dependencias do **customize-cra** e do **react-app-rewired** como dependências de desenvolvimento:

```jsx
yarn add customize-cra react-app-rewired -D
```
![perae](./parae.gif)

- "Henrique, o que é esse **customize-cra** e esse **react-app-rewired**"???


### **customize-cra && react-app-rewired** 
---

[customize-cra](https://github.com/arackaf/customize-cra) e [react-app-rewired](https://github.com/timarney/react-app-rewired) são basicamente ferramentas que permite e nos auxiliam na personalizações no create-react-app, vai ser muito útil pra gente nesse caso.

---

> **Passo 2**: Agora será necessário você criar um arquivo na raiz do seu projeto com o nome: **config-overrides.js**

Criou? Certo! Agora coloque esse código abaixo dentro dele.

```jsx
const { addBabelPlugin, override } = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import',
    {
      rootPathSuffix: 'src',
    },
  ])
);
```

Esse código informa que a pasta root do nosso projeto é a **src**. É bem próvavel que o seu [ESLint](https://henriquetavares.com/pt-br/setting-eslint-on-reactjs-and-react-native) fique reclamando que o **customize-cra** não deve ser colocado nas dependências de desenvolvimento e sim nas dependências globais, pra corrigir isso ... ignora 🤷‍

---

> **Passo 3**: Vamos instalar o dono do título desse post agora:

```jsx
yarn add prettier eslint-config-prettier eslint-plugin-prettier babel-eslint -D
```

```jsx
yarn add babel-plugin-root-import -D
```

```jsx
yarn add eslint-import-resolver-babel-plugin-root-import -D
```

---
> **Passo 4**: Agora para que a nossa pasta root, a **src** que refêrenciamos lá no passo 2, seja interpretada como um **"~"**, vamos criar um arquivo chamado: **jsconfig.json** e colocar o código abaixo dentro dele:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "~/*": ["*"]
    }
  }
}
```

---

> **Passo 5**: Acesse o arquivo **package.json**, e altere os scripts de start, build e test para que fiquem dessa maneira:

```js
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
  },
```

Repare que substituimos o **react-scripts** por **react-app-rewired**. É uma mudança necessária para que tudo funcione corretamente, mas fica tranquilo que não vai afetar em nada para você.

---

> **Passo 6**: Para finalizarmos, acesse o seu arquivo **.eslintrc.js** e lá no final de tudo adicione as linhas para configurar o ESLint para reconhecer o Root Import:
```js
  settings: {
    "import/resolver": {
      "babel-plugin-root-import": {
        rootPathSuffix: "src"
      }
    }
  }
```

---

> **Passo 7**: Pronto! Agora quando você quiser acessar um arquivo, não precisa mais ficar voltando e voltando, basta lembrar que o **"~"** representa a pasta **src** que é a nossa pasta "globalzona". Então, lembra aquele exemplo que dei lá na introdução? Veja como ele ficaria agora utilizando Root Import:

```js
import IconBlog from '~/assets/images/IconBlog.svg';
```

## Finalizando
---
Viram como o Root Import facilita essa parte de importação? Tem vezes que a gente fica uma vida pra chegar no destino, e com essa configuração, a ideia é facilitar nossa vida.

É isso, Codeeers, até a próxima!

![Think Different](./think.gif)