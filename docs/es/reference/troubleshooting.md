# Solución de problemas

## No se dibujan resultados

Los resultados solo aparecen cuando el modelo se puede resolver. Comprueba, en este orden:

1. **¿Hay un aviso rojo en el visor?** *No hay materiales definidos.* / *No hay secciones definidas.* → añade uno. *Model has N error(s)* → haz clic en **Show details** y corrige cada punto (ver la tabla siguiente).
2. **¿Suficientes apoyos?** El solver necesita al menos tres grados de libertad restringidos *y* ningún mecanismo. Una viga sobre dos rodillos (Dz + Dz) solo tiene dos y se desliza; un pórtico todo articulado sin arriostrar puede ser un mecanismo aunque tenga muchos apoyos. Añade un `Dx` en algún sitio, o un `Ry` en un apoyo.
3. **¿Están conectados los elementos?** Dos nodos con las mismas coordenadas siguen siendo dos nodos distintos. Elimina el sobrante y vuelve a conectar, o coloca nodos sobre elementos con **Conectar a la estructura**.
4. **¿Rótulas por todas partes?** Un nodo cuyos elementos están todos articulados y sin `Ry` restringido tiene un giro indefinido. Desmarca una rótula o restringe `Ry` en ese nodo.
5. **Números absurdos** (desplazamientos de millones) significan que la estructura es casi un mecanismo; EduBeam oculta esos resultados. Busca un apoyo que falte o una rigidez casi nula (`E`, `A` o `Iy` introducidos por error como 0 o en la unidad equivocada).

## Mensajes de error

Mensajes de **Show details** (diálogo *Cannot solve model*, por ahora solo en inglés):

| Mensaje | Significado / solución |
| --- | --- |
| *Model needs at least 3 constrained DOFs to be stable in 2D analysis.* | Añade apoyos hasta restringir al menos tres grados de libertad en total. |
| *Element X references missing node / material / cross section Y.* | La entidad referenciada se eliminó (normalmente en un JSON editado a mano). Reasígnala en la tabla *Elementos*. |
| *Element X must reference exactly 2 nodes.* | Elemento corrupto en un archivo importado; elimínalo y créalo de nuevo. |
| *Nodal load / Prescribed displacement #n references missing node Y.* | Elimina la carga o reasígnala. |
| *Element load #n references missing element Y.* | Elimina la carga. |
| *Solver failed due to an internal model inconsistency…* | Fallo genérico; deshaz el último paso o guarda el archivo e [informa del problema](https://github.com/janvorisek/edubeam/issues). |

Las advertencias (diálogo *Model warnings*) no detienen el cálculo: *Element X references the same node at both ends* (elemento de longitud cero: elimínalo) y *… contains invalid values* (una carga con una componente no numérica: edítala).

## Los resultados parecen erróneos

| Síntoma | Causa probable |
| --- | --- |
| Las cargas actúan hacia arriba | El eje global **z apunta hacia abajo**, así que `Fz`/`fz` positivo es hacia abajo. Los valores negativos apuntan hacia arriba. Ver [convenio de signos](/es/elements/conventions). |
| La flecha es 1000× mayor o menor | Confusión de unidades: `E` introducido en Pa con la unidad en MPa, o `Iy` en cm⁴ con la unidad en m⁴. Revisa la etiqueta de unidades abajo a la derecha del visor. |
| La flecha es ligeramente mayor que la fórmula del libro | Deformación por cortante de Timoshenko. Aumenta el coeficiente de cortante de la sección (o usa una barra esbelta) para acercarte a los valores de Euler–Bernoulli. Ver [Comprobar resultados a mano](/es/guide/verification). |
| El diagrama de momentos está en el lado «equivocado» | El lado es solo un convenio de dibujo; lee el signo en las etiquetas: positivo significa tracción en la fibra inferior. |
| Los diagramas son enormes / diminutos | Puramente visual: ajusta **Escala de resultados** en *Configuración → Ajustes del visor*. |
| Una carga en coordenadas locales apunta al revés | El eje x local del elemento va del nodo *inicial* al *final*. Usa **Intercambiar nodos** o cambia el signo. |
| La carga térmica no hace nada | Las estructuras isostáticas se deforman libremente con la temperatura sin esfuerzos. Comprueba que α ≠ 0 y, para el gradiente, que la altura h de la sección está definida. |

## Problemas de la interfaz

| Síntoma | Solución |
| --- | --- |
| Los atajos no hacen nada | Haz clic primero en el lienzo: las teclas se ignoran mientras un campo de texto tiene el foco. |
| No se puede desplazar el lienzo | El desplazamiento usa por defecto el botón central/derecho del ratón; cámbialo en *Configuración → Controles y atajos*. En un trackpad usa dos dedos o cambia el ajuste a *Botón derecho*. |
| El modelo desapareció tras una actualización | Una actualización que borra el almacenamiento se anuncia antes con un diálogo; cancélala y guarda el proyecto antes de actualizar. |
| Idioma incorrecto | *Configuración → Idioma y configuración regional*, o añade `?lang=es` a la URL. |
| Los cambios de configuración no se guardan | El almacenamiento local está bloqueado (ventana privada, modo de privacidad estricto). La configuración y el guardado automático lo necesitan. |

## Informar de un error

Abre una [incidencia en GitHub](https://github.com/janvorisek/edubeam/issues) indicando navegador y sistema operativo, lo que esperabas y, lo más útil de todo, un **enlace compartido** o el **JSON del proyecto** que reproduce el problema.
