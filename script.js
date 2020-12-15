var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var x = document.getElementById("details");
x.innerHTML = "Browser inner window width: " + w + "<br> Browser inner window height: " + h + ".";

document.getElementById("width").innerHTML=
"Screen Width: " + screen.width;