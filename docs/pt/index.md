---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Análise estrutural online e gratuita"
  tagline: Desenhe uma viga, um pórtico ou uma treliça, adicione cargas e veja os diagramas se atualizarem enquanto você edita. Resultados completos de MEF no navegador, sem instalação, sem cadastro e sem custo.
  image:
    src: /screenshots/pt/hero.webp
    alt: O aplicativo EduBeam com um pórtico resolvido
  actions:
    - theme: brand
      text: Abrir o aplicativo
      link: https://run.edubeam.app/?lang=pt
    - theme: alt
      text: Ler o guia
      link: /pt/guide/introduction
    - theme: alt
      text: Ver exemplos
      link: /pt/examples/

features:
  - icon: ⚡
    title: Resultados enquanto você desenha
    details: Não existe botão Calcular. Arraste um nó, marque uma rótula ou altere uma carga, e N, V, M, as reações e a deformada acompanham na hora.
    link: /pt/essentials/results
    linkText: Leitura dos resultados
  - icon: 🧑‍🏫
    title: Feito para o ensino
    details: Primeiros passos guiados, valores ao passar o mouse, um solver que explica por que uma estrutura é um mecanismo e links de compartilhamento que você pode colocar nas notas de aula.
    link: /pt/guide/teaching
    linkText: Ensinar com o EduBeam
  - icon: 🌍
    title: Seu idioma, suas unidades
    details: 12 idiomas de interface, unidades SI ou americanas e a escolha entre eixos com z para baixo ou y para cima, como nos livros.
    link: /pt/essentials/units-settings
    linkText: Unidades e configurações
  - icon: 🔗
    title: Compartilhe, exporte, incorpore
    details: Envie um modelo inteiro como link, salve-o como arquivo, exporte o desenho em PNG ou SVG e as tabelas de resultados em CSV.
    link: /pt/essentials/import-export
    linkText: Arquivos e compartilhamento
---

## Comece aqui {#start-here}

<div class="start-grid">

**Primeira vez no EduBeam?** Siga o [Início rápido de 10 minutos](/pt/guide/quick-start). Você modela uma viga biapoiada passo a passo e confere cada resultado à mão.

**Já sabe o que quer construir?** Vá direto a um [tutorial](/pt/tutorials/three-hinged-frame) ou abra um [exemplo](/pt/examples/) pronto e modifique-o.

**Dá aula?** Veja [Ensinar com o EduBeam](/pt/guide/teaching): links de compartilhamento para exercícios, um visualizador incorporável para slides e exercícios prontos.

</div>

<div class="shots">

![Uma treliça: esforços normais, tração positiva](/screenshots/pt/tut-truss.webp)

![Um mecanismo à vista: o EduBeam mostra por que ele não pode ser resolvido](/screenshots/pt/ui-mechanism.webp)

</div>

## O que você pode modelar {#what-you-can-model}

- **Vigas, pórticos e treliças** no plano: vigas contínuas, pórticos simples, arcos triarticulados, treliças com nós articulados.
- **Qualquer apoio**: apoio fixo, apoio móvel, engaste, engaste deslizante, apoios rotacionados e recalques de apoio.
- **Cargas**: forças e momentos concentrados, cargas distribuídas uniformes e trapezoidais, cargas concentradas em qualquer ponto de uma barra e temperatura.
- **Qualquer seção**: da biblioteca (IPE, HEA, AISC W, HSS, retângulos, tubos) ou desenhada como polígono, com as propriedades calculadas para você.

Saiba mais na [Introdução](/pt/guide/introduction).

<ElementariumPromo />
