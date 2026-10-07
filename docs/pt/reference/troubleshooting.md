# Solução de problemas

## Nenhum resultado é desenhado {#no-results-are-drawn}

Os resultados só aparecem quando o modelo pode ser resolvido. Verifique, nesta ordem:

1. **Leia a mensagem no canto superior esquerdo da visualização.**
   - *Nenhum material definido.* / *Nenhuma seção definida.*: adicione um com o botão **Adicionar**.
   - Uma etiqueta azul **Faltam apoios**: o modelo está apenas incompleto. Adicione apoios. Aponte para a etiqueta para ver, como um contorno tracejado, como a estrutura ainda pode se mover.
   - Uma **mensagem vermelha**: algo está errado. Ela indica o problema, ou mostra *Erros no modelo: N* quando há vários. Clique em **Mostrar detalhes** e corrija cada item (veja a tabela abaixo). Os nós ou as rótulas envolvidos são circulados na tela.
   - Uma **mensagem amarela**: avisos. O modelo foi resolvido mesmo assim; você pode ocultá-los.
2. **Apoios suficientes?** O solver precisa de pelo menos três GLs restringidos, e os apoios precisam fixar a estrutura. Uma viga sobre dois apoios móveis (Dz + Dz) tem apenas dois e escorrega. Acrescente um `Dx` em algum lugar, ou um `Ry` em um dos apoios.
3. **Os elementos estão conectados?** Dois nós com as mesmas coordenadas continuam sendo dois nós distintos. Exclua o nó solto e reconecte, ou posicione nós sobre elementos com **Conectar à estrutura**.
4. **Rótulas demais?** Rótulas nas duas extremidades de um pilar, ou um quadrado de barras articuladas sem diagonal, formam um mecanismo. O EduBeam circula as rótulas e mostra o movimento.
5. **Rigidez nula?** `E`, `A` ou `Iy` digitados por engano como 0, ou na unidade errada, fazem parte da estrutura se mover quase sem resistência. O EduBeam informa isso como *instável*.

![Mostrar detalhes lista cada problema com uma dica e pode mostrar o movimento](/screenshots/pt/ui-diagnostics.webp){.shot-lg}

## Mensagens {#messages}

**Mostrar detalhes** abre um diálogo com o título *Não é possível resolver o modelo* (erros), *Ainda não é possível resolver* (ainda faltam apoios) ou *Avisos do modelo*. O link **Solução de problemas** dele leva a esta página.

### Ainda falta {#still-needed}

| Mensagem | Significado / correção |
| --- | --- |
| *A estrutura precisa de apoios para poder ser resolvida.* | Menos de três GLs restringidos no total. Adicione apoios. |
| *Uma parte separada da estrutura (nós …) tem menos de 3 GLs restringidos e pode se mover livremente.* | O modelo está em pedaços e um deles está solto. Conecte-o ou apoie-o. |

### Erros {#errors}

| Mensagem | Significado / correção |
| --- | --- |
| *A estrutura tem apoios suficientes, mas eles não a fixam: ela ainda pode …* | Os apoios são todos paralelos, ou suas linhas de ação se encontram em um ponto. O contorno tracejado mostra o movimento; mude a direção de um apoio. A mesma mensagem fala de uma *parte separada* se apenas um pedaço for afetado. |
| *Os apoios fixam a estrutura, mas ela ainda é um mecanismo: suas barras podem girar em torno das articulações do nó …* | As rótulas deixam as barras girarem umas em relação às outras, como em um pórtico com rótulas no topo dos dois pilares ou em um quadrado articulado sem diagonal. Remova uma rótula, ou adicione uma barra ou um apoio. |
| *A estrutura é instável. Movimentos praticamente sem resistência: nó …* | Quase um mecanismo, ou uma rigidez próxima de zero. Verifique os apoios, as rótulas e os valores de `E`, `A` e `Iy`. |
| *A estrutura é um mecanismo: a matriz de rigidez é singular.* | Algo pode se mover livremente sem ter sido detectado pelas verificações acima. Verifique se cada parte está fixada por pelo menos três restrições e se as rótulas não deixam uma barra livre para girar. |
| *O elemento … referencia o nó / material / seção inexistente …* | O objeto referenciado foi excluído, normalmente em um arquivo JSON editado à mão. Reatribua-o na tabela *Elementos*. |
| *O elemento … deve referenciar exatamente 2 nós.* | Um elemento corrompido em um arquivo importado. Exclua-o e crie-o de novo. |
| *A carga nodal / O deslocamento prescrito nº n referencia o nó inexistente …* | Exclua a carga ou atribua-lhe um nó. |
| *A carga de elemento nº n referencia o elemento inexistente …* | Exclua a carga. |
| *O solver falhou devido a uma inconsistência interna do modelo…* | Uma falha genérica. Desfaça o último passo, ou salve o arquivo e [relate o problema](https://github.com/janvorisek/edubeam/issues). |

### Avisos {#warnings}

O modelo é resolvido mesmo assim, mas verifique estes pontos:

| Mensagem | Significado / correção |
| --- | --- |
| *O nó … não está ligado a nenhum elemento e é ignorado pelo solver.* | Um nó solto. Exclua-o ou conecte-o. |
| *O nó … tem apoio, mas nenhum elemento está ligado a ele, então o apoio não transmite nada.* | Um apoio em um nó solto. |
| *O elemento … referencia o mesmo nó nas duas extremidades.* | Um elemento de comprimento nulo. Exclua-o. |
| *A carga nodal / O deslocamento prescrito nº n contém valores inválidos.* | Uma componente que não é um número. Edite a carga. |

## Os resultados parecem errados {#results-look-wrong}

| Sintoma | Causa provável |
| --- | --- |
| As cargas atuam para cima | O eixo global **z aponta para baixo**, então `Fz`/`fz` positivo é para baixo. Valores negativos apontam para cima. Veja as [convenções](/pt/elements/conventions). Com eixos y para cima, é o contrário. |
| A flecha está 1000× maior ou menor | Confusão de unidades: `E` digitado em Pa com a unidade em MPa, ou `Iy` em cm⁴ com a unidade em m⁴. Confira o indicador de unidades no canto inferior direito da visualização. |
| A flecha é ligeiramente maior que a da fórmula do livro | Deformação por cisalhamento de Timoshenko. Aumente o coeficiente de cisalhamento da seção, ou use uma barra esbelta, para se aproximar dos valores de Euler–Bernoulli. Veja [Conferir resultados à mão](/pt/guide/verification). |
| Um sinal parece “errado” | Leia o sinal nos rótulos, não pelo lado do diagrama. M positivo traciona a fibra inferior. Os esforços de extremidade em *Resultados dos elementos* seguem os eixos locais do elemento, não a convenção N-V-M. |
| Dois pilares idênticos mostram sinais opostos de cortante | O sinal de V segue a orientação de cada elemento. Inverta os nós de um deles para comparar. |
| Números como `4 · 10¹` | O formato numérico científico. Escolha *Automático* em *Configurações → Idioma e localidade → Formato numérico*. |
| Diagramas enormes ou minúsculos | Puramente visual. Ajuste a **Escala de resultados** em *Configurações → Configurações de visualização*. |
| Uma carga em coordenadas locais aponta para o lado errado | O eixo x local do elemento vai do nó *inicial* ao nó *final*. Inverta os nós ou troque o sinal. |
| A carga de uma barra inclinada está estranha | **LCS** vem marcado por padrão, então `fz` atua perpendicularmente à barra. Desmarque-o para uma carga vertical. |
| A carga térmica não faz nada | Uma estrutura isostática se deforma livremente sob temperatura, sem esforços internos. Confira se α ≠ 0 e, para o gradiente, se a altura h da seção está definida. |

## Problemas na interface {#interface-issues}

| Sintoma | Correção |
| --- | --- |
| Os atalhos não fazem nada | Clique primeiro na tela: as teclas são ignoradas enquanto um campo de texto tem o foco. |
| Não consigo fazer a panorâmica | A panorâmica usa por padrão o botão do meio ou o direito do mouse; altere isso em *Configurações → Controles e atalhos*. Em um trackpad, a rolagem com dois dedos aplica zoom; clique e arraste com dois dedos para a panorâmica. |
| Meu modelo sumiu | Abrir um link, um arquivo ou um exemplo, assim como limpar, guarda o modelo antigo: **☰ → Estruturas recentes**, ou <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Idioma errado | *Configurações → Idioma e localidade*, ou acrescente `?lang=pt` ao endereço. |
| As alterações nas configurações não ficam salvas | O armazenamento local está bloqueado (janela anônima, modo de privacidade estrito). As configurações, o salvamento automático e as Estruturas recentes precisam dele. |

## Relatar um erro {#reporting-a-bug}

Abra uma [issue no GitHub](https://github.com/janvorisek/edubeam/issues) informando o navegador e o sistema operacional, o que você esperava e, o mais útil de tudo, um **link de compartilhamento** ou o **arquivo de projeto** que reproduz o problema.
