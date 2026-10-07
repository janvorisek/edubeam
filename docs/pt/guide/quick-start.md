# Início rápido

Em cerca de dez minutos você vai modelar uma viga biapoiada de aço com carga uniforme, ler as reações, o esforço cortante e o momento fletor, e conferi-los com as fórmulas dos livros.

::: tip Acompanhe em paralelo
Abra [run.edubeam.app](https://run.edubeam.app/?lang=pt){target="_blank"} em uma segunda aba. Se já houver um modelo carregado, use **Limpar estrutura** na barra superior para começar vazio, e marque *Excluir materiais* e *Excluir seções* para começar totalmente do zero. A limpeza pode ser desfeita com <kbd>Ctrl</kbd>+<kbd>Z</kbd>, e o modelo antigo fica em **☰ → Estruturas recentes**.

Prefere aprender fazendo, com dicas na tela? **☰ → Desenhar sua primeira viga** guia você por uma viga parecida usando o mouse.
:::

## O problema {#the-problem}

<ExampleStructure />

Uma viga biapoiada de 6 m (apoio fixo à esquerda, apoio móvel à direita) suporta uma carga uniforme de 12 kN/m. Material: aço, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Seção: IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Confira as unidades {#_1-check-the-units}

O indicador de unidades no canto inferior direito da visualização mostra as unidades usadas em todos os campos de entrada e resultados. Este tutorial assume os padrões SI: metros, kN, kNm e MPa.

![Os botões de grade (G), encaixe (S) e mira, e o indicador de unidades](/screenshots/pt/ui-grid-units.webp){.shot-sm}

Se aparecer `ft · kip · kip·ft · ksi`, clique no indicador e escolha **Sistema de unidades → SI (métrico)**.

## 2. Adicione o material e a seção {#_2-add-the-material-and-cross-section}

Os elementos precisam de um material e de uma seção, então crie-os primeiro.

1. Abra a aba **Materiais** na barra inferior e clique em **Adicionar material**.
2. Informe `E = 210000` MPa e `G = 81000` MPa. Deixe a densidade e `α = 0,000012` 1/K. Clique em **Adicionar material**.

<div class="shots">

![Adicionar material: digite E e G…](/screenshots/pt/qs-material.webp)

![…ou escolha Steel (S235) na Biblioteca de materiais](/screenshots/pt/qs-material-library.webp)

</div>

3. Abra a aba **Seções** e clique em **Adicionar seção**.
4. Informe `Área = 0,00285` m², `Iy = 1,943e-5` m⁴, `Altura = 0,2` m e `Coeficiente de cisalhamento = 1`. Clique em **Adicionar seção**.

![Adicionar seção. Ou escolha da biblioteca, ou desenhe uma forma poligonal.](/screenshots/pt/qs-cross-section.webp){.shot-md}

::: details Por que o coeficiente de cisalhamento importa?
O EduBeam usa elementos de viga de Timoshenko, que incluem a deformação por cisalhamento. `k` é o fator de correção de cisalhamento: $k \approx 0{,}83$ para um retângulo e cerca de $0{,}4$–$0{,}5$ para um perfil I quando $A$ é a área total. Usar `k = 1` com a área total *subestima* levemente a flexibilidade ao cisalhamento. Em uma viga esbelta como esta, a diferença na flecha fica bem abaixo de 1 %. A fórmula está na [página de teoria da viga](/pt/elements/beam).
:::

## 3. Adicione os nós {#_3-add-the-nodes}

1. Abra a aba **Nós**. Ela tem dois botões **Adicionar nó**: o primeiro abre um diálogo, o segundo (com ícone de cursor) posiciona nós com o mouse. Clique no primeiro.
2. Informe `X = 0`, `Z = 0` e clique em **Adicionar nó**. O nó recebe o rótulo `1`.
3. Adicione um segundo nó em `X = 6`, `Z = 0`. Este é o nó `2`.

![O diálogo Adicionar nó também pode definir os apoios de imediato](/screenshots/pt/qs-node.webp){.shot-md}

Com o botão do mouse, cada clique na tela posiciona um nó. Com **Encaixar na grade** ativado (<kbd>S</kbd>), os cliques caem no passo da grade (0,1 m por padrão).

## 4. Conecte-os com um elemento {#_4-connect-them-with-an-element}

1. Abra a aba **Elementos** e clique no primeiro botão **Adicionar elemento**.
2. Escolha **Nó inicial** `1` e **Nó final** `2`. O material e a seção que você criou já vêm selecionados. Clique em **Adicionar elemento**.

![Adicionar elemento: os dois nós de extremidade, rótulas de extremidade opcionais, material e seção](/screenshots/pt/qs-element.webp){.shot-md}

Uma linha aparece entre os nós. Pressione <kbd>F</kbd> para ajustá-la à tela.

## 5. Adicione os apoios {#_5-add-the-supports}

Na aba **Nós**, a coluna **GLs restringidos** tem um seletor de símbolo de apoio e três caixas de seleção por nó: `Dx`, `Dz`, `Ry`.

- Nó `1`: escolha o símbolo de **apoio fixo** ou marque **Dx** e **Dz**.
- Nó `2`: escolha o **apoio móvel** ou marque apenas **Dz**.

![Apoios na tabela de nós: nó 1 com apoio fixo, nó 2 com apoio móvel](/screenshots/pt/qs-supports.webp)

Você também pode clicar em um nó na visualização e escolher **Apoios do nó**. [Nós e apoios](/pt/essentials/nodes-supports#supports) lista todos os tipos de apoio.

## 6. Adicione a carga {#_6-add-the-load}

1. Abra a aba **Cargas** e clique em **Adicionar carga de elemento**.
2. **Tipo de carga**: *Carga distribuída uniforme*. **Elemento**: `1`.
3. Informe `fz = 12` kN/m e deixe `fx = 0`. Clique em **Adicionar carga de elemento**.

![O diálogo mostra uma prévia da carga no elemento](/screenshots/pt/qs-load.webp){.shot-md}

Um `fz` positivo aponta no sentido +z, que na tela é **para baixo**, então um valor positivo é uma carga gravitacional. Veja as [convenções de sinais](/pt/elements/conventions).

## 7. Leia os resultados {#_7-read-the-results}

A solução aparece assim que a carga é adicionada. O painel de exibição no canto superior direito da visualização liga e desliga os diagramas. **Forma deformada**, **M<sub>y</sub>(x)** e **Reações** vêm ligados por padrão. Marque **V<sub>z</sub>(x)** para adicionar o esforço cortante.

![Esforço cortante (verde), momento fletor (vermelho), reações (roxo) e a deformada](/screenshots/pt/qs-results.webp)

| Diagrama | O que você deve ver |
| --- | --- |
| **Reações** | Duas setas para cima de **36 kN** nos nós 1 e 2. |
| **V<sub>z</sub>(x)** | Uma reta de **+36 kN** à esquerda até **−36 kN** à direita, cruzando o zero no meio do vão. |
| **M<sub>y</sub>(x)** | Uma parábola com valor extremo de **54 kNm** no meio do vão. |
| **Forma deformada** | Uma flecha simétrica. Aponte para o nó `1` para ler sua rotação: **2,6469 · 10⁻² rad**. |

A aba **Resultados** da barra inferior traz os números. **Resultados nodais** lista `Dx`, `Dz`, `Ry` de cada nó. **Resultados dos elementos** lista os esforços de extremidade de cada elemento em seu sistema de coordenadas local.

Se os diagramas parecerem grandes ou pequenos demais, altere **Escala de resultados** em **Configurações → Configurações de visualização → Tamanhos**.

## 8. Confira à mão {#_8-check-by-hand}

| Grandeza | Fórmula | À mão | EduBeam |
| --- | --- | --- | --- |
| Reação | $R = qL/2$ | 36 kN | 36 kN |
| Cortante máximo | $V = qL/2$ | 36 kN | 36 kN |
| Momento máximo | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Rotação no apoio | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha no meio do vão (flexão) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Flecha no meio do vão (cisalhamento) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Flecha no meio do vão (total) | soma | 49,86 mm | 49,86 mm |

Não há nó no meio do vão, então, para ler a flecha ali, adicione um: escolha o segundo botão **Adicionar nó**, clique sobre a viga em `X = 3` e escolha **Conectar à estrutura**. A viga é dividida em duas e o `Dz` do novo nó em **Resultados** mostra 49,86 mm. A divisão não altera nenhum resultado, porque o elemento é exato.

Tudo confere. Mais roteiros de conferência (viga em balanço, viga biengastada, treliça, temperatura) estão em [Conferir resultados à mão](/pt/guide/verification).

## 9. Experimente {#_9-experiment}

É aqui que o EduBeam mostra seu valor. Tente cada uma destas ações e observe os diagramas se atualizarem:

- **Arraste o nó 2** para a direita: o momento cresce com $L^2$.
- **Marque `Ry` no nó 1** para engastá-lo: o momento no meio do vão cai e surge um momento negativo no apoio.
- **Marque `Dz` no nó do meio do vão** que você acabou de adicionar, para obter uma viga contínua de dois vãos.
- **Marque uma rótula de extremidade** em um elemento na aba Elementos para liberar o momento naquela extremidade.
- Pressione <kbd>Ctrl</kbd>+<kbd>Z</kbd> para desfazer qualquer passo.

## 10. Salve ou compartilhe {#_10-save-or-share}

- **Compartilhar modelo** (na barra superior ou no menu ☰) gera um link que contém o modelo inteiro. Cole-o em um e-mail, em um chat ou nos seus slides.
- **☰ → Salvar projeto** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) baixa um `project.json` que você pode abrir depois com **Abrir projeto** ou arrastando-o para o aplicativo.
- **☰ → Exportar imagem** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva o desenho em PNG ou SVG para um relatório.

O modelo também fica guardado no navegador, então recarregar a página não o perde. Veja [Importar, exportar e compartilhar](/pt/essentials/import-export).

## Próximos passos {#where-next}

- [Tutorial do pórtico triarticulado](/pt/tutorials/three-hinged-frame): um pórtico com rótula interna, conferido à mão.
- [Exemplos](/pt/examples/): abra pórticos e treliças prontos com um clique.
- [Cargas](/pt/essentials/loads): cargas trapezoidais, concentradas e térmicas, deslocamentos prescritos.
- [Teclado, mouse e toque](/pt/reference/shortcuts): trabalhe mais rápido na tela.
