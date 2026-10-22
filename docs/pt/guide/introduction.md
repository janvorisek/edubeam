<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Desenvolvedor principal e designer do produto',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Solver MEF, autor do aplicativo original',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Introdução

<Edubeam /> é uma ferramenta gratuita, executada no navegador, para **análise estrutural 2D** de vigas, pórticos e treliças. Você desenha a estrutura, adiciona apoios e cargas, e o solver de elementos finitos recalcula tudo no instante em que algo muda. Não há botão *Calcular*, nem instalação, nem cadastro.

[Abra o EduBeam](https://run.edubeam.app/?lang=pt){target="_blank"} em uma nova aba e acompanhe o [Início rápido](/pt/guide/quick-start).

![Um pórtico triarticulado no EduBeam: cargas em laranja, reações em roxo, o momento fletor em vermelho e a deformada em cinza](/screenshots/pt/hero.webp)

## Sua primeira visita {#your-first-visit}

Na primeira vez que você abre o aplicativo, uma janela de boas-vindas pergunta como você quer começar e quais unidades e eixos prefere. Você pode mudar as duas coisas depois em [Configurações](/pt/essentials/units-settings).

![A janela de boas-vindas](/screenshots/pt/welcome.webp){.shot-lg}

- **Fazer um tour** mostra, um de cada vez, o menu, desfazer e refazer, os botões de visualização, as opções de exibição, a grade e as unidades e a barra inferior.
- **Desenhar sua primeira viga** é uma tarefa guiada de sete passos. Você desenha uma viga com o mouse, apoia, carrega e lê os resultados. Um pequeno cartão no canto diz o que fazer a seguir.
- **Abrir um exemplo** abre a galeria de modelos prontos.

As três opções também estão no **menu ☰**, então você pode voltar a elas a qualquer momento.

![Desenhar sua primeira viga: o cartão do guia fica no canto enquanto você trabalha](/screenshots/pt/first-beam-task.webp)

## O que ele faz {#what-it-does}

| Área | Recursos |
| --- | --- |
| **Estruturas** | Vigas, vigas contínuas, pórticos e treliças planos (x–z) formados por nós e elementos de viga 2D de Timoshenko. Rótulas de extremidade transformam qualquer barra em barra de treliça. |
| **Apoios** | Apoio fixo, apoio móvel, engaste, engaste deslizante e qualquer outra combinação de `Dx`, `Dz`, `Ry` restringidos, escolhida pelo símbolo. Apoios rotacionados por meio de um ângulo nodal. Recalques de apoio. |
| **Cargas** | Forças e momentos nodais, deslocamentos prescritos, cargas distribuídas uniformes e trapezoidais, forças e momentos concentrados ao longo de uma barra e temperatura uniforme ou com gradiente. |
| **Seções** | Bibliotecas de materiais e de seções (europeias e americanas), além de um editor de polígonos que calcula $A$, $I_y$, $I_z$, $I_{yz}$, eixos principais e raios de giração para qualquer forma. |
| **Resultados** | Forma deformada, esforço normal **N**, esforço cortante **V**, momento fletor **M**, reações, deslocamentos nodais, esforços de extremidade dos elementos e matrizes de rigidez dos elementos. |
| **Análise** | Análise estática linear com um caso de carga. Os resultados são exatos para o modelo linear, então não é preciso refinar a malha. Quando uma estrutura não pode ser resolvida, o EduBeam diz por quê e anima como ela pode se mover. |
| **Arquivos** | Salve e abra projetos em JSON, compartilhe um modelo inteiro como link, exporte o desenho em PNG ou SVG e os resultados em CSV. Modelos substituídos recentemente ficam guardados para que você possa recuperá-los. Tudo fica no seu dispositivo. |
| **Unidades** | SI ou sistema americano com um clique, ou cada grandeza separadamente. Eixos com x para a direita e z para baixo, ou x para a direita e y para cima. |

## O que ele (ainda) não faz {#what-it-does-not-do-yet}

Conhecer os limites de antemão poupa tempo:

- **Somente 2D.** Sem comportamento fora do plano, sem pórticos espaciais.
- **Somente estática linear.** Sem efeitos de segunda ordem (P–Δ), flambagem, dinâmica ou plasticidade.
- **Um caso de carga.** Não há combinações de carga nem envoltórias. Modele cada caso separadamente e salve cada um como arquivo ou link de compartilhamento próprio.
- **Sem peso próprio.** Aplique-o como carga distribuída se precisar.
- **Sem verificações normativas.** O EduBeam fornece esforços internos e deslocamentos; as verificações segundo norma ficam por sua conta.

Se um recurso que falta é importante para você, [abra uma issue](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## Para quem é? {#who-is-it-for}

- **Estudantes** de mecânica das estruturas que querem um retorno imediato sobre seus cálculos manuais. Veja [Conferir resultados à mão](/pt/guide/verification).
- **Professores** que mostram, ao vivo no projetor e em qualquer um dos 12 idiomas, como apoios, rótulas e cargas alteram os esforços internos. Veja [Ensinar com o EduBeam](/pt/guide/teaching).
- **Engenheiros** que querem uma verificação rápida antes de abrir um programa de desktop mais pesado.

## Como este guia está organizado {#how-this-guide-is-organised}

1. **Primeiros passos.** Esta página, o [Início rápido de 10 minutos](/pt/guide/quick-start) e os [Exemplos](/pt/examples/) prontos.
2. **Tutoriais.** Modelos completos do início ao fim, conferidos à mão: um [pórtico triarticulado](/pt/tutorials/three-hinged-frame) e uma [treliça plana](/pt/tutorials/truss).
3. **Modelagem.** Uma página por bloco: a [interface do usuário](/pt/essentials/user-interface), [nós e apoios](/pt/essentials/nodes-supports), [elementos, materiais e seções](/pt/essentials/elements), [cargas](/pt/essentials/loads) e [unidades e configurações](/pt/essentials/units-settings).
4. **Resultados.** Como [ler os diagramas e as tabelas](/pt/essentials/results) e como [conferi-los](/pt/guide/verification).
5. **Arquivos e compartilhamento.** [Projetos, links de compartilhamento, exportação de imagem e CSV](/pt/essentials/import-export) e [ensinar com o EduBeam](/pt/guide/teaching).
6. **Referência.** [Teclado, mouse e toque](/pt/reference/shortcuts), [solução de problemas](/pt/reference/troubleshooting) e as [perguntas frequentes](/pt/faq/).
7. **Manual teórico.** [Convenções de sinais](/pt/elements/conventions) e as formulações dos elementos de [viga](/pt/elements/beam) e de [treliça](/pt/elements/truss).

Os ícones **?** do aplicativo abrem a página correspondente deste guia no seu idioma.

## Idiomas {#languages}

A interface está disponível em English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Türkçe, Українська, ไทย e 汉语. O EduBeam escolhe o idioma pelo navegador. Altere-o em **Configurações → Idioma e localidade** ou abra o aplicativo com o parâmetro `?lang=`, por exemplo [run.edubeam.app/?lang=pt](https://run.edubeam.app/?lang=pt){target="_blank"}.

## Autores e créditos {#authors-credits}

<Edubeam /> é liderado por [Jan Voříšek](https://github.com/janvorisek), mantenedor e designer de produto da edição web moderna. A versão para navegador é desenvolvida de forma independente da ČVUT. O EduBeam de desktop original para Windows e Linux foi criado por [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) e [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) no Departamento de Mecânica da [Faculdade de Engenharia Civil da Universidade Técnica Tcheca de Praga (ČVUT)](https://www.fsv.cvut.cz/en). O solver é a biblioteca de código aberto [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Contribua {#contribute}

- Relate comportamentos confusos ou erros em uma [issue no GitHub](https://github.com/janvorisek/edubeam/issues).
- Melhore esta documentação ou as traduções editando os arquivos em `docs/` e abrindo um pull request.
- Compartilhe o EduBeam com colegas de turma e de trabalho.
