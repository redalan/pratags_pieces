# praBrowInfo
(cc)(p) Redalan Net 2022
vers. 0.22101701 alfa



## SOBRE

Pequeña función independiente que formará parte de la clase PRATAGS, pero que ya puedes usar.

Esta función te da información sobre las capacidades que tiene el navegador del usuario en algunos  aspectos que necesitas en tu proyecto, como por ejemplo si soporta las Array Function, las funciones de almacenamiento local y session, cookies, el uso de indexDB etc.

Las capacidades que puedes testear en esta versión son:
- sessionStorage
- localStorage
- cookies
- Arrow Functions ()=>
- indexDB
- querySelector
- jQuery

## USO

Para usar esta función, puedes descargar el js o añadirlo a tu js o zona script de tu html. También lo puedes usar en un webview de android o iOS para ver el soporte de ese webview en ese teléfono (que es dónde más te puede servir pues muchos webview no soportan muchas funciones de los navegadores de escritorio).

Para llamar a la función usa:
 ~~~
 praBrowInfo([string info], [string allRequired=arrowFunction,querySelector,cookies])
 Return variant
~~~

praBroInfo devuelve bool o un objeto json según la “info” dada.

Si “info” no se especifica, devolverá un objeto json con la información de cada test soportado y si es soportado o no. También obtendrás, en esa información, la versión del motor de javascript soportado por el navegador.

Si en “info” especificas unas de las capacidades soportadas, devolverá True o False si está o no soportada por el navegador.

Si en “info” especificas “all”, entonces mirará todas las capacidades incluidas, en un string a modo de lista separado por comas, y si TODAS son soportadas, devolverá True. Por defecto usa "arrowFunction,querySelector,cookies”, pero puedes especificar en este segundo parámetro las capacidades (soportadas) que quieres comprobar.

## Ejemplos

 ~~~
 praBrowInfo();
~~~

Devuelve:
{
  "jsVersion": 1.5,
  "arrowFunction": true,
  "cookies": true,
  "querySelector": true,
  "localStorage": true,
  "sessionStorage": true,
  "jquery": false,
  "indexedDB": true
}

 ~~~
 praBrowInfo('cookies');
~~~

Devuelve:
True

 ~~~
 praBrowInfo('all');
~~~

Devuelve:
True // Si arrowFunction,querySelector,cookies son soportados


 ~~~
 praBrowInfo('all','jquery,querySelector');
~~~

Devuelve:
True // Si jQuery and querySelector son soportados


---
