# Sistema de coordenadas e convenção de sinais

A maioria dos resultados «errados» no <Edubeam /> é, na verdade, uma surpresa da convenção de sinais. O que segue é exatamente o que o solver usa.

## Eixos globais

- **x**: horizontal, positivo para a **direita**.
- **z**: vertical, positivo **para baixo** na tela.
- **y**: o eixo perpendicular ao plano (aponta para o observador em um sistema dextrogiro). Rotações e momentos são em torno de y.

O indicador de eixos no canto da grade mostra x (vermelho) e z (verde). Um nó no topo de um pilar de 3 m tem, portanto, `Z = −3` se a base está em `Z = 0`.

## Graus de liberdade

Cada nó tem `Dx`, `Dz` (translações) e `Ry` (rotação). `Dz` positivo é um deslocamento para baixo; `Ry` positivo é uma rotação **anti-horária** na tela. Os mesmos sinais valem para deslocamentos prescritos e para os resultados nodais.

## Cargas

| Carga | Sentido positivo |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (direita; ou o x local do elemento com LCS ativado) |
| `Fz`, `fz`, `f1z`… | +z (**baixo**; ou o z local com LCS ativado) |
| `My` | anti-horário na tela |
| `ΔTs` | aquecimento (alongamento) |
| `ΔTb − ΔTt` | fibra inferior mais quente que a superior |

Assim, uma carga gravitacional é um `fz` **positivo**, e um vento que empurra um pilar esquerdo para a direita é um `fx` positivo.

## Eixos locais do elemento

O **x** local vai do nó inicial ao nó final; o **z** local é perpendicular a ele e obtido girando os eixos globais pelo ângulo do elemento $\alpha$. Para um elemento horizontal desenhado da esquerda para a direita, eixos locais e globais coincidem. Use **Inverter nós** na tabela *Elementos* para inverter a direção.

## Esforços internos

| Grandeza | Positivo significa |
| --- | --- |
| **N** | tração |
| **V<sub>z</sub>** | o sinal usual da teoria de vigas: em uma viga biapoiada sob carga gravitacional, V é positivo no apoio esquerdo e negativo no direito |
| **M<sub>y</sub>** | **tração na fibra inferior (+z)**. Uma viga biapoiada sob carga gravitacional tem momento positivo no meio do vão; uma viga em balanço com carga na extremidade tem momento negativo no engaste |

## Esforços de extremidade (tabela Resultados dos elementos)

`X12, Z12, M12` atuam sobre o elemento no nó inicial, `X21, Z21, M21` no nó final, no sistema **local**, com os mesmos sentidos positivos dos eixos locais e de `My`. São as forças que os nós exercem sobre o elemento, isto é, $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, onde $\mathbf{f}_{eq}$ são as cargas nodais equivalentes das cargas de elemento. A soma dos esforços de extremidade de todos os elementos que concorrem em um nó equilibra as cargas nodais e reações ali.

## Reações

Há uma reação para cada GL restringido, informada no sistema de coordenadas do nó (girado pelo ângulo do SCL nodal, se definido). As setas de reação na visualização apontam na direção em que o apoio empurra a estrutura.

## Unidades

O solver trabalha internamente em SI (m, N, Pa, rad, K). As unidades de exibição afetam apenas o que você digita e lê; alterá-las nunca muda o modelo.
