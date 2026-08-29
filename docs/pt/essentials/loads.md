# Cargas

Todas as cargas pertencem a um **único caso de carga** e atuam simultaneamente. Para comparar cenários, salve cada um como arquivo de projeto ou link próprio.

<LoadShowcase />

## A convenção de sinais em uma linha

O eixo global **x** aponta para a direita e o eixo global **z** aponta **para baixo**. Um `Fz` ou `fz` positivo em coordenadas globais é, portanto, uma carga para baixo (tipo gravitacional); um momento `My` positivo gira no sentido anti-horário na tela. Detalhes em [Sistema de coordenadas e convenção de sinais](/pt/elements/conventions).

## Cargas nodais

Aba *Cargas* → **Adicionar carga nodal**, ou clique em um nó → **Adicionar carga**. Escolha **Força/Momento**:

| Campo | Significado | Unidade |
| --- | --- | --- |
| `Fx` | força horizontal (+ → direita) | unidade de força |
| `Fz` | força vertical (+ → baixo) | unidade de força |
| `My` | momento em torno de y | unidade de momento |

As componentes estão sempre no sistema de coordenadas **global**. Uma pré-visualização com seta no diálogo mostra direção e intensidade resultantes. Várias cargas nodais em um mesmo nó são permitidas e simplesmente se somam.

### Deslocamentos prescritos (recalques de apoio)

No mesmo diálogo escolha **Deslocamento prescrito** (ou clique em um nó apoiado → **Prescrever deslocamento**). Os campos passam a ser:

| Campo | Significado | Unidade |
| --- | --- | --- |
| `Dx` | deslocamento horizontal imposto | unidade de comprimento |
| `Dz` | deslocamento vertical imposto (+ → baixo) | unidade de comprimento |
| `Ry` | rotação imposta | rad |

Só é possível informar um valor para um GL que esteja **restringido** naquele nó — apenas apoios podem ser movidos. Cada nó admite um deslocamento prescrito; edite-o em vez de adicionar um segundo. Em uma estrutura isostática, um recalque produz deslocamentos mas não esforços; em uma hiperestática, produz ambos.

## Cargas de elemento

Aba *Cargas* → **Adicionar carga de elemento**, ou clique em um elemento → **Adicionar carga**. Escolha o **Tipo de carga**; o diálogo mostra uma pré-visualização da carga sobre o elemento.

### Carga distribuída uniforme

| Campo | Significado | Unidade |
| --- | --- | --- |
| `fx` | carga por unidade de comprimento em x | força / comprimento |
| `fz` | carga por unidade de comprimento em z | força / comprimento |
| **LCS** | marque para interpretar `fx`, `fz` nos eixos locais do elemento | – |

O caso mais comum é uma carga vertical gravitacional: `fz > 0`, LCS desligado. Em uma barra inclinada, uma carga **perpendicular à barra** (por exemplo vento em uma terça) é `fz` com LCS **ligado**; uma carga vertical por metro de *projeção horizontal* não está disponível diretamente — converta-a antes para metro de comprimento da barra.

### Carga trapezoidal

| Campo | Significado |
| --- | --- |
| `f1x`, `f1z` | intensidade no nó **inicial** |
| `f2x`, `f2z` | intensidade no nó **final** |

As intensidades variam linearmente entre as extremidades. Uma carga triangular é simplesmente `f1z = 0`. Cargas trapezoidais estão sempre no **sistema local do elemento** (a caixa LCS fica travada); em barras horizontais o z local e o global coincidem, então isso só importa em barras inclinadas.

### Carga concentrada

Uma força ou momento pontual em qualquer ponto **ao longo** de um elemento — sem nó adicional.

| Campo | Significado |
| --- | --- |
| `Fx`, `Fz`, `My` | componentes de força / momento |
| **Posição da carga a partir do nó inicial** | distância do nó inicial, `0 ≤ a ≤ L` |
| **LCS** | componentes em eixos locais |

O diagrama de cortante salta `Fz` no ponto de aplicação e o diagrama de momento apresenta um vértice; o valor do momento ali é rotulado automaticamente.

### Carga térmica

| Campo | Significado |
| --- | --- |
| **ΔT<sub>s</sub>** – variação axial de temperatura | variação uniforme em toda a seção → alongamento $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** – fibra inferior menos superior | diferença de temperatura ao longo da altura → curvatura $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

As cargas térmicas usam o **α** do material e a **altura h** da seção. Um `ΔTb − ΔTt` positivo (fibra inferior mais quente) faz o elemento curvar para cima. Em uma estrutura isostática a temperatura só produz deslocamentos; é a restrição (extremidades engastadas, continuidade, barras redundantes) que a transforma em esforços.

## Editar e remover cargas

- As cargas aparecem como etiquetas nas tabelas *Nós* / *Elementos* e como linhas na aba *Cargas*, onde as componentes (e a caixa LCS) são editadas no lugar.
- **Clique duplo** em uma carga na visualização, ou clique e **Editar carga**, abre o diálogo de edição.
- Selecione uma carga e pressione <kbd>Delete</kbd>, ou use o ícone de lixeira.
- Cargas ligadas a um nó ou elemento são excluídas com ele e copiadas com ele ao copiar e colar.

## O que não está disponível

- **Casos e combinações de carga**: apenas um caso.
- **Peso próprio**: informe-o como carga distribuída uniforme $f_z = \rho\,g\,A$ (por exemplo IPE 200: 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m).
- **Cargas trapezoidais em coordenadas globais** em barras inclinadas.
