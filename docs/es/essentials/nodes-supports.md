# Nodos y apoyos

Los nodos son los puntos del modelo. Los elementos conectan nodos, y los apoyos y las cargas nodales se aplican en los nodos.

## Coordenadas {#coordinates}

Cada nodo tiene una coordenada **X** y una **Z** en la unidad de longitud actual. El eje x apunta a la derecha y el **eje z apunta hacia abajo** en pantalla, de modo que un pilar que sube desde el suelo va de `Z = 0` a `Z = −3`, no a `+3`. El indicador de ejes en la esquina de la cuadrícula muestra la orientación. Si prefieres un eje vertical hacia arriba, cambia a [ejes con y hacia arriba](/es/elements/conventions#y-up-axes) en Configuración.

## Añadir nodos {#adding-nodes}

| Método | Cómo |
| --- | --- |
| **Diálogo** | Pestaña *Nodos* → el primer botón **Añadir nodo**, o clic derecho en el lienzo → *Añadir nodo*. Introduce X y Z y, si quieres, los apoyos y el ángulo del apoyo. |
| **Ratón** | Pestaña *Nodos* → el segundo botón **Añadir nodo** (icono de cursor), o mantén <kbd>Ctrl</kbd> pulsado al elegir *Añadir nodo* en el menú del lienzo. Cada clic en el lienzo añade un nodo. Pulsa <kbd>Esc</kbd> o **Cancelar** para terminar. |
| **Al dibujar elementos** | En el modo de ratón para elementos, un clic en el lienzo vacío crea un nodo y lo conecta. |
| **Copiar y pegar** | Selecciona nodos (y elementos), pulsa <kbd>Ctrl</kbd>+<kbd>C</kbd> y <kbd>Ctrl</kbd>+<kbd>V</kbd>, y haz clic donde deba ir la copia, o escribe un desplazamiento Δx, Δz y pulsa **Pegar**. |

<div class="shots">

![El diálogo Añadir nodo](/screenshots/es/qs-node.webp)

![En el modo de ratón, una banda en la parte superior define los apoyos y el ángulo de cada nodo que colocas](/screenshots/es/nodes-add-banner.webp)

</div>

Las etiquetas se asignan automáticamente (`1`, `2`, … o continuando tu propio esquema, p. ej. `A`, `B`) y se pueden renombrar en la tabla.

### Ajuste a la cuadrícula {#snapping}

Con **Ajustar a la cuadrícula** activado (<kbd>S</kbd> o el botón **S**), los nodos que colocas o arrastras caen en múltiplos del **Paso de ajuste a la cuadrícula**: 0,1 m por defecto, o 0,5 ft en unidades estadounidenses. Cámbialo en *Configuración → Ajustes del visor → Cuadrícula*. Desactiva el ajuste para colocar libremente, o escribe después las coordenadas exactas en la tabla.

### Colocar un nodo sobre un elemento existente {#placing-a-node-on-an-existing-element}

Si al añadir un nodo haces clic cerca de un elemento, EduBeam pregunta qué pretendes:

- **Conectar a la estructura** divide el elemento en dos (`1a` y `1b`). Las rótulas de los extremos exteriores se conservan, y las cargas uniformes y trapezoidales se reparten entre las dos mitades; las cargas puntuales y térmicas pasan a la primera mitad. Es la forma más rápida de añadir un apoyo intermedio o un punto de carga.
- **Colocar nodo independiente** crea el nodo sobre el elemento sin conectarlo.

## Editar nodos {#editing-nodes}

- **Tabla:** edita la etiqueta, X y Z directamente.
- **Arrastrar:** mueve un nodo en el visor, también en una pantalla táctil: pulsa el nodo y arrástralo. Cada movimiento se puede deshacer.
- **Diálogo Editar nodo:** el lápiz de la columna *Acciones* de la tabla. Reúne las coordenadas, los apoyos y el ángulo del apoyo, con una vista previa del símbolo de apoyo.
- **Eliminar:** la × de la tabla, *Eliminar* en el panel del nodo, o selecciónalo y pulsa <kbd>Supr</kbd>. Eliminar un nodo elimina también los elementos y las cargas unidos a él.

## Apoyos {#supports}

Un apoyo es un conjunto de grados de libertad (GDL) restringidos. Cada nodo tiene tres:

| GDL | Significado |
| --- | --- |
| **Dx** | traslación según x (horizontal) |
| **Dz** | traslación según z (vertical) |
| **Ry** | giro alrededor de y (en el plano del dibujo) |

Lo más rápido es **elegir el símbolo**. Está en el panel del nodo, en **Apoyos del nodo**, en los diálogos Añadir nodo y Editar nodo, y como un pequeño menú al principio de la columna *Grados de libertad restringidos* de la tabla de nodos. Marcar las casillas `Dx`, `Dz`, `Ry` hace lo mismo, un GDL cada vez.

![Apoyos del nodo: elige un símbolo o marca los GDL, y define el ángulo del apoyo](/screenshots/es/nodes-support-picker.webp){.shot-lg}

| Apoyo | Restringidos | Se mueve | Reacciones |
| --- | --- | --- | --- |
| **Libre** | ninguno | todo | ninguna |
| **Articulación** | Dx + Dz | gira | R<sub>x</sub>, R<sub>z</sub> |
| **Rodillo** | Dz | se desliza en horizontal, gira | R<sub>z</sub> |
| **Rodillo vertical** | Dx | se desliza en vertical, gira | R<sub>x</sub> |
| **Empotramiento** | Dx + Dz + Ry | nada | R<sub>x</sub>, R<sub>z</sub>, M |
| **Deslizadera** | Dz + Ry | se desliza en horizontal | R<sub>z</sub>, M |
| **Deslizadera vertical** | Dx + Ry | se desliza en vertical | R<sub>x</sub>, M |
| **Solo giro impedido** | Ry | se desliza en ambas direcciones | M |

Para cada GDL restringido se calcula, y se dibuja, una reacción.

::: tip Nudos de celosía
Las barras de celosía son elementos viga con ambas **rótulas de extremo** liberadas (ver [Elementos](/es/essentials/elements#end-hinges)). Una articulación (Dx + Dz) es la elección habitual en un apoyo de celosía. Un nodo en el que todos los elementos conectados están articulados no tiene rigidez al giro; EduBeam lo admite y da su giro como 0.
:::

### Apoyos inclinados (girados) {#inclined-skewed-supports}

Define el **Ángulo del SCL nodal** α en grados (−180…180). Está en el panel del nodo, en *Apoyos del nodo*, en los diálogos Añadir nodo y Editar nodo, y en el campo α de la tabla de nodos. Los ejes del nodo giran ese ángulo y los GDL del apoyo actúan en las direcciones giradas, de modo que un rodillo sobre una pendiente de 30° es `Dz` con α = 30. El símbolo gira en consecuencia y la reacción se da en la dirección girada.

### Estabilidad {#stability}

El solver necesita en total al menos **tres GDL restringidos**, y los apoyos y las rótulas deben sujetar la estructura. Mientras no haya apoyos suficientes, el visor muestra la etiqueta azul *Faltan apoyos*. Si los apoyos son suficientes en número pero no pueden sujetar la estructura (todos paralelos, o concurrentes en un punto), o si las rótulas permiten que las barras giren unas respecto a otras, un mensaje rojo indica el problema y un contorno discontinuo muestra cómo se mueve la estructura. Consulta [Solución de problemas](/es/reference/troubleshooting).

## Cargas nodales y asientos {#nodal-loads-and-settlements}

Las fuerzas, los momentos y los desplazamientos impuestos (asientos de apoyo) se aplican en los nodos. Consulta [Cargas](/es/essentials/loads#nodal-loads).

## Líneas de cota {#dimension-lines}

Clic derecho en el lienzo → **Añadir cota** para dibujar una línea de cota entre dos puntos, o clic derecho en un elemento → **Acotar el elemento …** para acotarlo directamente. Los extremos se ajustan a los nodos cuando los arrastras cerca de ellos. Selecciona una línea y usa **Editar** para escribir sus coordenadas, o **Invertir cota** para poner la etiqueta al otro lado. Las líneas de cota son solo decorativas; se guardan con el proyecto y viajan en los enlaces para compartir.
