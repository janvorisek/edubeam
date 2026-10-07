# Enseñar con EduBeam

<Edubeam /> nació en un aula, y ahí sigue funcionando mejor: un modelo en el proyector que reacciona en cuanto lo cambias, y el mismo modelo en el portátil de cada estudiante gracias a un enlace. Esta página reúne lo que más usan los docentes.

## En clase {#in-the-lecture}

- **Que se lea desde la última fila.** En *Configuración → Ajustes del visor*, sube el **Tamaño de fuente** a 18–20 px y el **Tamaño de apoyos** a 130–150 %. Aumenta la **Escala de resultados** si los diagramas se ven tímidos en una pantalla grande.
- **Muestra una cosa cada vez.** Desmarca todo en las opciones de visualización excepto la magnitud de la que estás hablando y luego añade las demás una a una.
- **Cambia el modelo en directo.** Arrastra un apoyo, marca `Ry`, añade una rótula. Los estudiantes ven causa y efecto al instante, y <kbd>Ctrl</kbd>+<kbd>Z</kbd> te devuelve al punto anterior.
- **Deja que el solver explique los mecanismos.** Libera una rótula de más y EduBeam hace oscilar el contorno discontinuo del mecanismo y rodea con un círculo las rótulas culpables. Es un buen momento para hablar de estabilidad.
- **Usa el idioma y los ejes de tus estudiantes.** Elige el idioma de la interfaz, unidades SI o estadounidenses, y ejes con z hacia abajo o con y hacia arriba, según tus apuntes.

![Un mecanismo hecho visible: las rótulas en B y C permiten que el pórtico se desplace lateralmente](/screenshots/es/ui-mechanism.webp)

## En apuntes y ejercicios {#in-lecture-notes-and-assignments}

Un enlace para compartir contiene el modelo completo, así que funciona en cualquier sitio donde funcione un enlace: un PDF, una diapositiva, una página del campus virtual, un correo.

1. Construye el modelo y pulsa **Compartir modelo → Copiar**.
2. Pega el enlace en tus apuntes. Los enlaces de versiones anteriores de EduBeam siguen funcionando, así que los apuntes siguen siendo válidos año tras año.
3. Los estudiantes que lo abren obtienen su propia copia para experimentar. Nada de lo que cambien te llega a ti ni a otros estudiantes.

Variantes útiles del enlace:

| Enlace | Abre |
| --- | --- |
| `https://run.edubeam.app/?model=…` | El modelo, listo para editar |
| `https://run.edubeam.app/?viewer=1&model=…` | El modelo en [modo visor](/es/essentials/import-export#embed-a-read-only-viewer), para incrustarlo en un `<iframe>` |
| `https://run.edubeam.app/?panel=examples` | La galería de ejemplos |
| `https://run.edubeam.app/?lang=cs` | La aplicación en checo (o en cualquier [otro código de idioma](/es/essentials/import-export#url-parameters)) |

::: warning Abrir un enlace reemplaza el modelo del estudiante
El modelo que tenía pasa a **☰ → Estructuras recientes** y se puede restaurar, y un mensaje lo indica. Aun así, pide a los estudiantes que guarden el trabajo que les importe con **Guardar proyecto** antes de abrir enlaces de clase.
:::

## Ejercicios que los estudiantes pueden comprobar por sí mismos {#assignments-students-can-check-themselves}

EduBeam da a los estudiantes una respuesta inmediata a sus cálculos a mano sin revelarles el método:

- Pide las reacciones, los esfuerzos y un desplazamiento a mano, y luego que construyan el modelo y comparen. [Comprobar resultados a mano](/es/guide/verification) tiene fórmulas listas para usar.
- Pregunta *por qué* difiere un resultado: la deformación por cortante, una rótula olvidada, una carga en ejes locales en lugar de globales.
- Pide a los estudiantes que entreguen un enlace o un `project.json` junto con su cálculo. Puedes abrirlo y ver exactamente qué han modelado.
- Para los informes, los estudiantes pueden exportar el dibujo en **SVG** (nítido en Word y LaTeX) y los resultados en **CSV**.

## Ejercicios ya preparados {#ready-made-exercises}

- La página de [Ejemplos](/es/examples/) tiene seis modelos, cada uno con ejercicios propuestos.
- Los tutoriales del [pórtico triarticulado](/es/tutorials/three-hinged-frame) y de la [celosía plana](/es/tutorials/truss) son ejemplos resueltos completos con comprobaciones a mano.
- El [Inicio rápido](/es/guide/quick-start) sirve como guion de la primera práctica: lleva unos diez minutos.

## Primeros pasos de los estudiantes {#getting-students-started}

Los usuarios nuevos ven un diálogo de bienvenida con dos opciones guiadas: **Hacer un recorrido** (una visita por la interfaz) y **Dibuja tu primera viga** (una tarea de siete pasos con el ratón). Ambas están también en el menú ☰. Muchos docentes simplemente dicen «abrid run.edubeam.app y elegid *Dibuja tu primera viga*» al comienzo de la primera práctica.

## Sin conexión y ordenadores de laboratorio {#offline-and-lab-computers}

EduBeam es una aplicación web progresiva (PWA). Una vez que un ordenador la ha cargado, sigue funcionando sin conexión, y el navegador puede ofrecer instalarla. Los modelos y la configuración se guardan por perfil de navegador, así que en los ordenadores compartidos de un aula de informática los estudiantes deben guardar su trabajo como archivos o enlaces.
