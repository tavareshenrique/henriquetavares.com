---
title: My basic settings in React Native projects
date: '2019-08-18'
spoiler: Some essential settings for my React Native projects.
updateDate: '2019-09-26'
tags: ["React Native","JavaScript"]
---

## Heeeeeeeey Coders!!

Today I want to show you my main basic settings I use when starting a project in React Native from scratch.

## ESLint e Prettier
---

To start with, let's go with them, our little friends ESLint and Prettier that you've seen here on the blog, so just follow the steps of the previous tutorial, [Configuring ESlint and Prettier on ReactJS and React Native](https://henriquetavares.com/setting-eslint-on-reactjs-and-react-native/).

## Reactotron
---

If you don't know what Reactotron is, it's used to inspect code in ReactJS and React Native, I think it can still be much more useful for React Native than for ReactJS, and for me it's essential in my projects. If you still had this difficulty understanding what Reactotron is, it may be that later on I will bring an article about it.

Okay, now let's to code:

> **Step 1**: To start with, add the Reactotron dependencies, this includes not only Reactotron itself, but the Reactotron dependencies with Redux and Redux Saga. So make sure you have Redux and Redux Saga installed, if not, install them first like this:

```jsx
yarn add reactotron-react-native
```

Now the Reacotron + Redux + Redux Saga dependencies:

```jsx
yarn add reactotron-react-native reactotron-redux reactotron-redux-saga
```

> **Step 2**: Create a `config` folder inside the` src` folder of your project;

> **Step 3**: Inside the `config` folder create a file called` ReactotronConfig.js`, the structure should look like this:

```
your-project-rn
├── src/
│   ├── config/
│   │   └── ReactotronConfig.js
```
> **Step 4**: Inside the `ReactotronConfig.js` file paste the code:

```jsx
import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure()
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
```
**Note:** Notice to Android friends, if by any chance your project information is not showing up on your Reactotron Desktop, add your computer ip to `Reactotron.configure ()`, like this:

```jsx{4}
import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({ host: 'your-ip' })
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
```

> **Step 5**: Import ReactotronConfig into the project's index:

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

**Note:** Remember to import it before **ALL** non-React imports.

## React Native Gesture Handler
---

Gesture Handler is a very famous library used to recognize gestures made on the cell phone by React Native, such as tweezers movement etc.

> **Step 1**: Installing:

```jsx
yarn add react-navigation react-native-gesture-handler
```

> **Step 2**: Linking:

```jsx
react-native link react-native-gesture-handler
```

> **Step 3**: For Android there's one more step, so I left the link that takes you straight to the React Native Gesture Handler page with the steps you have to do, it is recommended to do what is passed on the official site, because this information may change , so I won't copy and paste here.

**Below the link:**

> https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html#android

## Styled-Components
---
Well, for starters, I want to make clear my great passion for stylish components, I can no longer style anything without using Styled-Components. I don't want ~want~ to go into too much detail, because I want to bring a unique article about it, but in short, Styled-Components is used to make stylizations using JS files.

> **Step 1**: Installing:

```jsx
yarn add styled-components
```

## Vector Icons
---
As its name implies, it's an easy way to work with Icone on React Native.

> **Step 1**: Installing:

```jsx
yarn add react-native-vector-icons
```

> **Step 2**: Linking:

```jsx
react-native link react-native-vector-icons
```

>**Step 3**: How to use:

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

Async Storage is React Native's `Local Storage`, it is like a local `database` to save some data, but using the storage itself.

> **Passo 1**: Installing:

```jsx
yarn add @react-native-community/async-storage
```

> **Passo 2**: Linking:

```jsx
react-native link @react-native-community/async-storage
```
## Finishing
---
So Coders, that's it, as I increase this list I'm adding here, and soon I want to add the Redux part here, plus the organization of my folders.

But I hope this all helps somehow, until next time!

![think-different](./think.gif)
