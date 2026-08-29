# Elementos, materiales y secciones

## El elemento viga

<Edubeam /> tiene un único tipo de elemento: una **viga de Timoshenko 2D** en el plano x–z con tres grados de libertad en cada extremo (`Dx`, `Dz`, `Ry`). Transmite esfuerzo axil, cortante y flector, e incluye la deformación por cortante (por eso la sección tiene un coeficiente de cortante). La formulación completa está en el [manual teórico](/es/elements/beam).

<TrussElement :moment="true" caption="Elemento viga 2D: tres grados de libertad por nodo" />

Los diagramas a lo largo de un elemento son exactos para el modelo lineal, así que basta un elemento por barra. Añade nodos intermedios solo donde necesites un apoyo, una rótula, un cambio de sección o un nodo para aplicar una carga.

### Añadir elementos

| Método | Cómo |
| --- | --- |
| **Diálogo** | Pestaña *Elementos* → **Añadir elemento** (o menú del lienzo → *Añadir elemento*): elige **Nodo inicial**, **Nodo final**, material y sección. |
| **Ratón** | Pestaña *Elementos* → **Añadir con ratón** (o mantén <kbd>Ctrl</kbd> con la opción del menú del lienzo). Haz clic en un nodo para empezar y en el siguiente para conectar; un clic en el lienzo vacío crea allí un nodo nuevo. Sigue haciendo clic para dibujar una poligonal; <kbd>Esc</kbd> termina. Se asignan automáticamente el primer material y la primera sección del modelo. |

::: warning Primero materiales y secciones
Un elemento no puede existir sin material y sección. Si no hay ninguno, el visor muestra *No hay materiales definidos.* / *No hay secciones definidas.* con el acceso directo **Añadir**.
:::

### Orientación del elemento

El **eje x local** va del nodo inicial al nodo final. Esto importa para:

- las cargas en coordenadas locales (`fx`, `fz` en SCL),
- la *Posición de carga desde el nodo inicial* de las cargas concentradas,
- el orden de las fuerzas en extremos (`X12, Z12, M12` en el inicio, `X21, Z21, M21` en el final) en la tabla de resultados.

Usa **Intercambiar nodos** en la tabla *Elementos* para invertir un elemento.

### Rótulas de extremo

Cada elemento tiene dos casillas **Rótulas de extremo** (inicio / final) en la tabla *Elementos*. Una rótula marcada libera el momento flector en ese extremo (condensación estática del grado de libertad de giro), de modo que:

- una rótula → una articulación dentro de un pórtico o viga continua (momento nulo allí);
- las dos rótulas → una **barra de celosía** que solo transmite esfuerzo axil.

<TrussElement :hinges="[true, true]" caption="Ambos extremos articulados → barra de celosía" />

Cuando dos elementos concurren en un nodo y solo uno está articulado, el otro sigue transmitiendo momento al nodo; articula el elemento que quieres liberar, no «el nodo».

### Editar y eliminar

Haz clic en un elemento y usa el menú contextual (**Editar elemento**, **Añadir carga**, **Matriz de rigidez**, **Eliminar**) o edita directamente en la tabla *Elementos*. Eliminar un elemento elimina también sus cargas. **Matriz de rigidez** abre una ventana flotante con la matriz 6 × 6 del elemento en coordenadas locales y globales, muy útil para comprobar el ensamblaje a mano en el método de la rigidez.

## Materiales

Pestaña *Materiales* → **Añadir material**:

| Campo | Símbolo | Unidad | Notas |
| --- | --- | --- | --- |
| Módulo de Young (módulo de elasticidad) | $E$ | unidad de presión (MPa por defecto) | Acero ≈ 210 000 MPa, hormigón ≈ 30 000 MPa, madera ≈ 11 000 MPa |
| Módulo de cortante | $G$ | unidad de presión | $G = E / (2(1+\nu))$; acero ≈ 81 000 MPa. Solo afecta al término de cortante de Timoshenko. |
| Densidad | $\rho$ | kg/m³ | Se guarda con el proyecto; el solver estático no la usa (no hay carga de peso propio). |
| Coeficiente de dilatación térmica | $\alpha$ | 1/K | Lo usan las [cargas térmicas](/es/essentials/loads#carga-termica). Acero 12 × 10⁻⁶. |

La **Biblioteca de materiales** ofrece valores predefinidos: aceros estructurales (S235, S275, S355, inoxidable), aleaciones de aluminio, cobre/latón/bronce, titanio, clases de hormigón, madera (C24, GL24h, GL32h), vidrio, GFRP/CFRP y polímeros habituales. Elige uno en el diálogo de la biblioteca o en *O elegir de la biblioteca* dentro del diálogo *Añadir material*.

## Secciones

Pestaña *Secciones* → **Añadir sección**:

| Campo | Símbolo | Unidad | Notas |
| --- | --- | --- | --- |
| Área | $A$ | unidad de área | Rigidez axil $EA$ |
| Momento de inercia (segundo momento de área) | $I_y$ | m⁴ (o la unidad elegida) | Rigidez a flexión $EI_y$ respecto al eje de flexión en el plano |
| Altura (canto) | $h$ | unidad de longitud | La usan las cargas térmicas con gradiente (curvatura $= \alpha\,\Delta T / h$) |
| Coeficiente de cortante | $k$ | – | Factor de corrección por cortante: área eficaz a cortante $= kA$. Usa `1` para (casi) ignorar la deformación por cortante; ≈ 0,83 en rectángulos; en perfiles en I, $A_{alma}/A$. |

La **Biblioteca de secciones** proporciona valores aproximados para rectángulos, cuadrados, círculos, perfiles IPE y HEA, tubos RHS y CHS. Tómalos como punto de partida y compruébalos en un prontuario antes de fiarte de ellos.

::: tip Valores rápidos de comprobación
Rectángulo $b \times h$: $A = bh$, $I_y = bh^3/12$. Círculo macizo de diámetro $d$: $A = \pi d^2/4$, $I_y = \pi d^4/64$.
:::

Materiales y secciones pueden ser compartidos por cualquier número de elementos; cambiar un valor actualiza todos los elementos que lo usan y recalcula el modelo.
