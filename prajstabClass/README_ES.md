# PRAJS TABLE vers 0.21120701.Alfa
(cc) Redalan Net 2021

Clase Javascript que automatiza y crea nuevas funcionalidades a tus tablas html con filtros y paginación desde un conjunto de datos JSON.

Versión alfa.


## Uso

### HTML

 Html Opción 1:
 ~~~html

 <div id="id de tu objeto"></div>

 ~~~




 Html Opción 2:

 ~~~html

 <div id="yourIdObject">
    <template>
        <tr>
            <td>{fieldName}</td>
        </tr>
    </template>
 </div>

 ~~~




### Javascript

~~~javascript 

 var objTest;
 window.onload = () => {
    objTest = new prajsTable("yourIdObject","objTest");
    objTest.setData(test);
    objTest.show();
 }

~~~



### Conjunto de datos JSON

 ~~~json

{
    "pagination": {
             "regByPag": 100,
             "class": "",
             "position" : "both"
    },
    "class":"",
    "totalPosition": "both",
    "countRows" : true,
                
    "head":
        {
            "filterStyle": "float",
            "filterClass": "",
            "columns": [
                {
                    "field": "c1", 
                    "text": "Column 1",
                    "hover": "",
                    "style": "",
                    "filter": "text",

                    "customFieldFunction": "nombre de tu función",
                    "customFilterFunction": "función de filtro",
                    "customFilterFunctionRow": "función de filtro",
                    "filterData" : "valor de filtro al inicio"
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

> Ayuda Conjunto de Datos
> - **pagination**
    - **regByPag**: 0 para no paginar, y un número para especificar el número de filas por página.
    - **class**: clase personalizada.
    - **position**: [both | top | bottom]  
                    Posición de la paginación.
> - **class**:  
> - **totalPosition**: [top | both | bottom | none]  
 Posición fila TOTAL (columnas numéricas)
> - **countRows** : [true | false]  
Recuento de filas (poner o no)
> - **head**:
>   - **filterStyle**: [float | line]  
    (flotante o incrustado)
>   - **filterClass**: Clase CSS para añadir al filtro.
>   - **columns**: _Grupo de Columnas_
>        - **field**: Campo de la columna JSON
>        - **text**: Título de la columna
>        - **hover**: Texto hover
>        - **style**: ""
>        - **filter**: Tipo de filtro  
            [text | select | number | custom | year | yearmonth]
>            - text = Texto (filtro de cadena)
>            - select = Desplegable con los diferentes valores no repetidos
>            - number = Campo numérico. Se puede usar = + o - para especificar igual, más o menos de un valor dado.
>            - custom = nombre de una función de filtro (ver customFieldFunction)
>            - year = en una columna fecha, desplegable con los años no repetidos
>            - yearmonth = en una columna fecha, desplegable con año y mes no repetidos.
>       - _Campos opcionales si el filtro es "custom"_ 
>           - **customFieldFunction**: Nombre de tu función.  Debe devolver el objeto html con el filtro que se usará y debe contener la cadena _{events}_ para que el sistema añada los eventos html de cambio (onchange) y el estilo flotante en su caso.
>           - **customFilterFunction**: Función de filtro
>               - Recibe 2 parámetros:  
Valor: Valor de la celda  
Filtro: Valor seleccionado o dado en el filtro.
>               - Debe devolver: true (incluido en filtro) o false (no incluido)
>          - **customFilterFunctionRow**: Función de filtro
>               - Recibe 2 parámetros:  
>                    Objeto Fila: objeto html ROW de la fila de la tabla  
>                    Filtro: Valor seleccionado o dado en el filtro
>               - Debe devolver: true o false
>           - **filterData**: Valor de filtro al inicio. Si se especifica, valor de inicio de este filtro.
> - **body**: Grupo de filas y columnas
>    - Fila 1
>        - Columna: Valor
>        - Columna: Valor
>    - Fila 2
>        - Columna: Valor
>        - Columna: Valor
>    - etc...  
