/**
 * Vers. Alfa.22091301 by Redalan Net
 * Public GNU license
 Standalone function that allows to transform xml data string to json object.

This function will be part of the future PRATAGS alpha release. A RedAlan project of a basic and minimal CSS and Javascript framework.
 * */

/*
    Use: praxml2json(string xml, [maxdeep integer]);
    Parameters:
        xml     String with valid tags xml data.
        maxDeep Int (optional) with max iteractions. This number is for security proposal.
* */


/**
 * Function to convert xml data to json object
 * @param xml {string} - String with xml data format
 * @param maxDeep {int} #5000 - Optional deep levels to convert. Default 5k
 * @return {object} - Return json object with data founded
 */

function praxml2json(xml="",maxDeep=5000) {
    var objXML;
    var parser;
    var security = 0;
    var resJson = {};

    const recursiveXml = function(obj,tagGroup=false) {
        let tempString="";
        let tagGroupLocal = false;
        security++;
        if (security > maxDeep) {
            console.log("Forced end xml2json");
            return tempString;
        }


        for(const i of obj.childNodes) {


            if ( i.children ) {
                if (i.children.length > 0) {
                    tagGroupLocal = (i.children[1] &&
                        i.children[0].tagName == i.children[1].tagName);
                    if (tagGroup) {
                        tempString += recursiveXml(i,tagGroupLocal);
                    } else {
                        tempString += '"' + i.tagName + '": [' + recursiveXml(i,tagGroupLocal) + ']';
                    }
                } else {
                    tempString += '"' + i.tagName + '": "' + i.textContent + '"';
                }
                tempString += ",";
            }



        }
        if (!tagGroup) {
            tempString = "{" + tempString.slice(0,-1) + "}";
        } else {
            tempString = tempString.slice(0,-1);
        }

        return tempString;

    };


    parser = new DOMParser();
    if (typeof(xml) == 'string') {
        /* XML parameter is string */
        objXML = parser.parseFromString(xml,"text/xml");
    } else {
        /* XML parameter must be HTML object or will be an error */
        objXML = xml;
    }

    if (objXML) {
        resJson = recursiveXml(objXML);
    }

    if (JSON.parse(resJson)) {
        resJson = JSON.parse(resJson);
    }
    return resJson;


}