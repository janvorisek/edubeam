# Perguntas frequentes

## Geral

### O que é o EduBeam?

Um solver gratuito, de código aberto e executado no navegador para vigas, pórticos e treliças planos, voltado a estudantes, professores e engenheiros que querem resposta imediata. Veja a [Introdução](/pt/guide/introduction).

### É gratuito mesmo? Preciso de cadastro?

Sim, e não. Abra [run.edubeam.app](https://run.edubeam.app/?lang=pt) e comece a modelar. Não há contas, instaladores nem limites de uso. O código está no [GitHub](https://github.com/janvorisek/edubeam).

### Quais navegadores e dispositivos funcionam?

Qualquer Chrome, Edge, Firefox ou Safari atual. Tablets e celulares funcionam (toque, arrastar para panorâmica, pinça para zoom, pressionar e segurar para mover um nó), mas com mouse e teclado a modelagem é muito mais rápida.

### Posso usar offline?

O EduBeam é um aplicativo web progressivo: uma vez carregado, continua funcionando sem conexão, e o navegador pode oferecer a instalação. Quando há uma nova versão, um diálogo pergunta antes de atualizar.

### Onde meus dados ficam armazenados?

Apenas no seu navegador. Os modelos nunca são enviados a um servidor; o link compartilhado *é* o modelo. Veja [Importar, exportar e compartilhar](/pt/essentials/import-export).

## Modelagem

### Como faço um engaste / apoio fixo / apoio móvel?

Marque os GLs: **Dx + Dz + Ry** = engaste, **Dx + Dz** = apoio fixo, **Dz** = apoio móvel. Todas as combinações e seus símbolos estão em [Nós e apoios](/pt/essentials/nodes-supports#apoios).

### Como modelo uma treliça?

Use elementos de viga e marque **as duas Rótulas de extremidade** de cada barra na aba *Elementos*. Aplique as cargas nos nós. Veja [Elementos](/pt/essentials/elements#rotulas-de-extremidade).

### Como coloco uma rótula em um pórtico?

Marque a **Rótula de extremidade** do elemento do lado do nó onde o momento deve ser liberado. Rotular *um* elemento em um nó libera apenas esse elemento.

### Como adiciono um apoio ou uma carga concentrada no meio de uma viga?

Adicione um nó sobre a viga com *Adicionar com o mouse* e escolha **Conectar à estrutura** — a viga é dividida em duas. Para uma carga concentrada sozinha você nem precisa de nó: use a carga de elemento **Carga concentrada** com posição.

### Posso aplicar peso próprio?

Não automaticamente. Informe-o como carga distribuída uniforme $f_z = \rho g A$.

### Posso modelar apoios inclinados?

Sim — defina um **Ângulo do SCL nodal** no nó; seus GLs passam a ser interpretados no sistema girado.

### Existem casos ou combinações de carga?

Não, apenas um caso de carga. Modele cada caso separadamente e salve ou compartilhe.

### Por que minhas cargas apontam para cima?

Porque o eixo global z aponta **para baixo**: `Fz` positivo é para baixo. Veja a [convenção de sinais](/pt/elements/conventions).

## Resultados

### Por que não há botão «Calcular»?

O modelo é resolvido automaticamente após cada alteração. Se nenhum resultado aparecer, o modelo ainda não pode ser resolvido — a [Solução de problemas](/pt/reference/troubleshooting) lista o que verificar.

### Por que minha flecha difere um pouco da fórmula?

O EduBeam usa vigas de Timoshenko, então as flechas incluem a deformação por cisalhamento. Em barras esbeltas a diferença fica bem abaixo de 1 %. Detalhes e comparações resolvidas em [Conferir resultados à mão](/pt/guide/verification).

### Qual é a precisão dos resultados? Preciso de mais elementos?

Para a análise estática linear o elemento de viga é exato sob os tipos de carga suportados, então um elemento por barra basta. Nós extras só são necessários onde você quer um apoio, uma rótula, uma mudança de seção ou um nó para aplicar carga.

### Onde as reações são listadas?

Na visualização, como setas com valores (ative **Reações** no painel de exibição). Esforços de extremidade e deslocamentos nodais estão na aba **Resultados**.

## Arquivos e compartilhamento

### Como compartilho um modelo?

**Compartilhar modelo** → **Copiar link**. O link contém o modelo inteiro. Os destinatários recebem sua própria cópia editável; não há colaboração em tempo real.

### Posso incorporar um modelo no meu site ou em slides?

Sim — acrescente `&viewer=1` a um link compartilhado e coloque-o em um `<iframe>`. Veja [Incorporar um visualizador somente leitura](/pt/essentials/import-export#incorporar-um-visualizador-somente-leitura).

### Posso exportar imagens ou tabelas?

Ainda não. Use uma captura de tela para imagens e copie o texto da tabela para os números. Vote no recurso no [GitHub](https://github.com/janvorisek/edubeam/issues).

### Posso gerar modelos por programa?

Sim. O arquivo de projeto é JSON simples em unidades SI — veja a [descrição do formato](/pt/essentials/import-export#formato-do-arquivo-de-projeto) — e pode ser aberto com *Abrir projeto* ou arrastando.

## Suporte

### Como relato um erro ou solicito um recurso?

Abra uma issue no [GitHub](https://github.com/janvorisek/edubeam/issues) e anexe um link compartilhado ou arquivo de projeto que reproduza o problema. Suporte privado: [support@edubeam.app](mailto:support@edubeam.app).
