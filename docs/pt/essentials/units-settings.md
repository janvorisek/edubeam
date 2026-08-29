# Unidades e configurações

Abra as configurações com o **botão ⚙ da visualização → Mais configurações**, clicando no **rótulo de unidades** no canto inferior direito da visualização ou pela aba **Configurações** acima da visualização. As configurações ficam salvas no navegador e sobrevivem a recarregamentos; **Redefinir configurações** restaura os padrões de visualização (idioma e unidades são mantidos).

## Idioma e localidade

**Idioma**: 11 idiomas de interface. Você também pode abrir o aplicativo com `?lang=<código>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Unidades**: cada grandeza tem sua própria unidade. Entradas, tabelas, dicas e rótulos dos diagramas usam a unidade escolhida, e mudar a unidade converte o que é exibido (o modelo é armazenado internamente em SI, então alternar não perde nada).

| Grandeza | Opções | Padrão |
| --- | --- | --- |
| Comprimento | m, cm, mm, in, ft | m |
| Área | m², cm², mm², in², ft² | m² |
| Segundo momento de área | m⁴, cm⁴, mm⁴, in⁴, ft⁴ | m⁴ |
| Massa | kg, lb | kg |
| Força | N, kN, MN, lbf, tonf, kgf | kN |
| Momento fletor | Nmm, Nm, kNm, MNm, tonf·m, lbf·in, lbf·ft | kNm |
| Tensão (E, G) | Pa, kPa, MPa, GPa, psi, ksc | MPa |

Cargas distribuídas usam *força / comprimento* nas unidades escolhidas (kN/m por padrão). Ângulos são sempre em radianos e temperaturas sempre em °C/K.

::: tip Unidades imperiais
Escolha ft (ou in), in², in⁴, lbf e psi conforme a necessidade — não há um único interruptor «imperial»; cada grandeza é definida separadamente.
:::

## Configurações de visualização

Uma **Pré-visualização** no topo mostra um modelo pequeno que reage a cada alteração abaixo.

**Grade**
- **Mostrar grade** (<kbd>G</kbd>): desenha a grade e as réguas.
- **Encaixar na grade** (<kbd>S</kbd>): nós posicionados ou arrastados com o mouse encaixam no passo da grade.
- **Passo do encaixe na grade**: espaçamento em metros (padrão 0,1).

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
