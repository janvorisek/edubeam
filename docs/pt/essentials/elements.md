# Elementos, materiais e seções

## O elemento de viga

<Edubeam /> tem um único tipo de elemento: uma **viga de Timoshenko 2D** no plano x–z com três graus de liberdade em cada extremidade (`Dx`, `Dz`, `Ry`). Ele transmite esforço normal, cortante e momento fletor, e inclui a deformação por cisalhamento (por isso a seção tem um coeficiente de cisalhamento). A formulação completa está no [manual teórico](/pt/elements/beam).

<TrussElement :moment="true" caption="Elemento de viga 2D: três graus de liberdade por nó" />

Os diagramas ao longo de um elemento são exatos para o modelo linear, então um elemento por barra é suficiente. Adicione nós intermediários apenas onde precisar de um apoio, uma rótula, uma mudança de seção ou um nó para aplicar carga.

### Adicionar elementos

| Método | Como |
| --- | --- |
| **Diálogo** | Aba *Elementos* → **Adicionar elemento** (ou menu da tela → *Adicionar elemento*): escolha **Nó inicial**, **Nó final**, material e seção. |
| **Mouse** | Aba *Elementos* → **Adicionar com o mouse** (ou segure <kbd>Ctrl</kbd> com a opção do menu da tela). Clique em um nó para começar e no próximo nó para conectar — clicar na tela vazia cria um novo nó ali. Continue clicando para desenhar uma poligonal; <kbd>Esc</kbd> encerra. O primeiro material e a primeira seção do modelo são atribuídos automaticamente. |

::: warning Materiais e seções primeiro
Um elemento não pode existir sem material e seção. Se não houver nenhum, a visualização mostra *Nenhum material definido.* / *Nenhuma seção definida.* com o atalho **Adicionar**.
:::

### Orientação do elemento

O **eixo x local** vai do nó inicial ao nó final. Isso importa para:

- cargas em coordenadas locais (`fx`, `fz` no SCL),
- a *Posição da carga a partir do nó inicial* das cargas concentradas,
- a ordem dos esforços de extremidade (`X12, Z12, M12` no início, `X21, Z21, M21` no fim) na tabela de resultados.

Use **Inverter nós** na tabela *Elementos* para inverter um elemento.

### Rótulas de extremidade

Cada elemento tem duas caixas **Rótulas de extremidade** (início / fim) na tabela *Elementos*. Uma rótula marcada libera o momento fletor naquela extremidade (condensação estática do grau de liberdade de rotação), de modo que:

- uma rótula → uma articulação dentro de um pórtico ou viga contínua (momento nulo ali);
- as duas rótulas → uma **barra de treliça**, que transmite apenas esforço normal.

<TrussElement :hinges="[true, true]" caption="Ambas as extremidades rotuladas → barra de treliça" />

Quando dois elementos se encontram em um nó e apenas um é rotulado, o outro continua transmitindo momento ao nó — rotule o elemento que você quer liberar, não «o nó».

### Editar e excluir

Clique em um elemento e use o menu de contexto (**Editar elemento**, **Adicionar carga**, **Matriz de rigidez**, **Excluir**) ou edite diretamente na tabela *Elementos*. Excluir um elemento também remove suas cargas. **Matriz de rigidez** abre uma janela flutuante com a matriz 6 × 6 do elemento em coordenadas locais e globais — útil para conferir a montagem à mão no método da rigidez direta.

## Materiais

Aba *Materiais* → **Adicionar material**:

| Campo | Símbolo | Unidade | Observações |
| --- | --- | --- | --- |
| Módulo de Young (módulo de elasticidade) | $E$ | unidade de tensão (MPa por padrão) | Aço ≈ 210 000 MPa, concreto ≈ 30 000 MPa, madeira ≈ 11 000 MPa |
| Módulo de cisalhamento | $G$ | unidade de tensão | $G = E / (2(1+\nu))$; aço ≈ 81 000 MPa. Afeta apenas o termo de cisalhamento de Timoshenko. |
| Densidade | $\rho$ | kg/m³ | Salva com o projeto; o solver estático não a usa (não há carga de peso próprio). |
| Coeficiente de dilatação térmica | $\alpha$ | 1/K | Usado pelas [cargas térmicas](/pt/essentials/loads#carga-termica). Aço 12 × 10⁻⁶. |

A **Biblioteca de materiais** oferece valores prontos: aços estruturais (S235, S275, S355, inoxidável), ligas de alumínio, cobre/latão/bronze, titânio, classes de concreto, madeira (C24, GL24h, GL32h), vidro, GFRP/CFRP e polímeros comuns. Escolha no diálogo da biblioteca ou em *Ou escolha da biblioteca* dentro do diálogo *Adicionar material*.

## Seções

Aba *Seções* → **Adicionar seção**:

| Campo | Símbolo | Unidade | Observações |
| --- | --- | --- | --- |
| Área | $A$ | unidade de área | Rigidez axial $EA$ |
| Momento de inércia (segundo momento de área) | $I_y$ | m⁴ (ou a unidade escolhida) | Rigidez à flexão $EI_y$ em torno do eixo de flexão no plano |
| Altura | $h$ | unidade de comprimento | Usada pelas cargas térmicas com gradiente (curvatura $= \alpha\,\Delta T / h$) |
| Coeficiente de cisalhamento | $k$ | – | Fator de correção de cisalhamento: área efetiva ao cisalhamento $= kA$. Use `1` para (quase) ignorar a deformação por cisalhamento; ≈ 0,83 para retângulos; em perfis I use $A_{alma}/A$. |

A **Biblioteca de seções** fornece valores aproximados para retângulos, quadrados, círculos, perfis IPE e HEA, tubos RHS e CHS. Trate-os como ponto de partida e confira os valores em uma tabela de perfis antes de confiar neles.

::: tip Valores rápidos de conferência
Retângulo $b \times h$: $A = bh$, $I_y = bh^3/12$. Círculo maciço de diâmetro $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materiais e seções podem ser compartilhados por qualquer número de elementos; alterar um valor atualiza todos os elementos que o usam e recalcula o modelo.
