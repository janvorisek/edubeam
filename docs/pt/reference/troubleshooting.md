# Solução de problemas

## Nenhum resultado é desenhado

Os resultados só aparecem quando o modelo pode ser resolvido. Verifique, nesta ordem:

1. **Há um aviso vermelho na visualização?** *Nenhum material definido.* / *Nenhuma seção definida.* → adicione um. *Model has N error(s)* → clique em **Show details** e corrija cada item (veja a tabela abaixo).
2. **Apoios suficientes?** O solver precisa de pelo menos três GLs restringidos *e* de nenhum mecanismo. Uma viga sobre dois roletes (Dz + Dz) tem apenas dois e escorrega; um pórtico todo rotulado sem contraventamento pode ser um mecanismo mesmo com muitos apoios. Acrescente um `Dx` em algum lugar, ou um `Ry` em um apoio.
3. **Os elementos estão conectados?** Dois nós com as mesmas coordenadas continuam sendo dois nós distintos. Exclua o excedente e reconecte, ou posicione nós sobre elementos com **Conectar à estrutura**.
4. **Rótulas em toda parte?** Um nó cujos elementos são todos rotulados e que não tem `Ry` restringido tem rotação indefinida. Desmarque uma rótula ou restrinja `Ry` nesse nó.
5. **Números absurdos** (deslocamentos na casa dos milhões) significam que a estrutura é quase um mecanismo; o EduBeam oculta esses resultados. Procure um apoio faltante ou uma rigidez quase nula (`E`, `A` ou `Iy` digitados por engano como 0 ou na unidade errada).

## Mensagens de erro

Mensagens de **Show details** (diálogo *Cannot solve model*, por enquanto apenas em inglês):

| Mensagem | Significado / correção |
| --- | --- |
| *Model needs at least 3 constrained DOFs to be stable in 2D analysis.* | Adicione apoios até restringir pelo menos três GLs no total. |
| *Element X references missing node / material / cross section Y.* | A entidade referenciada foi excluída (normalmente em um JSON editado à mão). Reatribua na tabela *Elementos*. |
| *Element X must reference exactly 2 nodes.* | Elemento corrompido em um arquivo importado; exclua-o e crie novamente. |
| *Nodal load / Prescribed displacement #n references missing node Y.* | Exclua a carga ou redirecione-a. |
| *Element load #n references missing element Y.* | Exclua a carga. |
| *Solver failed due to an internal model inconsistency…* | Falha genérica; desfaça o último passo ou salve o arquivo e [relate o problema](https://github.com/janvorisek/edubeam/issues). |

Avisos (diálogo *Model warnings*) não interrompem o cálculo: *Element X references the same node at both ends* (elemento de comprimento nulo — exclua-o) e *… contains invalid values* (uma carga com componente não numérica — edite-a).

## Os resultados parecem errados

| Sintoma | Causa provável |
| --- | --- |
| As cargas atuam para cima | O eixo global **z aponta para baixo**, então `Fz`/`fz` positivo é para baixo. Valores negativos apontam para cima. Veja a [convenção de sinais](/pt/elements/conventions). |
| A flecha está 1000× maior ou menor | Confusão de unidades — `E` digitado em Pa com a unidade em MPa, ou `Iy` em cm⁴ com a unidade em m⁴. Confira o rótulo de unidades no canto inferior direito da visualização. |
| A flecha é ligeiramente maior que a fórmula do livro | Deformação por cisalhamento de Timoshenko. Aumente o coeficiente de cisalhamento da seção (ou use uma barra esbelta) para se aproximar dos valores de Euler–Bernoulli. Veja [Conferir resultados à mão](/pt/guide/verification). |
| O diagrama de momento está do lado «errado» | O lado é apenas uma convenção de desenho; leia o sinal nos rótulos — positivo significa tração na fibra inferior. |
| Diagramas enormes / minúsculos | Puramente visual — ajuste a **Escala de resultados** em *Configurações → Configurações de visualização*. |
| Uma carga em coordenadas locais aponta para o lado errado | O eixo x local do elemento vai do nó *inicial* ao *final*. Use **Inverter nós** ou troque o sinal. |
| A carga térmica não faz nada | Estruturas isostáticas se deformam livremente sob temperatura, sem esforços. Confira que α ≠ 0 e, para o gradiente, que a altura h da seção está definida. |

## Problemas na interface

| Sintoma | Correção |
| --- | --- |
| Os atalhos não funcionam | Clique primeiro na tela — as teclas são ignoradas enquanto um campo de texto tem o foco. |
| Não consigo deslocar a tela | A panorâmica usa por padrão o botão do meio/direito do mouse; altere em *Configurações → Controles e atalhos*. Em um trackpad, use dois dedos ou mude a configuração para *Botão direito*. |
| O modelo sumiu após uma atualização | Uma atualização que limpa o armazenamento é anunciada antes em um diálogo; cancele-a e salve o projeto antes de atualizar. |
| Idioma errado | *Configurações → Idioma e localidade*, ou acrescente `?lang=pt` à URL. |
| As configurações não são mantidas | O armazenamento local está bloqueado (janela anônima, modo de privacidade estrito). Configurações e salvamento automático precisam dele. |

## Relatar um erro

Abra uma [issue no GitHub](https://github.com/janvorisek/edubeam/issues) informando navegador e sistema operacional, o que você esperava e — o mais útil de tudo — um **link compartilhado** ou o **JSON do projeto** que reproduz o problema.
