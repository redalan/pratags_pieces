/**
 * @author Redalan Net
 * @version 0.22101701 alfa
 * @copyright CC-BY Open GL 3.0 Redalan Net
 */

/**
 * Return browser capabilities or test one of the envisaged ones.
 * @param {string} info - optional -
 *      Type of information to request.
 *      - If empty, return json with capabilities.
 *      - If "all", return bool if all in allRequired is true
 *      - if "[arrowFunction | querySelector | localStorage | sessionStorage | jquery | cookies | indexDB]"
 *          return bool of that capability.
 * @param {string} allRequired - optional - Capabilities required for test with info="all"
 *
 * */
function praBrowInfo(info="",allRequired="arrowFunction,querySelector,cookies") {

    try {
        var praInfo = {};
        var praJsTemp;
        var praJsGarbage;
        var praGeneral = ["document.querySelector","localStorage","sessionStorage","jquery","indexedDB"];

        if (["jsVersion","all",""].includes(info)) {

            var eScript = document.createElement("script");

            eScript.type = "text/javascript";
            eScript.innerText = "var praBroInfoVersTemp = 1.0;";
            document.body.appendChild(eScript);

            for (i=1;i<=9;i++) {
                eScript = document.createElement("script");
                eScript.type = "text/javascript1." + i;
                eScript.innerText = "praBroInfoVersTemp = 1." + i + ";";
                document.body.appendChild(eScript);
            }

            praInfo.jsVersion = (praBroInfoVersTemp) ? praBroInfoVersTemp : false;
        }


    } catch { return false; }

    /* SPECIAL TESTS */

    /* Arrow Function */
    praJsTemp = false;
    try {
        praJsGarbage = () => {
            return true;
        };
        praJsTemp = praJsGarbage();
    } catch {
    }

    praInfo.arrowFunction = praJsTemp;

    /* cookies */
    praJsTemp = false;
    try {
        praJsTemp = (document.cookie || document.cookie == "") ? true : false;
    } catch {
    }

    praInfo.cookies = praJsTemp;


    /* GENERAL TESTS */
    for (i=0;i<praGeneral.length;i++) {
        praJsTemp = false;
        praJsGarbage = praGeneral[i].replace('document.','').replace('window.','');

        try { eval("praJsTemp = (" + praGeneral[i] + ") ? true : false;");} catch {}
        praInfo[praJsGarbage] = praJsTemp;
    }

    /* RETURN VALUES about info */

    if (info == "" || info == null) {
        return praInfo;
    } else if (info == "all") {
        praJsGarbage = allRequired.split(",");
        praJsTemp = true;
        Object.keys(praInfo).forEach(function(x) {
            if (praJsTemp && praJsGarbage.includes(x) && ! praInfo[x]) {
                praJsTemp = false;
            }
        });

        return praJsTemp;
    } else {
        return praInfo[info] ? praInfo[info] : false;
    }

}