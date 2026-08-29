# Preguntas frecuentes

## General

### ¿Qué es EduBeam?

Un solver gratuito, de código abierto y basado en el navegador para vigas, pórticos y celosías planos, pensado para estudiantes, docentes e ingenieros que quieren respuesta inmediata. Ver [Introducción](/es/guide/introduction).

### ¿Es realmente gratis? ¿Necesito una cuenta?

Sí, y no. Abre [run.edubeam.app](https://run.edubeam.app/?lang=es) y empieza a modelar. No hay cuentas, instaladores ni límites de uso. El código está en [GitHub](https://github.com/janvorisek/edubeam).

### ¿Qué navegadores y dispositivos funcionan?

Cualquier Chrome, Edge, Firefox o Safari actual. Tabletas y móviles funcionan (toque, arrastrar para desplazar, pellizco para zoom, mantener pulsado para mover un nodo), pero con ratón y teclado se modela mucho más rápido.

### ¿Puedo usarlo sin conexión?

EduBeam es una aplicación web progresiva: una vez cargada sigue funcionando sin conexión, y el navegador puede ofrecer instalarla. Cuando hay una versión nueva, un diálogo pregunta antes de actualizar.

### ¿Dónde se guardan mis datos?

Solo en tu navegador. Los modelos nunca se envían a un servidor; el enlace compartido *es* el modelo. Ver [Importar, exportar y compartir](/es/essentials/import-export).

## Modelado

### ¿Cómo hago un empotramiento / apoyo fijo / apoyo deslizante?

Marca los grados de libertad: **Dx + Dz + Ry** = empotramiento, **Dx + Dz** = apoyo fijo, **Dz** = apoyo deslizante. Todas las combinaciones y sus símbolos están en [Nodos y apoyos](/es/essentials/nodes-supports#apoyos).

### ¿Cómo modelo una celosía?

Usa elementos viga y marca **las dos Rótulas de extremo** de cada barra en la pestaña *Elementos*. Aplica las cargas en los nudos. Ver [Elementos](/es/essentials/elements#rotulas-de-extremo).

### ¿Cómo pongo una rótula en un pórtico?

Marca la **Rótula de extremo** del elemento en el lado del nudo donde debe liberarse el momento. Articular *un* elemento en un nudo libera solo ese elemento.

### ¿Cómo añado un apoyo o una carga puntual en medio de una viga?

Añade un nodo sobre la viga con *Añadir con ratón* y elige **Conectar a la estructura**: la viga se divide en dos. Para una carga puntual sola ni siquiera necesitas un nodo: usa la carga de elemento **Carga concentrada** con posición.

### ¿Puedo aplicar el peso propio?

No automáticamente. Introdúcelo como carga uniformemente distribuida $f_z = \rho g A$.

### ¿Puedo modelar apoyos inclinados?

Sí: asigna al nodo un **Ángulo del SCL nodal**; sus grados de libertad se interpretan entonces en el sistema girado.

### ¿Hay casos o combinaciones de carga?

No, un solo caso de carga. Modela cada caso por separado y guárdalo o compártelo.

### ¿Por qué mis cargas apuntan hacia arriba?

Porque el eje global z apunta **hacia abajo**: `Fz` positivo es hacia abajo. Ver [convenio de signos](/es/elements/conventions).

## Resultados

### ¿Por qué no hay botón «Calcular»?

El modelo se resuelve automáticamente tras cada cambio. Si no aparecen resultados, el modelo aún no es resoluble; [Solución de problemas](/es/reference/troubleshooting) indica qué revisar.

### ¿Por qué mi flecha difiere ligeramente de la fórmula?

EduBeam usa vigas de Timoshenko, así que las flechas incluyen la deformación por cortante. En barras esbeltas la diferencia está muy por debajo del 1 %. Detalles y comparaciones resueltas en [Comprobar resultados a mano](/es/guide/verification).

### ¿Qué precisión tienen los resultados? ¿Necesito más elementos?

Para el análisis estático lineal el elemento viga es exacto con los tipos de carga soportados, así que basta un elemento por barra. Solo necesitas nodos adicionales donde quieras un apoyo, una rótula, un cambio de sección o un nodo para aplicar una carga.

### ¿Dónde se listan las reacciones?

En el visor, como flechas con valores (activa **Reacciones** en el panel de visualización). Las fuerzas en extremos de barra y los desplazamientos nodales están en la pestaña **Resultados**.

## Archivos y compartir

### ¿Cómo comparto un modelo?

**Compartir modelo** → **Copiar enlace**. El enlace contiene todo el modelo. Los destinatarios obtienen su propia copia editable; no hay colaboración en tiempo real.

### ¿Puedo incrustar un modelo en mi web o en unas diapositivas?

Sí: añade `&viewer=1` a un enlace compartido y ponlo en un `<iframe>`. Ver [Incrustar un visor de solo lectura](/es/essentials/import-export#incrustar-un-visor-de-solo-lectura).

### ¿Puedo exportar imágenes o tablas?

Todavía no. Usa una captura de pantalla para imágenes y copia el texto de la tabla para los números. Vota por la función en [GitHub](https://github.com/janvorisek/edubeam/issues).

### ¿Puedo generar modelos por programa?

Sí. El archivo de proyecto es JSON plano en unidades SI (ver la [descripción del formato](/es/essentials/import-export#formato-del-archivo-de-proyecto)) y se abre con *Abrir proyecto* o arrastrándolo.

## Soporte

### ¿Cómo informo de un error o pido una función?

Abre una incidencia en [GitHub](https://github.com/janvorisek/edubeam/issues) y adjunta un enlace compartido o un archivo de proyecto que la reproduzca. Soporte privado: [support@edubeam.app](mailto:support@edubeam.app).
