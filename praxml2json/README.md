## praxml2json

This is a standalone function (to be included in the PRATAGS project class) that allows you to convert xml (or html) tag trees into a JSON dataset. 

Alpha version.

### Usage
~~~javascript
let objJSON = praxml2json(string string xml or html[,int max depth]);
~~~

> Parameters
> - string XML  
This is a string containing a data tree in xml format, i.e. a data set formatted with opening and closing tags or labels in tree format.
> - int Depth  
Number indicating the maximum depth in the trees to be considered.  
By default, 5000.

---
> Returns
> - JSON object  
Returns the data found to JSON format.

### Examples

The xml object is obtained from a string. 

~~~javascript
const xml = '<test1>Hi</test1>';
let result = praxml2json(xml);
~~~
Output of result:
~~~json
{
	"test1": "Hi"
}
~~~

The xml object is obtained from a part of the html code of the document.

~~~html
<div id="div1">
	<test2>Hi</test2>
</div>
~~~
~~~javascript
const xml = document.getElementById('div1');
let result = praxml2json(xml.innerHTML);
~~~
Output of result:
~~~json
{
	"test2": "Hi"
}
~~~
