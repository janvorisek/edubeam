# Tutorial: pórtico triarticulado

Um pórtico triarticulado é isostático: as três equações de equilíbrio mais a condição $M = 0$ na rótula fornecem as quatro reações de apoio. Isso o torna um modelo perfeito para conferir cada número que o EduBeam desenha. Reserve cerca de 15 minutos.

![O pórtico pronto: momento fletor e reações](/screenshots/pt/tut-frame-moment.webp)

[Abra o modelo pronto](https://run.edubeam.app/?model=eyJuIjpbWyJBIixbMCwwLDBdLFswLDJdLG51bGxdLFsiQiIsWzAsMCwtNF0sW10sbnVsbF0sWyJDIixbNCwwLC00XSxbXSxudWxsXSxbIkQiLFs4LDAsLTRdLFtdLG51bGxdLFsiRSIsWzgsMCwwXSxbMCwyXSxudWxsXV0sImUiOltbIjEiLFsiQSIsIkIiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiMiIsWyJCIiwiQyJdLCIxIiwiMSIsW2ZhbHNlLHRydWVdXSxbIjMiLFsiQyIsIkQiXSwiMSIsIjEiLFtmYWxzZSxmYWxzZV1dLFsiNCIsWyJEIiwiRSJdLCIxIiwiMSIsW2ZhbHNlLGZhbHNlXV1dLCJtIjpbWyIxIiw3ODUwLDIxMDAwMDAwMDAwMCw4MTAwMDAwMDAwMCwwLjAwMDAxMl1dLCJjcyI6W1siMSIsMC4wMDUzOCwwLjAwMDA4MzU2LDAuMywxXV0sImVsIjpbWyIyIixbMCwxMDAwMF0sZmFsc2VdLFsiMyIsWzAsMTAwMDBdLGZhbHNlXV0sImQiOltdfQ%3D%3D&lang=pt){target="_blank"} se quiser apenas explorá-lo.

## O problema {#the-problem}

- Dois pilares de 4 m, com apoios fixos nas bases A e E, a 8 m um do outro.
- Uma viga horizontal B–D no topo, com uma rótula no meio do vão, em C.
- Uma carga uniforme $q = 10$ kN/m em toda a viga.
- Aço ($E = 210$ GPa, $G = 81$ GPa), IPE 300 ($A = 53{,}8$ cm², $I_y = 8356$ cm⁴, $h = 300$ mm).

| Nó | X [m] | Z [m] | Apoio |
| --- | --- | --- | --- |
| A | 0 | 0 | apoio fixo |
| B | 0 | −4 | |
| C | 4 | −4 | (rótula na viga) |
| D | 8 | −4 | |
| E | 8 | 0 | apoio fixo |

Lembre-se de que **z aponta para baixo**, então o topo dos pilares está em `Z = −4`.

## 1. Material e seção {#_1-material-and-section}

1. **Limpar estrutura** (marque *Excluir materiais* e *Excluir seções*).
2. *Materiais* → **Biblioteca de materiais** → **Steel (S235)**.
3. *Seções* → **Adicionar seção**: `Área = 0,00538`, `Iy = 8,356e-5`, `Altura = 0,3`, `Coeficiente de cisalhamento = 1`.

A seção afeta apenas os deslocamentos. Este pórtico é isostático, então seus esforços internos não dependem de $E$, $A$ ou $I$.

## 2. Desenhe o pórtico {#_2-draw-the-frame}

O jeito mais rápido é uma única poligonal com o mouse:

1. Verifique se **Encaixar na grade** está ativado (o botão **S**).
2. Aba *Elementos* → o segundo botão **Adicionar elemento** (ícone de cursor).
3. Clique em (0, 0), depois em (0, −4), (4, −4), (8, −4) e (8, 0). Use as réguas e a mira para encontrar os pontos. Cada clique adiciona um nó e o liga ao anterior.
4. Pressione <kbd>Esc</kbd> para terminar e depois <kbd>F</kbd> para ajustar o pórtico à tela.

Agora você tem cinco nós e quatro elementos. As imagens aqui rotulam os nós de A a E; renomeie os seus na tabela *Nós*, se quiser, ou mantenha 1–5. Confira as coordenadas na tabela e corrija as que não caíram na grade.

## 3. Apoios e a rótula {#_3-supports-and-the-hinge}

1. Clique no nó A, abra **Apoios do nó** e escolha o **apoio fixo**. Faça o mesmo no nó E.
2. Na tabela *Elementos*, encontre o elemento de B a C e marque a rótula do **fim** (a segunda caixa em *Rótulas de extremidade*).

![A tabela de elementos: a rótula está no fim do elemento 2, no nó C](/screenshots/pt/elements-table.webp)

::: tip Uma rótula, não duas
Rotular o fim do elemento B–C basta: o momento em C passa a ser zero, porque C–D não consegue transmitir momento a um nó que só ele segura rigidamente. Marque também o início de C–D e nada muda. Mas marque também uma rótula em B, e o pórtico vira um mecanismo. Experimente: o EduBeam mostra como ele se move.
:::

## 4. Carga {#_4-load}

*Cargas* → **Adicionar carga de elemento** → *Carga distribuída uniforme*, elemento B–C, `fz = 10` kN/m. Repita para o elemento C–D. A viga é horizontal, então a caixa LCS não faz diferença aqui.

## 5. Resultados {#_5-results}

As opções de exibição começam com a forma deformada, o momento fletor e as reações ligados. Marque **N (x)** e **V<sub>z</sub> (x)** para ver o resto.

<div class="shots">

![Momento fletor e reações](/screenshots/pt/tut-frame-moment.webp)

![Esforço normal](/screenshots/pt/tut-frame-normal.webp)

![Esforço cortante](/screenshots/pt/results-shear.webp)

![Forma deformada](/screenshots/pt/results-deformed.webp)

</div>

## 6. Confira à mão {#_6-check-by-hand}

**Reações verticais.** Por simetria, cada base recebe metade da carga:

$$V_A = V_E = \frac{q \cdot 8}{2} = 40\ \text{kN}$$

**Reações horizontais.** Tome os momentos em relação à rótula C para a metade esquerda do pórtico. O momento ali deve ser nulo:

$$V_A \cdot 4 - H_A \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_A = \frac{160 - 80}{4} = 20\ \text{kN}$$

As duas bases empurram para dentro com 20 kN; esse empuxo horizontal é o que torna eficiente um pórtico triarticulado.

**Esforços internos.**

| Grandeza | Fórmula | À mão | EduBeam |
| --- | --- | --- | --- |
| Reações verticais | $qL/2$ | 40 kN | 40 kN |
| Reações horizontais | de $M_C = 0$ | 20 kN | 20 kN |
| Momento nos cantos B e D | $H \cdot h$ | 80 kNm, tração por fora | −80 kNm |
| Momento na rótula C | | 0 | 0 |
| Esforço normal nos pilares | $-V_A$ | −40 kN | −40 kN |
| Esforço normal na viga | $-H_A$ | −20 kN | −20 kN |
| Cortante nos pilares | $H_A$ | 20 kN | −20 kN (A–B), +20 kN (D–E) |
| Cortante na viga em B | $V_A$ | 40 kN | 40 kN |
| Cortante na viga em C | $V_A - 4q$ | 0 | 0 |
| Cortante na viga em D | $V_A - 8q$ | −40 kN | −40 kN |

Os dois pilares têm sinais opostos de cortante embora suportem a mesma força, porque os eixos locais de cada elemento seguem a sua orientação: A–B é desenhado para cima e D–E para baixo. Inverta os nós de um pilar e o sinal dele se inverte.

Na viga, $M(x) = -80 + 40x - 5x^2$ kNm (x a partir de B), que é nulo na rótula e nunca positivo: a viga inteira tem momento negativo. O cortante $V(x) = 40 - 10x$ cai a zero exatamente em C, então o extremo do momento também está na rótula.

**Deslocamento.** A rótula C desce 43,1 mm (*Resultados → Resultados nodais*, `Dz` de C). Isso vem da flexão das quatro barras e é um bom exercício para o princípio dos trabalhos virtuais.

## 7. Experimente {#_7-experiment}

- **Desmarque a rótula** em C. O pórtico passa a ser uma vez hiperestático; os momentos nos cantos diminuem e surge um momento positivo no meio do vão. Agora a seção importa: experimente uma viga mais rígida.
- **Engaste as bases** (escolha o apoio **engaste**). Surgem momentos em A e E.
- **Adicione uma carga horizontal**: uma carga nodal `Fx = 10` kN em B. O pórtico se desloca lateralmente e as reações deixam de ser simétricas. Confira-as com as mesmas três equações e $M_C = 0$.
- **Marque também uma rótula em B**. O pórtico agora é um mecanismo, e o EduBeam anima como ele pode se mover.
