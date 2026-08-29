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

<Edubeam /> es una herramienta gratuita, basada en el navegador, para el **análisis estructural de estructuras planas de barras**: vigas, pórticos y celosías. Dibuja la estructura, coloca apoyos y cargas, y el solver de elementos finitos recalcula todo en el instante en que cambias cualquier cosa. Sin botón «Calcular», sin instalación, sin cuenta.

[Abre EduBeam](https://run.edubeam.app/?lang=es){target="_blank"} en una pestaña nueva y sigue el [Inicio rápido](/es/guide/quick-start).

<figure>
  <a href="https://run.edubeam.app/?lang=es" target="_blank">
    <WelcomeStructure />
  </a>
  <figcaption>Una viga hiperestática resuelta en directo en el navegador</figcaption>
</figure>

## Qué hace

| Área | Capacidades |
| --- | --- |
| **Estructuras** | Vigas, vigas continuas, pórticos y celosías planos (x–z) formados por nodos y elementos viga 2D (viga de Timoshenko). Las rótulas de extremo convierten cualquier barra en una barra de celosía. |
| **Apoyos** | Cualquier combinación de grados de libertad restringidos `Dx`, `Dz`, `Ry` en un nodo → empotramiento, apoyo fijo (articulado), apoyo deslizante, empotramiento deslizante… Apoyos inclinados mediante un ángulo del sistema de coordenadas del nodo. |
| **Cargas** | Fuerzas y momentos nodales, desplazamientos impuestos (asientos de apoyo), cargas distribuidas uniformes y trapezoidales (en ejes globales o locales), cargas concentradas en cualquier punto de una barra y cargas térmicas uniformes o con gradiente. |
| **Resultados** | Deformada, esfuerzo axil **N**, esfuerzo cortante **V<sub>z</sub>**, momento flector **M<sub>y</sub>**, reacciones, desplazamientos nodales, fuerzas en extremos de barra y matrices de rigidez elementales. |
| **Análisis** | Análisis estático lineal con un único caso de carga. Los resultados son exactos para el modelo lineal (no hace falta refinar la malla). |
| **Archivos** | Guardar/abrir proyectos en JSON, compartir un modelo completo como URL, incrustar un visor de solo lectura. Todo permanece en tu dispositivo. |
| **Unidades** | Unidades seleccionables de forma independiente para longitud, área, momento de inercia, masa, fuerza, momento y presión (métricas e imperiales). |

## Qué no hace (todavía)

Conocer los límites de antemano ahorra tiempo:

- **Solo 2D**: sin comportamiento fuera del plano, sin pórticos espaciales.
- **Solo estática lineal**: sin efectos de segundo orden (P–Δ), pandeo, dinámica ni plasticidad.
- **Un solo caso de carga**: no hay combinaciones ni envolventes. Modela cada caso por separado (guárdalo como archivo o enlace propio).
- **Sin peso propio**: aplícalo como carga distribuida si lo necesitas.
- **Sin comprobaciones normativas**: EduBeam proporciona esfuerzos y desplazamientos; el dimensionamiento según norma es cosa tuya.

Si echas en falta una función, [abre una incidencia](https://github.com/janvorisek/edubeam/issues).

## Para quién es

- **Estudiantes** de resistencia de materiales y análisis de estructuras que quieren comprobar al instante sus cálculos a mano. Ver [Comprobar resultados a mano](/es/guide/verification).
- **Docentes** que muestran cómo apoyos, rótulas y cargas cambian los diagramas de esfuerzos, en directo, con proyector y en cualquiera de los 11 idiomas.
- **Ingenieros** que necesitan una comprobación rápida antes de abrir el programa «grande».

## Cómo está organizada la documentación

1. **Primeros pasos**: esta página, el [Inicio rápido de 10 minutos](/es/guide/quick-start) y los [Ejemplos](/es/examples/) listos para usar.
2. **Modelado**: una página por cada bloque: [interfaz de usuario](/es/essentials/user-interface), [nodos y apoyos](/es/essentials/nodes-supports), [elementos, materiales y secciones](/es/essentials/elements), [cargas](/es/essentials/loads), [unidades y ajustes](/es/essentials/units-settings).
3. **Resultados**: cómo [leer los diagramas y tablas](/es/essentials/results) y cómo [comprobarlos](/es/guide/verification).
4. **Archivos y compartir**: [proyectos JSON, enlaces y el visor incrustable](/es/essentials/import-export).
5. **Referencia**: [teclado y ratón](/es/reference/shortcuts), [solución de problemas](/es/reference/troubleshooting) y las [preguntas frecuentes](/es/faq/).
6. **Manual teórico**: [convenio de signos](/es/elements/conventions) y las formulaciones de los elementos [viga](/es/elements/beam) y [barra de celosía](/es/elements/truss).

## Idiomas

La interfaz está disponible en español, inglés, checo, alemán, francés, polaco, portugués, ruso, ucraniano, tailandés y chino. EduBeam elige el idioma según el navegador; cámbialo en **Configuración → Idioma y configuración regional** o abre la aplicación con el parámetro `?lang=`, p. ej. [run.edubeam.app/?lang=es](https://run.edubeam.app/?lang=es){target="_blank"}.

## Autores y agradecimientos

<Edubeam /> está dirigido por [Jan Voříšek](https://github.com/janvorisek), mantenedor y diseñador de la edición web moderna. La versión para navegador se desarrolla de forma independiente de la ČVUT; el EduBeam de escritorio original para Windows/Linux fue creado por [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) y [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) en el Departamento de Mecánica de la [Facultad de Ingeniería Civil de la Universidad Técnica Checa de Praga](https://www.fsv.cvut.cz/en). El solver es la biblioteca de código abierto [ts-fem](https://github.com/janvorisek/ts-fem).

<VPTeamMembers size="small" :members="members" />

## Contribuir

- Informa de comportamientos confusos o errores mediante una [incidencia en GitHub](https://github.com/janvorisek/edubeam/issues).
- Mejora esta documentación o las traducciones editando los archivos de `docs/` y abriendo un pull request.
- Comparte EduBeam con compañeros y colegas.
