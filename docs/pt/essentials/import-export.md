# Importar, exportar e compartilhar

Tudo no <Edubeam /> acontece no seu navegador. Nada é enviado a um servidor: um link de compartilhamento contém literalmente o modelo.

## Salvar um projeto {#save-a-project}

**☰ → Salvar projeto** ou <kbd>Ctrl</kbd>+<kbd>S</kbd> baixa `project.json`. Ele contém os nós, os elementos, os materiais, as seções (com as formas poligonais), as cargas, as linhas de cota e a versão do aplicativo que o gravou. Renomeie o arquivo à vontade.

## Abrir um projeto {#open-a-project}

- **☰ → Abrir projeto** ou <kbd>Ctrl</kbd>+<kbd>O</kbd> e escolha um arquivo `.json`, ou
- **arraste o arquivo para qualquer lugar da janela do aplicativo**.

Abrir substitui o modelo atual, inclusive materiais e seções. O modelo que você tinha não se perde: <kbd>Ctrl</kbd>+<kbd>Z</kbd> o traz de volta, e ele fica guardado em [Estruturas recentes](#recent-structures). Um arquivo que não é um projeto do EduBeam é recusado com uma mensagem, e o seu modelo permanece como estava.

Arquivos de projeto de todas as versões anteriores do EduBeam abrem na versão atual.

## Compartilhar um link {#share-a-link}

**Compartilhar modelo** (na barra superior ou no menu ☰) abre o diálogo *Compartilhar modelo por URL*:

![O diálogo de compartilhamento](/screenshots/pt/share.webp){.shot-lg}

- **Copiar** copia o link para a área de transferência. Clicar dentro do campo faz o mesmo.
- **Abrir link** abre o link em uma nova aba, para que você confira o que o destinatário verá.
- **Compartilhar via diálogo do sistema** entrega o link ao menu de compartilhamento do seu dispositivo, quando o navegador permite.

O link tem a forma `https://run.edubeam.app/?model=…` e codifica o modelo inteiro. Quem o abre recebe uma cópia própria para editar; as edições **não** são sincronizadas de volta, então envie um novo link quando o modelo mudar. Modelos muito grandes geram links muito longos; nesses casos, compartilhe o arquivo JSON.

Quando alguém abre um link, o modelo anterior dessa pessoa vai para Estruturas recentes, e uma mensagem diz onde encontrá-lo.

Links de versões antigas continuam funcionando: um link nas notas de aula do ano passado abre o mesmo modelo hoje.

## Exportar uma imagem {#export-an-image}

**☰ → Exportar imagem** ou <kbd>Ctrl</kbd>+<kbd>P</kbd> abre a exportação de imagem.

![Exportar imagem: escolha as camadas, o enquadramento e o tamanho, depois baixe ou copie](/screenshots/pt/export-image.webp)

- **Camadas**: as etiquetas no topo escolhem o que é desenhado, independentemente da visualização: forma deformada, N, V, M, reações, apoios, cargas, rótulos dos nós e dos elementos.
- **Enquadramento**: escolha uma proporção (16:9, 4:3, 3:2, 1:1), **Ajustar tudo** ou **Janela…** para arrastar um retângulo sobre o desenho. Você também pode arrastar as bordas da pré-visualização.
- **Tamanho**: largura e altura em pixels, ou uma **Escala** como 1 : 50 para um desenho em escala no papel. **Altura dos diagramas** define o tamanho dos diagramas de resultados na imagem. **Fundo transparente** remove o branco.
- **Baixar PNG**, **Baixar SVG** ou **Copiar para a área de transferência**.

O SVG fica nítido em qualquer tamanho e funciona no Word, no Inkscape e no LaTeX do Overleaf, o que o torna a melhor escolha para relatórios e trabalhos de conclusão.

## Exportar os resultados {#export-the-results}

**Resultados → Exportar CSV** baixa as duas tabelas de resultados, incluindo as reações, e **Copiar** as coloca na área de transferência para uma planilha. Veja [Exportar CSV e Copiar](/pt/essentials/results#export-csv-and-copy).

## Estruturas recentes {#recent-structures}

**☰ → Estruturas recentes** guarda os últimos 10 modelos que foram limpos ou substituídos por um link, um arquivo, um exemplo ou a tarefa da primeira viga. Cada um mostra uma miniatura, o motivo da substituição e seu tamanho. **Restaurar** traz um deles de volta; o modelo que você tinha passa, por sua vez, para a lista, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> desfaz a restauração.

![Estruturas recentes](/screenshots/pt/recent.webp){.shot-lg}

A lista fica guardada apenas neste navegador.

## Exemplos {#examples}

**☰ → Exemplos** abre uma galeria de modelos didáticos prontos. Abrir um deles substitui o seu modelo, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> traz o seu de volta. Os mesmos modelos, com exercícios, estão na página [Exemplos](/pt/examples/) deste guia.

![A galeria de exemplos](/screenshots/pt/examples.webp){.shot-lg}

## Incorporar um visualizador {#embed-a-read-only-viewer}

Acrescente `&viewer=1` a um link de compartilhamento para abrir o modelo no **modo de visualização**. A barra superior, a barra inferior, as abas, desfazer e refazer, os botões da grade e o indicador de eixos ficam ocultos, restando a tela, os botões de ajustar e centralizar e as opções de exibição. Coloque essa URL em um `<iframe>` para incorporar um modelo vivo, com zoom, em notas de aula ou em uma página web:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![O pórtico triarticulado no modo de visualização](/screenshots/pt/viewer-mode.webp){.shot-lg}

O modo de visualização serve para olhar, mas não é bloqueado: os visitantes ainda podem arrastar nós e alternar diagramas. Abrir um link de visualização também substitui o modelo do próprio visitante naquele navegador (ele vai para Estruturas recentes), exatamente como um link normal.

## Parâmetros de URL {#url-parameters}

| Parâmetro | Efeito |
| --- | --- |
| `model=<dados>` | Carrega o modelo codificado e o ajusta à tela. |
| `viewer=1` | Modo de visualização (veja acima). |
| `lang=<código>` | Troca o idioma da interface: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`. |
| `panel=examples` | Abre a galeria de exemplos imediatamente. |

Depois de lê-los, o EduBeam remove os parâmetros da barra de endereço.

## Persistência automática {#automatic-persistence}

O modelo atual e as suas configurações são salvos no armazenamento local do navegador após cada alteração e restaurados quando você volta, mesmo depois de fechar o navegador. É uma conveniência, não um backup: pertence a um perfil de navegador em um dispositivo, e limpar os dados do site o remove. Salve trabalhos importantes como arquivo de projeto.

## Formato do arquivo de projeto {#project-file-format}

`project.json` é JSON simples e legível:

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Esta é a viga do Início rápido. Todos os valores estão em **unidades SI** (m, N, Pa, rad), independentemente das unidades exibidas. As coordenadas são `[x, y, z]`, com y sempre igual a 0. As condições de contorno e as componentes das cargas usam os identificadores de GL `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` da carga de elemento | Valores |
| --- | --- |
| `udl` | `values: [fx, fz]` em N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` em N/m, eixos locais |
| `concentrated` | `values: [Fx, Fz, My, a]` em N, N·m e m a partir do nó inicial |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` em K; o gradiente é ΔTb − ΔTt |

As cargas nodais são `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }` e os deslocamentos prescritos `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; informe as três componentes. Os arquivos gravados pelo aplicativo também trazem `date`, `commit`, um `lcs` nodal e as formas poligonais em `shape`.

Como o formato é simples, você pode gerar modelos com um script ou uma planilha e abri-los com **Abrir projeto**.
