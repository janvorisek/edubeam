# Tutorial: treliça plana

Este tutorial monta uma pequena treliça isostática, confere os esforços nas barras com o método dos nós e o método das seções e encontra uma barra de esforço nulo. Reserve cerca de 15 minutos.

![A treliça pronta: esforços normais e reações](/screenshots/pt/tut-truss.webp)

[Abra o modelo pronto](https://run.edubeam.app/?model=eyJuIjpbWyIxIixbMCwwLDBdLFswLDJdLG51bGxdLFsiMiIsWzQsMCwwXSxbXSxudWxsXSxbIjMiLFs4LDAsMF0sW10sbnVsbF0sWyI0IixbMTIsMCwwXSxbMl0sbnVsbF0sWyI1IixbNCwwLC0zXSxbXSxudWxsXSxbIjYiLFs4LDAsLTNdLFtdLG51bGxdXSwiZSI6W1siMSIsWyIxIiwiMiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMiIsWyIyIiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiMyIsWyIzIiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNCIsWyI1IiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNSIsWyIxIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNiIsWyIyIiwiNSJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiNyIsWyI1IiwiMyJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOCIsWyIzIiwiNiJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dLFsiOSIsWyI2IiwiNCJdLCIxIiwiMSIsW3RydWUsdHJ1ZV1dXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODEwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDAyLDAuMDAwMDAxLDAuMSwxXV0sIm5sIjpbWyIyIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV0sWyIzIix7IjAiOjAsIjIiOjMwMDAwLCI0IjowfV1dLCJkIjpbXX0%3D&lang=pt){target="_blank"} se quiser apenas explorá-lo.

## O problema {#the-problem}

![Geometria, apoios e cargas](/screenshots/pt/tut-truss-model.webp)

- Um vão de 12 m em três painéis de 4 m, com 3 m de altura.
- Nós do banzo inferior 1–4, nós do banzo superior 5 e 6.
- Um apoio fixo no nó 1 e um apoio móvel no nó 4.
- Duas cargas de 30 kN, nos nós 2 e 3 do banzo inferior.
- Barras de aço com $A = 20$ cm².

| Nó | X [m] | Z [m] | Apoio | Carga |
| --- | --- | --- | --- | --- |
| 1 | 0 | 0 | apoio fixo | |
| 2 | 4 | 0 | | `Fz = 30` kN |
| 3 | 8 | 0 | | `Fz = 30` kN |
| 4 | 12 | 0 | apoio móvel | |
| 5 | 4 | −3 | | |
| 6 | 8 | −3 | | |

Barras: banzo inferior 1–2, 2–3, 3–4; banzo superior 5–6; diagonais de extremidade 1–5 e 6–4; montantes 2–5 e 3–6; e a diagonal central 5–3.

**É isostática?** $m + r = 9 + 3 = 12 = 2j$ com $j = 6$ nós, então sim: os esforços nas barras resultam apenas do equilíbrio.

## 1. Material e seção {#_1-material-and-section}

1. **Limpar estrutura** (marque *Excluir materiais* e *Excluir seções*).
2. *Materiais* → **Biblioteca de materiais** → **Steel (S235)**.
3. *Seções* → **Adicionar seção**: `Área = 0,002`, `Iy = 1e-6`, `Altura = 0,1`, `Coeficiente de cisalhamento = 1`. Com barras rotuladas, só a área importa.

## 2. Desenhe as barras com rótulas {#_2-draw-the-bars-with-hinges}

Uma barra de treliça no EduBeam é um elemento de viga com **as duas rótulas de extremidade** marcadas. A ferramenta de mouse pode defini-las para você:

1. Aba *Elementos* → o segundo botão **Adicionar elemento** (ícone de cursor).
2. Na faixa no topo da visualização, marque **Rótula no início** e **Rótula no fim**. Toda barra que você desenhar agora recebe as duas.
3. Desenhe o contorno como uma única poligonal: clique em (0, 0), (4, −3), (8, −3), (12, 0) e depois volte pela parte de baixo: (8, 0), (4, 0), (0, 0). Pressione <kbd>Esc</kbd>.
4. Desenhe as barras internas uma de cada vez, pressionando <kbd>Esc</kbd> depois de cada uma: (4, 0) → (4, −3), (4, −3) → (8, 0), (8, 0) → (8, −3).
5. Pressione <kbd>F</kbd> para ajustar à tela.

Confira a tabela *Elementos*: nove elementos, cada um com as duas *Rótulas de extremidade* marcadas. A numeração dos seus nós e elementos pode ser diferente da das imagens; isso não importa.

## 3. Apoios e cargas {#_3-supports-and-loads}

1. Clique no nó em (0, 0) → **Apoios do nó** → **apoio fixo**. Clique no nó em (12, 0) → **apoio móvel**.
2. Clique no nó em (4, 0) → **Adicionar carga** → `Fz = 30` kN. Faça o mesmo em (8, 0).

Um `Fz` positivo aponta para baixo. Os nós de uma treliça são livres para girar; o EduBeam aceita nós em que todas as barras são rotuladas e informa a rotação deles como 0.

## 4. Resultados {#_4-results}

Nas opções de exibição, desmarque **Forma deformada** e **M<sub>y</sub> (x)** (não há flexão em uma treliça) e marque **N (x)**.

![Esforços normais: tração positiva](/screenshots/pt/tut-truss.webp)

## 5. Confira à mão {#_5-check-by-hand}

**Reações.** As cargas são simétricas, então $R_1 = R_4 = 30$ kN para cima, e a reação horizontal no apoio fixo é nula.

**Nó 1** (método dos nós). A diagonal de extremidade 1–5 tem 5 m de comprimento ($\sin\alpha = 3/5$, $\cos\alpha = 4/5$):

$$\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \Rightarrow N_{15} = -50\ \text{kN} \qquad \sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}$$

**Nó 2.** O montante 2–5 é a única barra que pode levar a carga de 30 kN para cima: $N_{25} = +30$ kN, e $N_{23} = N_{12} = 40$ kN.

**Seção pelo painel central.** Corte as barras 5–6, 5–3 e 2–3 e fique com a parte esquerda:

- Momentos em relação ao nó 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Forças verticais: o cortante no painel é $R_1 - 30 = 0$, então a diagonal **5–3 não suporta nada**: $N_{53} = 0$.

| Barra | À mão | EduBeam |
| --- | --- | --- |
| Banzo inferior 1–2, 2–3, 3–4 | +40 kN (tração) | 40 |
| Banzo superior 5–6 | −40 kN (compressão) | −40 |
| Diagonais de extremidade 1–5, 6–4 | −50 kN | −50 |
| Montantes 2–5, 3–6 | +30 kN | 30 |
| Diagonal central 5–3 | 0 | 0 |

O deslocamento do nó 2 é 2,29 mm (*Resultados → Resultados nodais*). Calcule-o como exercício com o princípio dos trabalhos virtuais, $\delta = \sum N n L / (EA)$.

## 6. Experimente {#_6-experiment}

- **Mova uma carga.** Coloque as duas cargas de 30 kN no nó 2. A diagonal central agora tem esforço: com que sinal, e por quê?
- **Remova a diagonal central.** A treliça vira um mecanismo; o EduBeam circula as rótulas responsáveis e mostra como o painel se deforma por cisalhamento.
- **Desmarque todas as rótulas.** A treliça vira um pórtico com nós rígidos. Marque **M<sub>y</sub> (x)**: os momentos fletores são minúsculos em comparação com os esforços normais, e é por isso que a idealização com nós articulados funciona.
- **Coloque apoio fixo nos dois apoios.** Uma reação a mais a torna hiperestática, e os esforços no banzo inferior passam a depender das áreas das barras.
