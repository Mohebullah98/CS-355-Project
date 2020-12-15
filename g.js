function googlesearch() {
    var searchterm = document.getElementById("gooSearch").value
    var url = "https://www.googleapis.com/customsearch/v1/siterestrict?key=AIzaSyBPRakZQjv780pIeU1w_v5m0so7AZHT7c0&cx=017168851564985857371:ocrlfzfoqwy&q=" + searchterm;
    var titles = [];
    var urls = [];
    var descriptions = [];
    fetch(url)
        .then(response => {
            return response.json()
        })
        .then(data => {
            
            console.log(data.items[0]);
            var i;
            for (i = 0; i < data.items.length; i++) {
                titles[i] = data.items[i].title;
                urls[i] = data.items[i].link;
                descriptions[i] = data.items[i].snippet;
            }
            resultsDisplayer(titles, urls, descriptions);
        })
        .catch(err => {
           
        })

}
function resultsDisplayer(T, U, D) {
    document.getElementById("Seresults").innerHTML = "";
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

        document.getElementById("Seresults").appendChild(section);
    }

}
function search() {

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
