# Manual del investigador — Consultas SQL

*Contenido para armar el manual físico/imprimible en Canva. No es parte del sitio web (no está enlazado ni se despliega); es solo el texto fuente.*

## Introducción

Esta base de datos se consulta con **SQL**, un lenguaje para pedirle información a una base de datos. A continuación están las formas básicas de buscar y combinar datos que hacen falta para investigar el caso. Cada una tiene una explicación simple y un ejemplo de código que se puede adaptar cambiando el nombre de la tabla, la columna o el valor buscado.

Para referencia visual, el diagrama completo de la base de datos está en `schema.svg`, y las capturas de cada ejemplo ejecutándose en la consola real están en la carpeta `manual-img/` (`select-all.png`, `where.png`, `in.png`, `or.png`, `and.png`, `between.png`, `like-starts.png`, `like.png`, `orderby.png`, `aggregate.png`, `join.png`, `join-triple.png`, `subquery.png`, `groupby.png`) por si querés usarlas como capturas de pantalla en el diseño.

---

## 1. Ver todo el contenido de una tabla

Escribí `SELECT * FROM` seguido del nombre de la tabla. El asterisco (`*`) significa "todas las columnas". Como las tablas pueden tener miles de filas, agregá `LIMIT` y un número para ver solo unas pocas.

```sql
SELECT * FROM persona LIMIT 5;
```

---

## 2. Buscar por un valor exacto (WHERE)

La cláusula `WHERE` filtra los resultados según una condición. El texto va entre comillas simples (`'`) y tiene que coincidir exactamente, mayúsculas incluidas.

```sql
SELECT * FROM reporte_escena_crimen
WHERE ciudad = 'Chicago'
LIMIT 4;
```

---

## 3. Buscar entre varios valores posibles (IN)

En vez de repetir la misma columna con `OR` muchas veces, usá `IN` con una lista de valores entre paréntesis.

```sql
SELECT * FROM reporte_escena_crimen
WHERE ciudad IN ('Chicago', 'Reno')
LIMIT 5;
```

---

## 4. Que alcance con que se cumpla una sola condición (OR)

Si con que se cumpla cualquiera de dos condiciones ya sirve, unilas con `OR` en vez de `AND`.

```sql
SELECT * FROM reporte_escena_crimen
WHERE ciudad = 'Chicago'
   OR ciudad = 'Reno'
LIMIT 5;
```

---

## 5. Que se cumplan todas las condiciones a la vez (AND)

Si hace falta que se cumplan dos condiciones al mismo tiempo, unilas con `AND`.

```sql
SELECT * FROM reporte_escena_crimen
WHERE tipo = 'hurto'
  AND ciudad = 'Chicago';
```

---

## 6. Comparar números: mayor, menor o en un rango

Con columnas numéricas se puede usar `>`, `<` o `BETWEEN valor1 AND valor2` para buscar un rango de valores.

```sql
SELECT * FROM licencia_conducir
WHERE edad BETWEEN 85 AND 89
LIMIT 5;
```

---

## 7. Buscar cuando se sabe cómo empieza el texto (LIKE)

Se usa `LIKE` en vez de `=`, con el símbolo `%` como comodín. `%` significa "cualquier cosa (o nada) acá". `'Mar%'` encuentra todo lo que empieza con "Mar".

```sql
SELECT * FROM persona
WHERE nombre LIKE 'Mar%'
LIMIT 5;
```

---

## 8. Buscar cuando solo se sabe una parte, en cualquier lugar

Poniendo `%` de los dos lados, `'%Erickson%'` encuentra cualquier nombre que contenga "Erickson" en cualquier posición, no solo al principio.

```sql
SELECT * FROM persona
WHERE nombre LIKE '%Erickson%';
```

---

## 9. Ordenar los resultados (ORDER BY)

`ORDER BY` ordena los resultados según una columna. Se agrega `DESC` para ir de mayor a menor, o `ASC` (el orden por defecto) para ir de menor a mayor.

```sql
SELECT * FROM licencia_conducir
ORDER BY edad DESC
LIMIT 5;
```

---

## 10. Contar, sumar y promediar

`COUNT(*)` cuenta filas. `MIN`, `MAX`, `AVG` y `SUM` hacen lo mismo con el mínimo, máximo, promedio y suma de una columna numérica. Se pueden combinar varias en una sola consulta.

```sql
SELECT COUNT(*) AS cantidad,
       MIN(edad) AS edad_minima,
       MAX(edad) AS edad_maxima,
       AVG(edad) AS edad_promedio
FROM licencia_conducir;
```

---

## 11. Cruzar datos de dos tablas relacionadas (JOIN)

Los datos del caso están repartidos en varias tablas conectadas entre sí (ver el diagrama del esquema). `JOIN` combina dos tablas en una sola consulta, indicando con `ON` qué columnas las conectan.

```sql
SELECT persona.nombre, entrevista.transcripcion
FROM persona
JOIN entrevista ON persona.id = entrevista.id_persona
LIMIT 4;
```

---

## 12. Cruzar datos de tres tablas a la vez

Se puede encadenar más de un `JOIN` para traer columnas de varias tablas relacionadas en la misma consulta.

```sql
SELECT persona.nombre,
       licencia_conducir.color_ojos,
       ingreso.ingreso_anual
FROM persona
JOIN licencia_conducir ON persona.id_licencia = licencia_conducir.id
JOIN ingreso ON persona.dni = ingreso.dni
LIMIT 5;
```

---

## 13. Usar el resultado de una consulta dentro de otra (subconsulta)

Cuando el dato que se busca en una tabla depende de una condición sobre otra tabla, se puede poner esa segunda consulta entre paréntesis después de `IN`. Primero se resuelve la consulta de adentro, y el resultado se usa como lista de valores para la de afuera.

```sql
SELECT * FROM persona
WHERE id_licencia IN (
    SELECT id FROM licencia_conducir WHERE color_ojos = 'azul'
)
LIMIT 5;
```

---

## 14. Agrupar filas y contar por grupo (GROUP BY / HAVING)

`GROUP BY` agrupa las filas que comparten un mismo valor (por ejemplo, todos los eventos de una misma persona) para poder contarlas o combinarlas con `COUNT`, `SUM`, etc. Para filtrar esos grupos según el resultado de esa cuenta, se usa `HAVING` en vez de `WHERE` (que solo filtra filas individuales, antes de agrupar).

```sql
SELECT id_persona, COUNT(*) AS cantidad_eventos
FROM registro_evento_facebook
GROUP BY id_persona
HAVING COUNT(*) > 3
LIMIT 5;
```

---

## Referencia rápida de tablas

| Tabla | Qué contiene |
|---|---|
| `reporte_escena_crimen` | Reportes policiales: fecha, tipo de crimen, descripción, ciudad |
| `persona` | Personas: nombre, dirección, licencia, DNI |
| `licencia_conducir` | Datos físicos y del auto: edad, altura, color de ojos/cabello, género, patente, marca y modelo |
| `entrevista` | Transcripciones de testimonios, ligadas a una persona |
| `ingreso` | Ingreso anual, ligado al DNI de una persona |
| `socio_gimnasio` | Membresías de gimnasio: nombre, fecha de inicio, estado (oro/plata/regular) |
| `registro_entrada_gimnasio` | Registros de entrada/salida al gimnasio, ligados a una membresía |
| `registro_evento_facebook` | Check-ins a eventos en redes sociales, ligados a una persona |
| `tablas` | Vista con el listado de todas las tablas de la base |

**Símbolos del diagrama:** 🔑 = clave primaria · → = clave foránea (conecta con otra tabla)
