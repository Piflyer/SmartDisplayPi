const Store = require('electron-store');
const settings = new Store();

const defaultApps = [{
    name: "Browser",
    icon: "./media/Internet_Explorer.png",
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
    name: "OutLook",
    icon: "./media/Microsoft_Office_Outlook_(2018–present).svg.png",
    href: "webview.html?url=https://outlook.live.com/"
}, {
    name: "Settings",
    icon: "./media/settings.png",
    href: "settings.html"
}];
var shortcuts = document.createElement("DIV");
shortcuts.classList.add("animate__animated", "animate__slideInUp");
shortcuts.id = "shortcuts";
document.body.appendChild(shortcuts);

function check(buffer, callback) {
    var view = new DataView(buffer);

    // is a PNG?
    if (view.getUint32(0) === 0x89504E47 && view.getUint32(4) === 0x0D0A1A0A) {
        // We know format field exists in the IHDR chunk. The chunk exists at 
        // offset 8 +8 bytes (size, name) +8 (depth) & +9 (type)
        var depth = view.getUint8(8 + 8 + 8);
        var type = view.getUint8(8 + 8 + 9);

        callback({
            depth: depth,
            type: ["G", "", "RGB", "Indexed", "GA", "", "RGBA"][type],
            buffer: view.buffer,
            hasAlpha: type === 4 || type === 6  // grayscale + alpha or RGB + alpha
        })
    }
    // Not a PNG
    else {
        callback({
            depth: null,
            type: "NOTPNG",
            buffer: view.buffer,
            hasAlpha: false
        });
    }
}

function loadXHR(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        if (xhr.status === 200) check(xhr.response, callback);
        else consle.log("Loading error: " + xhr.statusText);
    };
    xhr.send();
}
settings.get("apps", defaultApps).forEach(app => {
    let shortcut = document.createElement("A");
    shortcut.href = "file:///" + __dirname + "/" + app.href;
    shortcut.innerHTML = `<img src="${app.icon}">`;
    loadXHR(app.icon, function (result) {
        shortcut.firstChild.style.borderRadius = (result.hasAlpha && app.icon !== "./media/gclock.png" ? "0" : "50%");
        console.log(result.depth + app.icon);
    });
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

const BetterBoard = require('betterboard');
BetterBoard.init({
    keysArrayOfObjects: [
        {
            "0": "Q",
            "1": "W",
            "2": "E",
            "3": "R",
            "4": "T",
            "5": "Y",
            "6": "U",
            "7": "I",
            "8": "O",
            "9": "P",
            "10": "+"
        },
        {
            "0": "A",
            "1": "S",
            "2": "D",
            "3": "F",
            "4": "G",
            "5": "H",
            "6": "J",
            "7": "K",
            "8": "L",
            "9": ";"
        },
        {
            "0": "Z",
            "1": "X",
            "2": "C",
            "3": "V",
            "4": "B",
            "5": "N",
            "6": "M",
            "7": ",",
            "8": "."
        }
    ],
    language: 'en',
    theme: 'flat',
    allowRealKeyboard: true,
    allowMobileKeyboard: true,
    autoScroll: true,
    capsLockActive: false,
});
BetterBoard.run('input[type=text], input[type=number], textarea');