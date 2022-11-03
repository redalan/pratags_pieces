# PRAJS TABLE vers 0.21120701.Alfa
(cc) Redalan Net 2021

Javascript class to give functionality to your tables with filters and pagination from a Json (Alpha version).

## Use

### HTML
-
 Html Option 1:
 ~~~
 <div id="yourIdObject"></div>
~~~




 Html Option 2:

 ~~~
 <div id="yourIdObject">
    <template>
        <tr>
            <td>{fieldName}</td>
        </tr>
    </template>
 </div>
~~~
---



### Javascript
-
 ~~~
var objTest;
window.onload = () => {
    objTest = new prajsTable("yourIdObject","objTest");
    objTest.setData(test);
    objTest.show();
}
~~~



### Data Format Json

 ~~~
{
    "pagination": {
             "regByPag": 100,   // 0 for no pagination
             "class": "",
             "position" : "both"  // both / top / bottom
    },
    "class":"",
    "totalPosition": "both" // top / both / bottom / none
    "countRows" : true // true / false
    "head":
        {
            "filterStyle": "float",   // float | line,
            "filterClass": "", //class to add input and select filters.
            "columns": [
                {
                    "field": "c1", // field of json column
                    "text": "Column 1", // Name-Title of column
                    "hover": "",
                    "style": "",
                    "filter": "text"   // text | select | number | custom | year | yearmonth

                    //Optional fields to "custom" filter:

                    "customFieldFunction": "nameOfYourFunction", //Must return your html with costumized input, and must contain {events} string to pra system add events of change and float.


                    "customFilterFunction": "nameOfYourFunctionFilter", // It will receive 2 parameters: Record Value and Filter Value. Must return true or false.


                    "customFilterFunctionRow": "nameOfYourFunctionFilter", // It will receive 2 parameters: Row Object and Filter Value. Must return true or false.


                    "filterData" : "default filter" // default filter on start.
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

