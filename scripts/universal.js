var overlay = document.getElementById("shortcuts");
document.documentElement.style.setProperty('--animate-duration', '.75s');

function closeopen() {
    if (overlay.style.display == "none") {
        const openStart = new Event('openStart');
        document.dispatchEvent(openStart);
        console.log("opening");
        overlay.style.display = "block";
        overlay.classList.replace('animate__slideOutDown', 'animate__slideInUp');
        overlay.addEventListener('animationend', () => {
            overlay.style.display = "block";
        });
    } else {
        const closeStart = new Event('closeStart');
        document.dispatchEvent(closeStart);
        console.log("closing");
        overlay.classList.replace("animate__slideInUp", 'animate__slideOutDown');
        overlay.addEventListener('animationend', () => {
            overlay.style.display = "none";
        });
    }
}
document.getElementById("homebutton").addEventListener("dblclick", () => {
    window.location = require('electron-root-path').rootPath + "/index.html";
})
function resize() {
    document.getElementById("first-image").style.marginLeft = (document.getElementById("first-image").offsetWidth + (0.015 * document.body.offsetWidth)) + "px";
    document.getElementById("homebutton").style.height = document.getElementById("first-image").offsetWidth + "px";
    document.getElementById("homebutton").style.width = document.getElementById("first-image").offsetWidth + "px";
}
resize();
// DEVELOPMENT PURPOSES ONLY!!!
window.addEventListener('resize', resize);
// Back to your regularly scheduled programming.
const Store = require('electron-store');
const settings = new Store();