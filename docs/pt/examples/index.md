# Exemplos

Cada cartão abaixo é um modelo vivo e resolvido. Clique em um para abri-lo no <Edubeam /> com toda a configuração pronta para editar — depois arraste um nó, mude uma carga ou marque uma rótula e veja os diagramas acompanharem.

<br>

<FeatureStructures />

Os mesmos modelos estão no aplicativo em **☰ → Exemplos**, e [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=pt){target="_blank"} abre essa galeria diretamente.

## Exercícios sugeridos {#suggested-exercises}

- **Viga hiperestática**: desmarque `Ry` no engaste para torná-la biapoiada. Quanto cresce o momento no meio do vão?
- **Viga em balanço**: compare a flecha na extremidade com $FL^3/3EI$ (veja [Conferir resultados à mão](/pt/guide/verification)) e depois reduza $I_y$ pela metade na aba *Seções*.
- **Treliça Pratt**: os nós deste exemplo são rígidos. Marque as duas rótulas de extremidade em todas as barras para torná-la uma treliça de verdade e compare os esforços normais. Agora remova uma diagonal: a treliça ainda fica de pé?
- **Viga contínua de três vãos**: a viga está apoiada apenas nas extremidades. Marque `Dz` nos nós internos B e C para torná-la contínua e veja os momentos negativos aparecerem sobre os apoios.
- **Pórtico**: marque as duas rótulas de extremidade da viga para modelar ligações viga-pilar rotuladas, ou troque o apoio direito de apoio móvel para apoio fixo.
- **Carga térmica**: restrinja `Dx` nos dois apoios e veja o esforço normal aparecer.

## Tutoriais resolvidos {#worked-tutorials}

- [Pórtico triarticulado](/pt/tutorials/three-hinged-frame): reações, N, V e M conferidos à mão.
- [Treliça plana](/pt/tutorials/truss): método dos nós, método das seções e uma barra de esforço nulo.

## Contribua com um exemplo {#contribute-an-example}

Tem um bom modelo didático? Compartilhe-o por meio de um link no [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) ou no [Twitter](https://twitter.com/EdubeamApp) e nós o adicionaremos à galeria.
