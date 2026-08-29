# Importar, exportar y compartir

Todo en <Edubeam /> ocurre en tu navegador. No se sube nada a un servidor: un enlace compartido contiene literalmente el modelo.

## Guardar un proyecto

**Menú ☰ → Guardar proyecto** o <kbd>Ctrl</kbd>+<kbd>S</kbd> descarga `project.json`. Contiene nodos, elementos, materiales, secciones, cargas, cotas y la versión de la aplicación que lo escribió. Puedes renombrar el archivo libremente.

## Abrir un proyecto

- **Menú ☰ → Abrir proyecto** o <kbd>Ctrl</kbd>+<kbd>O</kbd> y elige un archivo `.json`, o
- **arrastra el archivo a cualquier parte de la ventana de la aplicación**.

Abrir sustituye el modelo actual (incluidos materiales y secciones). Usa antes **Guardar proyecto** si quieres conservarlo.

## Compartir un enlace

**Compartir modelo** (🔗 en la barra superior o en el menú ☰) abre el diálogo *Compartir modelo por URL*:

- **Copiar enlace**: copia el enlace al portapapeles (o haz clic dentro del campo).
- **Abrir enlace**: lo abre en una pestaña nueva para que veas lo que verá el destinatario.
- **Compartir con el diálogo del sistema**: en móviles y tabletas, pasa el enlace al menú de compartir del sistema.

El enlace tiene la forma `https://run.edubeam.app/?model=…` y codifica todo el modelo (nodos, elementos, propiedades, cargas). Quien lo abra obtiene una copia exacta para editar en local; las ediciones **no** se sincronizan de vuelta: envía un nuevo enlace cuando cambie el modelo. Los modelos muy grandes generan enlaces muy largos; en ese caso comparte el archivo JSON.

## Incrustar un visor de solo lectura

Añade `&viewer=1` a un enlace compartido (o `?viewer=1` a cualquier URL de la aplicación) para abrir el modelo en **modo visor**: la barra superior, la barra inferior, deshacer/rehacer y el panel de ajustes se ocultan y solo queda el lienzo con el modelo. Pon esa URL en un `<iframe>` para incrustar un modelo vivo y con zoom en apuntes o en una página web:

```html
<iframe src="https://run.edubeam.app/?viewer=1&model=…" width="100%" height="400"></iframe>
```

La página de [Ejemplos](/es/examples/) está construida así: cada tarjeta es un enlace con el parámetro `?model=`.

## Parámetros de URL

| Parámetro | Efecto |
| --- | --- |
| `model=<datos>` | Carga el modelo codificado, lo ajusta a la pantalla y elimina el parámetro de la barra de direcciones. |
| `lang=<código>` | Cambia el idioma de la interfaz (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`). |
| `viewer=1` | Modo visor de solo lectura (ver arriba). |

## Persistencia automática

El modelo actual y tu configuración se guardan en el almacenamiento local del navegador tras cada cambio y se restauran al volver, incluso después de cerrar el navegador. Es una comodidad, no una copia de seguridad: está ligada a un perfil de navegador en un dispositivo, y borrar los datos del sitio la elimina. Guarda el trabajo importante como archivo de proyecto.

## Formato del archivo de proyecto

`project.json` es JSON plano y legible:

```json
{
  "edubeam": true,
  "version": "1.0.6",
  "domain": {
    "materials": [ { "label": "1", "e": 210000000000, "g": 81000000000, "alpha": 0.000012, "d": 7850 } ],
    "crossSections": [ { "label": "1", "a": 0.00285, "iy": 1.943e-5, "h": 0.2, "k": 1 } ],
    "nodes": [ { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] }, … ],
    "elements": [ { "label": "1", "nodes": ["1", "2"], "mat": "1", "cs": "1", "hinges": [false, false] } ],
    "loadCases": [ … ]
  }
}
```

Todos los valores se guardan en **unidades SI** (m, N, Pa, rad) independientemente de las unidades mostradas. Las condiciones de contorno usan los identificadores de GDL `0 = Dx`, `2 = Dz`, `4 = Ry`. Como el formato es sencillo, puedes generar modelos con un script o una hoja de cálculo y abrirlos con **Abrir proyecto**. El formato no está versionado como API estable; comprueba el campo `version` si automatizas sobre él.
