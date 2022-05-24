var ById = function (id) {
    return document.getElementById(id);
}
var jsonfile = require('jsonfile');
var uuid = require('uuid');
var back = ById('backbtn'),
    forward = ById('forward'),
    refresh = ById('refresh'),
    omni = ById('url'),
    fave = ById('fave'),
    favicon = ById('favicon'),
    home = ById('home'),
    view = ById('view'),
    defaultBookmarks = [
        {
            "id": "06934346-c4e5-41ce-86d5-221e1eb07eea",
            "url": "https://www.nytimes.com/",
            "icon": "https://www.google.com/s2/favicons?sz=64&domain_url=https://www.nytimes.com/",
            "title": "The New York Times - Breaking News, US News, World News and Videos"
        },
        {
            "id": "52b5dd1d-1f4f-47eb-b108-6ba50df48f2c",
            "url": "https://www.bbc.com/",
            "icon": "https://www.google.com/s2/favicons?sz=64&domain_url=https://www.bbc.com/",
            "title": "BBC - Homepage"
        },
        {
            "id": "2ad3d74f-bd46-458a-84db-670982c19503",
            "url": "https://www.uticaod.com/",
            "icon": "https://www.google.com/s2/favicons?sz=64&domain_url=https://www.uticaod.com/",
            "title": "Utica Observer Dispatch: Local News, Politics &amp; Sports in Utica, NY"
        }
    ];
function reloadView() {
    view.reload();
}

function backView() {
    view.goBack();
}

function forwardView() {
    view.goForward();
}
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path fill="currentColor"
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (!!pattern.test(str)) {
        return true;
    } else {
        return false;
    }
}
function updateURL(event) {
    if (event.keyCode === 13) {
        BetterBoard.closeKeyboard();
        omni.blur();
        let val = omni.value;
        if (val === "") {
            view.src = "browserHome.html";
            return;
        }
        let https = val.slice(0, 8).toLowerCase();
        let http = val.slice(0, 7).toLowerCase();
        if (https === 'https://' || http === 'http://') {
            view.loadURL(val);
        } else {
            if (validURL("http://" + val)) {
                view.loadURL("http://" + val);
            } else {
                view.loadURL("https://www.google.com/search?q=" + val);
            }
        }
    }
}
var Bookmark = function (id, url, faviconUrl, title) {
    this.id = id;
    this.url = url;
    this.icon = faviconUrl;
    this.title = title;
}

Bookmark.prototype.ELEMENT = function () {
    var a_tag = document.createElement('a');
    a_tag.href = this.url;
    a_tag.className = 'link';
    a_tag.textContent = this.title;
    var favimage = document.createElement('img');
    favimage.src = this.icon;
    favimage.className = 'favicon';
    a_tag.insertBefore(favimage, a_tag.childNodes[0]);
    return a_tag;
}
function handleBookmark() {
    if (fave.getAttribute("smartdisplay-browser-faved") == "false") {
        let tmp = settings.get("Browser.bookmarks", defaultBookmarks);
        let bookmark = new Bookmark(uuid.v4(), view.getURL(), "https://www.google.com/s2/favicons?sz=64&domain_url=" + encodeURI(view.getURL()), view.getTitle());
        tmp.push(bookmark);
        settings.set("Browser.bookmarks", tmp);
        fave.setAttribute("smartdisplay-browser-faved", bookmark.id);
    }
    else {
        let tmp = settings.get("Browser.bookmarks", defaultBookmarks);
        let id = fave.getAttribute("smartdisplay-browser-faved");
        let index = tmp.findIndex(x => x.id === id);
        tmp.splice(index, 1);
        settings.set("Browser.bookmarks", tmp);
        fave.setAttribute("smartdisplay-browser-faved", false);
    }
}

function updateNav(event) {
    if (view.getURL().includes("https://www.google.com/search?q=")) {
        omni.value = "Google Search | " + decodeURI(new URLSearchParams(view.getURL().split("https://www.google.com/search")[1]).get('q'));
    } else if (view.getURL().includes("browserHome.html")) {
        omni.value = "";
    }
    else if (view.getURL().includes("https://www.bing.com/search?q=")) {
        omni.value = "Bing Search | " + decodeURI(new URLSearchParams(view.getURL().split("https://www.bing.com/search")[1]).get('q'));
    } else {
        omni.value = view.getURL();
    }
    let index = settings.get("Browser.bookmarks", defaultBookmarks).findIndex(x => x.url === view.getURL());
    if (index !== -1) {
        fave.setAttribute("smartdisplay-browser-faved", settings.get("Browser.bookmarks", defaultBookmarks)[index].id);
    } else {
        fave.setAttribute("smartdisplay-browser-faved", false);
    }
    if (view.canGoBack()) {
        back.disabled = false;
        back.style.transform = 'scale(1.3)';
        back.style.backgroundColor = "#0284c3";
        back.style.borderColor = "#73a9c5";
        back.style.color = "#fff";
        back.children[0].children[0].style.stroke = "#fff";

    } else {
        back.disabled = true;
        back.style.backgroundColor = "#fff";
        back.style.borderColor = "#d8d8d8";
        back.style.color = "#d8d8d8";
        back.children[0].children[0].style.stroke = "#d8d8d8";
    }
    if (view.canGoForward()) {
        forward.disabled = false;
        forward.style.backgroundColor = "#0284c3";
        forward.style.borderColor = "#73a9c5";
        forward.style.color = "#fff";
        forward.children[0].children[0].style.stroke = "#fff";
    } else {
        forward.disabled = true;
        forward.style.backgroundColor = "#fff";
        forward.style.borderColor = "#d8d8d8";
        forward.style.color = "#d8d8d8";
        forward.children[0].children[0].style.stroke = "#d8d8d8";
    }
    if (view.canGoForward()) {
        forward.disabled = false;
    } else {
        forward.disabled = true;
    }
    favicon.src = "https://www.google.com/s2/favicons?sz=64&domain_url=" + encodeURI(view.getURL());
}
refresh.addEventListener('click', reloadView);
back.addEventListener('click', backView);
forward.addEventListener('click', forwardView);
omni.addEventListener('keydown', updateURL);
fave.addEventListener('click', handleBookmark);
view.addEventListener('did-navigate-in-page', updateNav);
view.addEventListener('did-navigate', updateNav);
view.addEventListener('did-fail-load', (error) => {
    console.log(error.errorCode);
    if (error.isMainFrame) {
        view.loadURL('file:///' + __dirname + "/browserError.html?error=" + encodeURI(error.errorDescription) + "&errorcode=" + encodeURI(error.errorCode));
    }
});
document.addEventListener("closeStart", function () {
    view.style.height = "calc(100vh - 60px)";
});
document.addEventListener("openStart", function () {
    view.style.height = "calc(100vh - 60px - 13vh - 0.70vh)";
});
home.addEventListener("click", function () {
    view.loadURL('file:///' + __dirname + '/browserHome.html?' + encodeURI(json2Url.serialize(settings.get("Browser.bookmarks", defaultBookmarks))));
});
window.addEventListener("beforeunload", function (e) {
    settings.set("Browser.lastState", { url: view.getURL() });
}, false);
var first = 0;
function domReady() {
    console.log("ran");
    if (first === 0) {
        if (settings.get("Browser.lastState", null) === null) {
            view.loadURL('file:///' + __dirname + '/browserHome.html?' + encodeURI(json2Url.serialize(settings.get("Browser.bookmarks", defaultBookmarks))));
            first = 1;
            return;
        }
        else {
            view.loadURL(settings.get("Browser.lastState").url);
            first = 1;
            return;
        }
    }
    if (first === 1) {
        view.clearHistory();
        back.disabled = true;
        back.style.background = "#fff";
        back.style.borderColor = "#d8d8d8";
        back.style.color = "#d8d8d8";
        back.children[0].children[0].style.stroke = "#d8d8d8";
        view.removeEventListener("dom-ready", domReady);
    }

}
view.addEventListener("dom-ready", domReady);
view.addEventListener("did-stop-loading", () => {
    injectScript(view);
});
