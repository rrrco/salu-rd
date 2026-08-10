# Fotos editoriales

Coloca aquí las fotos. El sitio ya reserva el espacio de cada una, así que al
reemplazar el archivo con el nombre exacto la foto aparece sin ningún cambio de
código y sin saltos de layout.

| Archivo | Proporción | Qué debe mostrar |
|---|---|---|
| `animal.jpg` | 21:9 horizontal | Ganado sano (bovinos, aves, equinos, porcinos) o un veterinario atendiendo animales en campo. Tomada en horizontal, con el sujeto ligeramente a la derecha del centro y espacio limpio en el tercio izquierdo para el texto que va encima. |
| `delivery.jpg` | 3:4 vertical | Cajas de producto en su entorno real, o una entrega en curso. |

**El recorte es agresivo, así que el sujeto va al centro.** Ambas fotos se
recortan con `object-cover` y cambian de proporción según el ancho de pantalla:
`animal.jpg` va de 21:9 en escritorio a 4:5 vertical en móvil, y `delivery.jpg`
de 4:3 en móvil a una columna vertical alta en escritorio. Lo que quede en los
bordes desaparece. Si el sujeto no está cerca del centro del encuadre, se pierde
en alguna pantalla.

**No hace falta recortar el fondo.** El sistema aplica un tinte teal y una ligera
desaturación a todas, de modo que fotos de distintas fuentes y con distinta
iluminación se lean como un mismo conjunto. Los fondos suman. Por el mismo tinte,
conviene evitar luz muy cálida o dorada: se vuelve verdosa. Luz de día neutra o
cielo cubierto funcionan mejor.

Formato: JPG o WebP. Ancho mínimo recomendado 3000px para `animal.jpg`, y
2400x3200 para `delivery.jpg`. `delivery.jpg` necesita más ancho del que parece:
en escritorio se recorta a una columna vertical angosta (≈2:3), así que casi un
tercio del ancho original se descarta.

> Estado actual: `delivery.jpg` es una foto propia (camión cargado con cajas
> SALU) en 896x1200. El encuadre es correcto —proporción 3:4, sujeto centrado,
> luz de día cubierta— pero queda por debajo del mínimo: en escritorio el recorte
> vertical solo aporta 776x1200 px reales contra los ~1010x1560 que pide una
> pantalla retina, así que se ve algo suave. Reemplazar por una versión 3:4 de al
> menos 2400x3200 en cuanto exista. `animal.jpg` está en 1584x672; alcanza para pantallas medianas
> pero queda corto del ancho recomendado, así que en monitores grandes todavía se
> ve algo suave. Además viene ya recortada a 21:9, por lo que en móvil (4:5) el
> encuadre central deja al veterinario fuera y solo se ve el rebaño.
