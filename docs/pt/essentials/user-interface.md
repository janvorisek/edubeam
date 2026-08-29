# Interface do usuário

<Edubeam /> tem três áreas. Quando você sabe o que fica em cada uma, o resto da documentação faz sentido.

```
┌──────────────────────────────────────────────────────────────┐
│ ☰  edubeam    🗑 Limpar estrutura  🔗 Compartilhar  Novidades │  ← Barra superior
├──────────────────────────────────────────────────────────────┤
│ Estrutura | Configurações                                    │  ← Abas
│ ↶ ↷                                        ⌖  ⤢  ⚙            │
│                                                              │
│                     tela (o modelo)             [camadas de  │  ← Visualização
│                                                  resultados] │
│                                       G  S  m·kN·kNm·MPa     │
├──────────────────────────────────────────────────────────────┤
│ Nós | Elementos | Cargas | Materiais | Seções | Resultados    │  ← Barra inferior
│ [Adicionar nó] [Adicionar com o mouse]  tabela de entidades …│
└──────────────────────────────────────────────────────────────┘
```

## Barra superior

| Controle | O que faz |
| --- | --- |
| **Menu ☰** | **Abrir projeto**, **Salvar projeto**, **Compartilhar modelo**, **Limpar estrutura** e a versão do aplicativo. |
| **Limpar estrutura** 🗑 | Exclui todos os nós, elementos e cargas após confirmação. Duas caixas permitem excluir também materiais e seções. Não pode ser desfeito. |
| **Compartilhar modelo** 🔗 | Abre o [diálogo de compartilhamento](/pt/essentials/import-export#compartilhar-um-link) com uma URL que codifica o modelo inteiro. |
| **O que há de novo?** | Notas de versão. |
| **Documentação** / GitHub | Links para este site e para o código-fonte. |

No [modo visualizador](/pt/essentials/import-export#incorporar-um-visualizador-somente-leitura) a barra superior fica oculta.

## Visualização

A tela onde você desenha e inspeciona o modelo. Todo o resto do aplicativo responde ao que você seleciona aqui.

### Botões sobre a tela

- **Canto superior esquerdo:** **Desfazer** / **Refazer** (também <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>). Toda alteração do modelo — adicionar, editar, arrastar, excluir — pode ser desfeita.
- **Canto superior direito:** **Centralizar** (<kbd>C</kbd>), **Ajustar à tela** (<kbd>F</kbd>) e o botão de **configurações de exibição** ⚙.
- **Canto inferior direito:** **G** alterna a grade, **S** alterna o encaixe na grade; o **rótulo de unidades** mostra as unidades ativas e abre as configurações ao clicar.

### Painel de exibição

Abre com o botão ⚙. Duas linhas de caixas de seleção:

- **Resultados:** *Forma deformada*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, *Reações*.
- **Modelo:** *Apoios*, *Cargas*, *Rótulos dos nós*, *Rótulos dos elementos*.

**Mais configurações** abre o [diálogo de configurações](/pt/essentials/units-settings) completo.

### Navegação

| Ação | Mouse / toque |
| --- | --- |
| Zoom | Roda do mouse (em direção ao cursor), <kbd>Ctrl</kbd>+<kbd>=</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd>; pinça em telas sensíveis ao toque |
| Panorâmica | Arrastar com o botão **do meio ou direito** (configurável em *Configurações → Controles e atalhos*); arrastar com um dedo em telas sensíveis ao toque |
| Ajustar / centralizar | <kbd>F</kbd> / <kbd>C</kbd> ou os botões do canto superior direito |

### Selecionar e editar

- **Clique** em um nó, elemento, carga ou linha de cota para selecioná-lo. A barra inferior pula para a aba correspondente e um pequeno **menu de contexto** aparece ao lado da seleção com as ações disponíveis (por exemplo *Adicionar carga*, *Apoios do nó*, *Editar elemento*, *Matriz de rigidez*, *Excluir*).
- **Arraste sobre a tela vazia** para desenhar um retângulo de seleção. Tudo dentro dele — nós, elementos, suas cargas e cotas — é selecionado. <kbd>Delete</kbd> exclui tudo; <kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>V</kbd> copia e cola em outro lugar.
- **Arraste um nó** para movê-lo. Com o encaixe ativado ele cai na grade. Os elementos conectados e suas cargas acompanham.
- **Clique duplo em uma carga** para editá-la.
- **Passe o mouse** sobre qualquer item para ver uma dica: nós mostram deslocamentos e rotação, elementos mostram material e seção, cargas mostram suas componentes.
- **Clique com o botão direito na tela vazia** para abrir o menu da tela: *Adicionar nó*, *Adicionar elemento*, *Adicionar cota*, *Editar* (abre uma tabela da seleção atual), *Copiar*, *Colar*, *Excluir*. Segure <kbd>Ctrl</kbd> ao escolher *Adicionar nó* / *Adicionar elemento* para posicioná-los com o mouse em vez de um diálogo.

Todos os atalhos estão na página [Teclado e mouse](/pt/reference/shortcuts).

### Avisos

Mensagens aparecem no canto superior esquerdo da visualização quando algo está errado: *Nenhum material definido.* / *Nenhuma seção definida.* (com um botão **Adicionar**) ou *Model has N error(s)*, com um botão **Show details** que lista cada problema. Veja [Solução de problemas](/pt/reference/troubleshooting).

## Barra inferior

Seis abas, cada uma com um contador, uma barra de ferramentas e uma tabela editável. Arraste o divisor acima da barra para redimensioná-la, ou minimize-a com o botão à direita.

| Aba | Barra de ferramentas | Tabela |
| --- | --- | --- |
| **Nós** | Adicionar nó (diálogo), Adicionar com o mouse | Rótulo, X, Z, caixas **GLs restringidos**, cargas no nó, excluir |
| **Elementos** | Adicionar elemento (diálogo), Adicionar com o mouse | Rótulo, tipo, nó inicial/final (+ *Inverter nós*), material, seção, **Rótulas de extremidade**, cargas no elemento, matriz de rigidez, excluir |
| **Cargas** | Adicionar carga nodal, Adicionar carga de elemento | Tipo, alvo, componentes editáveis, excluir |
| **Materiais** | Adicionar material, Biblioteca de materiais | Rótulo, E, G, α<sub>T</sub>, excluir |
| **Seções** | Adicionar seção, Biblioteca de seções | Rótulo, A, I<sub>y</sub>, h, k, excluir |
| **Resultados** | Alternância Resultados nodais / Resultados dos elementos | Deslocamentos e rotações por nó, ou esforços de extremidade por elemento |

As células são editadas no lugar — clique, digite, pressione <kbd>Enter</kbd> (ou <kbd>Esc</kbd> para sair da célula). Os valores são mostrados e digitados nas [unidades atuais](/pt/essentials/units-settings).

## Abas acima da visualização

A aba **Estrutura** está sempre presente. Abrir as configurações adiciona ao lado uma aba **Configurações** que pode ser fechada, para ajustar cores ou unidades sem perder o modelo de vista.

## Janelas flutuantes

Algumas ações abrem janelas arrastáveis sobre a visualização: **Matriz de rigidez** (no menu de contexto de um elemento ou na linha da tabela) mostra a matriz de rigidez 6 × 6 do elemento em coordenadas locais e globais; **Editar** no menu da tela abre uma tabela da seleção atual. Feche-as com o ×.
