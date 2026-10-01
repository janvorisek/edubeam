# Unidades y ajustes

Abre la configuración con el **botón ⚙ del visor → Más ajustes**, haciendo clic en la **etiqueta de unidades** de la esquina inferior derecha del visor o desde la pestaña **Configuración** sobre el visor. La configuración se guarda en el navegador y sobrevive a las recargas; **Restablecer configuración** devuelve los ajustes del visor a sus valores predeterminados y las unidades a las de tu región (el idioma se conserva).

## Idioma y configuración regional

**Idioma**: 11 idiomas de interfaz. También puedes abrir la aplicación con `?lang=<código>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Sistema de unidades**: *SI (métrico)* o *Estadounidense (imperial)* ajusta de una vez todas las unidades de abajo. Si después cambias cualquier unidad por separado, el sistema aparece como *Personalizado*. En la primera visita, EduBeam empieza en unidades estadounidenses si el navegador tiene la configuración regional de EE. UU. *y* el ordenador está en una zona horaria de EE. UU.; en cualquier otro caso, empieza en SI.

**Unidades**: cada magnitud tiene su propia unidad. Entradas, tablas, tooltips y etiquetas de los diagramas usan la unidad elegida, y cambiarla convierte lo que se muestra (el modelo se guarda internamente en SI, así que cambiar de unidades no pierde nada, y un enlace compartido abre el mismo modelo en cualquier unidad).

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

Las cargas distribuidas usan *fuerza / longitud* en las unidades elegidas (kN/m en SI, kip/ft en unidades estadounidenses) y la densidad, *masa / longitud³*. El coeficiente de dilatación térmica sigue la unidad de temperatura (1/K o 1/°F). Las cargas de temperatura son *variaciones* de temperatura, así que 10 °C equivalen a 18 °F. Los giros siempre están en radianes.

Tonf es la tonelada-fuerza métrica (1000 kgf), no la tonelada corta estadounidense. Las unidades estadounidenses se convierten con sus definiciones exactas (1 ft = 0,3048 m, 1 kip = 4448,2216 N).

**Sistema de coordenadas**: *x a la derecha, z hacia abajo* (predeterminado) o *x a la derecha, y hacia arriba*. La opción y hacia arriba invierte el signo de los valores verticales y de los ángulos de apoyo y renombra los ejes en todas las entradas, tablas, descripciones y exportaciones; el modelo y los archivos guardados no cambian. Consulta [Eje y hacia arriba](/es/elements/conventions#y-up-axes).

## Ajustes del visor

Una **Vista previa** en la parte superior muestra un modelo pequeño que reacciona a cada cambio.

**Cuadrícula**
- **Mostrar cuadrícula** (<kbd>G</kbd>): dibuja la cuadrícula y las reglas.
- **Ajustar a la cuadrícula** (<kbd>S</kbd>): los nodos colocados o arrastrados con el ratón se ajustan al paso.
- **Paso de ajuste a la cuadrícula**: separación en la unidad de longitud (0,1 m por defecto, o 0,5 ft en unidades estadounidenses). Al cambiar entre unidades métricas y estadounidenses, un paso que sigue en su valor predeterminado pasa al predeterminado del otro sistema; un paso que hayas fijado tú se conserva. Las reglas también cuentan en la unidad de longitud; en pies, las reglas y la cruceta muestran pies y pulgadas (5′-6″), mientras que las entradas y las tablas mantienen pies decimales (5,5).

**Etiquetas de resultados**
- **Orientación de las etiquetas de resultados**: *Perpendicular al diagrama* (las etiquetas siguen el diagrama) o *Siempre horizontales*.

**Tamaños**
- **Escala de resultados** (0–120 px): altura en pantalla de la mayor ordenada de los diagramas / de la mayor flecha. Los diagramas se normalizan con su propio máximo, así que es un ajuste puramente visual; cámbialo cuando los diagramas sean demasiado grandes o pequeños para el modelo.
- **Tamaño de apoyos** (0,5–1,5) y **Tamaño de fuente** (10–20 px).

**Colores**: colores independientes para nodos, elementos, cargas, deformada, esfuerzo axil, cortante, flector y reacciones. Por defecto: N azul, V verde, M rojo, reacciones morado, cargas naranja.

## Controles y atajos

**Desplazar con**: qué botón del ratón desplaza el lienzo: *central o derecho* (por defecto), *Rueda del ratón* (solo botón central) o solo *Botón derecho*. La lista completa de atajos está en la página [Teclado y ratón](/es/reference/shortcuts).

## Lo que se guarda automáticamente

Además de la configuración, EduBeam guarda el **modelo actual** en el almacenamiento local del navegador tras cada cambio. Recargar la pestaña o reabrir la aplicación lo restaura. Esto es por navegador y dispositivo; para llevar un modelo a otro sitio usa [Guardar proyecto o Compartir modelo](/es/essentials/import-export).
