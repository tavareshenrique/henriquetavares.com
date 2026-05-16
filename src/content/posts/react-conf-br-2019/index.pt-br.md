---
title: React Conf 2019 - Brasil
date: '2019-10-28'
spoiler: O que aconteceu na React Conf 2019 - Brasil?
updateDate: '2021-03-13'
tags: ["React Native","React", "JavaScript", "ReactConfBR2019"]
---

## Faaaaala Codeeeeers!!

Estou de volta, esse mês de outubro eu estava de férias, então decidi aproveitar o máximo e dei uma desligada da rotina, estava vindo de uma rotina frenética, meio que estava precisando, fiquei umas 3 semanas sem abrir o VSCode hehehehehe 😬.

Maaaaas, isso não significa que fiquei parado, durante as férias eu aproveitei e fui na 3ª edição da React Conf que aconteceu em São Paulo no dia 19 de Outubro de 2019, e é isso que eu vim contar um pouquinho pra vocês sobre as coisas que eu vi lá, mas de uma forma resumida.

![HenriqueRC2019](./rconf.jpg)

# React Native (Comparação com Flutter)

Já de começo, uma "polêmica"...

![Para](./para.gif)

O [Andrei Calazans](https://twitter.com/andrei_calazans) que é um cara super conceituado quando o assunto é React Native, trouxe um pouco da comparação entre o React Native e o seu "rival" o Flutter.

A talk não tinha o intuito de dizer qual era o melhor, e sim, quais as vantagens de cada um dependendo do projeto que você esteja desenvolvendo. É claro que o mercado para o React Native está muito mais agitado, além do fato de se usar Javascript, que é uma das linguagens mais utilizadas atualmente pelos programadores, é possível reutilizar o mesmo código que você desenvolveu em React para um aplicação web, com algumas pequenas modificações, obviamente, para desenvolver o mobile.

Mas o Flutter não fica para trás, depois que o Nubank resolveu aderir o Flutter, ele deu uma crescida enorme no mercado brasileiro. Existem grandes vantagens dele em cima dos apps feitos em React Native, e vice-versa, então, como o André deixou bem claro, é questão de saber qual o intuito do seu projeto, para assim então você decidir a tecnologia que irá usar, mas sempre consciente que independente da escolha que seja feita, você não ficará para trás.

Particularmente, durante a talk, eu entendi que por questões de desempenho, o Flutter está um pouco, mas bem pouco, a frente do React Native, mas a comunidade do React Native sabe disso, e estão trabalhando para melhorar cada vez mais essa questão.

**Slide da Talk:** https://slides.com/andreicalazans/the-state-ofreact-native#/

# Performance com React
Performance com React foi uma talk muuuito interessante apresentado pela Larissa Thaís, que faz nós pensarmos 2, 3 ou 4 vezes nos projetos que trabalhamos ou estamos trabalhando.

Ela começa questionando, **"Teu sistema perfoma bem?"**

Mas dentro dessa pergunta, existem outras perguntas...

![What](./what.gif)

Calma, vamos lá, se a sua resposta for positiva para todas essas perguntas abaixo, significa que você está num caminho super certo.

* O seu projeto tem um Tempo de Carregamento favorável?

* O seu projeto tem uma boa fluidez?

* O tamanho do bundle é bom?

* Funciona corretamente? Sem erros?

* O tempo de resposta do erro para o usuário é rápido?

* Qual o desempenho ao exibir vários itens na tela?

* O seu projeto possibilita o usuário fazer mais em menos tempo?

* Tem um fluxo constante de novos usuários?

São perguntas muito importantes que você sempre deve estar fazendo não só no fim do projeto, mas a todo instante, se você fez uma nova feature, refaça essas perguntas, que tenho certeza que irão te ajudar.

Larissa sempre destacava que Performance é igual a desempenho, que a performance é o cumprimento de uma obrigação ou de uma promessa. 

Então mantenha sua palavra, parça!

![DAB](./dab.gif)

Novamente, ela questiona, **Mas por que me incomodar com isso(performance)?**

Ela destaca 2 tópicos interessantes sobre essa pergunta e eu vou explicar o porque, que são:

* "Performance influencia a percepção do usuário sobre a qualidade".

  _**Ou seja, se você tem um sistema rápido, performático, que quando um usuário precisa fazer determinada ação, ele simplesmente vai lá e faz, sem demora, sem se prolongar, o usuário tem uma visão muito positiva sobre a empresa e o produto. O sistema não precisa adivinhar o que o usuário irá fazer, ele apenas, precisa fazer.**_ 

* "Vocẽ não vai ter um usuário dizendo: "A página de relatórios tá demorando demais por causa das imagens"

  _**Quem dera né? se o problema já chegasse com a solução metade do nosso serviço como programadores estaria pronto. Pra reformular, o usuário apenas iria dizer: "̶E̶s̶s̶a̶ ̶p̶o̶r̶r̶a̶ ̶d̶e̶s̶s̶e̶ ̶s̶i̶s̶t̶e̶m̶a̶ ̶t̶a̶ ̶u̶m̶a̶ ̶m̶e̶r̶d̶a̶" ... "Esse sistema tá muito lento"**_

Para ser mais direto, ela destaca algumas dicas, para fazer uma análise objetiva, quais são:

* Minificação;
* Code splitting;
* Otimização de imagens e ou reservar um servidor de imagens;
* Utilização de cache;
* Requisições assíncronas;
* Debounce em campos de texto;
* Rever o tempo de query's do banco;
  * **Mexer só no front não faz milagre, se seu problema for loading de request o backend tem que colocar a mão também**

Pensando nos componentes do React ela deixa alguma dicas de ferramentas:

**React DevTools:** Para verificar o que tem que atualizar no virtual-DOM;

**Highlight Updated Options:** Verificando renders desnecessários

Também recomenda isolar regiões de updates frequentes, como exemplo, um cronômetro, e sempre que possível usar PureComponet's ou React.Memo.

**Slide da Talk:** https://drive.google.com/file/d/1FTihjdURKDD34UbB7whJnPsIcumgatix/view

# The Golden Stack
Foi uma talk bem interessante também apresentada pelo [João Marins](https://twitter.com/jgcmarins), ele destaca a stack que é usada pelo [Foton](https://twitter.com/fotoncompany).

![Golden-Stack](./golden-stack.png)

Vou passar uma visão rápida sobre cada uma dessas perguntinhas respondida por ele e com alguns pontos meus.

**Why Monorepo?** Eu não sou expert em Monorepo, na verdade, preciso me aprofundar muito, não sou muito conceituado com o tema, mas o João explica que eles resolveram adotar o Monorepo por questão de praticidade e mais algumas coisinhas que eu prefiro não me aprofundar por causa do que eu já disse lá no início.

**Why MongoDB?** O MongoDB foi uma decisão pelo fato de ser um banco NoSQL, então decidiram adotar o mesmo. Eu particularmente já trabalhei com MongoDB em projetos particulares, e eu amo, além de ter uma curva de aprendizado grande é muito simples pra quem está começando a mexer e pra quem já mexe.

**Why TypeScript?** O TypeScript foi um dos assuntos que mais me chamou a atenção na React Conf Brasil 2019, muita gente vem adotando o TypeScript em novos projetos ao invés do Javascript. Tudo isso se deve ao fato de que o TypeScript te passa mais segurança,e foi um dos motivos de estar na stack do João, e lá eu tive certeza que já passou da hora pra mim começar a me aprofundar em TypeScript.

**Why GraphQL?** Outra tecnologia que me chamou muita atenção durante a React Conf Brasil 2019 junto ao TypeScript foi o GraphQL não só novos projetos estão adotando como projetos antigos estão migrando, a frase mais falada lá foi que “O GraphQL chegou pra ficar”, então não preciso dizer mais nada. O João ressaltou que o REST foi uma evolução do SOAP e GraphQL uma evolução do REST que vei para ficar.

**Why Jest?** O Jest foi uma das ferramentas de teste mais mencionada pela maioria dos palestrantes, eu já costumo usar o Jest mesmo, e só me deu mais certeza que estou no caminho certo.

**Why React e React Native?** Sério? preciso falar mesmo? Mas já falei tanto...mas tá, resumindo, o fato de você conseguir reaproveitar o código de um e de outro para desenvolver é algo fora de série, e é uma das milhares de vantagens de ter o React e o React Native na sua stack.

**Why Styled-Components?** Um dos grandes amores da minha vida é esse carinha aí. Eu estava até pensando em trazer um post só dele aqui, de tanto que eu gosto. Eu digo para os meus colegas que eu não sei mais mexer com CSS se não usar o Styled-Components, e lá também me deu certeza que ele está muito em alta no mercado, está na stack de grandes desenvolvedores e grandes empresas, como a do João e da Foton.

Essa palestras, só me fez ter certeza que onde eu trabalho, na [Zaal](https://www.zaal.com.br/) e o que eu tenho estudado e aprofundado está no caminho certo, não aderimos ainda a todas as ferramentas da lista, mas mais da metade está em uso, e umas com planos futuros.

**Why Relay? && Good Questions to answer && Whats next?**

Agora, deixo uns vídeos do João respondendo porque dele escolher o Relay ao invés do Apollo e respondendo algumas perguntas muito interessantes, ah e vem React Hooks ai pro Relay.

[![Watch the video](./play.gif)](https://drive.google.com/open?id=1Cqr69pPN_JNgJb0eIZiWp31u7gDIXHKE)

**Slide da Talk:** https://jgcmarins.github.io/the-golden-stack/#0


# Do Enzyme ao Testing Library
[Pablo Dinella](https://twitter.com/pablordinella), destacou a importância diferença entre a utilização do Enzyme e do Testing Library.

Se você não sabe o Testing Library é uma solução muito leve para testar componentes React. Ele fornece funções leves de utilidade em cima do ReactDOM de uma maneira que incentive melhores práticas de teste. A ideia dessa biblioteca é servir como um substituto para o Enzyme.

Uma vez eu ouvi uma frase que dizia: **"Para você ser um programador sênior, você deve ter o hábito de escrever testes diários"**, e essa apresentação só me deu mais certeza disso.

Bom, ele destaca que o Enzyme pode:

    * navegar na árvore componentes;
    * fazer seleções (seletores CSS, nome de componente...);
    * acessar props e state;
    * executar métodos;

E diz as coisas que o testing Library NÃO faz:

    * Shallow rendering shallow()
    * Static rendering render()
    * Navegação na árvore de componentes
    * Obter instância de componente
    * Acessar e setar props
    * Acessar e setar state

"Tudo isso são coisas que o usuário final não pode fazer, entao seu teste também não deveria fazer"

Ele vai mais afundo e deixa a característica de cada um explicita:

* Enzyme
   *  Baseia-se no retorno do componente
  * Facilita a navegação na árvore de componentes
  * Simula interações
  * Testa implementação

* Testing Library
  * Baseia-se no DOM renderizado
  * Tem seletores "humanizados"
  * Interações em nodes do DOM
  * Testa do ponto de vista do usuário fina

**Slide da Talk:** https://slides.com/pablo-dinella/do-enzyme-ao-testing-library#/

# ReasonML
ReasonML deu o que falar na React Conf Brasil 2019, eu particularmente nunca tinha ouvido falar, foi apresentado pelo [Gabriel Rubens](https://twitter.com/fakenickels) numa apresentação muito bem humorada e bem direta.

Pra quem está desse jeito aí abaixo como eu e nunca tinha ouvido falar de ReasonML, eu vou tentar explicar rapidamente.

![WTF](./wtf.gif)

O ReasonML nada mais é do que a nova linguagem de programação do...Facebook.

![Zuck](./zuck.gif)

Pra resumir bem, mas bem mesmo, o ReasonML é linguagem de programação objeto-funcional, é uma nova sintaxe, tipo C, para a linguagem de programação OCaml. Essa nova sintaxe tem como foco, facilitar a interoperabilidade com JavaScript e a adoção de programadores JavaScript. Além disso, ele remove idiossincrasias da sintaxe do OCaml.

Gabriel deixou bem claro na apresentação que é praticamente impossível compilar um código com erro utilizando o ReasonML, já vi isso antes em Delphi heim KKKKKK

Brincadeiras à parte, e então, por que ela foi tão polêmica? 

Bom, ao final o público podia fazer perguntas referentes a apresentação, e o Gabriel foi muito questionado se valia a pena estudar essa nova linguagem, pois, em Javascript nós "sofremos" com as milhares de coisas que surgem, nós não podemos deixar de estudar 1 dia se quer pra não ficar pra trás.

Então seria um tempo bem gasto estudando essa nova linguagem? 

Ou devemos focar no que já estamos estudando, como o próprio Javascript, TypeScript etc?

Gerou um debate, mas assim como tudo na vida, tudo tem seu lado pró e contra, então eu deixo abaixo o link do slide da aparesentação do Gabriel e um artigo sobre o ReasonML muito bom, caso vocês se interessem para tirarem suas próprias conclusões.

**Slide da talk:** https://es2077-reactconf.netlify.com/0

**Artigo:** https://medium.com/@oieduardorabelo/o-que-%C3%A9-reasonml-e0a2b6068306

# Gatsby
Pra finalizar, e também foi a talk que finalizou a React Conf Brasil 2019, [Preston So](https://twitter.com/prestonso) que veio direto de New York **(sério, ele chegou do aeroporto e foi falar)**, falou sobre o Gatsby hoje e o Gatsby no futuro.

Pra quem não sabe o que é o Gatsby, Gatsby é um framework para montar sites muito rápido baseado em React.

E pra quem não sabe também, o meu blog é feito em Gatsby.

![Thumbs](./thumbs-up.gif)

Um dos principais pontos foi quando ele anunciou que o Gatsby está trabalhando para melhorar os builds, pois, quando se tem um site com muitas páginas, demora um bom tempo para que tudo possa ser "buildado", eles estão cientes disso, e estão buscando essa melhoria para uma próxima versão.

Além do mais, foi anunciado também o Gatsby Preview que ainda está em beta.

# Finalizando
Bom, Coders, é isso, eu poderia falar muito mais, mas acho que o principal eu trouxe aqui, assim espero. Foi uma experiência única, e espero voltar ano que vem para saber o que de novo vêm por aí.

Queria deixar meus agradecimentos ao meu amigo [Elan](https://github.com/elanfraga) por contribuir e me ajudar a lembrar alguns pontos.

Também deixar a recomendação sobre alguns pots bem interessantes sobre a React Conf 2018 do pessoal da g2i, que vale a leitura.

[Summary of React Conf Brazil — 2018](https://www.g2i.co/blog/react-conf-brazil-2018)
[What I learned at ReasonConf 2018](https://www.g2i.co/blog/what-i-learned-at-reasonconf-2018)

Abraços e até mais!

![Think Different](./think.gif)