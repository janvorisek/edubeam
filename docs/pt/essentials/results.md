# Resultados e diagramas

<Edubeam /> resolve o modelo após cada alteração, no máximo algumas vezes por segundo, então os resultados estão sempre atualizados. Não há botão *Calcular*. Se nada for desenhado, o modelo ainda não pode ser resolvido; a mensagem no canto superior esquerdo da visualização diz por quê (veja [Solução de problemas](/pt/reference/troubleshooting)).

Todas as imagens desta página mostram o mesmo modelo: o [pórtico triarticulado](/pt/tutorials/three-hinged-frame) sob 10 kN/m.

## Diagramas na visualização {#overlays-in-the-viewer}

Ligue-os e desligue-os nas **opções de exibição**, no canto superior direito da visualização (o botão ⚙ as mostra ou oculta).

| Diagrama | Cor (padrão) | Observações |
| --- | --- | --- |
| **Forma deformada** | cinza | Exagerada: o maior deslocamento é desenhado com o comprimento em pixels da *Escala de resultados*. Ligada por padrão. |
| **N (x)**, esforço normal | azul | Tração positiva. Constante ao longo de um elemento, a menos que atue nele uma carga axial. |
| **V<sub>z</sub> (x)**, esforço cortante | verde | Linear sob carga uniforme, quadrático sob carga trapezoidal, com salto em uma carga concentrada. |
| **M<sub>y</sub> (x)**, momento fletor | vermelho | Positivo com tração na fibra inferior. Rotulado nas duas extremidades, nas cargas concentradas e em cada extremo local (onde V = 0). Ligado por padrão. |
| **Reações** | roxo | Uma seta e um valor para cada GL restringido. Ligadas por padrão. |

Os valores são escritos nos pontos característicos de cada diagrama. A orientação dos rótulos, o tamanho dos diagramas e as cores podem ser alterados nas [Configurações](/pt/essentials/units-settings#viewer-settings).

<div class="shots">

![Esforço normal N: os dois pilares têm 40 kN de compressão, a viga 20 kN](/screenshots/pt/results-normal.webp)

![Esforço cortante V: 20 kN nos pilares; na viga, 40 kN nos cantos caindo a zero na rótula](/screenshots/pt/results-shear.webp)

![Momento fletor M: −80 kNm nos dois cantos, zero nas bases e na rótula](/screenshots/pt/results-moment.webp)

![Forma deformada (exagerada): a rótula em C desce](/screenshots/pt/results-deformed.webp)

</div>

![Reações: 40 kN na vertical e 20 kN na horizontal em cada apoio fixo](/screenshots/pt/results-reactions.webp){.shot-lg}

### Leitura do sinal {#reading-the-sign}

Leia o sinal de um valor pelo seu rótulo, não pelo lado da barra em que o diagrama está desenhado. Um momento fletor negativo traciona a fibra superior de uma viga, ou o lado externo do canto de um pórtico.

## Dicas ao passar o mouse {#hover-tooltips}

Apontar para um objeto é a forma mais rápida de ler um valor:

- **Nó**: `ux`, `uz` e `φy` (deslocamentos na unidade de deslocamento, rotação em radianos).
- **Elemento**: seu rótulo, sua seção e seu material.
- **Carga**: suas componentes.

Em uma tela sensível ao toque, toque no objeto. Os mesmos detalhes aparecem no painel de seleção.

![Apontando para o nó 2 da viga do Início rápido](/screenshots/pt/ui-hover.webp){.shot-sm}

## Aba Resultados {#results-tab}

A aba **Resultados** da barra inferior tem duas tabelas, alternadas com **Resultados nodais** e **Resultados dos elementos**.

### Resultados nodais {#nodal-results}

Uma linha por nó com **Dx**, **Dz** (unidade de deslocamento) e **Ry** (rad). Os sinais seguem os eixos globais: `Dz` positivo é para baixo e `Ry` positivo é anti-horário na tela.

![Resultados nodais do pórtico triarticulado (Formato numérico: Automático)](/screenshots/pt/results-nodal.webp)

### Resultados dos elementos {#element-results}

Uma linha por elemento com os **esforços de extremidade no sistema de coordenadas local do elemento**:

| Coluna | Significado |
| --- | --- |
| `X12`, `Z12`, `M12` | esforço normal, esforço cortante e momento atuando sobre o elemento no nó **inicial** |
| `X21`, `Z21`, `M21` | o mesmo no nó **final** |

![Resultados dos elementos do pórtico triarticulado](/screenshots/pt/results-element.webp)

São as forças que os nós exercem sobre o elemento: a matriz de rigidez do elemento vezes seus deslocamentos de extremidade, menos as cargas nodais equivalentes. Elas seguem os eixos locais, não a convenção N-V-M dos diagramas:

- Para a viga biapoiada de 6 m do [Início rápido](/pt/guide/quick-start): `Z12 = Z21 = −36 kN`. Os dois apoios empurram a viga para cima, que é −z.
- Para uma viga em balanço engastada no nó inicial, com carga de 18 kN para baixo na extremidade: `Z12 = −18 kN`, `M12 = +72 kNm`, `Z21 = +18 kN`, `M21 = 0`.
- Para o pilar 1 do pórtico (A embaixo, B em cima): `X12 = +40 kN` empurra ao longo do eixo x local para dentro do elemento, o que corresponde a 40 kN de compressão.

### Exportar CSV e Copiar {#export-csv-and-copy}

**Exportar CSV** baixa `edubeam-results.csv` com as duas tabelas, nas unidades mostradas na tela e prontas para uma planilha. A tabela de nós também lista as **reações** `Rx`, `Rz`, `My`. **Copiar** coloca as mesmas tabelas na área de transferência como texto separado por tabulações, que se cola diretamente no Excel, no LibreOffice ou no Google Planilhas. Na exportação, os esforços de extremidade dos elementos se chamam `N1 V1 M1 N2 V2 M2`.

### Matriz de rigidez {#stiffness-matrix}

Escolha **Matriz de rigidez** no painel de um elemento ou na linha da tabela para abrir uma janela com a matriz de rigidez 6 × 6 do elemento em coordenadas globais, útil para conferir a montagem manual em uma disciplina de método da rigidez. As fórmulas estão no [manual teórico](/pt/elements/beam).

## Formato numérico {#number-format}

Os resultados são mostrados com cinco algarismos significativos. **Configurações → Idioma e localidade → Formato numérico** define como eles são escritos:

| Formato | 40 000 é escrito como | Use para |
| --- | --- | --- |
| **Científico** (padrão) | 4 · 10⁴ | valores que abrangem muitas ordens de grandeza |
| **Engenharia** | 40 · 10³ | corresponder aos prefixos quilo / mega |
| **Automático** | 40000 | números do dia a dia no ensino |

O formato automático escreve valores de 0,001 a 100 000 como números simples e passa para potências de dez fora desse intervalo. O separador decimal segue o idioma.

## Precisão e exatidão {#precision-and-accuracy}

- O elemento de viga é exato para o modelo linear de Timoshenko sob cargas nodais, uniformes, trapezoidais, concentradas e térmicas, então os resultados **não** dependem do número de elementos.
- O cálculo é feito em dupla precisão. Valores minúsculos como `1,5 · 10⁻¹⁸` são erros de arredondamento e significam zero.
- As flechas incluem a **deformação por cisalhamento**. Em barras esbeltas isso acrescenta uma fração de um por cento ao valor de Euler–Bernoulli; em barras altas ou curtas pode chegar a vários por cento. Defina o coeficiente de cisalhamento da seção com um valor grande para suprimi-la.

## Resultados em um relatório {#results-in-a-report}

- **☰ → Exportar imagem** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva o desenho em PNG ou SVG com os diagramas que você escolher. Veja [Exportar uma imagem](/pt/essentials/import-export#export-an-image).
- **Resultados → Exportar CSV** ou **Copiar** fornece os números.
- **Compartilhar modelo** fornece um link para que o leitor possa abrir o próprio modelo.
