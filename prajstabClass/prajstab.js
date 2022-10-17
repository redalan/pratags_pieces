/**
 * PRAJS TABLE vers 0.21120702.Alfa
 * PRAJS (cc) Redalan.Net 2021
 */

/*
Use:

# HTML
----------------------------------------
 Html Option 1:
 ...
 <div id="yourIdObject"></div>
 ...

 Html Option 2:
 ...
 <div id="yourIdObject">
    <template>
        <tr>
            <td>{fieldName}</td>
        </tr>
    </template>
 </div>
 ...
:::::::::::::::::::::::::::::::::::::::::

#Javascript:
----------------------------------------
...
var objTest;
window.onload = () => {
    objTest = new prajsTable("yourIdObject","objTest");
    objTest.setData(test);
    objTest.show();
}
...
:::::::::::::::::::::::::::::::::::::::::



## Data Format Json:
----------------------------------------
...
{
    "pagination": {
             "regByPag": 100,   // 0 for no pagination
             "class": "",
             "position" : "both"  // both / top / bottom
    },
    "class":"",
    "totalPosition": "both" / top / both / bottom / none
    "countRows" : true // true / false
    "head":
        {
            "filterStyle": "float",   // float | line,
            "filterClass": "", //class to add input and select filters.
            "columns": [
                {
                    "field": "c1",
                    "text": "Columna 1",
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
...
:::::::::::::::::::::::::::::::::::::::::
 */

/**
 * @class prajsTable
 * @classdesc Automate tables to get sorting and filtering by column. You can do this with html tables already created or with a json that defines them.
 * @constructor
 * @param containerId {string} - HTML id container of table or to make table
 * @param pParentNameString {string} - Name of object which new prajsTable is assigned.
 */

class prajsTable {
    #vagData;
    #vagContainer;
    #vagContainerHead;
    #vagContainerBody;
    #vagTemplateTr;
    #handError;
    #parentObj;
    #vagPag;
    #bDebug;
    #bAllOk;


    constructor(containerId,pParentNameString) {
        this.#vagData = "";
        this.#handError = {"code":"","desc":""};
        this.#vagContainer = document.getElementById(containerId);
        this.#vagContainerHead = null;
        this.#vagContainerBody = null;
        this.#parentObj = pParentNameString;
        this.#vagPag=1;
        this.oDebug = null;
        this.#bDebug = true;
        this.#bAllOk = true;
        let cTemplates = null;

        if (document.styleSheets && document.styleSheets.length-1 <= 0) {
            document.body.insertAdjacentHTML("afterBegin","<style></style>");
        }

        if (this.#vagContainer.length <= 0) {
            this.#debug("prajstab: Id Container not exist.");
            this.#bAllOk = false;

        } else {

            cTemplates = this.#vagContainer.getElementsByTagName("template");

            if (cTemplates.length > 0) {
                this.#vagTemplateTr = cTemplates[0].innerHTML;
            } else {
                this.#vagTemplateTr = "";
            }


            this.#classes();
        }





    }

    /**
     * Set data content for table
     * @param dataJSON {object} - json data for table
     * @param externalDataBodyOptional {object} - html id with data
     * @returns {boolean} - False if any error occurred.
     */
    setData(dataJSON=null,externalDataBodyOptional=null) {
        let res = false;
        let data = dataJSON;
        let sTemplate="";

        if (! this.#bAllOk) {
            this.#debug("prajstab: Something wrong when object was created.");
            return false;
        }

        if ( data
             && typeof(data) === "object"
             && typeof(data.head) !== "undefined"
             && typeof(data.body) !== "undefined"
        ) {
            this.#vagData = data;

            if (externalDataBodyOptional &&
                typeof(externalDataBodyOptional) === "object"
            ) {

                if (typeof(this.#vagData.body) !== 'undefined') {
                    this.#vagData.body = externalDataBodyOptional;
                }

            } else if (externalDataBodyOptional != null) {
                this.#debug("prajstab: Warning: externalData sent not used because is wrong.");
            }



            if (this.#vagTemplateTr > "") {

                if (/<tr/.test(this.#vagTemplateTr)) {
                    sTemplate = this.#vagTemplateTr;
                } else {
                    sTemplate = "<tr>" + this.#vagTemplateTr + "</tr>";
                }

                this.#vagTemplateTr = sTemplate;

            } else {
                sTemplate = "<tr>";
                for (let ii in this.#vagData.head.columns) {
                    let itm = this.#vagData.head.columns[ii];
                    sTemplate += "<td>{" + itm.field + "}</td>";
                }
                sTemplate += "</tr>";
                this.#vagTemplateTr = sTemplate;
            }

        } else {
            this.#debug("prajstab: Object Data sent has errors.");
            this.#bAllOk = false;
            return false;
        }

    }

    /**
     * Show Table
     * @returns {boolean} - False if any error occurred.
     */
    show() {
        const cThis=this;
        let vTableClass;
        let vPag="";
        let vPagTop = "";
        let vPagBottom = "";

        if (! this.#bAllOk) {
            this.#debug("prajstab: Something wrong when object was created.");
            return false;
        }

        if (this.#hasValue("class",this.#vagData) ) {
            vTableClass = 'class="' + this.#vagData["class"] + '" ';
        } else {
            vTableClass = "";
        }

        if (this.#getIfHasValue("regByPag",this.#vagData.pagination,0) > 0 ) {

            vPag = "<div data-ptpag=true class=\""+ this.#getIfHasValue("class",this.#vagData.pagination,"") +"\" ></div>";
            switch (this.#getIfHasValue("position",this.#vagData.pagination,"bottom")) {
                case "top":
                    vPagTop = vPag;
                    break;
                case "bottom":
                    vPagBottom = vPag;
                    break;
                case "both":
                    vPagTop = vPag;
                    vPagBottom = vPag;
                    break;
            }

        }

        this.#vagContainer.innerHTML = `${vPagTop} <table ${vTableClass} ><thead></thead><tbody></tbody></table> ${vPagBottom}`;
        this.#vagContainerHead = this.#vagContainer.getElementsByTagName("thead")[0];
        this.#vagContainerBody = this.#vagContainer.getElementsByTagName("tbody")[0];

        this.#showHead().then(function() {
            /* cThis.#showBody(cThis.#vagData.body); */
            cThis.#execFilter();
        });
    }


    async #showHead() {
        let vHead = '';
        let vGarbage = {
            "style":"",
            "head": "",
            "filterLine":"",
            "filterFloat":""
        };
        let sFunctionFloatFilter = this.#parentObj + ".showFilter(this);";


        for (const i in this.#vagData.head.columns) {
            let itm = this.#vagData.head.columns[i];

            if (this.#hasValue("style",itm)) {
                vGarbage["style"] = ` style="${itm.style}" `;
            } else {
                vGarbage["style"] = "";
            }

            if (this.#hasValue("hover",itm)) {
                vGarbage["hover"] = ` title="${itm.hover}" `;
            } else {
                vGarbage["hover"] = "";
            }

            if (this.#hasValue("filter",itm)) {

                if (this.#vagData.head.filterStyle == 'line') {
                    vGarbage["filterLine"] = `<br>` + this.#inputFilter(itm.field);
                } else {
                    vGarbage["filterLine"] = "";
                }

                if (this.#vagData.head.filterStyle == 'float') {
                    vGarbage["filterFloat"] = ` onclick="${sFunctionFloatFilter}" `;
                    vGarbage["filterLine"] = `<div data-ptfloat="off">` + this.#inputFilter(itm.field) + "</div>";
                } else {
                    vGarbage["filterFloat"] = "";
                }

            } else {
                vGarbage["filterLine"] = "";
                vGarbage["filterFloat"] = "";
            }



            vHead += `
                <th data-ptField="${itm.field}" ${vGarbage["style"]} ${vGarbage["hover"]} ${vGarbage["filterFloat"]}>${itm.text}${vGarbage["filterLine"]}</th>
            `;
        }

        vHead = `<thead><tr>${vHead}</tr></thead>`;

        this.#vagContainerHead.innerHTML = vHead;

    }

    #showBody(pData) {
       let vBody = "";
       let rowsPag = (this.#hasValue("regByPag",this.#vagData.pagination) && this.#vagData.pagination.regByPag > 0 )
                    ? this.#vagData.pagination.regByPag : pData.length;
       let vPags = (rowsPag > 0) ? Math.ceil(pData.length/rowsPag) : 1;
       let pPag = (this.#vagPag > vPags) ? vPags : this.#vagPag;
       let vRegIni = (pPag-1)*rowsPag;
       let vRegFin = (vRegIni + rowsPag) > pData.length ? pData.length : (vRegIni + rowsPag);
       let sPagination = "";
       let sFunctionPagination = this.#parentObj + ".pagination(this);";
       let mFields = this.#vagTemplateTr.match(/\{*[\s\S](\w+)[\s\S]\}/g);
       let mTotal = [];


       vRegFin = (vRegFin > (pData.length-1)) ? pData.length-1 : vRegFin;

       if (pData.length>0) {

           for (let i=vRegIni; i<=vRegFin; i++) {
                let vRow = this.#vagTemplateTr;

               for (const ii in mFields) {
                   let itmField = mFields[ii].replace(/[\{|\}]/g,"").trim();
                   let itm = this.#getIfHasValue(itmField,pData[i],null);
                   if (itm != null || itm === 0) {
                       vRow = vRow.replace(mFields[ii],itm);
                   } else {
                       vRow = vRow.replace(mFields[ii],"");
                   }

               }
               vBody += vRow;

           }

           /*
            SUM VALUES OF "TOTAL" FIELDS
            and show last row
            */

           for (const i in this.#vagData.head.columns) {
               let itm = this.#vagData.head.columns[i];

               if (typeof(itm.total) === "boolean" && itm.total ) {
                  mTotal.push(itm.field);
               }
           }

           if (mTotal.length > 0) {
               let vRow = this.#vagTemplateTr;

               for (const i in mFields) {
                   let itmField = mFields[i].replace(/[\{|\}]/g,"").trim();
                   let vTotal = 0;

                   if (i == 0 && typeof(this.#vagData.countRows) === "boolean" && this.#vagData.countRows ) {
                       vRow = vRow.replace(mFields[i],pData.length);
                   }

                   if (itmField > "" && mTotal.includes(itmField)) {
                       pData.forEach((elem)=>{
                           vTotal += (parseFloat(elem[itmField])) ? parseFloat(elem[itmField]) : 0;
                       });
                       vRow = vRow.replace(mFields[i],vTotal.toFixed(2));

                   } else {
                       vRow = vRow.replace(mFields[i],"");
                   }
               }

               vRow = vRow.replace("<tr","<tr data-total ");

               if (typeof(this.#vagData.totalPosition) === "string") {
                   switch (this.#vagData.totalPosition.toLowerCase()) {
                       case "top":
                           vBody = vRow + vBody;
                           break;
                       case "both":
                           vBody = vRow + vBody + vRow;
                           break;
                       case "none":
                           break;
                       default:
                           vBody += vRow;
                   }
               } else {
                   vBody += vRow;
               }


           }




       }

       this.#vagContainerBody.innerHTML = vBody;


       if (rowsPag > 0 ) {
           sPagination = "<ul>";
           for (let i=1;i<=vPags;i++) {
               if (i == this.#vagPag) {
                   sPagination += `<li data-ptactive='true' onclick='${sFunctionPagination}' >`;
               } else {
                   sPagination += `<li onclick='${sFunctionPagination}'>`;
               }
               sPagination += "" + i + "</li>";
           }
           sPagination += "</ul>";

           for (let i in this.#vagContainer.getElementsByTagName("div") ) {
               let oGarbage = this.#vagContainer.getElementsByTagName("div")[i];
               if (oGarbage) {
                   if (this.#hasValue("ptpag",oGarbage.dataset)) {
                       oGarbage.innerHTML = sPagination;
                   }
               }
           }


       }

        this.#vagContainer.style.opacity = 1;


    }

    #findHeadColumn(pField) {
        let vColumn;
        for(const i in this.#vagData.head.columns) {
            let itm = this.#vagData.head.columns[i];
            if (itm.field == pField) {
                vColumn = i;
                break;
            }

        }

        return (vColumn?vColumn:false);
    }

    #inputFilter(pColumnField) {
        let res = "";
        let vColumn = null;
        let oSelected = "";
        let sFunctionChange = this.#parentObj + ".setFilter(this);";
        let sFunctionBlur = this.#parentObj + ".hideFilter(this);";
        let sFilterClass = (typeof(this.#vagData.head.filterClass) === "string") ? ' class="' + this.#vagData.head.filterClass + '" ' : "";


       vColumn = this.#findHeadColumn(pColumnField);


        if (vColumn) {
            switch (this.#vagData.head.columns[vColumn].filter) {
                case "":
                case "none":
                    res = "&nbsp;";
                    break;

                case "number":
                    if (! this.#vagData.head.columns[vColumn].hasOwnProperty("filterData")) {
                        this.#vagData.head.columns[vColumn]["filterData"] = "";
                    }
                    res = `<input type="text" ${sFilterClass} value="${this.#vagData.head.columns[vColumn]["filterData"]}" onchange="${sFunctionChange}" onblur="${sFunctionBlur}" placeholder="=-<+>">`;
                    break;
                case "text":
                    if (! this.#vagData.head.columns[vColumn].hasOwnProperty("filterData")) {
                        this.#vagData.head.columns[vColumn]["filterData"] = "";
                    }
                    res = `<input type="text" ${sFilterClass} value="${this.#vagData.head.columns[vColumn]["filterData"]}" onchange="${sFunctionChange}" onblur="${sFunctionBlur}">`;
                    break;

                case "custom":
                    res = "&nbsp;";
                    if (! this.#vagData.head.columns[vColumn].hasOwnProperty("filterData")) {
                        this.#vagData.head.columns[vColumn]["filterData"] = "";
                    }

                    if (this.#vagData.head.columns[vColumn].hasOwnProperty("customFieldFunction")) {
                        let cfField = this.#vagData.head.columns[vColumn].customFieldFunction;
                        cfField = cfField.split("(")[0];
                        if (eval("typeof("+cfField+") == 'function'")) {
                            res = eval(cfField+"();");
                            if (res && res > "") {
                                let resEvents = ` onchange="${sFunctionChange}" onblur="${sFunctionBlur}" `;
                                res = res.replace('{events}',resEvents);
                            }
                        }
                    }

                    break;

                case "year":
                case "yearmonth":
                case "select":
                    let gbOptions = [];
                    if (! this.#vagData.head.columns[vColumn].hasOwnProperty("filterData")) {
                        this.#vagData.head.columns[vColumn]["filterData"] = "";
                    }

                    let fElement = this.#vagData.head.columns[vColumn].field;

                    for (const i in this.#vagData.body) {
                        let iElement;

                        switch (this.#vagData.head.columns[vColumn].filter) {
                            case "year":
                                iElement = new Date(this.#vagData.body[i][fElement]);
                                if (! iElement) {
                                    iElement = "";
                                } else {
                                    iElement = iElement.getFullYear().toString();
                                }


                                break;

                            case "yearmonth":
                                iElement = new Date(this.#vagData.body[i][fElement]);
                                if (! iElement) {
                                    iElement = "";
                                } else {
                                    iElement = iElement.getFullYear() + '-' + ('0' + (iElement.getMonth()+1)).slice(-2);
                                }

                                break;

                            default:
                                iElement = (this.#vagData.body[i][fElement])
                                    ? this.#vagData.body[i][fElement].trim()
                                    : "";
                        }

                        if (! gbOptions.find(function(e) {return e === iElement;})) {
                            if (iElement != null && iElement !== "" && iElement !== "\n") {
                                gbOptions.push(iElement);
                            }
                        }
                    }

                    if (this.#vagData.head.columns[vColumn].filter == "select") {
                        gbOptions.sort(
                            function(a,b) {
                                return (a.toLowerCase() < b.toLowerCase())?-1:1;
                            }
                        );
                    } else {
                        gbOptions.sort(
                            function(a,b) {
                                return (a.toLowerCase() > b.toLowerCase())?-1:1;
                            }
                        );
                    }





                    res = `<select onchange="${sFunctionChange}" onblur="${sFunctionBlur}" ${sFilterClass} >`;
                    res += `<option value=""> </option>`;
                    for (const i in gbOptions) {
                        if (this.#vagData.head.columns[vColumn]["filterData"] > "" &&
                            this.#vagData.head.columns[vColumn]["filterData"] === gbOptions[i]
                        ) {
                             oSelected = " selected ";
                        } else {
                             oSelected = "";
                        }
                        res += `<option value="${gbOptions[i]}" ${oSelected}>${gbOptions[i]}</option>`;
                    }

                    res += `</select>`;

                    break;

            }
        }

        return res;
    }

    /**
     * Set filter of data
     * @param pPtFieldData {string} - Field (json) to filter
     * @param pValue {string} - Value of field. If numeric, +N or -N is allowed. With string, look for it inside value.
     * @param pNotFilterYet {boolean} - Not show result of filter yet
     * @returns {boolean} - False if errors occurred
     */

    setFilter(pPtFieldData,pValue=null,pNotFilterYet=false) {
        let pFilterObject = null;
        let oFilter;
        let oField;
        let nField;

        if (typeof(pPtFieldData) === 'object') {
            pFilterObject = pPtFieldData;
            oFilter = pFilterObject.value;
            oField = (pFilterObject.parentNode.tagName == "DIV") ? pFilterObject.parentNode.parentNode : pFilterObject.parentNode;
            nField = this.#findHeadColumn(oField.dataset["ptfield"]);

        } else if (typeof(pPtFieldData) === 'string') {
            nField = this.#findHeadColumn(pPtFieldData);
            oField = this.#vagContainer.getElementsByTagName("th")[nField];
            oFilter = pValue;
            if (oField.getElementsByTagName("input").length > 0) {
                oField.getElementsByTagName("input")[0].value = oFilter;
            } else if (oField.getElementsByTagName("select").length > 0) {
                oField.getElementsByTagName("select")[0].value = oFilter;
            }
        } else {
            return false;
        }



        this.#vagData.head.columns[nField]["filterData"] = oFilter;
        if (oFilter > "") {
            oField.dataset["ptactive"] = "true";
            oField.setAttribute("title",oFilter);
        } else {
            oField.dataset["ptactive"] = "false";
            oField.setAttribute("title","");
        }
        if (this.#vagData.head.filterStyle == 'float') {
            oField.getElementsByTagName("div")[0].dataset["ptfloat"] = "off";
        }
        if (! pNotFilterYet) {
            this.#filter();
        }

    }

    /**
     * Show filter in head
     * @param pFilterObject {object} - Table object
     */
    showFilter(pFilterObject) {
        const fField = pFilterObject.getElementsByTagName("div")[0];
        fField.dataset["ptfloat"] = "on";
        if (fField.getElementsByTagName("input").length > 0) {
            fField.getElementsByTagName("input")[0].focus();
        }


    }

    /**
     * Hide filter in head
     * @param pFilterObject {object} - Table object
     */
    hideFilter(pFilterObject) {
        const oField = (pFilterObject.parentNode.tagName == "DIV") ? pFilterObject.parentNode.parentNode : pFilterObject.parentNode;
        if (this.#vagData.head.filterStyle == 'float') {
            oField.getElementsByTagName("div")[0].dataset["ptfloat"] = "off";
        }

    }

    /**
     * Clear content of filters in head
     */
    cleanFilters() {
        for (let ii in this.#vagData.head.columns) {
            this.#vagData.head.columns[ii].filterData = "";
        }
        this.#updateFilters();
        this.#filter();
    }

    /**
     * Save filters content in sessionStorage
     */
    saveFilters() {
        let mFilters = [];
        let sFilters = document.location.pathname + this.#parentObj;

        sFilters = sFilters.replace(/\//g,"");
        for (let ii in this.#vagData.head.columns) {
            mFilters[ii] = this.#vagData.head.columns[ii].filterData;
        }
        if (sessionStorage) {
            sessionStorage.setItem(sFilters,JSON.stringify(mFilters));
        }
    }

    /**
     * Get filters content from sessionStorage
     */
    getSaveFilters() {
        let sFilters = document.location.pathname + this.#parentObj;
        sFilters = sFilters.replace(/\//g,"");

        if (sessionStorage && sessionStorage.getItem(sFilters)) {
            let mFilters = JSON.parse(sessionStorage.getItem(sFilters));
            for (let ii in this.#vagData.head.columns) {
                this.#vagData.head.columns[ii].filterData = mFilters[ii];
            }

            this.#updateFilters();
            this.#filter();
        }

    }

    /**
     * Pagination zone
     * @param pObject {object} - Table object
     */
    pagination(pObject) {
        this.#vagPag = pObject.innerHTML;
        this.#filter();
    }

    #updateFilters() {
        if (this.#vagContainer.getElementsByTagName("th").length > 0) {
            let itm = this.#vagContainer.getElementsByTagName("th");
            itm.title = "-";
            for (let ii=0;ii<itm.length;ii++) {
                let itm2 = this.#vagContainer.getElementsByTagName("th")[ii];
                if (this.#vagData.head.columns[ii].filterData > "") {
                    itm2.dataset["ptactive"] = "true";
                } else {
                    itm2.dataset["ptactive"] = "false";
                }

                if (itm2.getElementsByTagName("input").length > 0) {
                    itm2.getElementsByTagName("input")[0].value = this.#vagData.head.columns[ii].filterData;
                } else if (itm2.getElementsByTagName("select").length > 0) {
                    itm2.getElementsByTagName("select")[0].value = this.#vagData.head.columns[ii].filterData;
                }
            }
        }
    }

    #filter() {
        this.#vagContainer.style.opacity = .5;
        if (this.#hasValue("saveFilters",this.#vagData) && this.#vagData.saveFilters ) {
            this.saveFilters();
        }
        setTimeout(()=>{this.#execFilter();},100);
    }


    #execFilter() {
        let tempData = this.#vagData.body;

        for (const i in this.#vagData.head.columns) {
            let itm = this.#vagData.head.columns[i];
            let res = false;
            if (itm.filterData > "") {
                let cFunction = this.#hasValue("customFilterFunction",itm);
                let cFunctionRow = this.#hasValue("customFilterFunctionRow",itm);
                tempData = tempData.filter(function(e) {
                    var sValue;
                    var sValue2;
                    switch (itm.filter) {
                        case "select":
                            return (e[itm.field] == itm.filterData);
                            break;
                        case "year":
                            res = false;

                            if (e[itm.field]) {
                                sValue = new Date(e[itm.field]);
                            } else {
                                sValue = false;
                            }
                            res = (sValue && sValue.getFullYear() == itm.filterData) ? true : false;

                            return res;
                            break;

                        case "yearmonth":
                            res = false;
                            sValue = new Date(e[itm.field]);
                            sValue2 = new Date(itm.filterData);
                            res = (sValue && sValue2 && sValue.getFullYear() == sValue2.getFullYear() && sValue.getMonth() == sValue2.getMonth()) ? true : false;

                            return res;
                            break;


                        case "number":
                            res = true;
                            switch (itm.filterData[0]) {
                                case ">":
                                case "+":
                                    sValue = itm.filterData.replace(/[\>|\+]/,"");
                                    res = (parseFloat(e[itm.field]) >= parseFloat(sValue));
                                    break;
                                case "<":
                                case "-":
                                    sValue = itm.filterData.replace(/[\<|\-]/,"");
                                    res = (parseFloat(e[itm.field]) <= parseFloat(sValue));
                                    break;
                                case "=":
                                    sValue = itm.filterData.replace(/[\=|\>]/,"");
                                    res = (parseFloat(e[itm.field]) == parseFloat(sValue));
                                    break;
                                default:
                                    sValue = itm.filterData;
                                    res = (parseFloat(e[itm.field]) == sValue || parseFloat(e[itm.field]) * -1 == sValue);
                                    break;
                            }
                            return res;
                            break;
                        case "custom":
                            if (cFunction) {
                                return eval(itm.customFilterFunction.split("(")[0] + "('"+e[itm.field]+"','"+itm.filterData+"')");
                            } else if (cFunctionRow) {
                                return eval(itm.customFilterFunctionRow.split("(")[0] + "(e,'"+itm.filterData+"')")
                            } else {
                                let gString = new RegExp(itm.filterData,"gi");
                                return (gString.test(e[itm.field]));
                            }
                            break;
                        default:
                            let gString = new RegExp(itm.filterData,"gi");
                            return (gString.test(e[itm.field]));

                    }


                });
            }
        }


        this.#showBody(tempData);
    }

    /**
     * Get json data of table
     * @returns {object} - Json
     */
    getData() {
        return this.#vagData.body;
    }

    #hasValue(pStringKey,pObject) {
        if (typeof(pObject) === "object" && pStringKey in pObject) {
            if (typeof(pObject[pStringKey]) !== "undefined" && pObject[pStringKey] > "" && pObject[pStringKey] !== "none") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    #getIfHasValue(pStringKey,pObject,pDefault) {
        if (this.#hasValue(pStringKey,pObject)) {
            return pObject[pStringKey];
        } else {
            return pDefault;
        }
    }

    /**
     * Set debug on/off
     * @param trueOrFalse {boolean} - Set debug True (on) or False (off, default)
     */
    setDebug(trueOrFalse=false) {
        this.#bDebug = trueOrFalse;
    }

    #debug(sString="") {
        if (this.#bDebug) {
            console.log("PRAjsTAB:");
            console.log(sString);
        }
    }

    #classes() {
        const oCss = document.styleSheets[document.styleSheets.length-1];

        const sObjectId = this.#vagContainer.id;

        oCss.insertRule(
            `#${sObjectId} th[data-ptfield] input,
             #${sObjectId} th[data-ptfield] select {
                    
                    
                   
            }`
            ,0
        );



        oCss.insertRule(
            `#${sObjectId} th[data-ptfield] div[data-ptfloat="off"] {
                    display: none;
                    width: 90%;
                    margin: auto;
            }`
            ,0
        );

        oCss.insertRule(
            `#${sObjectId} th[data-ptfield] div[data-ptfloat="on"] {
                    display: blocK; 
                    position: relative;
                    width: 95%;
                    margin-top: -1.4em;
                    
            }`
            ,0
        );




        oCss.insertRule(
            `#${sObjectId} th[data-ptactive="true"]:before {
                    content: "⟗ ";
            }`
            ,0
        );

        oCss.insertRule(
            `#${sObjectId} div[data-ptpag] ul {
                    display: block;
                    margin: auto;
                    margin-top: 2em;
                    margin-bottom: 1em;
                    list-style-type: none;
            }`
            ,0
        );

        oCss.insertRule(
            `#${sObjectId} div[data-ptpag] ul li {
                    cursor: pointer;
                    padding: .5em;
                    display: inline-block;
            }`
            ,0
        );

        oCss.insertRule(
            `#${sObjectId} div[data-ptpag] ul li[data-ptactive] {
                    background-color: white;
                    filter: invert(1);
            }`
            ,0
        );

    }


}


