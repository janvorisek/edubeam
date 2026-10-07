# Cargas

Todas as cargas pertencem a um **único caso de carga** e atuam juntas. Para comparar cenários, salve cada um como arquivo de projeto ou link de compartilhamento.

![Todos os tipos de carga em uma viga contínua: uma força nodal, uma carga uniforme, uma carga trapezoidal, uma carga concentrada, uma carga térmica e um recalque de apoio](/screenshots/pt/loads-overview.webp)

<LoadShowcase />

## A convenção de sinais em uma linha {#sign-convention-in-one-line}

O eixo global **x** aponta para a direita e o eixo global **z** aponta **para baixo**. Um `Fz` ou `fz` positivo é, portanto, uma carga para baixo, do tipo gravitacional, e um momento `My` positivo gira no sentido anti-horário na tela. Os detalhes estão em [Sistema de coordenadas e convenções de sinais](/pt/elements/conventions). Com os [eixos com y para cima](/pt/elements/conventions#y-up-axes), os nomes e os sinais verticais se invertem: a gravidade é um `Fy` negativo.

## Cargas nodais {#nodal-loads}

Aba *Cargas* → **Adicionar carga nodal**, ou clique em um nó → **Adicionar carga**. Escolha **Força/Momento**:

| Campo | Significado | Unidade |
| --- | --- | --- |
| `Fx` | força horizontal (positiva para a direita) | unidade de força |
| `Fz` | força vertical (positiva para baixo) | unidade de força |
| `My` | momento em torno de y (positivo no sentido anti-horário) | unidade de momento |

![Adicionar carga nodal. A prévia mostra o sentido enquanto você digita.](/screenshots/pt/loads-nodal.webp){.shot-md}

As componentes estão sempre no sistema de coordenadas **global**. Um nó pode receber várias cargas nodais; elas se somam e são desenhadas empilhadas.

### Deslocamentos prescritos (recalques de apoio) {#prescribed-displacements-support-settlements}

No mesmo diálogo, escolha **Deslocamento prescrito**, ou clique em um nó com apoio → **Prescrever deslocamento**. Os campos passam a ser:

| Campo | Significado | Unidade |
| --- | --- | --- |
| `Dx` | deslocamento horizontal imposto | unidade de deslocamento |
| `Dz` | deslocamento vertical imposto (positivo para baixo) | unidade de deslocamento |
| `Ry` | rotação imposta | rad |

Só é possível informar um valor para um GL que esteja **restringido** naquele nó, porque apenas apoios podem ser movidos. Cada nó tem no máximo um deslocamento prescrito; edite-o em vez de adicionar um segundo. Em uma estrutura isostática, um recalque produz deslocamentos, mas não esforços internos; em uma hiperestática, produz ambos.

## Cargas de elemento {#element-loads}

Aba *Cargas* → **Adicionar carga de elemento**, ou clique em um elemento → **Adicionar carga**. Escolha o **Tipo de carga**; o diálogo mostra uma prévia da carga sobre o elemento enquanto você digita.

### Carga distribuída uniforme {#uniformly-distributed-load}

| Campo | Significado | Unidade |
| --- | --- | --- |
| `fx` | carga por unidade de comprimento ao longo de x | força / comprimento |
| `fz` | carga por unidade de comprimento ao longo de z | força / comprimento |
| **LCS** | marcado: `fx`, `fz` atuam nos eixos locais do elemento; desmarcado: nos eixos globais | – |

**LCS** vem marcado por padrão. Em um elemento horizontal desenhado da esquerda para a direita, os eixos locais e globais coincidem, então não faz diferença. Em uma barra inclinada, faz:

- uma carga **perpendicular à barra** (vento em uma tesoura de cobertura) é `fz` com LCS **marcado**;
- uma carga **vertical** por metro de comprimento da barra (peso próprio) é `fz` com LCS **desmarcado**;
- uma carga vertical por metro de projeção *horizontal* (neve) não está disponível diretamente. Multiplique-a primeiro por $\cos\alpha$, onde $\alpha$ é a inclinação da barra, e informe-a como carga vertical.

### Carga trapezoidal {#trapezoidal-load}

| Campo | Significado |
| --- | --- |
| `f1x`, `f1z` | intensidade no nó **inicial** |
| `f2x`, `f2z` | intensidade no nó **final** |

A intensidade varia linearmente do início ao fim do elemento. Uma carga triangular tem `f1z = 0`. As cargas trapezoidais sempre atuam nos **eixos locais do elemento** (a caixa LCS fica travada); em um elemento horizontal, isso é o mesmo que os eixos globais.

### Carga concentrada {#concentrated-load}

Uma força ou um momento pontual em qualquer ponto **ao longo** de um elemento, sem precisar de um nó adicional.

| Campo | Significado |
| --- | --- |
| `Fx`, `Fz`, `My` | componentes de força e de momento |
| **Posição da carga a partir do nó inicial** | distância a partir do nó inicial, `0 ≤ a ≤ L` |
| **LCS** | componentes nos eixos locais |

O diagrama de cortante salta `Fz` no ponto da carga e o diagrama de momento tem um vértice ali; o valor do momento nesse ponto é rotulado automaticamente. Um `My` concentrado faz o diagrama de momento saltar.

### Carga térmica {#temperature-load}

| Campo | Significado |
| --- | --- |
| **ΔT<sub>c</sub>**, variação axial de temperatura | variação uniforme em toda a seção, que produz um alongamento $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>**, diferença de temperatura | fibra inferior menos fibra superior, que produz uma curvatura $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

As cargas térmicas usam o **α** do material e a **altura h** da seção. Um `ΔTb − ΔTt` positivo (mais quente embaixo) alonga a fibra inferior, então o elemento se curva para baixo como uma viga sob carga gravitacional. Em uma estrutura isostática, a temperatura causa apenas deslocamentos; a restrição (extremidades engastadas, continuidade, barras redundantes) a transforma em esforços internos.

<div class="shots">

![Carga distribuída uniforme](/screenshots/pt/loads-udl.webp)

![Carga trapezoidal](/screenshots/pt/loads-trapezoidal.webp)

![Carga concentrada](/screenshots/pt/loads-concentrated.webp)

![Carga térmica](/screenshots/pt/loads-temperature.webp)

</div>

## Editar e remover cargas {#editing-and-removing-loads}

- Cada carga é uma linha na aba *Cargas*, onde você pode editar suas componentes e a opção LCS no lugar. As cargas também aparecem como etiquetas nas tabelas *Nós* e *Elementos*.
- **Clique duas vezes** em uma carga na visualização, ou clique nela e escolha **Editar carga**, para abrir o diálogo de edição.
- Selecione uma carga e pressione <kbd>Delete</kbd>, ou use o × na tabela.
- As cargas ligadas a um nó ou elemento são excluídas junto com ele, e copiadas junto quando você copia e cola.

![A aba Cargas: uma linha por carga, com as componentes editáveis no lugar](/screenshots/pt/loads-table.webp)

## O que não está disponível {#what-is-not-available}

- **Casos e combinações de carga.** Há um único caso de carga.
- **Peso próprio.** Informe-o como carga uniforme com LCS desmarcado: $f_z = \rho\,g\,A$. Para um IPE 200, 7850 × 9,81 × 0,00285 ≈ 0,22 kN/m.
- **Cargas trapezoidais em eixos globais** em barras inclinadas.
