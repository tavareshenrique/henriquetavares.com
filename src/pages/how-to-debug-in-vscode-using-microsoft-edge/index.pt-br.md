---
title: Como debugar no VSCode utilizando o Microsoft Edge(Dev)
date: '2021-01-19'
spoiler: Você quer fugir do Google Chrome? chega mais...
---

## Faaaala galera!!

Nos últimos meses eu tenho utilizado o Microsoft Edge, mas tenho usado a versão "dev", porque estou usando Linux e ainda não existe a versão oficial do Microsoft Edge para o Linux.

![edge](./edge.png)

Portanto, essas etapas foram executadas em um Ubuntu Linux.

Então, depois de muito tempo usando o Google Chrome, resolvi mudar, já que o Chrome consome muita memória do meu PC, e o Microsoft Edge veio ajudar a melhorar isso.

Além disso, a semelhança com o Google Chrome é praticamente a mesma, mas é claro, ele usa MUITO menos a memória.

Bora codar!

## Iniciando

> **Etapa 1**: Você precisa instalar a extensão [Microsoft Edge Tools for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-edgedevtools.vscode-edge-devtools);

> **Etapa 2**: Agora, vamos configurar o **launch.json**:
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

É isso! De boa né?!


![facil](./facil.gif)

**🎙️ Observação:** Foi necessário declarar **"runtimeExecutable"**, porque como eu disse antes, o Microsft Edge que utilizo é a versão **"dev"**. Quando a Micrsoft lançar a versão oficial para Linux, ou se você já usa a versão oficial no Windows ou MacOS, você **NÃO VAI PRECISAR** deste **"runtimeExecutable"**.

## Finalizando
---
É isso, espero que ajude, demorei um pouco para chegar nesse resultado final. Lembrando, fiz esse processo no Ubuntu Linux usando a versão "dev" do Microsoft Edge.

**Até a próxima!**

![think-different](./think.gif)
