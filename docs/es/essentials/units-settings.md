# Unidades y ajustes

Hay tres formas de llegar a la configuración:

- la pestaña **Configuración** sobre el visor, que la muestra a tamaño completo;
- la **etiqueta de unidades** abajo a la derecha del visor, que la abre en *Idioma y configuración regional*;
- **Más ajustes** bajo las opciones de visualización, que la abre en *Ajustes del visor*.

La configuración se guarda en el navegador y sobrevive a las recargas. **Restablecer configuración** devuelve a sus valores predeterminados los ajustes del visor, el formato numérico, los ejes, el botón para desplazar y las unidades de tu región; el idioma se conserva.

## Idioma y configuración regional {#language-locale}

![Configuración → Idioma y configuración regional](/screenshots/es/settings-language.webp)

**Idioma.** 12 idiomas de interfaz. También puedes abrir la aplicación con `?lang=<código>`: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`, `tr`.

**Formato numérico.** Cómo se escriben los resultados: *Automático*, *Científico* (predeterminado) o *Ingeniería*. Consulta [Formato numérico](/es/essentials/results#number-format).

**Sistema de coordenadas.** *x a la derecha, z hacia abajo* (predeterminado) o *x a la derecha, y hacia arriba*. La opción con y hacia arriba invierte el signo de los valores verticales y de los ángulos de apoyo, y renombra los ejes en todas las entradas, tablas, tooltips y exportaciones. El modelo y los archivos guardados no cambian. Consulta [Ejes con y hacia arriba](/es/elements/conventions#y-up-axes).

![El pórtico triarticulado con ejes y hacia arriba: el indicador de ejes de la esquina apunta y hacia arriba](/screenshots/es/settings-y-up.webp){.shot-lg}

**Sistema de unidades.** *SI (métrico)* o *Estadounidense (imperial)* fija de una vez todas las unidades de abajo. Si después cambias cualquier unidad por separado, el sistema aparece como *Personalizado*. En la primera visita eliges en el diálogo de bienvenida; antes de eso, EduBeam solo supone unidades estadounidenses si el navegador tiene configuración regional de EE. UU. *y* el ordenador está en una zona horaria de EE. UU.

**Unidades.** Cada magnitud tiene su propia unidad. Las entradas, las tablas, los tooltips y las etiquetas de los diagramas usan la unidad elegida, y cambiar una unidad convierte lo que se muestra. El modelo se guarda en SI, así que no se pierde nada al cambiar de un sistema a otro, y un enlace compartido abre el mismo modelo en cualquier unidad.

| Magnitud | Opciones | SI | Estadounidense |
| --- | --- | --- | --- |
| Longitud (geometría) | m, cm, mm, ft, in | m | ft |
| Dimensiones de sección | m, cm, mm, ft, in | m | in |
| Desplazamiento | m, cm, mm, ft, in | m | in |
| Área | m², cm², mm², ft², in² | m² | in² |
| Segundo momento de área | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Masa | kg, lb | kg | lb |
| Fuerza | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Momento flector | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Presión (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatura | °C, °F | °C | °F |

Las cargas lineales usan *fuerza / longitud* de las unidades elegidas (kN/m en SI, kip/ft en unidades estadounidenses), y la densidad, *masa / longitud³*. El coeficiente de dilatación térmica sigue la unidad de temperatura (1/K o 1/°F). Las cargas térmicas son *variaciones* de temperatura, así que 10 °C equivalen a 18 °F. Los giros están siempre en radianes.

Tonf es la tonelada-fuerza métrica (1000 kgf), no la tonelada corta estadounidense. Las unidades estadounidenses se convierten con sus definiciones exactas (1 ft = 0,3048 m, 1 kip = 4448,2216 N). En pies, escribe valores decimales como `5,5`; las reglas y la cruceta muestran pies y pulgadas (5′-6″).

## Ajustes del visor {#viewer-settings}

![Configuración → Ajustes del visor, con la vista previa en directo a la derecha](/screenshots/es/settings-viewer.webp)

Una **Vista previa** junto a los ajustes muestra un modelo pequeño que reacciona a cada cambio. Las etiquetas debajo de ella eligen qué resultado muestra, y al hacer clic en un color la vista previa cambia a ese resultado.

**Cuadrícula**
- **Mostrar cuadrícula** (<kbd>G</kbd>) dibuja la cuadrícula y las reglas.
- **Ajustar a la cuadrícula** (<kbd>S</kbd>) hace que los nodos que colocas o arrastras se ajusten al paso de la cuadrícula.
- **Mostrar cruceta** marca la posición del puntero en las reglas, para que puedas leer sus coordenadas (solo con ratón).
- **Paso de ajuste a la cuadrícula** es la separación en la unidad de longitud: 0,1 m por defecto, o 0,5 ft en unidades estadounidenses. Al cambiar entre unidades métricas y estadounidenses, un paso que sigue en su valor predeterminado pasa al predeterminado del otro sistema; un paso que hayas fijado tú se conserva.

**Tamaños**
- **Escala de resultados** (8–120 px, 48 por defecto) es la altura en pantalla de la mayor ordenada de un diagrama o de la mayor flecha. Cada diagrama se escala con su propio máximo, así que es un ajuste puramente visual; cámbialo cuando los diagramas sean demasiado grandes o demasiado pequeños.
- **Tamaño de apoyos** (50–150 %) y **Tamaño de fuente** (10–20 px). Las fuentes más grandes ayudan con un proyector.

**Orientación de las etiquetas de resultados**: *Perpendicular al diagrama* (las etiquetas siguen el diagrama) o *Siempre horizontales*.

**Comprobación del modelo**
- **Mostrar cómo puede moverse una estructura inestable** dibuja el contorno discontinuo de un mecanismo.
- **Animar el movimiento** lo hace oscilar de un lado a otro.

**Colores**: colores independientes para nodos, elementos, cargas, deformada, esfuerzo axil, esfuerzo cortante, momento flector y reacciones. Por defecto: N azul, V verde, M rojo, reacciones moradas, cargas naranjas.

## Controles y atajos {#controls-shortcuts}

**Desplazar con** define qué botón del ratón desplaza el lienzo: *Rueda o botón derecho del ratón* (predeterminado), *Rueda del ratón* o *Botón derecho*. La lista completa de atajos está en la página [Teclado, ratón y pantalla táctil](/es/reference/shortcuts).

## Qué se guarda en tu navegador {#what-is-stored-in-your-browser}

Además de la configuración, EduBeam guarda en el almacenamiento local del navegador:

- el **modelo actual**, guardado tras cada cambio, de modo que recargar la pestaña o volver a abrir la aplicación lo restaura;
- **Estructuras recientes**: los 10 últimos modelos que limpiaste o reemplazaste.

Ambos son por navegador y por dispositivo, y borrar los datos del sitio los elimina. Usa [Guardar proyecto o Compartir modelo](/es/essentials/import-export) para conservar un modelo o llevarlo a otro sitio.
