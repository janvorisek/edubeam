# Início rápido

Em cerca de dez minutos você vai modelar uma viga biapoiada de aço com carga uniforme, ler as reações, o esforço cortante e o momento fletor, e conferi-los com as fórmulas dos livros.

::: tip Acompanhe em paralelo
Abra [run.edubeam.app](https://run.edubeam.app/?lang=pt){target="_blank"} em uma segunda aba. Se já houver um modelo carregado, use **Limpar estrutura** (ícone de lixeira na barra superior) e marque *Excluir materiais* e *Excluir seções* para começar do zero.
:::

## O problema

<ExampleStructure />

Uma viga biapoiada com 6 m de vão (apoio fixo à esquerda, apoio móvel à direita) suporta uma carga uniforme de 12 kN/m. Material: aço, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Seção IPE 200: $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Confira as unidades

Observe o rótulo de unidades no canto inferior direito da visualização (por exemplo `m · m² · kN · kNm · MPa`). Essas são as unidades de todos os campos de entrada e resultados. O padrão é metro, kN, kNm e MPa, que é o que este tutorial assume. Para mudar, clique no rótulo ou abra **Configurações → Idioma e localidade**.

## 2. Adicione o material e a seção

Um elemento precisa de material e seção para existir, então crie-os primeiro.

1. Abra a aba **Materiais** na barra inferior e clique em **Adicionar material**.
2. Informe `E = 210000` MPa, `G = 81000` MPa, deixe a densidade e `α = 0,000012` 1/K. Confirme com **Adicionar material**.
   *(Ou clique em **Biblioteca de materiais** e escolha **Steel (S235)**, que tem exatamente esses valores.)*
3. Abra a aba **Seções** e clique em **Adicionar seção**.
4. Informe `Área = 0,00285` m², `Iy = 1,943e-5` m⁴, `Altura = 0,2` m, `Coeficiente de cisalhamento = 1`. Confirme com **Adicionar seção**.

::: details Para que serve o coeficiente de cisalhamento?
O EduBeam usa elementos de viga de Timoshenko, que incluem a deformação por cisalhamento. `k` é o fator de correção de cisalhamento ($k \approx 0{,}83$ para retângulo, $\approx 0{,}4$–$0{,}5$ para a alma de um perfil I quando $A$ é a área total). Usar `k = 1` com a área total *subestima* levemente a flexibilidade ao cisalhamento; em uma viga esbelta como esta a diferença na flecha fica bem abaixo de 1 %. A fórmula está na [página de teoria da viga](/pt/elements/beam).
:::

## 3. Adicione os nós

1. Abra a aba **Nós** e clique em **Adicionar nó**. Informe `X = 0`, `Z = 0` e confirme. O nó recebe o rótulo `1`.
2. Clique novamente em **Adicionar nó** com `X = 6`, `Z = 0`. Este é o nó `2`.

Também é possível posicionar nós com o mouse: escolha **Adicionar com o mouse** (ou clique com o botão direito na tela → *Adicionar nó* segurando <kbd>Ctrl</kbd>) e clique na grade. Com **Encaixar na grade** ativado (<kbd>S</kbd>), os cliques caem em incrementos de 0,1 m.

## 4. Conecte-os com um elemento

1. Abra a aba **Elementos** e clique em **Adicionar elemento**.
2. Escolha **Nó inicial** `1`, **Nó final** `2`. O material e a seção que você criou já vêm pré-selecionados. Confirme.

Uma linha preta aparece entre os nós. Pressione <kbd>F</kbd> para ajustá-la à tela.

## 5. Adicione os apoios

Na aba **Nós**, a coluna **GLs restringidos** tem três caixas de seleção por nó: `Dx`, `Dz`, `Ry`.

- Nó `1`: marque **Dx** e **Dz** → aparece o símbolo de um apoio fixo.
- Nó `2`: marque apenas **Dz** → apoio móvel.

As mesmas caixas estão disponíveis ao clicar em um nó na visualização e escolher **Apoios do nó**. Todos os tipos de apoio estão em [Nós e apoios](/pt/essentials/nodes-supports).

## 6. Adicione a carga

1. Abra a aba **Cargas** e clique em **Adicionar carga de elemento**.
2. **Tipo de carga**: *Carga distribuída uniforme*. **Elemento**: `1`.
3. Informe `fz = 12` kN/m e deixe `fx = 0`. Confirme.

Um `fz` positivo aponta na direção +z, que na tela é **para baixo** — portanto um valor positivo é uma carga do tipo gravitacional. Veja a [convenção de sinais](/pt/elements/conventions).

## 7. Leia os resultados

A solução aparece assim que a carga é adicionada. Abra o painel de configurações da visualização (botão de engrenagem no canto superior direito) para ligar e desligar as camadas:

| Camada | O que você deve ver |
| --- | --- |
| **Reações** | Duas setas para cima de **36 kN** nos nós 1 e 2. |
| **V<sub>z</sub> (x)** | Uma reta de **+36 kN** à esquerda até **−36 kN** à direita, cruzando o zero no meio do vão. |
| **M<sub>y</sub> (x)** | Uma parábola com valor extremo de **54 kNm** no meio do vão. |
| **Forma deformada** | Uma flecha simétrica. Passe o mouse sobre o nó `1` para ler sua rotação: cerca de **0,0265 rad**. |

A aba **Resultados** da barra inferior traz os números: **Resultados nodais** lista `Dx`, `Dz`, `Ry` de cada nó; **Resultados dos elementos** lista os esforços de extremidade de cada elemento em seu sistema de coordenadas local.

Se os diagramas parecerem grandes ou pequenos demais, arraste o controle **Escala de resultados** em **Configurações → Configurações de visualização → Tamanhos**.

## 8. Confira à mão

| Grandeza | Fórmula | À mão | EduBeam |
| --- | --- | --- | --- |
| Reação | $R = qL/2$ | 36 kN | 36 kN |
| Cortante máximo | $V = qL/2$ | 36 kN | 36 kN |
| Momento máximo | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Rotação no apoio | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha no meio do vão | $w = 5qL^4/(384EI)$ | 49,6 mm | 49,6 mm |

Tudo confere. Mais roteiros de conferência (viga em balanço, viga biengastada, treliça) em [Conferir resultados à mão](/pt/guide/verification).

## 9. Experimente

É aqui que o EduBeam mostra seu valor. Tente cada uma destas ações e observe os diagramas mudarem:

- **Arraste o nó 2** para a direita: o momento cresce com $L^2$.
- **Marque `Ry` no nó 1** para engastá-lo: o momento no meio do vão cai e surge um momento negativo no apoio.
- **Adicione um terceiro nó** em `X = 3` clicando sobre a viga no modo *Adicionar com o mouse* — escolha **Conectar à estrutura** para dividir a viga — e marque seu `Dz` para obter uma viga contínua de dois vãos.
- **Marque uma rótula de extremidade** em um elemento na aba Elementos para liberar o momento naquela extremidade.
- Pressione <kbd>Ctrl</kbd>+<kbd>Z</kbd> para desfazer qualquer passo.

## 10. Salve ou compartilhe

- **Compartilhar modelo** (barra superior) gera uma URL que contém o modelo inteiro — cole em um e-mail, chat ou apresentação.
- **Salvar projeto** (menu ☰ ou <kbd>Ctrl</kbd>+<kbd>S</kbd>) baixa um `project.json` que você pode reabrir com **Abrir projeto** ou arrastando-o para o aplicativo.

O modelo também fica guardado no armazenamento local do navegador, de modo que recarregar a página não o perde. Veja [Importar, exportar e compartilhar](/pt/essentials/import-export).

## Próximos passos

- [Exemplos](/pt/examples/): pórticos e treliças prontos com um clique.
- [Cargas](/pt/essentials/loads): cargas trapezoidais, concentradas, térmicas e deslocamentos prescritos.
- [Teclado e mouse](/pt/reference/shortcuts): trabalhe mais rápido na tela.
