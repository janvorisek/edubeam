# Resultados e diagramas

<Edubeam /> resolve o modelo automaticamente após cada alteração (limitado a algumas vezes por segundo), então os resultados estão sempre atualizados. Não há botão *Calcular*. Se nada for desenhado, o modelo ainda não pode ser resolvido — veja [Solução de problemas](/pt/reference/troubleshooting).

## Camadas na visualização

Ligue e desligue no **painel de exibição** (botão ⚙, canto superior direito da visualização).

| Camada | Cor (padrão) | Observações |
| --- | --- | --- |
| **Forma deformada** | cinza | Exagerada; escalada para que o maior deslocamento tenha os pixels da *Escala de resultados*. |
| **N (x)** – esforço normal | azul | Tração positiva. Constante ao longo de um elemento, a menos que atue uma carga distribuída axial. |
| **V<sub>z</sub> (x)** – esforço cortante | verde | Linear sob carga uniforme, quadrático sob carga trapezoidal, com salto nas cargas concentradas. |
| **M<sub>y</sub> (x)** – momento fletor | vermelho | Positivo com tração na fibra inferior. Rotulado nas duas extremidades, nas cargas concentradas e em cada extremo local (onde V = 0). |
| **Reações** | roxo | Uma seta e um valor para cada GL restringido. |

Os diagramas são desenhados ao longo dos elementos com os valores nos pontos característicos. A orientação dos rótulos e a escala de todos os diagramas podem ser alteradas em [Configurações](/pt/essentials/units-settings#configuracoes-de-visualizacao).

### Esforço normal

<Figure>
    <Structure :show-loads="true" show-normal-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: -100, 2: 0, 4: 0 }}]" />
    <figcaption>Viga em balanço comprimida por uma força horizontal na extremidade livre: N é constante e negativo</figcaption>
</Figure>

### Esforço cortante

<Figure>
  <Structure :show-loads="true" show-shear-force :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>Viga em balanço com carga vertical na extremidade: V é constante</figcaption>
</Figure>

### Momento fletor

<Figure>
  <Structure :show-loads="true" show-moment :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
 <figcaption>A mesma viga em balanço: M cresce linearmente até F·L no engaste</figcaption>
</Figure>

### Forma deformada

<Figure>
  <Structure :show-loads="true" show-deformed-shape :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />
  <figcaption>Configuração deformada (exagerada) da viga em balanço</figcaption>
</Figure>

### Reações

<Structure :show-loads="true" show-reactions :nodes="[{label: 'a', coords: [0,0,0], dofs: [0,2, 4]}, {label: 'b', coords: [10,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['a', 'b']}]" :nodal-loads="[{target: 'b', values: { 0: 0, 2: 10, 4: 0 }}]" />

## Dicas ao passar o mouse

Passar o mouse na visualização é a forma mais rápida de ler um valor:

- **Nó** → `ux`, `uz`, `φy` (deslocamentos na unidade de comprimento, rotação em radianos).
- **Elemento** → rótulo, seção e material.
- **Carga** → suas componentes.

## Aba Resultados

A aba **Resultados** da barra inferior tem duas visões:

### Resultados nodais

Uma linha por nó com **Dx**, **Dz** (unidade de comprimento) e **Ry** (rad). Os sinais seguem os eixos globais: `Dz` positivo é para baixo, `Ry` positivo é anti-horário na tela.

<figure>

![Resultados nodais](/results_nodes.png)

</figure>

### Resultados dos elementos

Uma linha por elemento com os **esforços de extremidade no sistema de coordenadas local do elemento**:

| Coluna | Significado |
| --- | --- |
| `X12`, `Z12`, `M12` | esforço normal, cortante e momento atuando sobre o elemento no nó **inicial** |
| `X21`, `Z21`, `M21` | o mesmo no nó **final** |

São as forças que os nós exercem sobre o elemento (matriz de rigidez do elemento vezes os deslocamentos de extremidade, menos as cargas nodais equivalentes). Para uma viga biapoiada de 6 m com 12 kN/m você obtém `Z12 = Z21 = −36 kN`: ambos os apoios empurram a viga para cima (z negativo). Para uma viga em balanço engastada no nó inicial com 18 kN para baixo na extremidade: `Z12 = −18`, `M12 = +72 kNm`, `Z21 = +18`, `M21 = 0`.

<figure>

![Resultados dos elementos](/results_elements.png)

</figure>

### Matriz de rigidez

Escolha **Matriz de rigidez** no menu de contexto de um elemento ou na linha da tabela para abrir uma janela flutuante com a matriz de rigidez 6 × 6 do elemento em coordenadas locais e globais — útil para conferir a montagem manual em uma disciplina de método da rigidez direta. As fórmulas estão no [manual teórico](/pt/elements/beam).

## Precisão

- O elemento de viga é exato para o modelo linear de Timoshenko sob cargas nodais, uniformes, trapezoidais, concentradas e térmicas, então os resultados **não** dependem do número de elementos.
- As tabelas mostram quatro algarismos significativos; o cálculo interno é em dupla precisão.
- As flechas incluem a **deformação por cisalhamento** (Timoshenko). Em barras esbeltas isso acrescenta uma fração de 1 % em relação às fórmulas de Euler–Bernoulli; em barras altas ou curtas pode chegar a vários por cento. Defina o coeficiente de cisalhamento da seção com um valor grande se quiser suprimi-la.

## Levar os resultados para um relatório

Não há exportação de tabelas; selecione o texto da tabela e copie, ou faça uma captura de tela da visualização. Para entregar um modelo a outra pessoa, use [Compartilhar modelo](/pt/essentials/import-export).
