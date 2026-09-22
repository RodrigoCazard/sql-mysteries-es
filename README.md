# El Misterio del Asesinato en SQL

![Ilustración de un detective mirando evidencia](174092-clue-illustration.png)

¡Ha habido un asesinato en SQL City! El Misterio del Asesinato en SQL está diseñado tanto para ser una lección autoguiada para aprender conceptos y comandos de SQL como un juego divertido para que usuarios experimentados de SQL resuelvan un crimen intrigante.

Esta es una **traducción al español** del proyecto original [SQL Murder Mystery](https://github.com/NUKnightLab/sql-mysteries) de Knight Lab (Northwestern University).

Entrá a **[la página del juego](https://rodrigocazard.github.io/sql-mysteries-es/)** para jugar directamente desde el navegador. Si buscás una introducción más guiada a SQL antes de arrancar, el [proyecto original en inglés](https://mystery.knightlab.com/walkthrough.html) tiene un tutorial paso a paso.

## ¿Qué más hay acá?

Antes de construir la versión basada en web, este proyecto se diseñó para que la gente lo descargara y lo resolviera en su propia computadora. Si te interesa esa opción, seguí leyendo.

## Qué necesitás para resolverlo en tu propia computadora

* **sql-murder-mystery.db**: este archivo de base de datos SQLite contiene todos los datos con los que vas a trabajar.
* **prompt**: según tu nivel de experiencia con SQL, encontrá el enunciado en el archivo [prompt_experienced](prompt_experienced.pdf) o en el archivo [prompt_beginner](prompt_beginner.pdf) (en inglés).
* **[reference](reference.pdf)**: un curso intensivo sobre conceptos y comandos de SQL (en inglés).
* **un entorno SQLite de tu elección**: para principiantes, recomendamos [SQLiteStudio](https://sqlitestudio.pl/), que es una buena interfaz gráfica para inspeccionar tus datos y escribir consultas.

## Para empezar
* **Si sos principiante en SQL**: empezá por el reference, leé el archivo [prompt_beginner](prompt_beginner.pdf), y después arrancá [instalando SQLiteStudio y cargando el archivo db](sqlite_studio.pdf). Si te trabás en algún punto, no dudes en volver al reference.

* **Si ya tenés experiencia con SQL**: leé el archivo [prompt_experienced](prompt_experienced.pdf), después descargá el archivo sql-murder-mystery.db y usá el entorno SQL que prefieras para resolver el misterio. Podés usar el reference para refrescar tu memoria de SQL. ¡Tratá de completar la actividad enteramente dentro de tu entorno SQL (sin anotar nada aparte)!


## Comprobando la solución
Escribí las siguientes consultas en tu entorno SQL para comprobar si encontraste al asesino correcto:

```SQL
INSERT INTO solucion VALUES (1, "Escribí acá el nombre de la persona que encontraste");

SELECT valor FROM solucion;
```

## Alcance de esta traducción

Se tradujo la interfaz del juego, los nombres de todas las tablas y columnas de la base de datos, y el contenido real del caso: el reporte de la escena del crimen, las entrevistas de los dos testigos y la confesión del asesino a sueldo. El resto de la base de datos (miles de reportes y entrevistas señuelo, usados a propósito como "ruido" para que el caso real sea difícil de encontrar) se dejó en inglés, ya que es texto de relleno sin relación con el caso y no afecta la resolución del misterio.

## Autores originales

* [Joon Park](https://twitter.com/JoonParkMusic)
* [Cathy He](https://twitter.com/Cathy_MeiyingHe)

## Inspiración
Este misterio fue inspirado por [un crimen en la vecina Terminal City](https://github.com/veltman/clmystery "command-line murder mystery").

## Copyright y licencia
El código original de este proyecto se distribuye bajo [la Licencia MIT](LICENSE).

El texto y contenido original se distribuye bajo [Creative Commons CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Esta traducción se comparte bajo la misma licencia.

Los componentes web de consultas SQL usados acá fueron adaptados de código creado y liberado al dominio público por Zi Chong Kao, creador de [Select Star SQL](https://selectstarsql.com/).

[Ilustración del detective por rambleron](https://www.vecteezy.com/vector-art/174092-clue-illustration), usada bajo la licencia gratuita de Vecteezy.
