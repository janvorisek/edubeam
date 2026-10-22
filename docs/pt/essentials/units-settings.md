# Unidades e configurações

Há três caminhos para as configurações:

- a aba **Configurações** acima da visualização, que as mostra em tamanho inteiro;
- o **indicador de unidades** no canto inferior direito da visualização, que as abre em *Idioma e localidade*;
- **Mais configurações**, abaixo das opções de exibição, que as abre em *Configurações de visualização*.

As configurações ficam salvas no navegador e sobrevivem a recarregamentos. **Redefinir configurações** restaura os padrões de visualização, o formato numérico, os eixos, o botão de panorâmica e as unidades da sua região; o idioma é mantido.

## Idioma e localidade {#language-locale}

![Configurações → Idioma e localidade](/screenshots/pt/settings-language.webp)

**Idioma.** 12 idiomas de interface. Você também pode abrir o aplicativo com `?lang=<código>`: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`.

**Formato numérico.** Como os valores dos resultados são escritos: *Automático*, *Científico* (padrão) ou *Engenharia*. Veja [Formato numérico](/pt/essentials/results#number-format).

**Sistema de coordenadas.** *x para a direita, z para baixo* (padrão) ou *x para a direita, y para cima*. A opção com y para cima inverte o sinal dos valores verticais e dos ângulos de apoio e renomeia os eixos em todas as entradas, tabelas, dicas e exportações. O modelo e os arquivos salvos não mudam. Veja [Eixos com y para cima](/pt/elements/conventions#y-up-axes).

![O pórtico triarticulado com eixos y para cima: o indicador de eixos no canto aponta y para cima](/screenshots/pt/settings-y-up.webp){.shot-lg}

**Sistema de unidades.** *SI (métrico)* ou *Americano (imperial)* define todas as unidades abaixo de uma só vez. Se depois você mudar qualquer unidade individual, o sistema aparece como *Personalizado*. Na primeira visita você escolhe na janela de boas-vindas; antes disso, o EduBeam só presume unidades americanas se o navegador estiver configurado com uma localidade dos EUA *e* o computador estiver em um fuso horário dos EUA.

**Unidades.** Cada grandeza tem sua própria unidade. Entradas, tabelas, dicas e rótulos dos diagramas usam a unidade escolhida, e mudar uma unidade converte o que é exibido. O próprio modelo é armazenado em SI, então alternar de um lado para o outro não perde nada, e um link compartilhado abre o mesmo modelo em quaisquer unidades.

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

As cargas distribuídas usam *força / comprimento* das unidades escolhidas (kN/m em SI, kip/ft em unidades americanas), e a densidade usa *massa / comprimento³*. O coeficiente de dilatação térmica segue a unidade de temperatura (1/K ou 1/°F). As cargas térmicas são *variações* de temperatura, então 10 °C equivalem a 18 °F. As rotações são sempre em radianos.

Tonf é a tonelada-força métrica (1000 kgf), não a tonelada curta americana. As unidades americanas são convertidas com suas definições exatas (1 ft = 0,3048 m, 1 kip = 4448,2216 N). Em pés, digite valores decimais como `5,5`; as réguas e a mira mostram pés e polegadas (5′-6″).

## Configurações de visualização {#viewer-settings}

![Configurações → Configurações de visualização, com a pré-visualização ao vivo à direita](/screenshots/pt/settings-viewer.webp)

Uma **Pré-visualização** ao lado das configurações mostra um modelo pequeno que reage a cada alteração. As etiquetas abaixo dela escolhem qual resultado ela mostra, e clicar em uma cor muda a pré-visualização para esse resultado.

**Grade**
- **Mostrar grade** (<kbd>G</kbd>) desenha a grade e as réguas.
- **Encaixar na grade** (<kbd>S</kbd>) faz com que os nós que você posiciona ou arrasta se encaixem no passo da grade.
- **Mostrar mira** marca a posição do ponteiro nas réguas, para que você possa ler suas coordenadas (somente com mouse).
- **Passo do encaixe na grade** é o espaçamento na unidade de comprimento: 0,1 m por padrão, ou 0,5 ft em unidades americanas. Ao alternar entre unidades métricas e americanas, um passo deixado no padrão passa para o padrão do outro sistema; um passo definido por você é mantido.

**Tamanhos**
- **Escala de resultados** (8–120 px, padrão 48) é a altura na tela da maior ordenada dos diagramas ou da maior flecha. Os diagramas são escalados pelo próprio máximo, então o ajuste é puramente visual; altere-o quando os diagramas estiverem grandes ou pequenos demais.
- **Tamanho dos apoios** (50–150 %) e **Tamanho da fonte** (10–20 px). Fontes maiores ajudam no projetor.

**Orientação dos rótulos de resultados**: *Perpendicular ao diagrama* (os rótulos seguem o diagrama) ou *Sempre horizontais*.

**Verificação do modelo**
- **Mostrar como uma estrutura instável pode se mover** desenha o contorno tracejado de um mecanismo.
- **Animar o movimento** faz o contorno oscilar de um lado para o outro.

**Cores**: cores separadas para nós, elementos, cargas, forma deformada, esforço normal, esforço cortante, momento fletor e reações. Padrões: N azul, V verde, M vermelho, reações roxo, cargas laranja.

## Controles e atalhos {#controls-shortcuts}

**Panorâmica com** define qual botão do mouse desloca a tela: *Roda do mouse ou botão direito* (padrão), *Roda do mouse* ou *Botão direito*. A lista completa de atalhos está na página [Teclado, mouse e toque](/pt/reference/shortcuts).

## O que fica guardado no seu navegador {#what-is-stored-in-your-browser}

Além das configurações, o EduBeam guarda no armazenamento local do navegador:

- o **modelo atual**, salvo após cada alteração, de modo que recarregar a aba ou reabrir o aplicativo o restaura;
- **Estruturas recentes**: os últimos 10 modelos que você limpou ou substituiu.

Ambos valem por navegador e por dispositivo, e limpar os dados do site os remove. Use [Salvar projeto ou Compartilhar modelo](/pt/essentials/import-export) para guardar um modelo ou levá-lo para outro lugar.
