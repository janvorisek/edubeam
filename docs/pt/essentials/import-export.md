# Importar, exportar e compartilhar

Tudo no <Edubeam /> acontece no seu navegador. Nada é enviado a um servidor — um link compartilhado contém literalmente o modelo.

## Salvar um projeto

**Menu ☰ → Salvar projeto** ou <kbd>Ctrl</kbd>+<kbd>S</kbd> baixa `project.json`. Ele contém nós, elementos, materiais, seções, cargas, cotas e a versão do aplicativo que o gravou. Renomeie o arquivo à vontade.

## Abrir um projeto

- **Menu ☰ → Abrir projeto** ou <kbd>Ctrl</kbd>+<kbd>O</kbd> e escolha um arquivo `.json`, ou
- **arraste o arquivo para qualquer lugar da janela do aplicativo**.

Abrir substitui o modelo atual (inclusive materiais e seções). Use **Salvar projeto** antes se quiser mantê-lo.

## Compartilhar um link

**Compartilhar modelo** (🔗 na barra superior ou no menu ☰) abre o diálogo *Compartilhar modelo por URL*:

- **Copiar link**: copia o link para a área de transferência (ou clique dentro do campo).
- **Abrir link**: abre em uma nova aba para você ver o que o destinatário verá.
- **Compartilhar via diálogo do sistema**: em celulares e tablets, entrega o link ao menu de compartilhamento do sistema.

O link tem a forma `https://run.edubeam.app/?model=…` e codifica o modelo inteiro (nós, elementos, propriedades, cargas). Quem o abre recebe uma cópia exata para editar localmente; as edições **não** são sincronizadas de volta — envie um novo link quando o modelo mudar. Modelos muito grandes geram links muito longos; nesse caso compartilhe o arquivo JSON.

## Incorporar um visualizador somente leitura

Acrescente `&viewer=1` a um link compartilhado (ou `?viewer=1` a qualquer URL do aplicativo) para abrir o modelo em **modo visualizador**: a barra superior, a barra inferior, desfazer/refazer e o painel de configurações ficam ocultos e resta apenas a tela com o modelo. Coloque essa URL em um `<iframe>` para incorporar um modelo vivo, com zoom, em apostilas ou páginas web:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

A página de [Exemplos](/pt/examples/) é construída assim — cada cartão é um link com o parâmetro `?model=`.

## Parâmetros de URL

| Parâmetro | Efeito |
| --- | --- |
| `model=<dados>` | Carrega o modelo codificado, ajusta-o à tela e remove o parâmetro da barra de endereço. |
| `lang=<código>` | Troca o idioma da interface (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`). |
| `viewer=1` | Modo visualizador somente leitura (veja acima). |

## Persistência automática

O modelo atual e suas configurações são salvos no armazenamento local do navegador após cada alteração e restaurados quando você volta — mesmo depois de fechar o navegador. É uma conveniência, não um backup: fica vinculado a um perfil de navegador em um dispositivo, e limpar os dados do site o remove. Salve trabalhos importantes como arquivo de projeto.

## Formato do arquivo de projeto

`project.json` é JSON simples e legível:

```json
{
  "edubeam": true,
  "version": "1.0.6",
  "domain": {
    "materials": [ { "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 } ],
    "crossSections": [ { "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 } ],
    "nodes": [ { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] }, … ],
    "elements": [ { "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] } ],
    "loadCases": [ … ]
  }
}
```

Todos os valores são armazenados em **unidades SI** (m, N, Pa, rad), independentemente das unidades exibidas. As condições de contorno usam os identificadores de GL `0 = Dx`, `2 = Dz`, `4 = Ry`. Como o formato é simples, você pode gerar modelos com um script ou planilha e abri-los com **Abrir projeto**. O formato não é versionado como API estável — verifique o campo `version` se automatizar sobre ele.
