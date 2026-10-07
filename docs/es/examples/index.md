# Ejemplos

Cada tarjeta de abajo es un modelo vivo y resuelto. Haz clic en una para abrirla en <Edubeam /> con toda la configuración lista para editar; luego arrastra un nodo, cambia una carga o marca una rótula y observa cómo te siguen los diagramas.

<br>

<FeatureStructures />

Los mismos modelos están en la aplicación en **☰ → Ejemplos**, y [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=es){target="_blank"} abre directamente esa galería.

## Ejercicios propuestos {#suggested-exercises}

- **Viga hiperestática**: desmarca `Ry` en el empotramiento para convertirla en biapoyada. ¿Cuánto crece el momento en el centro del vano?
- **Voladizo**: compara la flecha en el extremo con $FL^3/3EI$ (consulta [Comprobar resultados a mano](/es/guide/verification)) y luego reduce $I_y$ a la mitad en la pestaña *Secciones*.
- **Celosía Pratt**: los nudos de este ejemplo son rígidos. Marca las dos rótulas de extremo en todas las barras para convertirla en una verdadera celosía y compara los esfuerzos axiles. Ahora quita una diagonal: ¿sigue en pie la celosía?
- **Viga continua de tres vanos**: la viga solo está apoyada en sus extremos. Marca `Dz` en los nodos interiores B y C para hacerla continua y observa cómo aparecen los momentos negativos sobre los apoyos.
- **Pórtico**: marca las dos rótulas de extremo de la viga para modelar uniones viga-pilar articuladas, o cambia el apoyo derecho de rodillo a articulación.
- **Carga térmica**: restringe `Dx` en ambos apoyos y observa cómo aparece el esfuerzo axil.

## Tutoriales resueltos {#worked-tutorials}

- [Pórtico triarticulado](/es/tutorials/three-hinged-frame): reacciones, N, V y M comprobados a mano.
- [Celosía plana](/es/tutorials/truss): método de los nudos, método de las secciones y una barra de esfuerzo nulo.

## Aportar un ejemplo {#contribute-an-example}

¿Tienes un buen modelo docente? Compártelo mediante un enlace en [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) o en [Twitter](https://twitter.com/EdubeamApp) y lo añadiremos a la galería.
