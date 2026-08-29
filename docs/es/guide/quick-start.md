# Inicio rápido

En unos diez minutos modelarás una viga biapoyada de acero con carga uniforme, leerás las reacciones, el esfuerzo cortante y el momento flector, y los contrastarás con las fórmulas de los libros de texto.

::: tip Sigue los pasos en paralelo
Abre [run.edubeam.app](https://run.edubeam.app/?lang=es){target="_blank"} en una segunda pestaña. Si ya hay un modelo cargado, usa **Limpiar estructura** (icono de papelera en la barra superior) y marca *Eliminar materiales* y *Eliminar secciones* para empezar de cero.
:::

## El problema

<ExampleStructure />

Una viga biapoyada de 6 m de luz (apoyo fijo a la izquierda, apoyo deslizante a la derecha) soporta una carga uniforme de 12 kN/m. Material: acero, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Sección IPE 200: $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Comprueba las unidades

Mira la etiqueta de unidades en la esquina inferior derecha del visor (p. ej. `m · m² · kN · kNm · MPa`). Son las unidades de todos los campos de entrada y resultados. Las predeterminadas son metros, kN, kNm y MPa, que es lo que asume este tutorial. Para cambiarlas, haz clic en la etiqueta o abre **Configuración → Idioma y configuración regional**.

## 2. Añade el material y la sección

Un elemento necesita un material y una sección para existir, así que créalos primero.

1. Abre la pestaña **Materiales** en la barra inferior y haz clic en **Añadir material**.
2. Introduce `E = 210000` MPa, `G = 81000` MPa, deja la densidad y `α = 0,000012` 1/K. Confirma con **Añadir material**.
   *(O haz clic en **Biblioteca de materiales** y elige **Steel (S235)**: tiene exactamente estos valores.)*
3. Abre la pestaña **Secciones** y haz clic en **Añadir sección**.
4. Introduce `Área = 0,00285` m², `Iy = 1,943e-5` m⁴, `Altura = 0,2` m, `Coeficiente de cortante = 1`. Confirma con **Añadir sección**.

::: details ¿Para qué sirve el coeficiente de cortante?
EduBeam usa elementos viga de Timoshenko, que incluyen la deformación por cortante. `k` es el factor de corrección por cortante ($k \approx 0{,}83$ para un rectángulo, $\approx 0{,}4$–$0{,}5$ para el alma de un perfil en I si $A$ es el área completa). Poner `k = 1` con el área completa *infravalora* ligeramente la flexibilidad a cortante; en una viga esbelta como esta la diferencia en la flecha está muy por debajo del 1 %. La fórmula está en la [página de teoría de la viga](/es/elements/beam).
:::

## 3. Añade los nodos

1. Abre la pestaña **Nodos** y haz clic en **Añadir nodo**. Introduce `X = 0`, `Z = 0` y confirma. El nodo recibe la etiqueta `1`.
2. De nuevo **Añadir nodo** con `X = 6`, `Z = 0`. Es el nodo `2`.

También puedes colocar nodos con el ratón: elige **Añadir con ratón** (o clic derecho en el lienzo → *Añadir nodo* con <kbd>Ctrl</kbd> pulsado) y haz clic en la cuadrícula. Con **Ajustar a la cuadrícula** activado (<kbd>S</kbd>) los clics caen en incrementos de 0,1 m.

## 4. Conéctalos con un elemento

1. Abre la pestaña **Elementos** y haz clic en **Añadir elemento**.
2. Elige **Nodo inicial** `1`, **Nodo final** `2`. El material y la sección que creaste ya están preseleccionados. Confirma.

Aparece una línea negra entre los nodos. Pulsa <kbd>F</kbd> para ajustarla a la pantalla.

## 5. Añade los apoyos

En la pestaña **Nodos**, la columna **Grados de libertad restringidos** tiene tres casillas por nodo: `Dx`, `Dz`, `Ry`.

- Nodo `1`: marca **Dx** y **Dz** → aparece el símbolo de un apoyo fijo.
- Nodo `2`: marca solo **Dz** → apoyo deslizante.

Las mismas casillas están disponibles al hacer clic en un nodo del visor y elegir **Apoyos del nodo**. Todos los tipos de apoyo se describen en [Nodos y apoyos](/es/essentials/nodes-supports).

## 6. Añade la carga

1. Abre la pestaña **Cargas** y haz clic en **Añadir carga de elemento**.
2. **Tipo de carga**: *Carga uniformemente distribuida*. **Elemento**: `1`.
3. Introduce `fz = 12` kN/m y deja `fx = 0`. Confirma.

Un `fz` positivo apunta en la dirección +z, que en pantalla es **hacia abajo**, así que un valor positivo es una carga de tipo gravitatorio. Ver [convenio de signos](/es/elements/conventions).

## 7. Lee los resultados

La solución aparece en cuanto se añade la carga. Abre el panel de ajustes del visor (botón de engranaje, arriba a la derecha del visor) para activar y desactivar las capas:

| Capa | Lo que deberías ver |
| --- | --- |
| **Reacciones** | Dos flechas hacia arriba de **36 kN** en los nodos 1 y 2. |
| **V<sub>z</sub> (x)** | Una recta desde **+36 kN** a la izquierda hasta **−36 kN** a la derecha, que cruza el cero en el centro del vano. |
| **M<sub>y</sub> (x)** | Una parábola con su extremo de **54 kNm** en el centro del vano. |
| **Forma deformada** | Una flecha simétrica. Pasa el ratón por el nodo `1` para leer su giro: unos **0,0265 rad**. |

La pestaña **Resultados** de la barra inferior da los números: **Resultados nodales** lista `Dx`, `Dz`, `Ry` de cada nodo; **Resultados de elementos** lista las fuerzas en los extremos de cada elemento en su sistema de coordenadas local.

Si los diagramas se ven demasiado grandes o pequeños, mueve el control **Escala de resultados** en **Configuración → Ajustes del visor → Tamaños**.

## 8. Comprueba a mano

| Magnitud | Fórmula | A mano | EduBeam |
| --- | --- | --- | --- |
| Reacción | $R = qL/2$ | 36 kN | 36 kN |
| Cortante máximo | $V = qL/2$ | 36 kN | 36 kN |
| Momento máximo | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Giro en el apoyo | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha en el centro | $w = 5qL^4/(384EI)$ | 49,6 mm | 49,6 mm |

Todo coincide. Más comprobaciones (ménsula, viga biempotrada, celosía) en [Comprobar resultados a mano](/es/guide/verification).

## 9. Experimenta

Aquí es donde EduBeam demuestra su valor. Prueba cada una de estas acciones y observa cómo cambian los diagramas:

- **Arrastra el nodo 2** hacia la derecha: el momento crece con $L^2$.
- **Marca `Ry` en el nodo 1** para empotrarlo: el momento en el centro baja y aparece un momento negativo en el apoyo.
- **Añade un tercer nodo** en `X = 3` haciendo clic sobre la viga en modo *Añadir con ratón*; elige **Conectar a la estructura** para que la viga se divida, y marca su `Dz` para obtener una viga continua de dos vanos.
- **Marca una rótula de extremo** en un elemento de la pestaña Elementos para liberar el momento en ese extremo.
- Pulsa <kbd>Ctrl</kbd>+<kbd>Z</kbd> para deshacer cualquier paso.

## 10. Guarda o comparte

- **Compartir modelo** (barra superior) genera una URL que contiene todo el modelo: pégala en un correo, un chat o unas diapositivas.
- **Guardar proyecto** (menú ☰ o <kbd>Ctrl</kbd>+<kbd>S</kbd>) descarga un `project.json` que puedes reabrir con **Abrir proyecto** o arrastrándolo a la aplicación.

El modelo también se conserva en el almacenamiento local del navegador, de modo que recargar la página no lo pierde. Ver [Importar, exportar y compartir](/es/essentials/import-export).

## Y ahora

- [Ejemplos](/es/examples/): pórticos y celosías listos con un clic.
- [Cargas](/es/essentials/loads): cargas trapezoidales, concentradas, térmicas y desplazamientos impuestos.
- [Teclado y ratón](/es/reference/shortcuts): trabaja más rápido en el lienzo.
