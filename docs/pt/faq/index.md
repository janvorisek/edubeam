# Perguntas frequentes

## Geral {#general}

### O que é o EduBeam? {#what-is-edubeam}

Um solver gratuito, de código aberto e executado no navegador para vigas, pórticos e treliças 2D, voltado a estudantes, professores e engenheiros que querem um retorno imediato. Veja a [Introdução](/pt/guide/introduction).

### É gratuito mesmo? Preciso de cadastro? {#is-it-really-free-do-i-need-an-account}

Sim, e não. Abra [run.edubeam.app](https://run.edubeam.app/?lang=pt) e comece a modelar. Não há contas, instaladores nem limites de uso. O código-fonte está no [GitHub](https://github.com/janvorisek/edubeam).

### Quais navegadores e dispositivos funcionam? {#which-browsers-and-devices-work}

Qualquer versão atual do Chrome, Edge, Firefox ou Safari. Tablets e celulares funcionam: toque para selecionar ou posicionar, arraste um nó para movê-lo, arraste em outro lugar para a panorâmica, faça pinça para o zoom, e toque e segure para abrir o menu da tela. Com mouse e teclado, porém, a modelagem continua mais rápida. Veja [Teclado, mouse e toque](/pt/reference/shortcuts#touch).

### Perdi meu modelo. Consigo recuperá-lo? {#i-lost-my-model-can-i-get-it-back}

Provavelmente. Limpar o modelo, ou abrir um link, um arquivo ou um exemplo por cima dele, guarda o antigo em **☰ → Estruturas recentes** (os últimos 10), e <kbd>Ctrl</kbd>+<kbd>Z</kbd> desfaz a substituição. Ambos ficam apenas no seu navegador.

### Posso usar offline? {#can-i-use-it-offline}

O EduBeam é um aplicativo web progressivo: depois de carregado, continua funcionando sem conexão, e o navegador pode oferecer instalá-lo. Quando há uma nova versão disponível, um diálogo pergunta antes de atualizar.

### Onde meus dados ficam armazenados? {#where-is-my-data-stored}

Apenas no seu navegador. Os modelos nunca são enviados a um servidor; o link de compartilhamento *é* o modelo. Veja [Importar, exportar e compartilhar](/pt/essentials/import-export).

## Modelagem {#modelling}

### Como faço um engaste / apoio fixo / apoio móvel? {#how-do-i-make-a-fixed-pinned-roller-support}

Clique no nó, abra **Apoios do nó** e escolha o símbolo: apoio fixo, apoio móvel, engaste, engaste deslizante e outros. Ou marque os GLs: **Dx + Dz + Ry** = engaste, **Dx + Dz** = apoio fixo, **Dz** = apoio móvel. Todas as combinações estão em [Nós e apoios](/pt/essentials/nodes-supports#supports).

### Como modelo uma treliça? {#how-do-i-make-a-truss}

Use elementos de viga e marque **as duas Rótulas de extremidade** de cada barra na aba *Elementos*, ou marque *Rótula no início* e *Rótula no fim* na faixa antes de desenhar as barras com o mouse. Aplique as cargas nos nós. O [tutorial da treliça](/pt/tutorials/truss) mostra um exemplo completo.

### Como coloco uma rótula em um pórtico? {#how-do-i-put-a-hinge-in-a-frame}

Marque a **Rótula no fim** (ou no início) do elemento do lado do nó em que o momento deve ser liberado. Rotular *um* elemento em um nó libera apenas esse elemento.

### Como adiciono um apoio ou uma carga concentrada no meio de uma viga? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Adicione um nó sobre a viga com *Adicionar com o mouse* e escolha **Conectar à estrutura** — a viga é dividida em duas. Para uma carga concentrada isolada você nem precisa de um nó: use uma carga de elemento do tipo **Carga concentrada** com uma posição.

### Posso aplicar o peso próprio? {#can-i-apply-self-weight}

Não automaticamente. Informe-o como uma carga distribuída uniforme $f_z = \rho g A$.

### Posso modelar apoios inclinados? {#can-i-model-inclined-supports}

Sim — defina um **Ângulo do SCL nodal** no nó; os GLs dele passam a ser interpretados no sistema girado.

### Existem casos ou combinações de carga? {#are-there-load-cases-or-combinations}

Não, apenas um caso de carga. Modele cada caso separadamente e salve-o ou compartilhe-o.

### Por que minhas cargas apontam para cima? {#why-do-my-loads-point-up}

Porque o eixo global z aponta **para baixo**: um `Fz` positivo é para baixo. Veja as [convenções](/pt/elements/conventions). Se preferir um eixo vertical apontando para cima, mude para eixos com y para cima em *Configurações → Idioma e localidade → Sistema de coordenadas*.

## Resultados {#results}

### Por que não há um botão “Calcular”? {#why-is-there-no-solve-button}

O modelo é resolvido automaticamente após cada alteração. Se nenhum resultado aparece, o modelo ainda não pode ser resolvido — [Solução de problemas](/pt/reference/troubleshooting) lista o que verificar.

### Por que minha flecha difere ligeiramente da fórmula? {#why-does-my-deflection-differ-slightly-from-the-formula}

O EduBeam usa vigas de Timoshenko, então as flechas incluem a deformação por cisalhamento. Em barras esbeltas a diferença fica bem abaixo de 1 %. Detalhes e comparações resolvidas em [Conferir resultados à mão](/pt/guide/verification).

### Quão precisos são os resultados? Preciso de mais elementos? {#how-accurate-are-the-results-do-i-need-more-elements}

Na análise estática linear, o elemento de viga é exato para os tipos de carga disponíveis, então um elemento por barra basta. Nós extras só são necessários onde você quer um apoio, uma rótula, uma mudança de seção ou um nó para aplicar uma carga.

### Onde as reações são listadas? {#where-are-the-reactions-listed}

Na visualização, como setas com valores (**Reações** nas opções de exibição, ligadas por padrão). Elas também estão no arquivo gerado por **Resultados → Exportar CSV** e em **Copiar**. Os deslocamentos nodais e os esforços de extremidade dos elementos estão na aba **Resultados**.

## Arquivos e compartilhamento {#files-sharing}

### Como compartilho um modelo? {#how-do-i-share-a-model}

**Compartilhar modelo** → **Copiar**. O link contém o modelo inteiro. Os destinatários recebem uma cópia própria editável; não há colaboração em tempo real. Veja também [Ensinar com o EduBeam](/pt/guide/teaching).

### Posso incorporar um modelo no meu site ou em slides? {#can-i-embed-a-model-on-my-website-or-in-slides}

Sim: acrescente `&viewer=1` a um link de compartilhamento e coloque-o em um `<iframe>`. Veja [Incorporar um visualizador](/pt/essentials/import-export#embed-a-read-only-viewer).

### Posso exportar imagens ou tabelas? {#can-i-export-images-or-tables}

Sim. **☰ → Exportar imagem** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva o desenho em PNG ou SVG, no tamanho ou na escala que você escolher. **Resultados → Exportar CSV** salva as duas tabelas de resultados, e **Copiar** as coloca na área de transferência para uma planilha. Veja [Importar, exportar e compartilhar](/pt/essentials/import-export#export-an-image).

### Posso gerar modelos por programação? {#can-i-generate-models-programmatically}

Sim. O arquivo de projeto é JSON simples em unidades SI — veja a [descrição do formato](/pt/essentials/import-export#project-file-format) — e pode ser aberto com *Abrir projeto* ou arrastando e soltando.

## Suporte {#support}

### Como relato um erro ou peço um recurso? {#how-do-i-report-a-bug-or-request-a-feature}

Abra uma issue no [GitHub](https://github.com/janvorisek/edubeam/issues) e anexe um link de compartilhamento ou um arquivo de projeto que reproduza o problema. Suporte privado: [support@edubeam.app](mailto:support@edubeam.app).
