---
title: Using Babel Root Import in ReactJS
date: '2019-09-16'
spoiler: How to facilitate imports into your ReactJS projects.
---

## Heeeeeey Codeeers!!

Are you tired of when you have to import a file and you have to go back and forth, navigating within the subfolders until you reach your destination, like this?

```js
import IconBlog from '../../../../assets/images/IconBlog.svg';
```

Yeah??

![sim](./yessir.gif)

So follow me and I'll show you how to make this process easier.

## Getting Started
---

> **Step 1**: Install the **customize-cra** and **react-app-rewired** dependencies as development dependencies:

```jsx
yarn add customize-cra react-app-rewired -D
```
![perae](./calm.gif)

- "Henrique, what is this **customize-cra** and this **react-app-rewired**" ???


### **customize-cra && react-app-rewired** 
---

[customize-cra](https://github.com/arackaf/customize-cra) n' [react-app-rewired](https://github.com/timarney/react-app-rewired) are basically tools that allow us to assist in customizing create-react-app, it will be very useful for us.

---

> **Step 2**: Now you will need to create a file at the root of your project named: **config-overrides.js**

Created? Right! Now put this code below into it.

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

This code tells us that the root folder of our project is **src**. It is very likely that your [ESLint](https://henriquetavares.com/setting-eslint-on-reactjs-and-react-native) is complaining that **customize-cra** should not be placed in development dependencies and yes in global dependencies, to fix that ... ignore 🤷‍

---

> **Step 3**: Let's install the title owner of this post now:

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
> **Step 4**: Now, in order for our root folder, the **src** we referenced there in step 2, to be interpreted as a **"~"**, let's create a file called: **jsconfig.json** and put the code below inside it:

```jsx
"compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "~/*": ["*"]
    }
  }
```

---

> **Step 5**: Access the file **package.json**, and change the start, build and test scripts to look like this:

```js
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
  },
```

Note that we replaced **react-scripts** with **react-app-rewired**. It is a necessary change for everything to work properly, but be calm that it will not change anything for you.

---

> **Step 6**: Finally, go to your file **.eslintrc.js** and at the end add the lines to configure ESLint so that it recognizes Root Import.

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

> **Step 7**: Ready! Now when you want to access a file, you no longer need to get "lost", remember that **"~"** represents the **src** folder, which is our global folder. So, remember the example I gave in the introduction? Here is what it would be like now using Root Import:

```js
import IconBlog from '~/assets/images/IconBlog.svg';
```

## Finishing
---
See how Root Import makes this part of importing easier? There are times when we get lost to our destination, and with this configuration, the idea is to make our lives easier.

That's it, codeeers, see you next time!

![Think Different](./think.gif)