# PRAJS TABLE vers 0.21120701.Alfa
(cc) Redalan Net 2021

Clase Javascript que automatiza y crea nuevas funcionalidades a tus tablas html con filtros y paginación desde un conjunto de datos JSON.

Versión alfa.


## Uso

### HTML

 Html Opción 1:
 ~~~

 <div id="yourIdObject"></div>

 ~~~




 Html Opción 2:

 ~~~

 <div id="yourIdObject">
    <template>
        <tr>
            <td>{fieldName}</td>
        </tr>
    </template>
 </div>

 ~~~




### Javascript

 ~~~

 var objTest;
 window.onload = () => {
    objTest = new prajsTable("yourIdObject","objTest");
    objTest.setData(test);
    objTest.show();
 }

 ~~~



### Conjunto de datos JSON

 ~~~

{
    "pagination": {
             "regByPag": 100,   _0 para no paginar_
             "class": "",
             "position" : "both"
                          _[both | top | bottom]_
                          _Posición de la paginación._
    },
    "class":"",
    "totalPosition": "both"
                    _[top | both | bottom | none]_
                    _Posición fila TOTAL (columnas numéricas)_

    "countRows" : true
                   _[true | false]_
                   _Recuento de filas (poner o no)_
    "head":
        {
            "filterStyle": "float",
                            _[float | line]_
                            _(flotante o incrustado)_

            "filterClass": "",
                            _ Clase CSS para añadir al filtro _
            "columns": [
                {
                    "field": "c1",  _Campo de la columna JSON_
                    "text": "Column 1",  _Título de la columna_
                    "hover": "",
                    "style": "",
                    "filter": "text"
                              _[text | select | number | custom | year | yearmonth]_
                              - text = Texto (filtro de cadena)
                              - select = Desplegable con los diferentes valores no repetidos
                              - number = Campo numérico. Se puede usar = + o - para especificar igual, más o menos de un valor dado.
                              - custom = nombre de una función de filtro (ver customFieldFunction)
                              - year = en una columna fecha, desplegable con los años no repetidos
                              - yearmonth = en una columna fecha, desplegable con año y mes no repetidos

                    _Campos opcionales si el filtro es "custom"_

                    "customFieldFunction": "nombre de tu función",
                        _Debe devolver el objeto html con el filtro que se usará y debe contener la cadena "{events}" para que el sistema añada los eventos html de cambio (onchange) y el estilo flotante en su caso._


                    "customFilterFunction": "función de filtro",
                    _Recibe 2 parámetros:_
                        Valor: Valor de la celda
                        Filtro: Valor seleccionado o dado en el filtro

                        Debe devolver: true (incluido en filtro) o false (no incluido)




                    "customFilterFunctionRow": "función de filtro",
                    _Recibe 2 parámetros:_
                        Objeto Fila: objeto html ROW de la fila de la tabla
                        Filtro: Valor seleccionado o dado en el filtro

                     Debe devolver: true o false


                    "filterData" : "valor de filtro al inicio"
                     _Si se especifica, valor de inicio de este filtro_
                }
            ]
        },

    "body" : [
        {
            "c1":"Reg 1 C1",
            "c2":"Reg 1 C2",
            "c3":"Reg 3 C2"
        }
    ]
}

~~~

