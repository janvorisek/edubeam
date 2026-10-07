# Conferir resultados à mão

<Edubeam /> é um bom lugar para praticar o hábito de que todo engenheiro precisa: nunca confiar em um número que você não consegue reproduzir, ao menos aproximadamente. Esta página traz fórmulas fechadas para os casos clássicos e mostra o que o aplicativo informa para eles, para que você monte cada modelo e compare.

Para exemplos completos resolvidos com conferência à mão, veja os tutoriais do [pórtico triarticulado](/pt/tutorials/three-hinged-frame) e da [treliça plana](/pt/tutorials/truss).

Todos os casos usam a mesma seção de aço, salvo indicação em contrário: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (um IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Por que os números diferem ligeiramente
O EduBeam usa vigas de **Timoshenko**, que somam uma flecha por cisalhamento $\Delta w_s$ à flecha por flexão clássica de Euler–Bernoulli. Rotações, reações e esforços internos não mudam nos casos isostáticos. Em barras esbeltas o termo extra é minúsculo; as tabelas abaixo o mostram explicitamente.
:::

## Viga biapoiada com carga uniforme {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Apoios: nó 1 `Dx + Dz`, nó 2 `Dz`.

| Grandeza | Fórmula | Valor | EduBeam |
| --- | --- | --- | --- |
| Reações | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (meio do vão) | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotação no apoio | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha no meio do vão (flexão) | $5qL^4/(384EI)$ | 49,63 mm | — |
| Flecha no meio do vão (cisalhamento) | $qL^2/(8kGA)$ | 0,23 mm | — |
| Flecha no meio do vão (total) | soma | 49,86 mm | 49,86 mm |

Para ler a flecha no meio do vão, adicione um nó ali com *Adicionar nó* (mouse) → **Conectar à estrutura**; dividir o elemento não altera nenhum resultado.

<ExampleStructure />

## Viga em balanço com carga na extremidade {#cantilever-tip-load}

$L = 4$ m, $F = 18$ kN para baixo na extremidade livre. Apoio: nó 1 `Dx + Dz + Ry`.

| Grandeza | Fórmula | Valor | EduBeam |
| --- | --- | --- | --- |
| Reação vertical | $F$ | 18 kN | 18 kN |
| Momento de engastamento | $FL$ | 72 kNm | 72 kNm |
| Rotação na extremidade | $FL^2/(2EI)$ | 0,03529 rad | 0,03529 rad |
| Flecha na extremidade (flexão) | $FL^3/(3EI)$ | 94,11 mm | — |
| Flecha na extremidade (cisalhamento) | $FL/(kGA)$ | 0,31 mm | — |
| Flecha na extremidade (total) | soma | 94,42 mm | 94,42 mm |

O termo de cisalhamento aqui é 0,3 %. Encurte o balanço para 1 m e ele passa a 5 % — é para isso que serve o coeficiente de cisalhamento.

<Figure>
  <Structure :show-loads="true" show-moment show-reactions :nodes="[{label: '1', coords: [0,0,0], dofs: [0,2,4]}, {label: '2', coords: [4,0,0], dofs: []}]" :elements="[{label: '1', nodes: ['1', '2']}]" :nodal-loads="[{target: '2', values: { 0: 0, 2: 18000, 4: 0 }}]" />
  <figcaption>Viga em balanço com carga de 18 kN na extremidade: momento fletor e reações</figcaption>
</Figure>

## Viga biengastada com carga uniforme {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Ambos os nós `Dx + Dz + Ry`.

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Reações | $qL/2$ | 36 kN |
| Momento no apoio | $qL^2/12$ | 36 kNm (negativo, tração em cima) |
| Momento no meio do vão | $qL^2/24$ | 18 kNm (positivo, tração embaixo) |
| Flecha no meio do vão | $qL^4/(384EI) + qL^2/(8kGA)$ | 9,93 + 0,23 = 10,16 mm |

Monte-a a partir do caso biapoiado marcando `Ry` nos dois nós e observe o diagrama de momento se deslocar.

## Viga engastada e apoiada com carga uniforme {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m. Nó 1 `Dx + Dz + Ry`, nó 2 `Dz`.

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Reação no engaste | $5qL/8$ | 45 kN |
| Reação no apoio móvel | $3qL/8$ | 27 kN |
| Momento de engastamento | $qL^2/8$ | 54 kNm (negativo) |
| Momento positivo máximo | $9qL^2/128$ em $x = 5L/8$ a partir do engaste | 30,4 kNm em 3,75 m |

O aplicativo rotula o extremo local automaticamente, então você lê tanto o valor quanto (pela posição ao longo do elemento) onde ele ocorre.

## Treliça de duas barras {#two-bar-truss}

Duas barras partindo de apoios fixos em `(0, 0)` e `(4, 0)` que se encontram em `(2, −2)` (vértice 2 m acima), com as **rótulas de extremidade** marcadas nas duas extremidades de ambas as barras, e carga vertical $F = 20$ kN no vértice (para baixo, ou seja, `Fz = 20`).

Cada barra está a 45°, com comprimento $L = 2\sqrt{2}$ m. Por simetria, cada uma suporta

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (compressão)}$$

e cada apoio recebe 10 kN na vertical e ±10 kN na horizontal. Confira o diagrama **N (x)** e as reações.

## Gradiente térmico em viga biapoiada {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (fibra superior mais quente), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

A viga é livre para se curvar, então **não há esforços internos**; a curvatura é

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

e a flecha no meio do vão é $\kappa L^2 / 8 = -4{,}8$ mm (para cima). Agora restrinja `Ry` nas duas extremidades: a curvatura é impedida e surge um momento constante $M = EI\kappa = 2{,}45$ kNm em todo o vão.

## Deslocamento prescrito {#prescribed-displacement}

Tome a [viga engastada e apoiada](#propped-cantilever-uniform-load) sem a carga e prescreva `Dz = 10 mm` no apoio móvel (um recalque). A reação necessária para empurrar para baixo, em $w$, a extremidade de um balanço é $R = 3EIw/L^3 = 0{,}567$ kN e o momento de engastamento é $RL = 3{,}40$ kNm. Acrescente de volta a carga uniforme e os resultados se superpõem linearmente.

## Dicas para suas próprias conferências {#tips-for-your-own-checks}

- Mantenha o **indicador de unidades** à vista; a maioria das discrepâncias são deslizes de unidades.
- Use a janela **Matriz de rigidez** para comparar um único elemento com o [manual teórico](/pt/elements/beam) ao estudar o método da rigidez direta.
- Leia os valores exatos na aba **Resultados** e nas dicas ao passar o mouse, não nos rótulos dos diagramas, que são arredondados. **Exportar CSV** ou **Copiar** na aba Resultados também fornecem as reações, prontas para uma planilha.
- Defina **Formato numérico** como *Automático* nas Configurações para ler `40` em vez de `4 · 10¹`.
- Use **Compartilhar modelo** para entregar um modelo conferido a um colega ou professor.
