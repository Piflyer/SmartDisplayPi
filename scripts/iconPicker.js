const fs = require('fs');

let icons = JSON.parse(fs.readFileSync('assets/icons.json'));
const fuzzysort = require('fuzzysort');
function search(query) {
    let results = fuzzysort.go(query, icons, {
        limit: 50,
        all: true
    });
    document.getElementById("icons").innerHTML = "";
    results.forEach(result => {
        let img = document.createElement("img");
        img.src = "https://www.vestal.tk/smartdisplaypi-backend/kde-icons/icons/" + result.target;
        document.getElementById("icons").appendChild(img);
        img.onclick = function () {
            document.getElementById("icon").value = result.target;
            document.getElementById("icon-preview").src = img.src;
            document.getElementById("iconModal").style.display = "none";
        }
    })
}
search("");

