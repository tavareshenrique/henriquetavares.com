---
title: Using .ENV in React Native
date: '2020-01-08'
spoiler: Learn how to use environment variable in React Native.
updateDate: '2021-03-13'
tags: ["React Native", "Env", "Variável de Ambiente", "JavaScript"]
---

## Heeeeeeey Codeeeers!!!

I'm back...

![Back](./john.gif)

So, actually, I never gone, I just couldn't find a little time to write, but in the year 2020 that begins, I hope I can write much more here. ~~I don't promise anything~~

By the way, happy new year coders, may 2020 be a year of achievement for all of us. 🍾🎉🥳

## Introduction
---
Have you ever come across your React Native projects with any secret key, API key or any other sensitive information all exposed in your source code, rather than "hidden"?

So ... it happened to me!

![Yes](./yes.gif)

It turns out that it's not a good practice to leave any confidential data exposed in the source code, whether it's your open source project or not.

In my specific case, I needed to make a request in the Youtube API, and for that, it was necessary to generate an API key on Google in order to make this request.

I generated the API key, and instead of leaving it fully exposed there in the source code, like this:

```jsx
<YouTube
   apiKey="pRk6rydvxWrA4?xGNrZzwgs1_BGCuY"
/>
```

I created a **.env** file and saved my API key in there, like this:

```js
// .env

GOOGLE_API_KEY=pRk6rydvxWrA4?xGNrZzwgs1_BGCuY
```

And I import it anywhere in my project like this:

```jsx{4}
import { GOOGLE_API_KEY } from 'react-native-dotenv';

<YouTube
  apiKey={GOOGLE_API_KEY}
/>
```

That's it, really, and you can import anywhere, it's easy peasy.

But before proceeding ....

## Do you know what .env is?
---
The **.env** is basically a file you create in the root of your project, with the same name **(.env)**, and is responsible for storing your environment variables, ie you can use these embiente variables in ALL of your project.

Basicamente, as variáveis que você cria dentro do **.env** são variáveis de informações sensíveis, informações que são secretas, como, informações de banco de dados, secret keys e chaves de API's, como foi o meu caso. Ou seja, tudo que for segredo, ~~me conta,~~ você joga pra dentro do **.env**.

Basically, the variables you create within **.env** are sensitive information variables, information that is secret, such as database information, secret keys, and API keys, as was my case. That is, whatever is secret, ~~tell me,~~ you throw it into **.env**.

Remembering that it is extremely important that you put **.env** inside **.gitignore** not to send it to the repository on the server, because if you don't do it, it's the same as telling a secret to that gossipy aunt of yours.

![Secrets](./secrets.gif)

## Get to work
---
To start with, you need to have a React Native project set up there.

**Step 1:** Install **react-native-dotenv**, it will be responsible for everything:

`If you use NPM:`
```
npm install react-native-dotenv --save-dev
```

`If you use YARN:`
```
yarn add react-native-dotenv
```

**Step 2:** Inside your `babel.config.js` file, you will need to add `'module: react-native-dotenv'` into `presets`. Like this:

```js{4}
module.exports = {
   presets: [
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv'
   ]
}
```

**Step 3:** Create in the root of your project, as I had mentioned, a file called `.env`, and inside it, you will create your environment variable, like this:

```js
// .env

TEST_KEY=write_your_secret
```

Note that even though the content of your environment variable is a string, you don't need quotation marks, **.env** already understands this.

Well, now just use it, because it's ready!!!!

![OMG](./omg.gif)

## How to use?
---
Access any file in your project, it can be the `App.js` to test, and inside it you will import through `react-native-dotenv` the variable you declared in **.env**, like this:

```jsx{4,7}
import React from 'react';
import { Text } from 'react-native';

import { TEST_KEY } from 'react-native-dotenv';

export default function App() {
   return <Text>{`this is my environment variable: ${TEST_KEY}`}</Text>
}
```

## Can I give you a tip?

---

Are you a React Native developer? Do you know what skills you need to be a respected React Native developer? I recommend reading the **g2i** post, they approached the subject very well.

[Hiring a React Native Developer: What Should You Look For?](https://www.g2i.co/blog/hiring-a-react-native-developer)

## Finishing
---
That's it coders, hope this tip is useful for you somehow and remember ...

![cfc](./cfc.gif)

See you in the next!

![Think Different](./think.gif)