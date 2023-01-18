## praxml2json

Se trata de una función independiente (que será incluida dentro de la clase del proyecto PRATAGS) que te permite convertir árboles de etiquetas xml (o html) en un conjunto de datos JSON. 

Versión Alfa.

### Uso
~~~javascript
let objJSON = praxml2json(string cadena xml o html[,int profundidad máxima]);
~~~

> Parámetros
> - string XML  
Se trata de una cadena que contiene un árbol de datos en formato xml, es decir, un conjunto de datos formateado con etiquetas o tags de apertura y cierre en formato de árbol.
> - int Profundidad  
Número que indica la profundidad máxima en los árboles a tener en cuenta.  
Por omisión, 5000.

---
> Devuelve
> - Objeto JSON  
Devuelve los datos encontrados en formato JSON.

### Ejemplos

El objeto xml se obtiene de una cadena. 

~~~javascript
const xml = '<test1>Hi</test1>';
let result = praxml2json(xml);
~~~
Salida de result:
~~~json
{
	"test1": "Hi"
}
~~~

El objeto xml se obtiene de una parte del código html del documento.

~~~html
<div id="div1">
	<test2>Hi</test2>
</div>
~~~
~~~javascript
const xml = document.getElementById('div1');
let result = praxml2json(xml.innerHTML);
~~~
Salida de result:
~~~json
{
	"test2": "Hi"
}
~~~