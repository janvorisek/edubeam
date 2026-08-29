# Nodos y apoyos

Los nodos son los puntos del modelo. Los elementos conectan nodos; los apoyos y las cargas nodales se aplican en los nodos.

## Coordenadas

Cada nodo tiene una coordenada **X** y una **Z** en la unidad de longitud actual. El eje x apunta a la derecha y el **eje z apunta hacia abajo** en pantalla, de modo que un pilar que sube desde el suelo va de `Z = 0` a `Z = −3`, no `+3`. El indicador de ejes en la esquina de la cuadrícula muestra la orientación actual. Ver [Sistema de coordenadas y convenio de signos](/es/elements/conventions).

## Añadir nodos

| Método | Cómo |
| --- | --- |
| **Diálogo** | Pestaña *Nodos* → **Añadir nodo**, o clic derecho en el lienzo → *Añadir nodo*. Introduce X y Z. |
| **Ratón** | Pestaña *Nodos* → **Añadir con ratón** (o mantén <kbd>Ctrl</kbd> al elegir *Añadir nodo* en el menú del lienzo) y haz clic en el lienzo. Cada clic añade un nodo; <kbd>Esc</kbd> termina. |
| **Al dibujar elementos** | En el modo *Añadir elemento → Añadir con ratón*, un clic en el lienzo vacío crea un nodo nuevo y lo conecta. |
| **Copiar y pegar** | Selecciona nodos (y elementos), <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd> y haz clic donde deba ir la copia. |

Las etiquetas se asignan automáticamente (`1`, `2`, …) y se pueden renombrar en la tabla.

### Ajuste a la cuadrícula

Con **Ajustar a la cuadrícula** activado (<kbd>S</kbd> o la etiqueta **S**), los nodos colocados o arrastrados con el ratón caen en múltiplos del **Paso de ajuste a la cuadrícula** (por defecto `0,1 m`, modificable en *Configuración → Ajustes del visor → Cuadrícula*). Desactiva el ajuste para colocar libremente, o escribe después las coordenadas exactas en la tabla.

### Colocar un nodo sobre un elemento existente

Si al añadir un nodo haces clic a menos de ~0,1 m de un elemento, EduBeam pregunta qué quieres:

- **Conectar a la estructura**: el elemento se divide en dos (`1a` y `1b`), se conservan las rótulas de los extremos exteriores y cualquier carga distribuida se reparte entre las dos mitades. Es la forma más rápida de añadir un apoyo intermedio o un punto de aplicación de carga.
- **Colocar nodo independiente**: el nodo se crea sobre el elemento pero sin conectarse a él.

## Editar nodos

- **Tabla:** edita etiqueta, X y Z directamente.
- **Arrastrar:** mueve un nodo en el visor (se puede deshacer). En pantallas táctiles, mantén pulsado el nodo para empezar a moverlo.
- **Diálogo Editar nodo:** coordenadas, apoyos y ángulo del SCL en un solo sitio, con vista previa del símbolo de apoyo.
- **Eliminar:** el icono de papelera de la tabla, *Eliminar* en el menú del nodo, o seleccionar y pulsar <kbd>Supr</kbd>. Eliminar un nodo elimina los elementos y cargas conectados a él.

## Apoyos

Un apoyo no es más que un conjunto de grados de libertad restringidos. Cada nodo tiene tres:

| GDL | Significado |
| --- | --- |
| **Dx** | traslación según x (horizontal) |
| **Dz** | traslación según z (vertical) |
| **Ry** | giro alrededor de y (en el plano de la estructura) |

Marca las casillas en la columna **Grados de libertad restringidos** de la pestaña *Nodos*, en el menú **Apoyos del nodo** de un nodo seleccionado o en el diálogo *Editar nodo*. El símbolo dibujado en el visor depende de la combinación:

| Restringidos | Apoyo | Símbolo |
| --- | --- | --- |
| Dx + Dz + Ry | Empotramiento | bloque rayado |
| Dx + Dz | Apoyo fijo (articulado) | triángulo |
| Dz | Apoyo deslizante horizontal (rodillo) | triángulo sobre rodillos |
| Dx | Apoyo deslizante vertical | rodillo girado |
| Dz + Ry | Empotramiento deslizante (guía vertical) | empotramiento sobre rodillos |
| Dx + Ry | Empotramiento deslizante (guía horizontal) | empotramiento deslizante girado |
| Ry | Solo giro restringido | empotramiento al giro |
| ninguno | Nodo libre | — |

Se calcula —y se dibuja— una reacción por cada grado de libertad restringido.

::: tip Nudos de celosía
Las barras de celosía son elementos viga con las **dos rótulas de extremo** liberadas (ver [Elementos](/es/essentials/elements#rotulas-de-extremo)). En un nudo de celosía lo habitual es un apoyo fijo (Dx + Dz); **no** restrinjas Ry en un nodo donde todos los elementos conectados están articulados, o el giro de ese nodo quedará indefinido.
:::

### Apoyos inclinados

Fija el **Ángulo del SCL nodal** (grados, −180…180) en el menú del nodo o en el diálogo *Editar nodo*. Los ejes locales del nodo giran ese ángulo y los grados de libertad de apoyo se interpretan en el sistema girado, así que un rodillo sobre una pendiente de 30° es `Dz` con un ángulo de `30`. El símbolo de apoyo gira en consecuencia y la reacción se da en la dirección girada.

### Estabilidad

El solver necesita al menos **tres grados de libertad restringidos** en total y una estructura sin mecanismos. Con apoyos insuficientes aparece el error *Model needs at least 3 constrained DOFs…* o simplemente no hay resultados. Ver [Solución de problemas](/es/reference/troubleshooting).

## Cargas nodales y asientos

Las fuerzas, momentos y desplazamientos impuestos (asientos de apoyo) se aplican en los nodos; ver [Cargas](/es/essentials/loads#cargas-nodales).

## Líneas de cota

Clic derecho en el lienzo → **Añadir cota** dibuja una línea de cota entre dos puntos. Los extremos se ajustan a los nodos cercanos al arrastrarlos; selecciona la línea y usa **Editar** para escribir coordenadas o **Invertir cota** para poner la etiqueta al otro lado. Las cotas son solo gráficas y se guardan con el proyecto.
