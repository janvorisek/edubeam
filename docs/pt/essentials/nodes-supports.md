# Nós e apoios

Nós são os pontos do modelo. Elementos conectam nós; apoios e cargas nodais são aplicados nos nós.

## Coordenadas

Cada nó tem uma coordenada **X** e uma **Z** na unidade de comprimento atual. O eixo x aponta para a direita e o **eixo z aponta para baixo** na tela — então um pilar que sobe do chão vai de `Z = 0` a `Z = −3`, não `+3`. O indicador de eixos no canto da grade mostra a orientação atual. Veja [Sistema de coordenadas e convenção de sinais](/pt/elements/conventions).

## Adicionar nós

| Método | Como |
| --- | --- |
| **Diálogo** | Aba *Nós* → **Adicionar nó**, ou botão direito na tela → *Adicionar nó*. Informe X e Z. |
| **Mouse** | Aba *Nós* → **Adicionar com o mouse** (ou segure <kbd>Ctrl</kbd> ao escolher *Adicionar nó* no menu da tela) e clique na tela. Cada clique adiciona um nó; <kbd>Esc</kbd> encerra. |
| **Ao desenhar elementos** | No modo *Adicionar elemento → Adicionar com o mouse*, um clique na tela vazia cria um novo nó e o conecta. |
| **Copiar e colar** | Selecione nós (e elementos), <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd> e clique onde a cópia deve ficar. |

Os rótulos são atribuídos automaticamente (`1`, `2`, …) e podem ser renomeados na tabela.

### Encaixe na grade

Com **Encaixar na grade** ativado (<kbd>S</kbd> ou o rótulo **S**), nós posicionados ou arrastados com o mouse caem em múltiplos do **Passo do encaixe na grade** (padrão `0,1 m`, alterável em *Configurações → Configurações de visualização → Grade*). Desative o encaixe para posicionamento livre, ou digite as coordenadas exatas na tabela depois.

### Posicionar um nó sobre um elemento existente

Se, ao adicionar um nó, você clicar a menos de ~0,1 m de um elemento, o EduBeam pergunta o que você quer:

- **Conectar à estrutura**: o elemento é dividido em dois (`1a` e `1b`), as rótulas nas extremidades externas são preservadas e qualquer carga distribuída é repartida entre as metades. É a forma mais rápida de adicionar um apoio intermediário ou um ponto de aplicação de carga.
- **Posicionar nó individual**: o nó é criado sobre o elemento, mas sem conexão com ele.

## Editar nós

- **Tabela:** edite rótulo, X e Z diretamente.
- **Arrastar:** mova um nó na visualização (pode ser desfeito). Em telas sensíveis ao toque, pressione e segure o nó para começar a movê-lo.
- **Diálogo Editar nó:** coordenadas, apoios e ângulo do SCL em um só lugar, com pré-visualização do símbolo do apoio.
- **Excluir:** o ícone de lixeira na tabela, *Excluir* no menu do nó, ou selecionar e pressionar <kbd>Delete</kbd>. Excluir um nó exclui os elementos e cargas ligados a ele.

## Apoios

Um apoio é simplesmente um conjunto de graus de liberdade (GLs) restringidos. Cada nó tem três:

| GL | Significado |
| --- | --- |
| **Dx** | translação em x (horizontal) |
| **Dz** | translação em z (vertical) |
| **Ry** | rotação em torno de y (no plano da estrutura) |

Marque as caixas na coluna **GLs restringidos** da aba *Nós*, no menu **Apoios do nó** de um nó selecionado ou no diálogo *Editar nó*. O símbolo desenhado na visualização segue a combinação:

| Restringidos | Apoio | Símbolo |
| --- | --- | --- |
| Dx + Dz + Ry | Engaste | bloco hachurado |
| Dx + Dz | Apoio fixo (2º gênero) | triângulo |
| Dz | Apoio móvel horizontal (1º gênero) | triângulo sobre roletes |
| Dx | Apoio móvel vertical | rolete girado |
| Dz + Ry | Engaste deslizante (guia vertical) | engaste sobre roletes |
| Dx + Ry | Engaste deslizante (guia horizontal) | engaste deslizante girado |
| Ry | Somente rotação restringida | engaste à rotação |
| nenhum | Nó livre | — |

Uma reação é calculada — e desenhada — para cada GL restringido.

::: tip Nós de treliça
Barras de treliça são elementos de viga com as **duas rótulas de extremidade** liberadas (veja [Elementos](/pt/essentials/elements#rotulas-de-extremidade)). Em um nó de treliça, o usual é um apoio fixo (Dx + Dz); **não** restrinja Ry em um nó onde todos os elementos ligados são rotulados, senão a rotação desse nó fica indefinida.
:::

### Apoios inclinados

Defina o **Ângulo do SCL nodal** (graus, −180…180) no menu do nó ou no diálogo *Editar nó*. Os eixos locais do nó giram esse ângulo e os GLs de apoio são interpretados no sistema girado — um rolete sobre um talude de 30° é `Dz` com ângulo `30`. O símbolo do apoio gira junto e a reação é informada na direção girada.

### Estabilidade

O solver precisa de pelo menos **três GLs restringidos** no total e de uma estrutura sem mecanismos. Apoios insuficientes produzem o erro *Model needs at least 3 constrained DOFs…* ou simplesmente nenhum resultado. Veja [Solução de problemas](/pt/reference/troubleshooting).

## Cargas nodais e recalques

Forças, momentos e deslocamentos prescritos (recalques de apoio) são aplicados nos nós — veja [Cargas](/pt/essentials/loads#cargas-nodais).

## Linhas de cota

Botão direito na tela → **Adicionar cota** desenha uma linha de cota entre dois pontos. As extremidades encaixam nos nós próximos ao serem arrastadas; selecione a linha e use **Editar** para digitar coordenadas ou **Inverter cota** para colocar o rótulo do outro lado. As cotas são apenas gráficas e são salvas com o projeto.
