<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Desarrollador principal y diseñador del producto',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
    avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Solver MEF, autor de la aplicación original',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Introducción

<Edubeam /> es una herramienta gratuita, basada en el navegador, para el **análisis estructural 2D** de vigas, pórticos y celosías. Dibujas la estructura, añades apoyos y cargas, y el solver de elementos finitos lo recalcula todo en el momento en que cambias cualquier cosa. No hay botón *Calcular*, ni instalación, ni cuenta.

[Abre EduBeam](https://run.edubeam.app/?lang=es){target="_blank"} en una pestaña nueva y sigue el [Inicio rápido](/es/guide/quick-start).

![Un pórtico triarticulado en EduBeam: cargas en naranja, reacciones en morado, momento flector en rojo y deformada en gris](/screenshots/es/hero.webp)

## Tu primera visita {#your-first-visit}

La primera vez que abres la aplicación, un diálogo de bienvenida te pregunta cómo quieres empezar y qué unidades y ejes prefieres. Puedes cambiar ambas cosas más adelante en [Configuración](/es/essentials/units-settings).

![El diálogo de bienvenida](/screenshots/es/welcome.webp){.shot-lg}

- **Hacer un recorrido** te señala, uno a uno, el menú, deshacer y rehacer, los botones del visor, las opciones de visualización, la cuadrícula y las unidades, y la barra inferior.
- **Dibuja tu primera viga** es una tarea guiada de siete pasos. Dibujas una viga con el ratón, la apoyas, la cargas y lees los resultados. Una pequeña tarjeta en la esquina te indica qué hacer a continuación.
- **Abrir un ejemplo** abre la galería de modelos ya preparados.

Las tres opciones están también en el **menú ☰**, así que puedes volver a ellas en cualquier momento.

![Dibuja tu primera viga: la tarjeta de la guía permanece en la esquina mientras trabajas](/screenshots/es/first-beam-task.webp)

## Qué hace {#what-it-does}

| Área | Capacidades |
| --- | --- |
| **Estructuras** | Vigas, vigas continuas, pórticos y celosías planos (x–z) formados por nodos y elementos viga 2D de Timoshenko. Las rótulas de extremo convierten cualquier barra en una barra de celosía. |
| **Apoyos** | Articulación, rodillo, empotramiento, deslizadera y cualquier otra combinación de `Dx`, `Dz`, `Ry` restringidos, elegida por su símbolo. Apoyos girados mediante un ángulo nodal. Asientos de apoyo. |
| **Cargas** | Fuerzas y momentos nodales, desplazamientos impuestos, cargas lineales uniformes y trapezoidales, fuerzas y momentos puntuales a lo largo de una barra y cargas térmicas uniformes o con gradiente. |
| **Secciones** | Bibliotecas de materiales y secciones (europeas y estadounidenses), además de un editor de polígonos que calcula $A$, $I_y$, $I_z$, $I_{yz}$, los ejes principales y los radios de giro de cualquier forma. |
| **Resultados** | Deformada, esfuerzo axil **N**, esfuerzo cortante **V**, momento flector **M**, reacciones, desplazamientos nodales, fuerzas en los extremos de los elementos y matrices de rigidez de los elementos. |
| **Análisis** | Análisis estático lineal con un único caso de carga. Los resultados son exactos para el modelo lineal, así que no hace falta refinar la malla. Cuando una estructura no se puede resolver, EduBeam explica por qué y anima cómo puede moverse. |
| **Archivos** | Guardar y abrir proyectos en JSON, compartir un modelo completo como enlace, exportar el dibujo en PNG o SVG y los resultados en CSV. Los modelos reemplazados recientemente se conservan para que puedas recuperarlos. Todo permanece en tu dispositivo. |
| **Unidades** | SI o unidades estadounidenses con un clic, o cada magnitud por separado. Ejes con x a la derecha y z hacia abajo, o con x a la derecha e y hacia arriba. |

## Qué no hace (todavía) {#what-it-does-not-do-yet}

Conocer los límites de antemano ahorra tiempo:

- **Solo 2D.** Sin comportamiento fuera del plano, sin pórticos 3D.
- **Solo estática lineal.** Sin efectos de segundo orden (P–Δ), pandeo, dinámica ni plasticidad.
- **Un solo caso de carga.** No hay combinaciones de carga ni envolventes. Modela cada caso por separado y guárdalo como archivo o enlace propio.
- **Sin peso propio.** Aplícalo como carga lineal si lo necesitas.
- **Sin comprobaciones de diseño.** EduBeam te da esfuerzos y desplazamientos; las comprobaciones normativas corren de tu cuenta.

Si echas en falta una función importante para ti, [abre una incidencia](https://github.com/janvorisek/edubeam/issues).

<ElementariumPromo placement="introduction" />

## ¿Para quién es? {#who-is-it-for}

- **Estudiantes** de mecánica de estructuras que quieren una respuesta inmediata a sus cálculos a mano. Consulta [Comprobar resultados a mano](/es/guide/verification).
- **Docentes** que muestran en directo, con el proyector y en cualquiera de los 12 idiomas, cómo los apoyos, las rótulas y las cargas cambian los esfuerzos. Consulta [Enseñar con EduBeam](/es/guide/teaching).
- **Ingenieros** que quieren una comprobación rápida antes de abrir un programa de escritorio más pesado.

## Cómo está organizada esta guía {#how-this-guide-is-organised}

1. **Primeros pasos.** Esta página, el [Inicio rápido de 10 minutos](/es/guide/quick-start) y los [Ejemplos](/es/examples/) listos para usar.
2. **Tutoriales.** Modelos completos de principio a fin, comprobados a mano: un [pórtico triarticulado](/es/tutorials/three-hinged-frame) y una [celosía plana](/es/tutorials/truss).
3. **Modelado.** Una página por cada bloque: la [interfaz de usuario](/es/essentials/user-interface), [nodos y apoyos](/es/essentials/nodes-supports), [elementos, materiales y secciones](/es/essentials/elements), [cargas](/es/essentials/loads) y [unidades y ajustes](/es/essentials/units-settings).
4. **Resultados.** Cómo [leer los diagramas y las tablas](/es/essentials/results) y cómo [comprobarlos](/es/guide/verification).
5. **Archivos y compartir.** [Proyectos, enlaces para compartir, exportación de imágenes y CSV](/es/essentials/import-export), y [enseñar con EduBeam](/es/guide/teaching).
6. **Referencia.** [Teclado, ratón y pantalla táctil](/es/reference/shortcuts), [solución de problemas](/es/reference/troubleshooting) y las [preguntas frecuentes](/es/faq/).
7. **Manual teórico.** [Convenio de signos](/es/elements/conventions) y las formulaciones de los elementos [viga](/es/elements/beam) y [barra de celosía](/es/elements/truss).

Los iconos **?** de la aplicación abren la página correspondiente de esta guía en tu idioma.

## Idiomas {#languages}

La interfaz está disponible en English, Čeština, Deutsch, Español, Français, Polski, Português, Русский, Türkçe, Українська, ไทย y 汉语. EduBeam elige el idioma según tu navegador. Cámbialo en **Configuración → Idioma y configuración regional**, o abre la aplicación con el parámetro `?lang=`, p. ej. [run.edubeam.app/?lang=cs](https://run.edubeam.app/?lang=cs){target="_blank"}.

## Autores y agradecimientos {#authors-credits}

<Edubeam /> está dirigido por [Jan Voříšek](https://github.com/janvorisek), mantenedor y diseñador de producto de la edición web moderna. La versión para navegador se desarrolla de forma independiente de la ČVUT. El EduBeam de escritorio original para Windows y Linux fue creado por [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) y [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) en el Departamento de Mecánica de la [Facultad de Ingeniería Civil de la Universidad Técnica Checa de Praga (ČVUT)](https://www.fsv.cvut.cz/en). El solver es la biblioteca de código abierto [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Contribuir {#contribute}

- Informa de comportamientos confusos o errores mediante una [incidencia en GitHub](https://github.com/janvorisek/edubeam/issues).
- Mejora esta documentación o las traducciones editando los archivos de `docs/` y abriendo un pull request.
- Comparte EduBeam con tus compañeros y colegas.
