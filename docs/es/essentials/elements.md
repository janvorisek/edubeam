# Elementos, materiales y secciones

## El elemento viga {#the-beam-element}

<Edubeam /> tiene un único tipo de elemento: una **viga de Timoshenko 2D** en el plano x–z con tres grados de libertad en cada extremo (`Dx`, `Dz`, `Ry`). Transmite esfuerzo axil, cortante y flector, e incluye la deformación por cortante, por eso la sección tiene un coeficiente de cortante. La formulación completa está en el [manual teórico](/es/elements/beam).

<TrussElement :moment="true" caption="Elemento viga 2D: tres grados de libertad por nodo" />

Los resultados a lo largo de un elemento son exactos para el modelo lineal, así que basta un elemento por barra. Añade nodos intermedios solo donde necesites un apoyo, una rótula, un cambio de sección o un nodo en el que leer resultados.

### Añadir elementos {#adding-elements}

| Método | Cómo |
| --- | --- |
| **Diálogo** | Pestaña *Elementos* → el primer botón **Añadir elemento**, o el menú del lienzo → *Añadir elemento*. Elige el **Nodo inicial** y el **Nodo final**, las rótulas, el material y la sección. |
| **Ratón** | Pestaña *Elementos* → el segundo botón **Añadir elemento** (icono de cursor), o mantén <kbd>Ctrl</kbd> pulsado con la opción del menú del lienzo. Haz clic en un nodo para empezar y luego en el siguiente nodo para conectarlo; un clic en el lienzo vacío crea allí un nodo. Sigue haciendo clic para dibujar una polilínea y pulsa <kbd>Esc</kbd> para terminar. La banda de la parte superior define la **Rótula al inicio** y la **Rótula al final** de cada elemento que dibujas. Se usan el primer material y la primera sección del modelo. |

![El diálogo Añadir elemento](/screenshots/es/qs-element.webp){.shot-md}

::: warning Primero materiales y secciones
Un elemento necesita un material y una sección. Si no hay ninguno, el visor muestra *No hay materiales definidos.* / *No hay secciones definidas.* con un botón **Añadir**.
:::

### Orientación del elemento {#element-direction}

El **eje x local** va del nodo inicial al nodo final. Esto importa para:

- las cargas en coordenadas locales (**LCS** marcado),
- la *Posición de carga desde el nodo inicial* de las cargas concentradas,
- el orden de las fuerzas en extremos (`X12, Z12, M12` en el inicio, `X21, Z21, M21` en el final) en la tabla de resultados.

Usa el botón de intercambio entre los dos nodos en la tabla de *Elementos* para invertir un elemento.

### Rótulas de extremo {#end-hinges}

Cada elemento tiene dos casillas de **Rótulas de extremo**, inicio y final, en la tabla de *Elementos*. También están en el diálogo Añadir elemento, en el panel **Editar elemento** del elemento y en la banda que aparece al dibujar con el ratón. Una rótula marcada libera el momento flector en ese extremo, así que:

- una rótula crea una articulación dentro de un pórtico o de una viga continua (allí el momento es cero);
- las dos rótulas crean una **barra de celosía**, que solo transmite esfuerzo axil.

<TrussElement :hinges="[true, true]" caption="Ambos extremos articulados → barra de celosía" />

![La tabla de elementos del pórtico triarticulado: el elemento 2 tiene una rótula en su final, en el nodo C](/screenshots/es/elements-table.webp)

Cuando dos elementos concurren en un nodo y solo uno de ellos está articulado, el otro sigue transmitiendo momento al nodo. Así que articula el elemento que quieres liberar, no «el nodo». Si las rótulas convierten la estructura en un mecanismo, EduBeam las rodea con un círculo y muestra cómo se mueve.

### Editar y eliminar {#editing-and-deleting}

Haz clic en un elemento y usa su panel (**Editar elemento**, **Añadir carga**, **Matriz de rigidez**, **Eliminar**), o edítalo en la tabla de *Elementos*. Eliminar un elemento elimina también sus cargas. **Matriz de rigidez** abre una ventana con la matriz de rigidez 6 × 6 del elemento en coordenadas globales (N/m, N y N·m), con las rótulas de extremo ya condensadas. Es muy útil para comprobar un ensamblaje hecho a mano.

## Materiales {#materials}

Pestaña *Materiales* → **Añadir material**:

| Campo | Símbolo | Unidad | Notas |
| --- | --- | --- | --- |
| Módulo de Young | $E$ | unidad de presión (MPa por defecto) | Acero ≈ 210 000 MPa, hormigón ≈ 30 000 MPa, madera ≈ 11 000 MPa |
| Módulo de cortante | $G$ | unidad de presión | $G = E / (2(1+\nu))$; acero ≈ 81 000 MPa. Solo afecta al término de cortante de Timoshenko. |
| Densidad | $\rho$ | masa / longitud³ (kg/m³, lb/ft³) | Se guarda con el proyecto. El solver estático no la usa (no hay carga de peso propio). |
| Coeficiente de dilatación térmica | $\alpha$ | 1/K o 1/°F | Lo usan las [cargas térmicas](/es/essentials/loads#temperature-load). Acero: 12 × 10⁻⁶ /K. |

<div class="shots">

![Añadir material](/screenshots/es/qs-material.webp)

![La Biblioteca de materiales](/screenshots/es/qs-material-library.webp)

</div>

La **Biblioteca de materiales** tiene materiales ya preparados. La familia que corresponde a tus unidades aparece primero.

- **Metales:** aceros estructurales S235, S275, S355, aceros inoxidables, fundición, aleaciones de aluminio, cobre, latón, bronce, titanio; aceros estadounidenses ASTM A992, A36, A572 Gr. 50 y HSS A500 Gr. C.
- **Hormigón:** hormigón normal y ligero, clases C25/30, C30/37, C40/50, y f′c = 4 ksi y 5 ksi.
- **Madera:** C24, GL24h, GL32h.
- **Otros:** vidrio, GFRP, CFRP, HDPE, PVC, PMMA, policarbonato.

Ábrela con el botón de la barra de herramientas o con *O elegir de la biblioteca* en el diálogo *Añadir material*.

Un material que todavía usan algunos elementos no se puede eliminar; reasigna antes esos elementos.

## Secciones {#cross-sections}

Pestaña *Secciones* → **Añadir sección**:

| Campo | Símbolo | Unidad | Notas |
| --- | --- | --- | --- |
| Área | $A$ | unidad de área | Rigidez axil $EA$ |
| Momento de inercia | $I_y$ | unidad de momento de inercia | Rigidez a flexión $EI_y$ respecto al eje perpendicular al dibujo |
| Altura | $h$ | unidad de dimensiones de sección | La usan las cargas térmicas con gradiente (curvatura $= \alpha\,\Delta T / h$) |
| Coeficiente de cortante | $k$ | – | Factor de corrección por cortante de Timoshenko: el área eficaz a cortante es $kA$. Usa `1` para ignorar casi por completo la deformación por cortante, unos 0,83 para rectángulos y $A_{alma}/A$ para secciones en I. |

La **Biblioteca de secciones** da valores aproximados para rectángulos, cuadrados y círculos, perfiles IPE y HEA, tubos RHS y CHS, y los perfiles W y HSS (rectangulares y circulares) de AISC. Sus coeficientes de cortante dependen de la forma: $h\,t_w/A$ para perfiles en I, $2ht/A$ para tubos rectangulares, 0,5 para tubos circulares, 0,833 para rectángulos y 0,9 para círculos. Toma los valores como punto de partida y compruébalos en un prontuario de perfiles antes de fiarte de ellos.

![La Biblioteca de secciones](/screenshots/es/sections-library.webp){.shot-lg}

### Secciones poligonales {#polygonal-sections}

Pestaña *Secciones* → **Sección poligonal**, o *O definir una forma poligonal* en el diálogo *Añadir sección*, abre un editor de formas.

![El editor de secciones poligonales con la plantilla de sección en I, sus ejes principales y la elipse de inercia](/screenshots/es/sections-polygon.webp)

- **Empieza** con una plantilla (rectángulo, I, T, L, perfil en U, rectangular o circular hueca, círculo) con sus dimensiones y pulsa **Aplicar**.
- **Edita** la forma: arrastra los vértices (se ajustan al **Paso de ajuste**), haz clic en el punto medio de un lado para insertar un vértice, haz doble clic en un vértice para eliminarlo o escribe las coordenadas en la tabla de vértices. **Añadir hueco** añade un contorno interior. **Centrar en el centro de gravedad** mueve la forma para que su centro de gravedad quede en el origen.
- **Lee** el área $A$, el centro de gravedad, los momentos de inercia baricéntricos $I_y$, $I_z$, $I_{yz}$, los momentos principales $I_1$, $I_2$ con el ángulo de los ejes principales $\alpha$ (de $y$ al eje 1) y los radios de giro. El dibujo muestra la elipse de inercia.

Al guardar, $A$, $I_y$ y $h$ se rellenan a partir de la forma. En la tabla aparecen como solo lectura; usa el botón del polígono en la columna *Acciones* para volver a editar la forma. El coeficiente de cortante $k$ lo sigues introduciendo tú. Las coordenadas de la sección son locales y dextrógiras, con $x$ saliendo de la pantalla, $y$ hacia la izquierda y $z$ hacia abajo.

Si la forma no es simétrica respecto al plano del pórtico (un angular en L, por ejemplo), el editor avisa de que un análisis 2D solo es exacto si la barra está restringida frente al desplazamiento lateral y a la torsión en toda su longitud, por ejemplo por una losa. Cuando $I_{yz}$ es significativo, eliges qué rigidez a flexión usar: **Restringida lateralmente y a torsión en toda su longitud** ($I_y$) o **Libre de desplazarse lateralmente**, que es menor. La torsión no se incluye en ninguno de los dos casos.

::: tip Valores rápidos de comprobación
Para un rectángulo $b \times h$: $A = bh$, $I_y = bh^3/12$. Para un círculo macizo de diámetro $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Los materiales y las secciones pueden compartirse entre cualquier número de elementos. Cambiar un valor actualiza todos los elementos que lo usan y vuelve a resolver el modelo.
