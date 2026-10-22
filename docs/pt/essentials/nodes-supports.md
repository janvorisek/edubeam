# Nós e apoios

Os nós são os pontos do modelo. Os elementos ligam nós, e os apoios e as cargas nodais são aplicados nos nós.

## Coordenadas {#coordinates}

Cada nó tem uma coordenada **X** e uma **Z** na unidade de comprimento atual. O eixo x aponta para a direita e o **eixo z aponta para baixo** na tela, então um pilar que sobe do chão vai de `Z = 0` a `Z = −3`, não `+3`. O indicador de eixos no canto da grade mostra a orientação. Se preferir um eixo vertical apontando para cima, mude para os [eixos com y para cima](/pt/elements/conventions#y-up-axes) nas Configurações.

## Adicionar nós {#adding-nodes}

| Método | Como |
| --- | --- |
| **Diálogo** | Aba *Nós* → o primeiro botão **Adicionar nó**, ou botão direito na tela → *Adicionar nó*. Informe X e Z e, se quiser, os apoios e o ângulo do apoio. |
| **Mouse** | Aba *Nós* → o segundo botão **Adicionar nó** (ícone de cursor), ou segure <kbd>Ctrl</kbd> ao escolher *Adicionar nó* no menu da tela. Cada clique na tela adiciona um nó. Pressione <kbd>Esc</kbd> ou **Cancelar** para parar. |
| **Ao desenhar elementos** | No modo de mouse para elementos, um clique na tela vazia cria um nó e o conecta. |
| **Copiar e colar** | Selecione nós (e elementos), pressione <kbd>Ctrl</kbd>+<kbd>C</kbd> e <kbd>Ctrl</kbd>+<kbd>V</kbd> e clique onde a cópia deve ficar, ou digite um deslocamento Δx, Δz e pressione **Colar**. |

<div class="shots">

![O diálogo Adicionar nó](/screenshots/pt/qs-node.webp)

![No modo de mouse, uma faixa no topo define os apoios e o ângulo de cada nó que você posiciona](/screenshots/pt/nodes-add-banner.webp)

</div>

Os rótulos são atribuídos automaticamente (`1`, `2`, … ou continuando o seu próprio esquema, por exemplo `A`, `B`) e podem ser renomeados na tabela.

### Encaixe {#snapping}

Com **Encaixar na grade** ativado (<kbd>S</kbd> ou o botão **S**), os nós que você posiciona ou arrasta caem em múltiplos do **Passo do encaixe na grade**: 0,1 m por padrão, ou 0,5 ft em unidades americanas. Altere-o em *Configurações → Configurações de visualização → Grade*. Desative o encaixe para posicionamento livre, ou digite as coordenadas exatas na tabela depois.

### Posicionar um nó sobre um elemento existente {#placing-a-node-on-an-existing-element}

Se você clicar perto de um elemento ao adicionar um nó, o EduBeam pergunta o que você quer:

- **Conectar à estrutura** divide o elemento em dois (`1a` e `1b`). As rótulas nas extremidades externas são mantidas, e as cargas uniformes e trapezoidais são repartidas entre as metades; as cargas concentradas e térmicas vão para a primeira metade. É a forma mais rápida de adicionar um apoio intermediário ou um ponto de aplicação de carga.
- **Posicionar nó individual** cria o nó sobre o elemento sem conectá-lo.

## Editar nós {#editing-nodes}

- **Tabela:** edite o rótulo, X e Z diretamente.
- **Arrastar:** mova um nó na visualização, também em telas sensíveis ao toque: pressione o nó e arraste. Cada movimento pode ser desfeito.
- **Diálogo Editar nó:** o lápis na coluna *Ações* da tabela. Reúne as coordenadas, os apoios e o ângulo do apoio, com uma prévia do símbolo do apoio.
- **Excluir:** o × na tabela, *Excluir* no painel do nó, ou selecione-o e pressione <kbd>Delete</kbd>. Excluir um nó também exclui os elementos e as cargas ligados a ele.

## Apoios {#supports}

Um apoio é um conjunto de graus de liberdade (GLs) restringidos. Cada nó tem três:

| GL | Significado |
| --- | --- |
| **Dx** | translação em x (horizontal) |
| **Dz** | translação em z (vertical) |
| **Ry** | rotação em torno de y (no plano do desenho) |

O jeito mais rápido é **escolher o símbolo**. Ele está no painel do nó em **Apoios do nó**, nos diálogos Adicionar nó e Editar nó, e como um pequeno menu no início da coluna *GLs restringidos* da tabela de nós. Marcar as caixas `Dx`, `Dz`, `Ry` faz o mesmo, um GL de cada vez.

![Apoios do nó: escolha um símbolo ou marque os GLs, e defina o ângulo do apoio](/screenshots/pt/nodes-support-picker.webp){.shot-lg}

| Apoio | Restringidos | Movimentos | Reações |
| --- | --- | --- | --- |
| **Livre** | nenhum | todos | nenhuma |
| **Apoio fixo** | Dx + Dz | gira | R<sub>x</sub>, R<sub>z</sub> |
| **Apoio móvel** | Dz | desliza na horizontal, gira | R<sub>z</sub> |
| **Apoio móvel vertical** | Dx | desliza na vertical, gira | R<sub>x</sub> |
| **Engaste** | Dx + Dz + Ry | nenhum | R<sub>x</sub>, R<sub>z</sub>, M |
| **Engaste deslizante** | Dz + Ry | desliza na horizontal | R<sub>z</sub>, M |
| **Engaste deslizante vertical** | Dx + Ry | desliza na vertical | R<sub>x</sub>, M |
| **Apenas rotação impedida** | Ry | desliza nas duas direções | M |

Uma reação é calculada, e desenhada, para cada GL restringido.

::: tip Nós de treliça
As barras de treliça são elementos de viga com as duas **rótulas de extremidade** liberadas (veja [Elementos](/pt/essentials/elements#end-hinges)). Um apoio fixo (Dx + Dz) é a escolha usual em um apoio de treliça. Um nó em que todos os elementos ligados são rotulados não tem rigidez à rotação; o EduBeam o aceita e informa sua rotação como 0.
:::

### Apoios inclinados {#inclined-skewed-supports}

Defina o **Ângulo do SCL nodal** α em graus (−180…180). Ele está no painel do nó em *Apoios do nó*, nos diálogos Adicionar nó e Editar nó, e no campo α da tabela de nós. Os eixos do nó giram esse ângulo e os GLs do apoio atuam nas direções giradas, então um apoio móvel sobre um talude de 30° é `Dz` com α = 30. O símbolo gira junto e a reação é informada na direção girada.

### Estabilidade {#stability}

O solver precisa de pelo menos **três GLs restringidos** no total, e os apoios e as rótulas precisam fixar a estrutura. Enquanto não houver apoios suficientes, a visualização mostra uma etiqueta azul *Faltam apoios*. Se os apoios forem suficientes em número mas não conseguirem fixar a estrutura (todos paralelos, ou concorrentes em um ponto), ou se as rótulas deixarem as barras girarem umas em relação às outras, uma mensagem vermelha indica o problema e um contorno tracejado mostra como a estrutura se move. Veja [Solução de problemas](/pt/reference/troubleshooting).

## Cargas nodais e recalques {#nodal-loads-and-settlements}

Forças, momentos e deslocamentos prescritos (recalques de apoio) são aplicados nos nós. Veja [Cargas](/pt/essentials/loads#nodal-loads).

## Linhas de cota {#dimension-lines}

Botão direito na tela → **Adicionar cota** desenha uma linha de cota entre dois pontos, ou botão direito em um elemento → **Cotar o elemento** para cotá-lo diretamente. As extremidades se encaixam nos nós quando arrastadas para perto deles. Selecione uma linha e use **Editar** para digitar suas coordenadas, ou **Inverter cota** para colocar o rótulo do outro lado. As linhas de cota são apenas gráficas; elas são salvas com o projeto e vão junto nos links de compartilhamento.
