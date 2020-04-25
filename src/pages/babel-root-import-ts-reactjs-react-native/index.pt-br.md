---
title: Configurando Babel Root Import em projetos TypeScript no ReactJS e React Native
date: '2020-04-25'
spoiler: 'Esqueça para sempre as importações: "../../../../../"'
tags: ["ReactJS", "React Native", "TypeScript", "Babel", "RootImport", "ESLint"]
---

## Faaaaala Codeeeeers

Hoje eu vim trazer uma solução muito legal para você que está cansado de ter que fazer importações nos seus projetos **TypeScript** em **ReactJS** e **React Native**, dessa forma:

```js
import Header from '../../../../Components/Header'
```

Que tal...fazer isso aí acima, virar isso:

```js
import Header from '~/Components/Header'
```

Muito melhor, né?!

![yes](./yes.gif)

Eu já havia trazido a solução do **React Root Import** para projetos em **ReactJS** utilizando **JavaScript**, e você pode ver aqui:

[Utilizando Babel Root Import no ReactJS](https://henriquetavares.com/pt-br/root-import-reactjs/)

Em breve, vou atualizar e adicionar a parte do Root Import no **React Native** para projetos **JavaScript** também.

# ⚛️ Root Import no ReactJS

Antes de começar é **recomendado** que você tenha o **ESLint** configurado no seu projeto, caso não tenha ainda, ~~SAIA JÁ DAQUI~~, você pode seguir esse tutorial que fiz um tempo atrás e vai te ajudar:

[Configurando ESlint e o Prettier no ReactJS e React Native](https://henriquetavares.com/pt-br/setting-eslint-on-reactjs-and-react-native/)

### 1. Instale o `babel-eslint`, `babel-plugin-root-import`, `customize-cra`, `eslint-import-resolver-babel-plugin-root-import` e o `react-app-rewired` como dependência de desenvolvimento, dessa maneira:

```shell
yarn add babel-eslint babel-plugin-root-import customize-cra eslint-import-resolver-babel-plugin-root-import react-app-rewired -D
```

### 2. Depois é necessário alterar os `scripts` de `start`, `build` e `test` no seu `package.json`, dessa forma:

```json
"start": "react-app-rewired start",
"build": "react-app-rewired build",
"test": "react-app-rewired test",
```

🎙️ _Repare que você apenas substituiu o **react-scripts** pelo **react-app-rewired**, isso não vai interferir em nada na sua aplicação, o **react-app-rewired** junto do **customize-cra**, que vamos ver daqui a pouco, só nos auxiliam a sobrescrever algumas informações do **create-react-app** para que ele possa entender o **babel-root-import** na hora de rodar o projeto._

### 3. Agora, lá no seu `.eslintrc.json`, ao final do arquivo, vai ter um `"settings"`, senão tiver, é só você criar ele, ele deve deve ficar desse jeito:

```json
"settings": {
    "import/resolver": {
      "typescript": {},
      "babel-plugin-root-import": {
        "rootPathPrefix": "~",
        "rootPathSuffix": "src"
      }
    }
  }
```

🎙️ _Aqui um exemplo do meu arquivo completo:_

[ESLint Config TypeScript]([https://gist.github.com/tavareshenrique/c009880215681cd6e33710e882bf5cd3])

🗒 _**Obs.:** Só lembrando que esse formato aí está em **JSON**, se o seu **.eslintrc** for no format o**js**, é só **adaptar para JavaScript** que funciona do mesmo jeito._

### 4. Crie um arquivo chamado `config-overrides.js` na raiz do projeto  cole o seguinte código dentro dele:

```js
const { addBabelPlugin, override } = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import',
    {
      rootPathSuffix: 'src',
    },
  ]),
);
```

🎙️ _Esse arquivo que será responsável de implementar o babel root import no React, digamos assim, em termos._

🎙️ _É bem provável que o **ESLint** fique "reclamando" de um erro que o **"customize-cra"** deve vir nas dependências de produção e não da de desenvolvimento, mas não é necessário, pode ignorar, não vai influenciar em nada._

### 5. Crie um arquivo chamado `tsconfig.paths.json` na raiz do projeto, e cole o seguinte código nele:

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

🎙️ _Esse arquivo será responsável por sobrescrever algumas informações do **tsconfig.json**, tais como a **baseURL**, que no meu caso é a **"src"**, e imagino que a sua também, caso não seja, pode mudar. Ah, e também o **"paths"**._

### 6. Para finalizar adicione o `tsconfig.paths.json` que você criou dentro do `tsconfig.json` que já existe na sua aplicação, dessa maneira:

```json
"extends": "./tsconfig.paths.json",
```

# 📱 Root Import no React Native

Antes de começar é **recomendado** que você tenha o **ESLint**  configurado no seu projeto, entao já sabe:

[Configurando ESlint e o Prettier no ReactJS e React Native](https://henriquetavares.com/pt-br/setting-eslint-on-reactjs-and-react-native/)

### 1. Instale o `babel-eslint`, `babel-plugin-root-import`, e o `eslint-import-resolver-babel-plugin-root-import` como dependência de desenvolvimento

```shell
yarn add babel-eslint babel-plugin-root-import eslint-import-resolver-babel-plugin-root-import -D
```

### 2. Agora, lá no seu `.eslintrc.json`, ao final do arquivo, vai ter um `"settings"`, senão tiver, é só você criar ele, ele deve deve ficar desse jeito

```json
"settings": {
    "import/resolver": {
      "typescript": {},
      "babel-plugin-root-import": {
        "rootPathPrefix": "~",
        "rootPathSuffix": "src"
      }
    }
  }
```

🎙️ _Aqui um exemplo do meu arquivo completo:_

[ESLint Config TypeScript]([https://gist.github.com/tavareshenrique/c009880215681cd6e33710e882bf5cd3])

🗒 _**Obs.:** Só lembrando que esse formato aí está em **JSON**, se o seu **.eslintrc** for no formato **js**, é só **adaptar para JavaScript** que funciona do mesmo jeito._

### 3. Agora acesse o `babel.config.js`

🎙️ _Abaixo de:_

```js
presets: ['module:metro-react-native-babel-preset']
```

🎙️ _Cole o seguinte código:_

```js
plugins: [
 [
   'babel-plugin-root-import',
    {
     rootPathPrefix: '~',
     rootPathSuffix: 'src',
    },
  ],
],
```

🎙️ _**O arquivo deve estar dessa maneira:**_

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        rootPathPrefix: '~',
        rootPathSuffix: 'src',
      },
    ],
  ],
};
```

🎙️ _Isso é apenas para o babel reconhecer o **babel root import**, e claro, configurando a pasta **"src"** como nossa **pasta root**, se a sua não for essa pode mudar, e também configurando o **~** para ser o nosso **prefixo**._

### 4. Por último, adicione dentro do seu `compilerOptions` as opções `baseURL` apontando para sua pasta root, a minha é a `"src"`, e adione o `path`, dessa forma

```json
  "baseUrl": "src",
  "paths": {
   "~/*": ["*"]
  }
```

🎙️ _É bem provável que essas opções de **baseURL** e **path** já existam dentro do **tsconfig.json**, então só descomente elas, e configure._

🗒 _**Obs.:** Elas não preciam ficar uma do lado da outra, aí é só um exemplo._

# ✅  Finalizando

---
Bom, é só isso pessoal, talvez seja necessário você abrir e fechar o VSCode ou seu outro editor de código para tudo funcionar corretamente, mas dessa maneira você deverá ser capaz de importar seus arquivos dessa maneira:

```js
import Header from '~/Components/Header'
```

Espero que isso seja útil para vocês, qualquer dúvida, pode me procurar, até uma próxima!

![think-different](./think.gif)
