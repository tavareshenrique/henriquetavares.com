---
title: How to debug in VSCode using Microsoft Edge(Dev)
date: '2021-01-19'
spoiler: Do you want to escape Google Chrome? Come read here...
---

## Heeeeey Coders!!

In the last few months I have been using Microsoft Edge, but I have used the "dev" version, because I am using Linux and there is still no Microsoft Edge Release for Linux.

![edge](./edge.png)

Therefore, these steps were performed on an Ubuntu Linux.

So, after a long time using Google Chrome, I decided to change, since Chrome consumes a lot of memory on my PC, and Microsoft Edge came to help improve that.

In addition, the similarity to Google Chrome is much the same, but of course, it uses MUCH less memory.

Let's Code!

## Start

> **Step 1**: You need install the [Microsoft Edge Tools for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-edgedevtools.vscode-edge-devtools) Extension;

> **Step 2**: Now, we will configure the **launch.json**:
```json
// launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "edge",
      "request": "launch",
      "name": "Launch Edge against localhost",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}",
      "runtimeExecutable": "/opt/microsoft/msedge-dev/msedge"
    }
  ]
}
```

It is! Easy peasy, right?!


![easy](./easy.gif)

**🎙️ Note:** Look, it was necessary to declare **"runtimeExecutable"**, because as I said before, the Microsft Edge I use is the **"dev" version**. When Micrsoft release the official version for Linux, or if you already use the official version on Windows or MacOS, you will **NOT NEED** this **"runtimeExecutable"**.

## Finishing
---
That's it, I hope it helps, it took me a while to reach this final result. Remembering, I did this process on Ubuntu Linux using the "dev" version of Microsoft Edge. 

**See U!**

![think-different](./think.gif)

