function filesearch() {
    var resultDiv = document.getElementById('resultsDiv');

    var files = document.getElementById('selectFiles').files;
    if (files.length <= 0) {
        return false;
    }
    var jsonregex = new RegExp(/([a-zA-Z0-9\s_\\.\-\(\):])+(.json)$/i);
    var xmlregex = new RegExp(/([a-zA-Z0-9\s_\\.\-\(\):])+(.xml)$/i);
    var csvregex = new RegExp(/([a-zA-Z0-9\s_\\.\-\(\):])+(.csv)$/i);

    var titles = [];
    var urls = [];
    var descriptions = [];

    
    if (jsonregex.test(files[0].name)) {
        var fr = new FileReader();
        fr.onload = function (e) {
            var result = JSON.parse(e.target.result);
            
            var i;
            for (i = 0; i < result.Result.length; i++) {
                titles[i] = result.Result[i].title;
                urls[i] = result.Result[i].url;
                descriptions[i] = result.Result[i].description;
            }
            resultsDisplayer(titles, urls, descriptions);
        }
        fr.readAsText(files.item(0));

    }
    
    if (xmlregex.test(files[0].name)) {
        var fr = new FileReader();
        fr.onload = function (e) {
            var xmlparser = new DOMParser();
            var result = xmlparser.parseFromString(e.target.result, "text/xml");
            //document.getElementById('resultsDiv').innerHTML = result.getElementsByTagName("result")[0].getElementsByTagName("title")[0].childNodes[0].nodeValue;
            var i;
            for (i = 0; i < result.getElementsByTagName("result").length; i++) {
                titles[i] = result.getElementsByTagName("result")[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                urls[i] = result.getElementsByTagName("result")[i].getElementsByTagName("url")[0].childNodes[0].nodeValue;
                descriptions[i] = result.getElementsByTagName("result")[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
                resultsDisplayer(titles, urls, descriptions);
            }
        }

        fr.readAsText(files.item(0));
    }
    
    if (csvregex.test(files[0].name)) {
        var fr = new FileReader();
        fr.onload = function (e) {
            var result = e.target.result;
            resultarr = result.split("\n");
            var i;
            for (i = 0; i < resultarr.length; i++) {
                if (resultarr[i] != "") {
                    splitresults = resultarr[i].split(",");
                    titles[i] = splitresults[0];
                    urls[i] = splitresults[1];
                    descriptions[i] = splitresults[2];
                }
            }
            resultsDisplayer(titles, urls, descriptions);
        }

        fr.readAsText(files.item(0));
    }

}

function search() {

}

function resultsDisplayer(T, U, D) {
    document.getElementById("displayres").innerHTML = "";
    var i;
    for (i = 0; i < T.length; i++) {
        var section = document.createElement("section");
        section.style = "border-style: solid; border-width:1px";

        var titleheader = document.createElement("h2");
        titleheader.innerHTML = T[i];
        section.appendChild(titleheader);

        var url = document.createElement("a");
        url.innerHTML = U[i];
        url.href = U[i];
        url.style = "color: blue";
        section.appendChild(url);

        var description = document.createElement("p");
        description.innerHTML = D[i];
        section.appendChild(description);

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox" + i;
        section.appendChild(checkbox);

        document.getElementById("displayres").appendChild(section);
    }

}

function selectAll() {
    var inputs = document.getElementsByTagName("input");
    var i;
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "checkbox") {
            inputs[i].checked = true;
        }
    }
    document.getElementById("togglebox").innerHTML = "Deselect All";
    document.getElementById("togglebox").setAttribute("onClick", "deselectAll()");

}

function deselectAll() {
    var inputs = document.getElementsByTagName("input");
    var i;
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "checkbox") {
            inputs[i].checked = false;
        }
    }
    document.getElementById("togglebox").innerHTML = "Select All";
    document.getElementById("togglebox").setAttribute("onClick", "selectAll()");
}
function download() {
    var format = document.getElementById("formatdd").value;
    var sections = document.getElementsByTagName("section");
    var i;
    var titles = [];
    var urls = [];
    var descriptions = [];
    for (i = 0; i < sections.length; i++) {
        if (sections[i].childNodes[3].checked) {
            titles.push(sections[i].childNodes[0].innerText);
            urls.push(sections[i].childNodes[1].innerText);
            descriptions.push(sections[i].childNodes[2].innerText);
        }
    }
    fileBuilder(titles, urls, descriptions, format);
}

function fileBuilder(titles, urls, descriptions, format) {
    if (titles[0] != null) {


        if (format == "JSON") {
            var jsonOutObj = {
                "Result": []
            };
            var i;
            for (i = 0; i < titles.length; i++) {
                var resultObj = {
                    "title": titles[i],
                    "url": urls[i],
                    "description": descriptions[i]
                };
                jsonOutObj.Result.push(resultObj);
            }
            var jsonOutStr = JSON.stringify(jsonOutObj);
            downloader(document.getElementById("fileName").value, jsonOutStr, format);

        }
        if (format == "XML") {
            var doc = document.implementation.createDocument(null, 'results', null);
            var i;
            for (i = 0; i < titles.length; i++) {
                var resultele = document.createElementNS(null, 'result', null);
                var titleele = document.createElementNS(null, 'title', null);
                var urlele = document.createElementNS(null, 'url', null);
                var descele = document.createElementNS(null, 'description', null);
                console.log(typeof (titles[i]));
                titleele.innerHTML = titles[i];
                urlele.innerHTML = urls[i];
                descele.innerHTML = descriptions[i];
                resultele.appendChild(titleele);
                resultele.appendChild(urlele);
                resultele.appendChild(descele);
                doc.getElementsByTagName("results")[0].appendChild(resultele);
            }

            var serializer = new XMLSerializer();
            var docStr = serializer.serializeToString(doc);
            downloader(document.getElementById("fileName").value, docStr, format);

        }
        if (format == "CSV") {
            var csvStr = "";
            var i;
            for (i = 0; i < titles.length; i++) {
                csvStr += titles[i] + "," + urls[i] + "," + descriptions[i] + "\n";
            }
            downloader(document.getElementById("fileName").value, csvStr, format);

        }
    }
}

function downloader(filename, text, format) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/' + format + ';charset=utf-8,' + encodeURIComponent(text));
    if (filename != "") {
        pom.setAttribute('download', filename + "." + format);
    } else {
        pom.setAttribute('download', "file" + "." + format);
    }

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}