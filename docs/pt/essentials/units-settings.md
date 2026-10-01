# Unidades e configurações

Abra as configurações com o **botão ⚙ da visualização → Mais configurações**, clicando no **rótulo de unidades** no canto inferior direito da visualização ou pela aba **Configurações** acima da visualização. As configurações ficam salvas no navegador e sobrevivem a recarregamentos; **Redefinir configurações** restaura os padrões de visualização e as unidades da sua região (o idioma é mantido).

## Idioma e localidade

**Idioma**: 11 idiomas de interface. Você também pode abrir o aplicativo com `?lang=<código>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Sistema de unidades**: *SI (métrico)* ou *Americano (imperial)* define todas as unidades abaixo de uma só vez. Se depois você mudar qualquer unidade individual, o sistema aparece como *Personalizado*. No primeiro acesso, o EduBeam começa em unidades americanas se o navegador estiver configurado com a localidade dos EUA *e* o computador estiver em um fuso horário dos EUA, e em SI em todos os outros casos.

**Unidades**: cada grandeza tem sua própria unidade. Entradas, tabelas, dicas e rótulos dos diagramas usam a unidade escolhida, e mudar a unidade converte o que é exibido (o modelo é armazenado internamente em SI, então alternar não perde nada, e um link compartilhado abre o mesmo modelo em quaisquer unidades).

| Grandeza | Opções | SI | Americano |
| --- | --- | --- | --- |
| Comprimento (geometria) | m, cm, mm, ft, in | m | ft |
| Dimensões da seção | m, cm, mm, ft, in | m | in |
| Deslocamento | m, cm, mm, ft, in | m | in |
| Área | m², cm², mm², ft², in² | m² | in² |
| Segundo momento de área | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Massa | kg, lb | kg | lb |
| Força | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Momento fletor | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Tensão (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatura | °C, °F | °C | °F |

Cargas distribuídas usam *força / comprimento* nas unidades escolhidas (kN/m em SI, kip/ft em unidades americanas), e a densidade usa *massa / comprimento³*. O coeficiente de dilatação térmica segue a unidade de temperatura (1/K ou 1/°F). Cargas de temperatura são *variações* de temperatura, então 10 °C equivalem a 18 °F. Rotações são sempre em radianos.

Tonf é a tonelada-força métrica (1000 kgf), não a tonelada curta americana. As unidades americanas são convertidas com suas definições exatas (1 ft = 0,3048 m, 1 kip = 4448,2216 N).

**Sistema de coordenadas** — *x para a direita, z para baixo* (padrão) ou *x para a direita, y para cima*. A opção y para cima inverte o sinal dos valores verticais e dos ângulos de apoio e renomeia os eixos em todas as entradas, tabelas, dicas e exportações; o modelo e os arquivos salvos não mudam. Veja [Eixo y para cima](/pt/elements/conventions#y-up-axes).

## Configurações de visualização

Uma **Pré-visualização** no topo mostra um modelo pequeno que reage a cada alteração abaixo.

**Grade**
- **Mostrar grade** (<kbd>G</kbd>): desenha a grade e as réguas.
- **Encaixar na grade** (<kbd>S</kbd>): nós posicionados ou arrastados com o mouse encaixam no passo da grade.
- **Passo do encaixe na grade**: espaçamento na unidade de comprimento (padrão 0,1 m, ou 0,5 ft em unidades americanas). Ao alternar entre unidades métricas e americanas, um passo deixado no padrão passa para o padrão do outro sistema; um passo definido por você é mantido. As réguas também contam na unidade de comprimento; em pés, as réguas e a mira mostram pés e polegadas (5′-6″), enquanto entradas e tabelas mantêm pés decimais (5,5).

**Rótulos de resultados**
- **Orientação dos rótulos de resultados**: *Perpendicular ao diagrama* (os rótulos seguem o diagrama) ou *Sempre horizontais*.

**Tamanhos**
- **Escala de resultados** (0–120 px): altura na tela da maior ordenada dos diagramas / da maior flecha. Os diagramas são normalizados pelo próprio máximo, então é um ajuste puramente visual; altere-o quando os diagramas estiverem grandes ou pequenos demais para o modelo.
- **Tamanho dos apoios** (0,5–1,5) e **Tamanho da fonte** (10–20 px).

**Cores**: cores individuais para nós, elementos, cargas, forma deformada, esforço normal, esforço cortante, momento fletor e reações. Padrão: N azul, V verde, M vermelho, reações roxo, cargas laranja.

## Controles e atalhos

**Panorâmica com**: qual botão do mouse desloca a tela: *do meio ou direito* (padrão), *Roda do mouse* (apenas botão do meio) ou apenas *Botão direito*. A lista completa de atalhos está na página [Teclado e mouse](/pt/reference/shortcuts).

## O que é salvo automaticamente

Além das configurações, o EduBeam guarda o **modelo atual** no armazenamento local do navegador após cada alteração. Recarregar a aba ou reabrir o aplicativo o restaura. Isso vale por navegador e por dispositivo — para levar um modelo a outro lugar use [Salvar projeto ou Compartilhar modelo](/pt/essentials/import-export).
