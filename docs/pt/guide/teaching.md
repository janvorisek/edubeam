# Ensinar com o EduBeam

O <Edubeam /> nasceu em uma sala de aula, e é lá que ele ainda funciona melhor: um modelo no projetor que reage no instante em que você o altera, e o mesmo modelo no notebook de cada aluno por meio de um link. Esta página reúne o que os professores mais usam.

## Na aula {#in-the-lecture}

- **Torne tudo legível do fundo da sala.** Em *Configurações → Configurações de visualização*, aumente o **Tamanho da fonte** para 18–20 px e o **Tamanho dos apoios** para 130–150 %. Aumente a **Escala de resultados** se os diagramas parecerem tímidos numa tela grande.
- **Mostre uma coisa de cada vez.** Desmarque tudo nas opções de exibição, exceto a grandeza de que você está falando, e depois acrescente as outras uma a uma.
- **Altere o modelo ao vivo.** Arraste um apoio, marque `Ry`, adicione uma rótula. Os alunos veem causa e efeito na hora, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> leva você de volta.
- **Deixe o solver explicar os mecanismos.** Libere uma rótula a mais e o EduBeam faz oscilar o contorno tracejado do mecanismo e circula as rótulas responsáveis. É um bom momento para discutir estabilidade.
- **Use o idioma e os eixos dos alunos.** Escolha o idioma da interface, unidades SI ou americanas e eixos com z para baixo ou y para cima, de acordo com suas notas de aula.

![Um mecanismo à vista: as rótulas em B e C deixam o pórtico se deslocar lateralmente](/screenshots/pt/ui-mechanism.webp)

## Em notas de aula e exercícios {#in-lecture-notes-and-assignments}

Um link de compartilhamento contém o modelo inteiro, então funciona em qualquer lugar onde um link funcione: um PDF, um slide, uma página do AVA, um e-mail.

1. Monte o modelo e clique em **Compartilhar modelo → Copiar**.
2. Cole o link nas suas notas. Links de versões antigas do EduBeam continuam funcionando, então as notas permanecem válidas ano após ano.
3. Os alunos que o abrem recebem uma cópia própria para experimentar. Nada do que eles alteram chega até você ou a outros alunos.

Variantes úteis de link:

| Link | Abre |
| --- | --- |
| `https://run.edubeam.app/?model=…` | O modelo, pronto para editar |
| `https://run.edubeam.app/?viewer=1&model=…` | O modelo no [modo de visualização](/pt/essentials/import-export#embed-a-read-only-viewer), para incorporar em um `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | A galeria de exemplos |
| `https://run.edubeam.app/?lang=pt` | O aplicativo em português (ou em qualquer [outro código de idioma](/pt/essentials/import-export#url-parameters)) |

::: warning Abrir um link substitui o modelo do próprio aluno
O modelo que ele tinha vai para **☰ → Estruturas recentes** e pode ser restaurado, e uma mensagem avisa isso. Mesmo assim, peça aos alunos que salvem o trabalho importante com **Salvar projeto** antes de abrir links da aula.
:::

## Exercícios que os alunos podem conferir sozinhos {#assignments-students-can-check-themselves}

O EduBeam dá aos alunos um retorno imediato sobre seus cálculos manuais sem entregar o método:

- Peça as reações, os esforços internos e um deslocamento calculados à mão e depois peça que os alunos montem o modelo e comparem. [Conferir resultados à mão](/pt/guide/verification) traz fórmulas prontas.
- Pergunte *por que* um resultado difere: deformação por cisalhamento, uma rótula faltando, uma carga em eixos locais em vez de globais.
- Peça que os alunos entreguem um link de compartilhamento ou um `project.json` junto com o cálculo. Você pode abri-lo e ver exatamente o que eles modelaram.
- Para relatórios, os alunos podem exportar o desenho em **SVG** (nítido no Word e no LaTeX) e os resultados em **CSV**.

## Exercícios prontos {#ready-made-exercises}

- A página de [Exemplos](/pt/examples/) tem seis modelos, cada um com exercícios sugeridos.
- Os tutoriais do [pórtico triarticulado](/pt/tutorials/three-hinged-frame) e da [treliça plana](/pt/tutorials/truss) são exemplos completos resolvidos, com conferência à mão.
- O [Início rápido](/pt/guide/quick-start) serve como roteiro para a primeira aula de laboratório: leva cerca de dez minutos.

## Primeiros passos dos alunos {#getting-students-started}

Novos usuários veem uma janela de boas-vindas com duas opções guiadas: **Fazer um tour** (um passeio pela interface) e **Desenhar sua primeira viga** (uma tarefa de sete passos com o mouse). Ambas também estão no menu ☰. Muitos professores simplesmente dizem “abram run.edubeam.app e escolham *Desenhar sua primeira viga*” no início da primeira aula de laboratório.

## Uso offline e computadores de laboratório {#offline-and-lab-computers}

O EduBeam é um aplicativo web progressivo (PWA). Depois que um computador o carrega, ele continua funcionando sem conexão, e o navegador pode oferecer instalá-lo. Modelos e configurações são guardados por perfil do navegador, então, em computadores de laboratório compartilhados, os alunos devem salvar o trabalho como arquivos ou links.
