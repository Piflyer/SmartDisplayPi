const Store = require('electron-store');
const settings = new Store();

const defaultApps = [{
    name: "Browser",
    icon: "./media/Chromium_Material_Icon.png",
    href: "browser.html"
}, {
    name: "YouTube",
    icon: "./media/youtube.png",
    href: "webview.html?url=https://www.youtube.com/"
},
{
    name: "Ambient",
    icon: "./media/gclock.png",
    href: "ambient.html"
}, {
    name: "Google Photos",
    icon: "./media/googlephotos.png",
    href: "webview.html?url=https://photos.google.com/"
}, {
    name: "Settings",
    icon: "./media/settings.png",
    href: "settings.html"
}];
var shortcuts = document.createElement("DIV");
shortcuts.classList.add("animate__animated", "animate__slideInUp");
shortcuts.id = "shortcuts";
document.body.appendChild(shortcuts);
settings.get("apps", defaultApps).forEach(app => {
    let shortcut = document.createElement("A");
    shortcut.href = "file:///" + __dirname + "/" + app.href;
    shortcut.innerHTML = `<img src="${app.icon}">`;
    shortcuts.appendChild(shortcut);
});
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
    document.getElementById("shortcuts").firstChild.style.marginLeft = (document.getElementById("shortcuts").firstChild.offsetWidth + (0.015 * document.body.offsetWidth)) + "px";
    document.getElementById("homebutton").style.height = document.getElementById("shortcuts").firstChild.offsetWidth + "px";
    document.getElementById("homebutton").style.width = document.getElementById("shortcuts").firstChild.offsetWidth + "px";
}
resize();
setTimeout(resize, 100);
// DEVELOPMENT PURPOSES ONLY!!!
window.addEventListener('resize', resize);
// Back to your regularly scheduled programming.
if (settings.get("ambient", true) && !window.location.href.includes("ambient.html")) {
    function ambient() {
        window.location.href = "file:///" + __dirname + "/ambient.html";
    }
    t = setTimeout(ambient, 10000);
    window.addEventListener('load', resetTimer, true);
    var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(function (name) {
        document.addEventListener(name, resetTimer, true);
    });
    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(ambient, settings.get("ambientDelay", 30) * 60 * 1000);
    }
}