---
title: Configuring Babel Root Import in TypeScript projects in ReactJS and React Native
date: '2020-04-25'
spoiler: 'Say goodbye to imports: "../../../../../"'
tags: ["ReactJS", "React Native", "TypeScript", "Babel", "RootImport", "ESLint"]
---

## Heeeeeey Codeeeeers

Today I came to bring a very cool solution for you who are tired of having to import into your **TypeScript** projects in **ReactJS** and **React Native**, like this:

```js
import Header from '../../../../Components/Header'
```

How about ... do this up there, turn this over:

```js
import Header from '~/Components/Header'
```

Much better, right?!

![yes](./yes.gif)

Eu já havia trazido a solução do **React Root Import** para projetos em **ReactJS** utilizando **JavaScript**, e você pode ver aqui:

I had already brought the **React Root Import** solution for **ReactJS** projects using **JavaScript**, and you can see it here:

[Using Babel Root Import in ReactJS](https://henriquetavares.com/root-import-reactjs)

Soon, I will update and add the Root Import part of **React Native** for **JavaScript** projects as well.

# ⚛️ Root Import in ReactJS

Before you start it is **recommended** that you have **ESLint** configured in your project, if you haven't already, ~~GET OUT OF HERE~~, you can follow this tutorial I did a while ago and it will help you:

[Configuring ESlint and Prettier on ReactJS and React Native](https://henriquetavares.com/setting-eslint-on-reactjs-and-react-native)

### 1. Install the `babel-eslint`, `babel-plugin-root-import`, `customize-cra`, `eslint-import-resolver-babel-plugin-root-import` and the `react-app-rewired` as development dependency, in that way

```shell
yarn add babel-eslint babel-plugin-root-import customize-cra eslint-import-resolver-babel-plugin-root-import react-app-rewired -D
```

### 2. Then it is necessary to change the `scripts` of `start`, `build` and `test` in your `package.json`, in this way

```json
"start": "react-app-rewired start",
"build": "react-app-rewired build",
"test": "react-app-rewired test",
```

🎙️ _Look that you just replaced **react-scripts** with **react-app-rewired**, this will not interfere with anything in your application, **react-app-rewired** with **customize- cra**, which we will see in a moment, only help us to overwrite some information from **create-react-app** so that he can understand **babel-root-import** when running the project._

### 3. Now, in the `.eslintrc.json`, in the end of file, there is a `"settings"`, if don't have, you can create a one, it should be like this

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

🎙️ _Here is an example from my compelte file:_

[ESLint Config TypeScript]([https://gist.github.com/tavareshenrique/c009880215681cd6e33710e882bf5cd3])

🗒 _**Note:** Remember that the format is in **JSON**, if the file is in **.js** format, you just have to adapt it to **JavaScript** that works._

### 4. Create a file called `config-overrides.js` at the root of the project and paste the following code into it

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

🎙️ _This file that will be responsible for implementing babel root import in React, in terms._

🎙️ _It is very likely that **ESLint** will be "complaining" about an error that **"customize-cra"** should come on the production premises and not the development one, but it is not necessary, you can ignore it, it will not influence anything._

### 5. Create a file called `tsconfig.paths.json` at the root of the project, and paste the following code into it

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

🎙️ _This file will be responsible for overwriting some information from **tsconfig.json**, such as **baseURL**, which in my case is **“src”**, and I imagine yours too, if not , can change. Oh, and also the **"paths"**._

### 6. Finally, add the `tsconfig.paths.json` that you created inside the `tsconfig.json` that already exists in your application, like this

```json
"extends": "./tsconfig.paths.json",
```

# 📱 Root Import no React Native

Before you start it is **recommended** that you have **ESLint** configured in your project, so you already know:

[Configuring ESlint and Prettier on ReactJS and React Native](https://henriquetavares.com/setting-eslint-on-reactjs-and-react-native)

### 1. Install `babel-eslint`, `babel-plugin-root-import`, and `eslint-import-resolve-babel-plugin-root-import` as a development dependency

```shell
yarn add babel-eslint babel-plugin-root-import eslint-import-resolver-babel-plugin-root-import -D
```

### 2. Now, in the `.eslintrc.json`, in the end of file, there is a `"settings"`, if don't have, you can create a one, it should be like this

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

🎙️ _Here is an example from my compelte file:_

[ESLint Config TypeScript]([https://gist.github.com/tavareshenrique/c009880215681cd6e33710e882bf5cd3])

🗒 _**Note:** Remember that the format is in **JSON**, if the file is in **.js** format, you just have to adapt it to **JavaScript** that works._

### 3. Now access the `babel.config.js`

🎙️ _Bellow:_

```js
presets: ['module:metro-react-native-babel-preset']
```

🎙️ _Paste the code:_

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

🎙️ _**The file should look like this:**_

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

🎙️ _This is just for babel to recognize **babel root import**, and of course, by setting the **"src"** folder as our **root folder**, if yours is not this you can change it, and also by configuring the **~** to be our **prefix**._

### 4. Finally, add the `baseURL` options inside your `compilerOptions` pointing to your root folder, mine is `"src"`, and add `path`, like this

```json
  "baseUrl": "src",
  "paths": {
   "~/*": ["*"]
  }
```

🎙️ _It is very likely that these **baseURL** and **path** options already exist within **tsconfig.json**, so, therefore, uncomment them and configure._

🗒 _**Note:** They don't need to be next to each other, so it's just an example._

# ✅  Finishing

---
Well, that's it, you may need to open and close VSCode or your other code editor for everything to work properly, but this way you should be able to import your files this way:

```js
import Header from '~/Components/Header'
```

I hope this is useful for you, any questions, you can send me a message, see you next time!

![think-different](./think.gif)
