# Solución de problemas

## No se dibujan resultados {#no-results-are-drawn}

Los resultados solo aparecen cuando el modelo se puede resolver. Comprueba, en este orden:

1. **Lee el mensaje de arriba a la izquierda del visor.**
   - *No hay materiales definidos.* / *No hay secciones definidas.*: añade uno con el botón **Añadir**.
   - Una etiqueta azul **Faltan apoyos**: el modelo simplemente está sin terminar. Añade apoyos. Señala la etiqueta para ver, como contorno discontinuo, cómo puede moverse todavía la estructura.
   - Un **mensaje rojo**: algo está mal. Indica el problema, o dice *Errores en el modelo: N* cuando hay varios. Haz clic en **Mostrar detalles** y corrige cada punto (consulta la tabla de abajo). Los nodos o rótulas implicados aparecen rodeados con un círculo en el lienzo.
   - Un **mensaje amarillo**: advertencias. El modelo se ha resuelto de todos modos; puedes ocultarlas.
2. **¿Hay suficientes apoyos?** El solver necesita al menos tres GDL restringidos, y los apoyos deben sujetar la estructura. Una viga sobre dos rodillos (Dz + Dz) solo tiene dos y se desliza. Añade un `Dx` en algún sitio, o un `Ry` en uno de los apoyos.
3. **¿Están conectados los elementos?** Dos nodos con las mismas coordenadas siguen siendo dos nodos distintos. Elimina el sobrante y vuelve a conectar, o coloca los nodos sobre los elementos con **Conectar a la estructura**.
4. **¿Demasiadas rótulas?** Rótulas en ambos extremos de un pilar, o un cuadrado de barras articuladas sin diagonal, forman un mecanismo. EduBeam rodea las rótulas con un círculo y muestra el movimiento.
5. **¿Una rigidez nula?** Un `E`, `A` o `Iy` introducido por error como 0, o en la unidad equivocada, hace que parte de la estructura se mueva casi sin resistencia. EduBeam lo indica como *inestable*.

![Mostrar detalles lista cada problema con una sugerencia y puede mostrar el movimiento](/screenshots/es/ui-diagnostics.webp){.shot-lg}

## Mensajes {#messages}

**Mostrar detalles** abre un diálogo titulado *No se puede resolver el modelo* (errores), *Aún no se puede resolver* (faltan apoyos) o *Advertencias del modelo*. Su enlace **Solución de problemas** lleva a esta página.

### Falta por completar {#still-needed}

| Mensaje | Significado / solución |
| --- | --- |
| *La estructura necesita apoyos para poder resolverse.* | Hay menos de tres GDL restringidos en total. Añade apoyos. |
| *Una parte independiente de la estructura (nodos …) tiene menos de 3 grados de libertad restringidos y puede moverse libremente.* | El modelo está en trozos y uno de ellos flota. Conéctalo o ponle apoyos. |

### Errores {#errors}

| Mensaje | Significado / solución |
| --- | --- |
| *La estructura tiene suficientes apoyos, pero no la sujetan: todavía puede …* | Los apoyos son todos paralelos, o sus líneas de acción se cortan en un punto. El contorno discontinuo muestra el movimiento; cambia la dirección de uno de los apoyos. El mismo mensaje habla de una *parte independiente* si solo afecta a un trozo. |
| *Los apoyos sujetan la estructura, pero sigue siendo un mecanismo: sus barras pueden girar alrededor de las articulaciones del nudo …* | Las rótulas permiten que las barras giren unas respecto a otras, como en un pórtico con rótulas en la cabeza de ambos pilares o en un cuadrado articulado sin diagonal. Quita una rótula, o añade una barra o un apoyo. |
| *La estructura es inestable; se mueve prácticamente sin resistencia: nodo …* | Casi un mecanismo, o una rigidez cercana a cero. Comprueba los apoyos, las rótulas y los valores de `E`, `A` e `Iy`. |
| *La estructura es un mecanismo: la matriz de rigidez es singular.* | Algo puede moverse libremente y las comprobaciones anteriores no lo han detectado. Comprueba que cada parte esté sujeta por al menos tres restricciones y que las rótulas no dejen una barra libre para girar. |
| *El elemento … hace referencia al nodo / material / sección transversal inexistente …* | El objeto referenciado se eliminó, normalmente en un archivo JSON editado a mano. Reasígnalo en la tabla de *Elementos*. |
| *El elemento … debe hacer referencia a exactamente 2 nodos.* | Un elemento dañado en un archivo importado. Elimínalo y vuelve a crearlo. |
| *La carga nodal / El desplazamiento impuesto #n hace referencia al nodo inexistente …* | Elimina la carga o asígnale un nodo. |
| *La carga de elemento #n hace referencia al elemento inexistente …* | Elimina la carga. |
| *El solver falló por una incoherencia interna del modelo…* | Un fallo genérico. Deshaz el último paso, o guarda el archivo e [informa del problema](https://github.com/janvorisek/edubeam/issues). |

### Advertencias {#warnings}

El modelo se resuelve de todos modos, pero revisa estas:

| Mensaje | Significado / solución |
| --- | --- |
| *El nodo … no está conectado a ningún elemento y el solver lo ignora.* | Un nodo suelto. Elimínalo o conéctalo. |
| *El nodo … tiene apoyo, pero ningún elemento llega a él, así que el apoyo no transmite nada.* | Un apoyo en un nodo suelto. |
| *El elemento … hace referencia al mismo nodo en ambos extremos.* | Un elemento de longitud cero. Elimínalo. |
| *La carga nodal / El desplazamiento impuesto #n contiene valores no válidos.* | Una componente que no es un número. Edita la carga. |

## Los resultados parecen erróneos {#results-look-wrong}

| Síntoma | Causa probable |
| --- | --- |
| Las cargas actúan hacia arriba | El eje global **z apunta hacia abajo**, así que un `Fz`/`fz` positivo es hacia abajo. Los valores negativos apuntan hacia arriba. Consulta el [convenio de signos](/es/elements/conventions). Con ejes y hacia arriba es al revés. |
| La flecha es 1000 veces demasiado grande o pequeña | Una confusión de unidades: `E` introducido en Pa cuando la unidad es MPa, o `Iy` en cm⁴ cuando la unidad es m⁴. Comprueba la etiqueta de unidades abajo a la derecha del visor. |
| La flecha es algo mayor que la fórmula del libro | La deformación por cortante de Timoshenko. Aumenta el coeficiente de cortante de la sección, o usa una barra esbelta, para acercarte a los valores de Euler–Bernoulli. Consulta [Comprobar resultados a mano](/es/guide/verification). |
| Un signo parece «incorrecto» | Lee el signo en las etiquetas, no por el lado del diagrama. M positivo tracciona la fibra inferior. Las fuerzas en extremos de *Resultados de elementos* siguen los ejes locales del elemento, no el convenio N-V-M. |
| Dos pilares idénticos muestran cortantes de signo opuesto | El signo de V sigue la dirección de cada elemento. Intercambia los nodos de uno de ellos para compararlos. |
| Números como `4 · 10¹` | El formato numérico científico. Elige *Automático* en *Configuración → Idioma y configuración regional → Formato numérico*. |
| Los diagramas son enormes o diminutos | Es puramente visual. Ajusta la **Escala de resultados** en *Configuración → Ajustes del visor*. |
| Una carga en coordenadas locales apunta al revés | El eje x local del elemento va de su nodo *inicial* a su nodo *final*. Intercambia los nodos o cambia el signo. |
| La carga de una barra inclinada no cuadra | **LCS** está marcado por defecto, así que `fz` actúa perpendicular a la barra. Desmárcalo para una carga vertical. |
| Una carga térmica no hace nada | Una estructura isostática se deforma libremente con la temperatura, sin esfuerzos. Comprueba que α ≠ 0 y, para el gradiente, que la altura h de la sección esté definida. |

## Problemas de la interfaz {#interface-issues}

| Síntoma | Solución |
| --- | --- |
| Los atajos no hacen nada | Haz clic primero en el lienzo: las teclas se ignoran mientras un campo de texto tiene el foco. |
| No puedo desplazar la vista | Por defecto se desplaza con el botón central o derecho del ratón; cámbialo en *Configuración → Controles y atajos*. En un trackpad, el desplazamiento con dos dedos hace zoom; haz clic y arrastra con dos dedos para desplazar. |
| Mi modelo ha desaparecido | Al abrir un enlace, un archivo o un ejemplo, y al limpiar, el modelo anterior se conserva: **☰ → Estructuras recientes**, o <kbd>Ctrl</kbd>+<kbd>Z</kbd>. |
| Idioma equivocado | *Configuración → Idioma y configuración regional*, o añade `?lang=es` a la dirección. |
| Los cambios de configuración no se guardan | El almacenamiento local está bloqueado (ventana privada, modo de privacidad estricto). La configuración, el guardado automático y las Estructuras recientes lo necesitan. |

## Informar de un error {#reporting-a-bug}

Abre una [incidencia en GitHub](https://github.com/janvorisek/edubeam/issues) indicando tu navegador y sistema operativo, qué esperabas y, lo más útil de todo, un **enlace para compartir** o el **archivo de proyecto** que reproduzca el problema.
