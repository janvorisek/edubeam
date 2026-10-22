# Sistema de coordenadas e convenções de sinais

A maioria dos resultados “errados” no <Edubeam /> é, na verdade, uma surpresa da convenção de sinais. Tudo o que segue é o que o solver realmente usa.

## Eixos globais {#global-axes}

- **x** — horizontal, positivo para a **direita**.
- **z** — vertical, positivo **para baixo** na tela.
- **y** — o eixo perpendicular ao plano (aponta para o observador em um sistema dextrogiro). Rotações e momentos são em torno de y.

O indicador de eixos no canto da grade mostra x (vermelho) e z (verde). Um nó no topo de um pilar de 3 m tem, portanto, `Z = −3` se a base está em `Z = 0`.

## Graus de liberdade {#degrees-of-freedom}

Cada nó tem `Dx`, `Dz` (translações) e `Ry` (rotação). `Dz` positivo é um deslocamento para baixo; `Ry` positivo é uma rotação no sentido **anti-horário** na tela. Os mesmos sinais valem para os deslocamentos prescritos e para os resultados nodais informados.

## Cargas {#loads}

| Carga | Sentido positivo |
| --- | --- |
| `Fx`, `fx`, `f1x`… | +x (para a direita; ou ao longo do x local do elemento quando LCS está ativado) |
| `Fz`, `fz`, `f1z`… | +z (**para baixo**; ou ao longo do z local quando LCS está ativado) |
| `My` | anti-horário na tela |
| `ΔTc` | aquecimento (alongamento) |
| `ΔTb − ΔTt` | fibra inferior mais quente que a superior |

Assim, uma carga gravitacional é um `fz` **positivo**, e um vento que empurra um pilar esquerdo para a direita é um `fx` positivo.

## Eixos locais do elemento {#element-local-axes}

O **x** local vai do nó inicial ao nó final; o **z** local é perpendicular a ele, obtido girando os eixos globais pelo ângulo do elemento $\alpha$. Para um elemento horizontal desenhado da esquerda para a direita, os eixos locais e globais coincidem. Use **Inverter nós** na tabela *Elementos* para inverter a orientação.

## Esforços internos {#internal-forces}

| Grandeza | Positivo significa |
| --- | --- |
| **N** | tração |
| **V<sub>z</sub>** | o sinal usual da teoria de vigas: em uma viga biapoiada sob carga gravitacional, V é positivo no apoio esquerdo e negativo no direito |
| **M<sub>y</sub>** | **tração na fibra inferior** (+z). Uma viga biapoiada sob carga gravitacional tem momento positivo no meio do vão; uma viga em balanço com carga na extremidade tem momento negativo (tração em cima) no engaste |

## Esforços de extremidade (tabela Resultados dos elementos) {#end-forces-element-results-table}

`X12, Z12, M12` atuam sobre o elemento no nó inicial e `X21, Z21, M21` no nó final, no sistema **local**, com os mesmos sentidos positivos dos eixos locais e de `My`. São as forças que os nós exercem sobre o elemento, isto é, $\mathbf{f} = \mathbf{K}_l\,\mathbf{u}_l - \mathbf{f}_{eq}$, onde $\mathbf{f}_{eq}$ são as cargas nodais equivalentes das cargas de elemento. A soma dos esforços de extremidade de todos os elementos que concorrem em um nó equilibra as cargas nodais e as reações ali.

## Reações {#reactions}

Há uma reação para cada GL restringido, informada no sistema de coordenadas do nó (girado pelo ângulo do SCL nodal, se houver um definido). As setas de reação na visualização apontam no sentido em que o apoio empurra a estrutura.

## Eixos com y para cima {#y-up-axes}

**Configurações → Sistema de coordenadas → x para a direita, y para cima** passa tudo o que você digita e lê para o sistema dos livros: **x** para a direita, **y** para cima e **z** em direção ao observador. O modelo, os arquivos salvos e os desenhos não mudam; só mudam os números e os nomes:

| Grandeza | z para baixo (padrão) | y para cima |
| --- | --- | --- |
| Coordenada vertical | `Z` | `Y`, sinal oposto |
| Cargas, deslocamentos, reações e esforços de extremidade verticais | `Fz`, `fz`, `Dz`, `Z12`… | `Fy`, `fy`, `Dy`, `Y12`…, sinal oposto |
| Rotações e momentos | `Ry`, `My` | `Rz`, `Mz`, mesmo sinal (positivo no sentido anti-horário) |
| Ângulo do apoio α | medido no sentido horário | medido no sentido anti-horário, sinal oposto |
| Esforços internos N, V, M | | inalterados, diagramas desenhados da mesma forma |

Assim, uma carga gravitacional é um `fy` **negativo**, e o topo de um pilar de 3 m tem `Y = 3`.

## Unidades {#units}

O solver trabalha internamente em SI (m, N, Pa, rad, K). As unidades de exibição afetam apenas o que você digita e lê; alterá-las nunca muda o modelo.
