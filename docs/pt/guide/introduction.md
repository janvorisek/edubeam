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

<Edubeam /> é uma ferramenta gratuita, executada no navegador, para **análise estrutural de estruturas reticuladas planas**: vigas, pórticos e treliças. Você desenha a estrutura, coloca apoios e cargas, e o solver de elementos finitos recalcula tudo no instante em que algo muda. Sem botão «Calcular», sem instalação, sem cadastro.

[Abra o EduBeam](https://run.edubeam.app/?lang=pt){target="_blank"} em uma nova aba e acompanhe o [Início rápido](/pt/guide/quick-start).

<figure>
  <a href="https://run.edubeam.app/?lang=pt" target="_blank">
    <WelcomeStructure />
  </a>
  <figcaption>Uma viga hiperestática resolvida ao vivo no navegador</figcaption>
</figure>

## O que ele faz

| Área | Recursos |
| --- | --- |
| **Estruturas** | Vigas, vigas contínuas, pórticos e treliças planos (x–z) formados por nós e elementos de viga 2D (viga de Timoshenko). Rótulas de extremidade transformam qualquer barra em barra de treliça. |
| **Apoios** | Qualquer combinação de graus de liberdade restringidos `Dx`, `Dz`, `Ry` em um nó → engaste, apoio fixo (2º gênero), apoio móvel (1º gênero), engaste deslizante… Apoios inclinados por meio de um ângulo do sistema de coordenadas do nó. |
| **Cargas** | Forças e momentos nodais, deslocamentos prescritos (recalques de apoio), cargas distribuídas uniformes e trapezoidais (em eixos globais ou locais), cargas concentradas em qualquer ponto de uma barra e cargas térmicas uniformes ou com gradiente. |
| **Resultados** | Configuração deformada, esforço normal **N**, esforço cortante **V<sub>z</sub>**, momento fletor **M<sub>y</sub>**, reações, deslocamentos nodais, esforços de extremidade das barras e matrizes de rigidez dos elementos. |
| **Análise** | Análise estática linear com um único caso de carga. Os resultados são exatos para o modelo linear (não é preciso refinar a malha). |
| **Arquivos** | Salvar/abrir projetos em JSON, compartilhar o modelo inteiro como URL, incorporar um visualizador somente leitura. Tudo fica no seu dispositivo. |
| **Unidades** | Unidades selecionáveis de forma independente para comprimento, área, momento de inércia, massa, força, momento e tensão (métricas e imperiais). |

## O que ele (ainda) não faz

Conhecer os limites de antemão poupa tempo:

- **Somente 2D**: sem comportamento fora do plano, sem pórticos espaciais.
- **Somente estática linear**: sem efeitos de segunda ordem (P–Δ), flambagem, dinâmica ou plasticidade.
- **Um único caso de carga**: não há combinações nem envoltórias. Modele cada caso separadamente (salve como arquivo ou link próprio).
- **Sem peso próprio**: aplique-o como carga distribuída se precisar.
- **Sem verificações normativas**: o EduBeam fornece esforços e deslocamentos; o dimensionamento segundo norma é por sua conta.

Se um recurso que falta é importante para você, [abra uma issue](https://github.com/janvorisek/edubeam/issues).

## Para quem é

- **Estudantes** de resistência dos materiais e análise estrutural que querem conferir na hora seus cálculos manuais. Veja [Conferir resultados à mão](/pt/guide/verification).
- **Professores** que mostram como apoios, rótulas e cargas alteram os diagramas de esforços, ao vivo, no projetor, em qualquer um dos 11 idiomas.
- **Engenheiros** que precisam de uma verificação rápida antes de abrir o programa «grande».

## Como a documentação está organizada

1. **Primeiros passos**: esta página, o [Início rápido de 10 minutos](/pt/guide/quick-start) e os [Exemplos](/pt/examples/) prontos.
2. **Modelagem**: uma página por bloco: [interface](/pt/essentials/user-interface), [nós e apoios](/pt/essentials/nodes-supports), [elementos, materiais e seções](/pt/essentials/elements), [cargas](/pt/essentials/loads), [unidades e configurações](/pt/essentials/units-settings).
3. **Resultados**: como [ler os diagramas e tabelas](/pt/essentials/results) e como [conferi-los](/pt/guide/verification).
4. **Arquivos e compartilhamento**: [projetos JSON, links e o visualizador incorporável](/pt/essentials/import-export).
5. **Referência**: [teclado e mouse](/pt/reference/shortcuts), [solução de problemas](/pt/reference/troubleshooting) e as [perguntas frequentes](/pt/faq/).
6. **Manual teórico**: [convenção de sinais](/pt/elements/conventions) e as formulações dos elementos de [viga](/pt/elements/beam) e de [treliça](/pt/elements/truss).

## Idiomas

A interface está disponível em português, inglês, tcheco, alemão, espanhol, francês, polonês, russo, ucraniano, tailandês e chinês. O EduBeam escolhe o idioma pelo navegador; altere-o em **Configurações → Idioma e localidade** ou abra o aplicativo com o parâmetro `?lang=`, por exemplo [run.edubeam.app/?lang=pt](https://run.edubeam.app/?lang=pt){target="_blank"}.

## Autores e agradecimentos

<Edubeam /> é liderado por [Jan Voříšek](https://github.com/janvorisek), mantenedor e designer da edição web moderna. A versão para navegador é desenvolvida de forma independente da ČVUT; o EduBeam de desktop original para Windows/Linux foi criado por [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) e [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) no Departamento de Mecânica da [Faculdade de Engenharia Civil da Universidade Técnica Tcheca de Praga](https://www.fsv.cvut.cz/en). O solver é a biblioteca de código aberto [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Contribua

- Relate comportamentos confusos ou erros em uma [issue no GitHub](https://github.com/janvorisek/edubeam/issues).
- Melhore esta documentação ou as traduções editando os arquivos em `docs/` e abrindo um pull request.
- Compartilhe o EduBeam com colegas de turma e de trabalho.
