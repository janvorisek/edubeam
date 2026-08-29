# Conferir resultados à mão

<Edubeam /> é um bom lugar para praticar o hábito de que todo engenheiro precisa: nunca confiar em um número que não consegue reproduzir, ao menos aproximadamente. Esta página traz fórmulas fechadas para os casos clássicos e mostra o que o aplicativo devolve para eles, para que você construa cada modelo e compare.

Todos os casos usam a mesma seção de aço, salvo indicação em contrário: $E = 210\,000$ MPa, $G = 81\,000$ MPa, $A = 28{,}5$ cm², $I_y = 1943$ cm⁴, $h = 200$ mm, $k = 1$ (um IPE 200).

$$EI = 210 \times 10^9 \cdot 1{,}943 \times 10^{-5} = 4{,}080 \times 10^6\ \text{Nm}^2$$

::: tip Por que os números diferem ligeiramente
O EduBeam usa vigas de **Timoshenko**, que somam uma flecha por cisalhamento $\Delta w_s$ à flecha por flexão clássica de Euler–Bernoulli. Rotações, reações e esforços não mudam nos casos isostáticos. Em barras esbeltas o termo extra é minúsculo; as tabelas abaixo o mostram explicitamente.
:::

## Viga biapoiada com carga uniforme

$L = 6$ m, $q = 12$ kN/m. Apoios: nó 1 `Dx + Dz`, nó 2 `Dz`.

| Grandeza | Fórmula | Valor | EduBeam |
| --- | --- | --- | --- |
| Reações | $qL/2$ | 36 kN | 36 kN |
| $V_{max}$ | $qL/2$ | 36 kN | 36 kN |
| $M_{max}$ (meio do vão) | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotação no apoio | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha no meio do vão | $5qL^4/(384EI)$ | 49,63 mm | 49,63 mm |

<ExampleStructure />

## Viga em balanço com carga na extremidade

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
  <figcaption>Viga em balanço com 18 kN na extremidade: momento fletor e reações</figcaption>
</Figure>

## Viga biengastada com carga uniforme

$L = 6$ m, $q = 12$ kN/m. Ambos os nós `Dx + Dz + Ry`.

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Reações | $qL/2$ | 36 kN |
| Momento de engastamento | $qL^2/12$ | 36 kNm (negativo, tração em cima) |
| Momento no meio do vão | $qL^2/24$ | 18 kNm (positivo) |
| Flecha no meio do vão | $qL^4/(384EI)$ | 9,93 mm |

Construa-a a partir da biapoiada marcando `Ry` nos dois nós e observe o diagrama de momento se deslocar.

## Viga engastada-apoiada com carga uniforme

$L = 6$ m, $q = 12$ kN/m. Nó 1 `Dx + Dz + Ry`, nó 2 `Dz`.

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Reação no engaste | $5qL/8$ | 45 kN |
| Reação no apoio móvel | $3qL/8$ | 27 kN |
| Momento de engastamento | $qL^2/8$ | 54 kNm (negativo) |
| Momento positivo máximo | $9qL^2/128$ em $x = 5L/8$ a partir do engaste | 30,4 kNm em 3,75 m |

O aplicativo rotula o extremo local automaticamente, então você lê tanto o valor quanto (pela posição ao longo do elemento) onde ele ocorre.

## Treliça de duas barras

Duas barras partindo de apoios fixos em `(0, 0)` e `(4, 0)` que se encontram em `(2, −2)` (vértice 2 m acima), ambas com **as duas rótulas de extremidade** marcadas, carga vertical $F = 20$ kN no vértice (para baixo, ou seja, `Fz = 20`).

Cada barra está a 45°, comprimento $L = 2\sqrt{2}$ m. Por simetria, cada uma suporta

$$N = -\frac{F}{2 \sin 45^\circ} = -14{,}14\ \text{kN (compressão)}$$

e cada apoio recebe 10 kN na vertical e ±10 kN na horizontal. Confira a camada **N (x)** e as reações.

## Gradiente térmico em viga biapoiada

$L = 8$ m, $\Delta T_b - \Delta T_t = -10$ K (fibra superior mais quente), $\alpha = 12 \times 10^{-6}$, $h = 0{,}2$ m.

A viga é livre para se curvar, então **não há esforços**; a curvatura é

$$\kappa = \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} = \frac{12 \times 10^{-6} \cdot (-10)}{0{,}2} = -6 \times 10^{-4}\ \text{m}^{-1}$$

e a flecha no meio do vão é $\kappa L^2 / 8 = -4{,}8$ mm (para cima). Agora restrinja `Ry` nas duas extremidades: a curvatura é impedida e surge um momento constante $M = EI\kappa = 2{,}45$ kNm em todo o vão.

## Deslocamento prescrito

Tome a [viga engastada-apoiada](#viga-engastada-apoiada-com-carga-uniforme) sem carga e prescreva `Dz = 10 mm` no apoio móvel (um recalque). A reação necessária para empurrar a extremidade de um balanço $w$ para baixo é $R = 3EIw/L^3 = 0{,}567$ kN e o momento de engastamento é $RL = 3{,}40$ kNm. Acrescente de volta a carga uniforme e os resultados se superpõem linearmente.

## Dicas para suas próprias conferências

- Mantenha o **rótulo de unidades** à vista; a maioria das discrepâncias são deslizes de unidades.
- Use a janela **Matriz de rigidez** para comparar um único elemento com o [manual teórico](/pt/elements/beam) ao estudar o método da rigidez direta.
- Leia valores exatos na aba **Resultados** e nas dicas do mouse, não nos rótulos dos diagramas, que são arredondados.
- Entregue um modelo conferido a um colega ou professor com **Compartilhar modelo**.
