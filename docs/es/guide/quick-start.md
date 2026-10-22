# Inicio rápido

En unos diez minutos modelarás una viga biapoyada de acero con carga uniforme, leerás las reacciones, el esfuerzo cortante y el momento flector, y los contrastarás con las fórmulas de los libros de texto.

::: tip Sigue los pasos en paralelo
Abre [run.edubeam.app](https://run.edubeam.app/?lang=es){target="_blank"} en una segunda pestaña. Si ya hay un modelo cargado, usa **Limpiar estructura** en la barra superior para empezar de cero, y marca *Eliminar materiales* y *Eliminar secciones* para partir de un modelo completamente vacío. La limpieza se puede deshacer con <kbd>Ctrl</kbd>+<kbd>Z</kbd>, y el modelo anterior queda en **☰ → Estructuras recientes**.

¿Prefieres aprender haciendo, con indicaciones en pantalla? **☰ → Dibuja tu primera viga** te guía con el ratón a través de una viga parecida.
:::

## El problema {#the-problem}

<ExampleStructure />

Una viga biapoyada de 6 m (articulada a la izquierda, con apoyo móvil a la derecha) soporta una carga uniforme de 12 kN/m. Material: acero, $E = 210\ \text{GPa}$, $G = 81\ \text{GPa}$. Sección: un IPE 200, $A = 28{,}5\ \text{cm}^2$, $I_y = 1943\ \text{cm}^4$, $h = 200\ \text{mm}$.

## 1. Comprueba las unidades {#_1-check-the-units}

La etiqueta de unidades en la esquina inferior derecha del visor muestra las unidades que usan todos los campos de entrada y los resultados. Este tutorial supone los valores SI predeterminados: metros, kN, kNm y MPa.

![Los botones de cuadrícula (G), ajuste (S) y cruceta, y la etiqueta de unidades](/screenshots/es/ui-grid-units.webp){.shot-sm}

Si ves `ft · kip · kip·ft · ksi`, haz clic en la etiqueta y elige **Sistema de unidades → SI (métrico)**.

## 2. Añade el material y la sección {#_2-add-the-material-and-cross-section}

Los elementos necesitan un material y una sección, así que créalos primero.

1. Abre la pestaña **Materiales** en la barra inferior y haz clic en **Añadir material**.
2. Introduce `E = 210000` MPa y `G = 81000` MPa. Deja la densidad y `α = 0,000012` 1/K. Haz clic en **Añadir material**.

<div class="shots">

![Añadir material: escribe E y G…](/screenshots/es/qs-material.webp)

![…o elige Steel (S235) en la Biblioteca de materiales](/screenshots/es/qs-material-library.webp)

</div>

3. Abre la pestaña **Secciones** y haz clic en **Añadir sección**.
4. Introduce `Área = 0,00285` m², `Iy = 1,943e-5` m⁴, `Altura = 0,2` m y `Coeficiente de cortante = 1`. Haz clic en **Añadir sección**.

![Añadir sección. También puedes elegirla de la biblioteca o dibujar una forma poligonal.](/screenshots/es/qs-cross-section.webp){.shot-md}

::: details ¿Por qué importa el coeficiente de cortante?
EduBeam usa elementos viga de Timoshenko, que incluyen la deformación por cortante. `k` es el factor de corrección por cortante: $k \approx 0{,}83$ para un rectángulo y aproximadamente $0{,}4$–$0{,}5$ para una sección en I cuando $A$ es el área completa. Poner `k = 1` con el área completa *infravalora* ligeramente la flexibilidad a cortante. En una viga esbelta como esta, la diferencia en la flecha queda muy por debajo del 1 %. La fórmula está en la [página de teoría de la viga](/es/elements/beam).
:::

## 3. Añade los nodos {#_3-add-the-nodes}

1. Abre la pestaña **Nodos**. Tiene dos botones **Añadir nodo**: el primero abre un diálogo y el segundo (con un icono de cursor) coloca nodos con el ratón. Haz clic en el primero.
2. Introduce `X = 0`, `Z = 0` y haz clic en **Añadir nodo**. El nodo recibe la etiqueta `1`.
3. Añade un segundo nodo en `X = 6`, `Z = 0`. Es el nodo `2`.

![El diálogo Añadir nodo también permite definir los apoyos directamente](/screenshots/es/qs-node.webp){.shot-md}

Con el botón del ratón, en cambio, cada clic en el lienzo coloca un nodo. Con **Ajustar a la cuadrícula** activado (<kbd>S</kbd>), los clics caen en el paso de la cuadrícula (0,1 m por defecto).

## 4. Conéctalos con un elemento {#_4-connect-them-with-an-element}

1. Abre la pestaña **Elementos** y haz clic en el primer botón **Añadir elemento**.
2. Elige **Nodo inicial** `1` y **Nodo final** `2`. Tu material y tu sección ya están seleccionados. Haz clic en **Añadir elemento**.

![Añadir elemento: los dos nodos extremos, rótulas de extremo opcionales, material y sección](/screenshots/es/qs-element.webp){.shot-md}

Aparece una línea entre los nodos. Pulsa <kbd>F</kbd> para ajustarla a la pantalla.

## 5. Añade los apoyos {#_5-add-the-supports}

En la pestaña **Nodos**, la columna **Grados de libertad restringidos** tiene un selector de símbolos de apoyo y tres casillas por nodo: `Dx`, `Dz`, `Ry`.

- Nodo `1`: elige el símbolo **Articulación**, o marca **Dx** y **Dz**.
- Nodo `2`: elige el **Rodillo**, o marca solo **Dz**.

![Apoyos en la tabla de nodos: nodo 1 articulado, nodo 2 sobre rodillo](/screenshots/es/qs-supports.webp)

También puedes hacer clic en un nodo del visor y elegir **Apoyos del nodo**. En [Nodos y apoyos](/es/essentials/nodes-supports#supports) se describen todos los tipos de apoyo.

## 6. Añade la carga {#_6-add-the-load}

1. Abre la pestaña **Cargas** y haz clic en **Añadir carga de elemento**.
2. **Tipo de carga**: *Carga uniformemente distribuida*. **Elemento**: `1`.
3. Introduce `fz = 12` kN/m y deja `fx = 0`. Haz clic en **Añadir carga de elemento**.

![El diálogo muestra una vista previa de la carga sobre el elemento](/screenshots/es/qs-load.webp){.shot-md}

Un `fz` positivo apunta en la dirección +z, que en pantalla es **hacia abajo**, así que un valor positivo es una carga gravitatoria. Consulta el [convenio de signos](/es/elements/conventions).

## 7. Lee los resultados {#_7-read-the-results}

La solución aparece en cuanto se añade la carga. El panel de visualización, arriba a la derecha del visor, activa y desactiva los diagramas. **Forma deformada**, **M<sub>y</sub>(x)** y **Reacciones** están activados por defecto. Marca **V<sub>z</sub>(x)** para añadir el esfuerzo cortante.

![Esfuerzo cortante (verde), momento flector (rojo), reacciones (morado) y deformada](/screenshots/es/qs-results.webp)

| Capa | Lo que deberías ver |
| --- | --- |
| **Reacciones** | Dos flechas hacia arriba de **36 kN** en los nodos 1 y 2. |
| **V<sub>z</sub>(x)** | Una recta desde **+36 kN** a la izquierda hasta **−36 kN** a la derecha, que pasa por cero en el centro del vano. |
| **M<sub>y</sub>(x)** | Una parábola con su valor extremo de **54 kNm** en el centro del vano. |
| **Forma deformada** | Una flecha simétrica. Señala el nodo `1` para leer su giro: **2,6469 · 10⁻² rad**. |

La pestaña **Resultados** de la barra inferior da los números. **Resultados nodales** lista `Dx`, `Dz`, `Ry` de cada nodo. **Resultados de elementos** lista las fuerzas en los extremos de cada elemento en su sistema de coordenadas local.

Si los diagramas se ven demasiado grandes o pequeños, cambia la **Escala de resultados** en **Configuración → Ajustes del visor → Tamaños**.

## 8. Comprueba a mano {#_8-check-by-hand}

| Magnitud | Fórmula | A mano | EduBeam |
| --- | --- | --- | --- |
| Reacción | $R = qL/2$ | 36 kN | 36 kN |
| Cortante máximo | $V = qL/2$ | 36 kN | 36 kN |
| Momento máximo | $M = qL^2/8$ | 54 kNm | 54 kNm |
| Giro en el apoyo | $\varphi = qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha en el centro del vano (flexión) | $w = 5qL^4/(384EI)$ | 49,63 mm | |
| Flecha en el centro del vano (cortante) | $w_s = qL^2/(8kGA)$ | 0,23 mm | |
| Flecha en el centro del vano (total) | suma | 49,86 mm | 49,86 mm |

No hay ningún nodo en el centro del vano, así que, para leer allí la flecha, añade uno: elige el segundo botón **Añadir nodo**, haz clic sobre la viga en `X = 3` y elige **Conectar a la estructura**. La viga se divide en dos y el `Dz` del nuevo nodo en **Resultados** marca 49,86 mm. Dividir la viga no cambia ningún resultado, porque el elemento es exacto.

Todo coincide. Más recetas de comprobación a mano (voladizo, viga biempotrada, celosía, temperatura) en [Comprobar resultados a mano](/es/guide/verification).

## 9. Experimenta {#_9-experiment}

Aquí es donde EduBeam demuestra lo que vale. Prueba cada una de estas acciones y observa cómo se actualizan los diagramas:

- **Arrastra el nodo 2** hacia la derecha: el momento crece con $L^2$.
- **Marca `Ry` en el nodo 1** para empotrarlo: el momento en el centro del vano baja y aparece un momento negativo en el apoyo.
- **Marca `Dz` en el nodo central** que acabas de añadir para obtener una viga continua de dos vanos.
- **Marca una casilla de Rótulas de extremo** en un elemento de la pestaña Elementos para liberar el momento en ese extremo.
- Pulsa <kbd>Ctrl</kbd>+<kbd>Z</kbd> para deshacer cualquier paso.

## 10. Guarda o comparte {#_10-save-or-share}

- **Compartir modelo** (en la barra superior o en el menú ☰) te da un enlace que contiene todo el modelo. Pégalo en un correo, un chat o tus diapositivas.
- **☰ → Guardar proyecto** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) descarga un `project.json` que puedes abrir más tarde con **Abrir proyecto** o arrastrándolo a la aplicación.
- **☰ → Exportar imagen** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) guarda el dibujo en PNG o SVG para un informe.

El modelo también se conserva en el navegador, así que recargar la página no lo pierde. Consulta [Importar, exportar y compartir](/es/essentials/import-export).

## Y ahora {#where-next}

- [Tutorial del pórtico triarticulado](/es/tutorials/three-hinged-frame): un pórtico con una rótula interior, comprobado a mano.
- [Ejemplos](/es/examples/): abre pórticos y celosías ya preparados con un clic.
- [Cargas](/es/essentials/loads): cargas trapezoidales, concentradas y térmicas, desplazamientos impuestos.
- [Teclado, ratón y pantalla táctil](/es/reference/shortcuts): trabaja más rápido en el lienzo.
