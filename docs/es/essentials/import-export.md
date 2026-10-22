# Importar, exportar y compartir

En <Edubeam /> todo ocurre en tu navegador. No se sube nada a ningún servidor: un enlace para compartir contiene literalmente el modelo.

## Guardar un proyecto {#save-a-project}

**☰ → Guardar proyecto** o <kbd>Ctrl</kbd>+<kbd>S</kbd> descarga `project.json`. Contiene los nodos, los elementos, los materiales, las secciones (con sus formas poligonales), las cargas, las líneas de cota y la versión de la aplicación que lo escribió. Puedes renombrar el archivo libremente.

## Abrir un proyecto {#open-a-project}

- **☰ → Abrir proyecto** o <kbd>Ctrl</kbd>+<kbd>O</kbd> y elige un archivo `.json`, o
- **arrastra el archivo a cualquier punto de la ventana de la aplicación**.

Abrir un proyecto reemplaza el modelo actual, incluidos los materiales y las secciones. El modelo que tenías no se pierde: <kbd>Ctrl</kbd>+<kbd>Z</kbd> lo recupera, y además queda en [Estructuras recientes](#recent-structures). Un archivo que no es un proyecto de EduBeam se rechaza con un mensaje, y tu modelo queda como estaba.

Los archivos de proyecto de todas las versiones anteriores de EduBeam se abren en la actual.

## Compartir un enlace {#share-a-link}

**Compartir modelo** (en la barra superior o en el menú ☰) abre el diálogo *Compartir modelo por URL*:

![El diálogo de compartir](/screenshots/es/share.webp){.shot-lg}

- **Copiar** copia el enlace al portapapeles. Hacer clic dentro del campo hace lo mismo.
- **Abrir enlace** lo abre en una pestaña nueva, para que compruebes lo que verá el destinatario.
- **Compartir con el diálogo del sistema** pasa el enlace al menú de compartir de tu dispositivo, si el navegador lo admite.

El enlace tiene la forma `https://run.edubeam.app/?model=…` y codifica el modelo completo. Quien lo abre obtiene su propia copia para editar; los cambios **no** se sincronizan de vuelta, así que envía un enlace nuevo cuando cambie el modelo. Los modelos muy grandes generan enlaces muy largos; en ese caso, comparte mejor el archivo JSON.

Cuando alguien abre un enlace, su propio modelo anterior pasa a Estructuras recientes, y un mensaje le indica dónde encontrarlo.

Los enlaces de versiones anteriores siguen funcionando: un enlace en los apuntes del año pasado abre hoy el mismo modelo.

## Exportar una imagen {#export-an-image}

**☰ → Exportar imagen** o <kbd>Ctrl</kbd>+<kbd>P</kbd> abre la exportación de imágenes.

![Exportar imagen: elige las capas, el encuadre y el tamaño, y luego descarga o copia](/screenshots/es/export-image.webp)

- **Capas**: las etiquetas de la parte superior eligen qué se dibuja, con independencia del visor: deformada, N, V, M, reacciones, apoyos, cargas, etiquetas de nodos y de elementos.
- **Encuadre**: elige una proporción (16:9, 4:3, 3:2, 1:1), **Ajustar todo** o **Ventana…** para arrastrar un rectángulo sobre el dibujo. También puedes arrastrar los bordes de la vista previa.
- **Tamaño**: anchura y altura en píxeles, o una **Escala** como 1 : 50 para un dibujo a escala en papel. **Altura del diagrama** define el tamaño de los diagramas de resultados en la imagen. **Fondo transparente** omite el fondo blanco.
- **Descargar PNG**, **Descargar SVG** o **Copiar al portapapeles**.

El SVG se mantiene nítido a cualquier tamaño y funciona en Word, Inkscape y LaTeX en Overleaf, lo que lo convierte en la mejor opción para informes y trabajos de fin de grado.

## Exportar los resultados {#export-the-results}

**Resultados → Exportar CSV** descarga ambas tablas de resultados, incluidas las reacciones, y **Copiar** las pone en el portapapeles para una hoja de cálculo. Consulta [Exportar CSV y Copiar](/es/essentials/results#export-csv-and-copy).

## Estructuras recientes {#recent-structures}

**☰ → Estructuras recientes** conserva los 10 últimos modelos que se limpiaron o que fueron reemplazados por un enlace, un archivo, un ejemplo o la tarea de la primera viga. Cada uno muestra una miniatura, por qué se reemplazó y su tamaño. **Restaurar** recupera uno; el modelo que tenías en ese momento pasa a su vez a la lista, y <kbd>Ctrl</kbd>+<kbd>Z</kbd> deshace la restauración.

![Estructuras recientes](/screenshots/es/recent.webp){.shot-lg}

La lista se guarda solo en este navegador.

## Ejemplos {#examples}

**☰ → Ejemplos** abre una galería de modelos docentes ya preparados. Abrir uno reemplaza tu modelo, y <kbd>Ctrl</kbd>+<kbd>Z</kbd> recupera el tuyo. Los mismos modelos, con ejercicios, están en la página [Ejemplos](/es/examples/) de esta guía.

![La galería de ejemplos](/screenshots/es/examples.webp){.shot-lg}

## Incrustar un visor {#embed-a-read-only-viewer}

Añade `&viewer=1` a un enlace para compartir para abrir el modelo en **modo visor**. Se ocultan la barra superior, la barra inferior, las pestañas, deshacer y rehacer, los botones de la cuadrícula y el indicador de ejes, y quedan el lienzo, los botones de ajustar y centrar y las opciones de visualización. Pon esa URL en un `<iframe>` para incrustar un modelo vivo y con zoom en tus apuntes o en una página web:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

![El pórtico triarticulado en modo visor](/screenshots/es/viewer-mode.webp){.shot-lg}

El modo visor es para mirar, pero no está bloqueado: los visitantes pueden seguir arrastrando nodos y cambiando de diagrama. Abrir un enlace de visor también reemplaza el modelo propio del visitante en ese navegador (pasa a Estructuras recientes), igual que un enlace normal.

## Parámetros de URL {#url-parameters}

| Parámetro | Efecto |
| --- | --- |
| `model=<datos>` | Carga el modelo codificado y lo ajusta a la pantalla. |
| `viewer=1` | Modo visor (ver arriba). |
| `lang=<código>` | Cambia el idioma de la interfaz: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`. |
| `panel=examples` | Abre directamente la galería de ejemplos. |

Después de leerlos, EduBeam elimina los parámetros de la barra de direcciones.

## Persistencia automática {#automatic-persistence}

El modelo actual y tu configuración se guardan en el almacenamiento local del navegador tras cada cambio y se restauran cuando vuelves, incluso después de cerrar el navegador. Es una comodidad, no una copia de seguridad: pertenece a un perfil de navegador en un dispositivo, y borrar los datos del sitio lo elimina. Guarda el trabajo importante como archivo de proyecto.

## Formato del archivo de proyecto {#project-file-format}

`project.json` es JSON sencillo y legible:

```json
{
  "edubeam": true,
  "version": "1.3.1",
  "domain": {
    "materials": [{ "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 }],
    "crossSections": [{ "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 }],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [{ "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] }],
    "loadCases": [
      {
        "label": "1",
        "nodalLoads": [],
        "elementLoads": [{ "type": "udl", "target": "1", "lcs": false, "values": [0, 12000] }],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Es la viga del Inicio rápido. Todos los valores están en **unidades SI** (m, N, Pa, rad), sean cuales sean las unidades de visualización. Las coordenadas son `[x, y, z]`, con y siempre 0. Las condiciones de contorno y las componentes de las cargas usan los identificadores de GDL `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` de la carga de elemento | Valores |
| --- | --- |
| `udl` | `values: [fx, fz]` en N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` en N/m, ejes locales |
| `concentrated` | `values: [Fx, Fz, My, a]` en N, N·m y m desde el nodo inicial |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` en K; el gradiente es ΔTb − ΔTt |

Las cargas nodales son `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }` y los desplazamientos impuestos `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; indica las tres componentes. Los archivos escritos por la aplicación incluyen además una `date`, un `commit`, un `lcs` nodal y `shape`s poligonales.

Como el formato es sencillo, puedes generar modelos con un script o una hoja de cálculo y abrirlos con **Abrir proyecto**.
