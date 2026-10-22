# Elementos, materiais e seções

## O elemento de viga {#the-beam-element}

<Edubeam /> tem um único tipo de elemento: uma **viga de Timoshenko 2D** no plano x–z com três graus de liberdade em cada extremidade (`Dx`, `Dz`, `Ry`). Ele transmite esforço normal, cortante e momento fletor, e inclui a deformação por cisalhamento, e é por isso que a seção tem um coeficiente de cisalhamento. A formulação completa está no [manual teórico](/pt/elements/beam).

<TrussElement :moment="true" caption="Elemento de viga 2D – três graus de liberdade por nó" />

Os resultados ao longo de um elemento são exatos para o modelo linear, então um elemento por barra é suficiente. Adicione nós intermediários apenas onde precisar de um apoio, uma rótula, uma mudança de seção ou um nó para ler resultados.

### Adicionar elementos {#adding-elements}

| Método | Como |
| --- | --- |
| **Diálogo** | Aba *Elementos* → o primeiro botão **Adicionar elemento**, ou menu da tela → *Adicionar elemento*. Escolha o **Nó inicial** e o **Nó final**, as rótulas, o material e a seção. |
| **Mouse** | Aba *Elementos* → o segundo botão **Adicionar elemento** (ícone de cursor), ou segure <kbd>Ctrl</kbd> com a opção do menu da tela. Clique em um nó para começar e depois no próximo nó para conectar; um clique na tela vazia cria um nó ali. Continue clicando para desenhar uma poligonal e pressione <kbd>Esc</kbd> para terminar. A faixa no topo define **Rótula no início** e **Rótula no fim** para cada elemento que você desenha. São usados o primeiro material e a primeira seção do modelo. |

![O diálogo Adicionar elemento](/screenshots/pt/qs-element.webp){.shot-md}

::: warning Materiais e seções primeiro
Um elemento precisa de um material e de uma seção. Se não houver nenhum, a visualização mostra *Nenhum material definido.* / *Nenhuma seção definida.* com um botão **Adicionar**.
:::

### Orientação do elemento {#element-direction}

O **eixo x local** vai do nó inicial ao nó final. Isso importa para:

- cargas em coordenadas locais (**LCS** marcado),
- a *Posição da carga a partir do nó inicial* das cargas concentradas,
- a ordem dos esforços de extremidade (`X12, Z12, M12` no início, `X21, Z21, M21` no fim) na tabela de resultados.

Use o botão de inversão entre os dois nós na tabela *Elementos* para inverter um elemento.

### Rótulas de extremidade {#end-hinges}

Cada elemento tem duas caixas **Rótulas de extremidade**, início e fim, na tabela *Elementos*. Elas também estão no diálogo Adicionar elemento, no painel **Editar elemento** do elemento e na faixa ao desenhar com o mouse. Uma rótula marcada libera o momento fletor naquela extremidade, de modo que:

- uma rótula cria uma articulação dentro de um pórtico ou de uma viga contínua (o momento é nulo ali);
- as duas rótulas criam uma **barra de treliça**, que transmite apenas esforço normal.

<TrussElement :hinges="[true, true]" caption="Ambas as extremidades rotuladas → elemento de treliça" />

![A tabela de elementos do pórtico triarticulado: o elemento 2 tem uma rótula no fim, no nó C](/screenshots/pt/elements-table.webp)

Quando dois elementos se encontram em um nó e apenas um deles é rotulado, o outro continua transmitindo momento ao nó. Portanto, rotule o elemento que você quer liberar, não “o nó”. Se as rótulas transformarem a estrutura em um mecanismo, o EduBeam as circula e mostra como ela se move.

### Editar e excluir {#editing-and-deleting}

Clique em um elemento e use o painel dele (**Editar elemento**, **Adicionar carga**, **Matriz de rigidez**, **Excluir**), ou edite-o na tabela *Elementos*. Excluir um elemento também remove suas cargas. **Matriz de rigidez** abre uma janela com a matriz de rigidez 6 × 6 do elemento em coordenadas globais (N/m, N e N·m), com as eventuais rótulas de extremidade já condensadas. É útil para conferir a montagem feita à mão.

## Materiais {#materials}

Aba *Materiais* → **Adicionar material**:

| Campo | Símbolo | Unidade | Observações |
| --- | --- | --- | --- |
| Módulo de Young | $E$ | unidade de tensão (MPa por padrão) | Aço ≈ 210 000 MPa, concreto ≈ 30 000 MPa, madeira ≈ 11 000 MPa |
| Módulo de cisalhamento | $G$ | unidade de tensão | $G = E / (2(1+\nu))$; aço ≈ 81 000 MPa. Afeta apenas o termo de cisalhamento de Timoshenko. |
| Densidade | $\rho$ | massa / comprimento³ (kg/m³, lb/ft³) | Salva com o projeto. O solver estático não a usa (não há carga de peso próprio). |
| Coeficiente de dilatação térmica | $\alpha$ | 1/K ou 1/°F | Usado pelas [cargas térmicas](/pt/essentials/loads#temperature-load). Aço: 12 × 10⁻⁶ /K. |

<div class="shots">

![Adicionar material](/screenshots/pt/qs-material.webp)

![A Biblioteca de materiais](/screenshots/pt/qs-material-library.webp)

</div>

A **Biblioteca de materiais** tem materiais prontos. A família que corresponde às suas unidades aparece primeiro.

- **Metais:** aços estruturais S235, S275, S355, aços inoxidáveis, ferro fundido, ligas de alumínio, cobre, latão, bronze, titânio; aços americanos ASTM A992, A36, A572 Gr. 50 e HSS A500 Gr. C.
- **Concreto:** concreto normal e leve, classes C25/30, C30/37, C40/50, e f′c = 4 ksi e 5 ksi.
- **Madeira:** C24, GL24h, GL32h.
- **Outros:** vidro, GFRP, CFRP, PEAD, PVC, PMMA, policarbonato.

Abra-a pelo botão da barra de ferramentas ou por *Ou escolha da biblioteca* no diálogo *Adicionar material*.

Um material que ainda é usado por elementos não pode ser excluído; reatribua esses elementos primeiro.

## Seções {#cross-sections}

Aba *Seções* → **Adicionar seção**:

| Campo | Símbolo | Unidade | Observações |
| --- | --- | --- | --- |
| Área | $A$ | unidade de área | Rigidez axial $EA$ |
| Momento de inércia | $I_y$ | unidade de momento de inércia | Rigidez à flexão $EI_y$ em torno do eixo perpendicular ao desenho |
| Altura | $h$ | unidade de dimensões da seção | Usada pelas cargas térmicas com gradiente (curvatura $= \alpha\,\Delta T / h$) |
| Coeficiente de cisalhamento | $k$ | – | Fator de correção de cisalhamento de Timoshenko: a área efetiva ao cisalhamento é $kA$. Use `1` para quase ignorar a deformação por cisalhamento, cerca de 0,83 para retângulos, $A_{alma}/A$ para perfis I. |

A **Biblioteca de seções** fornece valores aproximados para retângulos, quadrados e círculos, perfis IPE e HEA, tubos RHS e CHS, e os perfis AISC W e HSS (retangulares e circulares). Seus coeficientes de cisalhamento seguem a forma: $h\,t_w/A$ para perfis I, $2ht/A$ para tubos retangulares, 0,5 para tubos circulares, 0,833 para retângulos e 0,9 para círculos. Trate os valores como ponto de partida e confira-os em uma tabela de perfis antes de confiar neles.

![A Biblioteca de seções](/screenshots/pt/sections-library.webp){.shot-lg}

### Seções poligonais {#polygonal-sections}

Aba *Seções* → **Seção poligonal**, ou *Ou defina uma forma poligonal* no diálogo *Adicionar seção*, abre um editor de forma.

![O editor de seção poligonal com o modelo de perfil I, seus eixos principais e a elipse de inércia](/screenshots/pt/sections-polygon.webp)

- **Comece** por um modelo (retângulo, I, T, L, U, tubo retangular ou circular, círculo) com suas dimensões e pressione **Aplicar**.
- **Edite** a forma: arraste os vértices (eles se encaixam no **Passo do encaixe**), clique no ponto médio de uma aresta para inserir um vértice, clique duas vezes em um vértice para removê-lo, ou digite as coordenadas na tabela de vértices. **Adicionar furo** adiciona um contorno interno. **Centralizar no centroide** move a forma para que seu centroide fique na origem.
- **Leia** a área $A$, o centroide, os momentos de inércia baricêntricos $I_y$, $I_z$, $I_{yz}$, os momentos principais $I_1$, $I_2$ com o ângulo do eixo principal $\alpha$ (de $y$ ao eixo 1) e os raios de giração. O desenho mostra a elipse de inércia.

Ao salvar, $A$, $I_y$ e $h$ são preenchidos a partir da forma. Eles aparecem como somente leitura na tabela; use o botão de polígono na coluna *Ações* para editar a forma de novo. O coeficiente de cisalhamento $k$ continua sendo informado por você. As coordenadas da seção são locais e dextrogiras, com $x$ apontando para fora da tela, $y$ para a esquerda e $z$ para baixo.

Se a forma não for simétrica em relação ao plano do pórtico (uma cantoneira, por exemplo), o editor avisa que uma análise 2D só é exata se a barra estiver contida contra deslocamento lateral e torção em todo o comprimento, por exemplo por uma laje. Quando $I_{yz}$ é significativo, você escolhe qual rigidez à flexão usar: **contida lateralmente e à torção em todo o comprimento** ($I_y$) ou **livre para se deslocar lateralmente**, que é menor. A torção não é incluída em nenhum dos casos.

::: tip Valores rápidos de conferência
Para um retângulo $b \times h$: $A = bh$, $I_y = bh^3/12$. Para um círculo maciço de diâmetro $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materiais e seções podem ser compartilhados por qualquer número de elementos. Alterar um valor atualiza todos os elementos que o usam e resolve o modelo de novo.
