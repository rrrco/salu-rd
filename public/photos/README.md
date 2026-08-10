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

**Redimensionar antes de commitear.** Las fotos locales no pasan por el
optimizador de Next: el loader propio (`app/lib/imageLoader.ts`) solo procesa
URLs de Sanity y devuelve el resto tal cual, así que el archivo que está en el
repo es exactamente el que descarga cada visitante. Trabaja con el original en
alta y guarda aquí una versión de ~1500x2000 a calidad 84, que cubre pantallas
retina en los dos recortes y pesa menos de 500KB.

> Estado actual: `delivery.jpg` está listo. Camión cargado con cajas SALU, 3:4,
> sujeto centrado, luz de día cubierta. El original es de 3584x4800; en el repo
> vive reducido a 1500x2000 (483KB) por la razón de arriba, con margen de sobra
> para retina en ambos recortes. `animal.jpg` está en 1584x672; alcanza para pantallas medianas
> pero queda corto del ancho recomendado, así que en monitores grandes todavía se
> ve algo suave. Además viene ya recortada a 21:9, por lo que en móvil (4:5) el
> encuadre central deja al veterinario fuera y solo se ve el rebaño.
