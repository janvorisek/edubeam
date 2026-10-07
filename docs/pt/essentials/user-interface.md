# Interface do usuário

<Edubeam /> tem três áreas: a **barra superior** no topo, a **visualização** no meio, onde você desenha, e a **barra inferior**, com uma tabela para cada tipo de objeto. Quando você sabe o que fica em cada lugar, o resto do guia faz sentido.

![As partes da interface, numeradas como na lista abaixo](/screenshots/pt/ui-overview.webp)

1. **Menu ☰**: abrir, salvar, compartilhar e exportar; exemplos e tours guiados.
2. **Botões da barra superior**: Limpar estrutura e Compartilhar modelo.
3. **Desfazer / Refazer** para cada alteração do modelo.
4. **Botões da visualização**: centralizar, ajustar à tela e o botão das opções de exibição.
5. **Opções de exibição**: quais resultados e partes do modelo são desenhados.
6. **Grade, encaixe, mira e unidades.**
7. **Abas da barra inferior**: Nós, Elementos, Cargas, Materiais, Seções, Resultados.
8. **A tabela** da aba aberta, onde cada valor pode ser editado.

::: tip Faça o tour
**☰ → Fazer um tour** mostra essas partes no próprio aplicativo, uma de cada vez.
:::

![Fazer um tour, no passo das opções de exibição](/screenshots/pt/tour.webp)

## Barra superior {#app-bar}

| Controle | O que faz |
| --- | --- |
| **Menu ☰** | O menu principal, veja abaixo. |
| **Limpar estrutura** | Exclui todos os nós, elementos e cargas após uma confirmação. Duas caixas de seleção excluem também os materiais e as seções. <kbd>Ctrl</kbd>+<kbd>Z</kbd> traz o modelo de volta, e ele fica guardado em Estruturas recentes. |
| **Compartilhar modelo** | Abre o [diálogo de compartilhamento](/pt/essentials/import-export#share-a-link) com um link que contém o modelo inteiro. |
| **O que há de novo?** | Notas de versão. Elas também se abrem sozinhas uma vez após uma atualização. |
| **Documentação** / GitHub | Este guia e o código-fonte. |

Em um celular, só cabem o menu ☰ e Documentação; todo o resto fica no menu.

### O menu ☰ {#the-☰-menu}

![O menu ☰](/screenshots/pt/ui-app-menu.webp){.shot-xs}

| Item | O que faz |
| --- | --- |
| **Abrir projeto** / **Salvar projeto** | Abre ou baixa um arquivo `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Ctrl</kbd>+<kbd>S</kbd>). |
| **Estruturas recentes** | Os últimos 10 modelos que você limpou ou substituiu, prontos para restaurar. |
| **Exportar imagem** | Salva o desenho em PNG ou SVG, ou o copia (<kbd>Ctrl</kbd>+<kbd>P</kbd>). |
| **Compartilhar modelo** | O mesmo que o botão da barra superior. |
| **Exemplos** | A galeria de modelos prontos. |
| **Desenhar sua primeira viga** | Uma tarefa guiada de sete passos. |
| **Fazer um tour** | O tour pela interface. |
| **Limpar estrutura** | O mesmo que o botão da barra superior. |

A parte de baixo do menu mostra a versão do aplicativo e sua data de lançamento.

## Visualização {#viewer}

A tela é onde você desenha e inspeciona o modelo. Todo o resto do aplicativo acompanha o que você seleciona aqui.

### Botões sobre a tela {#buttons-on-the-canvas}

- **Canto superior esquerdo:** **Desfazer** e **Refazer** (<kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Toda alteração do modelo, incluindo adicionar, editar, arrastar, excluir e limpar, pode ser desfeita.
- **Canto superior direito:** **Centralizar conteúdo** (<kbd>C</kbd>), **Ajustar conteúdo à tela** (<kbd>F</kbd>) e o botão ⚙, que mostra ou oculta as opções de exibição. Em telas sensíveis ao toque há também **Seleção por retângulo**.
- **Canto inferior direito:** **G** liga e desliga a grade, **S** liga e desliga o encaixe na grade, o botão da mira mostra a posição do ponteiro nas réguas, e o **indicador de unidades** abre as configurações em *Idioma e localidade*.

### Opções de exibição {#display-options}

![Os botões da visualização e as opções de exibição](/screenshots/pt/ui-display-settings.webp){.shot-lg}

Duas linhas de caixas de seleção, abertas por padrão:

- **Resultados:** *Forma deformada*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reações*. Forma deformada, M e Reações começam marcados.
- **Modelo:** *Apoios*, *Cargas*, *Rótulos dos nós*, *Rótulos dos elementos*.

**Mais configurações** abre as [configurações](/pt/essentials/units-settings) completas em *Configurações de visualização*.

### Navegação {#navigating}

| Ação | Mouse | Toque |
| --- | --- | --- |
| Zoom | Roda do mouse (em direção ao cursor), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Pinça |
| Panorâmica | Arrastar com o botão **do meio ou direito** (veja *Configurações → Controles e atalhos*) | Arrastar com um dedo |
| Ajustar / centralizar | <kbd>F</kbd> / <kbd>C</kbd> ou os botões do canto superior direito | Os botões do canto superior direito |

### Selecionar e editar {#selecting-and-editing}

**Clique** em um nó, elemento, carga ou linha de cota para selecioná-lo. Um painel se abre ao lado com os detalhes e as ações cabíveis: adicionar uma carga, definir apoios, editar, mostrar a matriz de rigidez, excluir. Clicar em um nó também muda a barra inferior para a aba Nós.

<div class="shots">

![Um nó: adicionar uma carga, definir apoios, prescrever um deslocamento](/screenshots/pt/ui-node-menu.webp)

![Um elemento: editar, adicionar uma carga, matriz de rigidez](/screenshots/pt/ui-element-menu.webp)

</div>

- **Arraste sobre a tela vazia** para desenhar um retângulo de seleção. Tudo o que estiver dentro é selecionado: nós, elementos, suas cargas e linhas de cota. Pressione <kbd>Delete</kbd> para excluir tudo, ou <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> para copiar para outro lugar.
- **Arraste um nó** para movê-lo. Com o encaixe ativado, ele cai na grade. Os elementos conectados e suas cargas acompanham.
- **Clique duas vezes em uma carga** para editá-la.
- **Aponte** para qualquer item para ver uma dica. Os nós mostram seus deslocamentos e sua rotação, os elementos o material e a seção, as cargas seus valores. Em uma tela sensível ao toque, toque no item: os mesmos detalhes aparecem no painel de seleção.

![Apontar para um nó mostra seus deslocamentos e sua rotação](/screenshots/pt/ui-hover.webp){.shot-sm}

**Clique com o botão direito na tela** (ou toque e segure em uma tela sensível ao toque) para abrir o menu da tela. Segure <kbd>Ctrl</kbd> ao escolher *Adicionar nó* ou *Adicionar elemento* para posicioná-los com o mouse em vez de por um diálogo. Sobre um elemento, o menu também oferece *Cotar o elemento*.

![O menu da tela](/screenshots/pt/ui-canvas-menu.webp){.shot-sm}

Todos os atalhos estão na página [Teclado, mouse e toque](/pt/reference/shortcuts).

### Quando o modelo não pode ser resolvido {#when-the-model-cannot-be-solved}

As mensagens aparecem no canto superior esquerdo da visualização:

- *Nenhum material definido.* / *Nenhuma seção definida.*, com um botão **Adicionar**.
- Uma pequena etiqueta azul **Faltam apoios** enquanto o modelo está apenas incompleto.
- Uma **mensagem vermelha** quando algo está errado, com **Mostrar detalhes**, que lista cada problema.

Quando a estrutura ainda pode se mover, o EduBeam a faz oscilar como um contorno tracejado e circula os nós ou as rótulas responsáveis. Aponte para a mensagem para ver o movimento de novo, ou use o botão do olho para ocultá-lo.

![Um pórtico com rótulas em B e C é um mecanismo: o EduBeam mostra como ele se move](/screenshots/pt/ui-mechanism.webp)

![Mostrar detalhes lista cada problema com uma dica](/screenshots/pt/ui-diagnostics.webp){.shot-lg}

[Solução de problemas](/pt/reference/troubleshooting) explica cada mensagem.

## Barra inferior {#bottom-bar}

Seis abas, cada uma com uma barra de ferramentas e uma tabela editável. As abas mostram quantos objetos de cada tipo o modelo tem. O **?** à direita explica a aba aberta, assim como o **?** ao lado de alguns títulos de coluna. Arraste a faixa de abas para cima ou para baixo para redimensionar a barra, ou minimize-a com o botão à direita.

| Aba | Barra de ferramentas | Tabela |
| --- | --- | --- |
| **Nós** | Adicionar nó (diálogo), Adicionar nó (mouse) | Rótulo, coordenadas, **GLs restringidos** (símbolo do apoio, Dx, Dz, Ry, ângulo do apoio α), cargas, editar, excluir |
| **Elementos** | Adicionar elemento (diálogo), Adicionar elemento (mouse) | Rótulo, tipo, nós (com um botão para invertê-los), material, seção, **Rótulas de extremidade**, cargas, matriz de rigidez, excluir |
| **Cargas** | Adicionar carga nodal, Adicionar carga de elemento | Tipo, alvo, componentes editáveis, editar, excluir |
| **Materiais** | Adicionar material, Biblioteca de materiais | Rótulo, E, G, α<sub>T</sub>, excluir |
| **Seções** | Adicionar seção, Biblioteca de seções, Seção poligonal | Forma, rótulo, A, I<sub>y</sub>, h, k, editar forma, excluir |
| **Resultados** | Resultados nodais, Resultados dos elementos, Exportar CSV, Copiar | Deslocamentos e rotações por nó, ou esforços de extremidade por elemento |

Edite uma célula no lugar: clique, digite e pressione <kbd>Enter</kbd> (ou <kbd>Esc</kbd> para sair da célula). Os valores são mostrados e digitados nas [unidades atuais](/pt/essentials/units-settings).

## Abas acima da visualização {#tabs-above-the-viewer}

**Estrutura** mostra a tela. **Configurações** mostra as configurações em tamanho inteiro, para que você possa mudar cores ou unidades e voltar para ver o efeito. O indicador de unidades e *Mais configurações* abrem as mesmas configurações como um diálogo sobre o modelo.

## Janelas flutuantes {#floating-windows}

**Matriz de rigidez** (no painel de um elemento ou na tabela de elementos) abre uma janela com a matriz de rigidez 6 × 6 do elemento em coordenadas globais. **Editar** no menu da tela abre uma tabela da seleção atual. Arraste-as pela barra de título e feche-as com o ×.
