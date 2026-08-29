# Unidades y ajustes

Abre la configuración con el **botón ⚙ del visor → Más ajustes**, haciendo clic en la **etiqueta de unidades** de la esquina inferior derecha del visor o desde la pestaña **Configuración** sobre el visor. La configuración se guarda en el navegador y sobrevive a las recargas; **Restablecer configuración** devuelve los ajustes del visor a sus valores predeterminados (el idioma y las unidades se conservan).

## Idioma y configuración regional

**Idioma**: 11 idiomas de interfaz. También puedes abrir la aplicación con `?lang=<código>` (`en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn`, `th`, `uk`, `ru`).

**Unidades**: cada magnitud tiene su propia unidad. Entradas, tablas, tooltips y etiquetas de los diagramas usan la unidad elegida, y cambiarla convierte lo que se muestra (el modelo se guarda internamente en SI, así que cambiar de unidades no pierde nada).

| Magnitud | Opciones | Por defecto |
| --- | --- | --- |
| Longitud | m, cm, mm, in, ft | m |
| Área | m², cm², mm², in², ft² | m² |
| Segundo momento de área | m⁴, cm⁴, mm⁴, in⁴, ft⁴ | m⁴ |
| Masa | kg, lb | kg |
| Fuerza | N, kN, MN, lbf, tonf, kgf | kN |
| Momento flector | Nmm, Nm, kNm, MNm, tonf·m, lbf·in, lbf·ft | kNm |
| Presión (E, G) | Pa, kPa, MPa, GPa, psi, ksc | MPa |

Las cargas distribuidas usan *fuerza / longitud* en las unidades elegidas (kN/m por defecto). Los ángulos siempre están en radianes y las temperaturas siempre en °C/K.

::: tip Unidades imperiales
Elige ft (o in), in², in⁴, lbf y psi según necesites: no hay un único interruptor «imperial», cada magnitud se ajusta por separado.
:::

## Ajustes del visor

Una **Vista previa** en la parte superior muestra un modelo pequeño que reacciona a cada cambio.

**Cuadrícula**
- **Mostrar cuadrícula** (<kbd>G</kbd>): dibuja la cuadrícula y las reglas.
- **Ajustar a la cuadrícula** (<kbd>S</kbd>): los nodos colocados o arrastrados con el ratón se ajustan al paso.
- **Paso de ajuste a la cuadrícula**: separación en metros (0,1 por defecto).

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
