function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function () {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}
nextImage = "https://cdn.pixabay.com/photo/2021/11/26/17/26/desert-6826299_960_720.jpg";
function updateBackground() {
    document.getElementById("background").style.backgroundImage = "url(" + nextImage + ")";
    setTimeout(() => {
        fetch("https://www.vestal.ml/smartdisplaypi-backend/background.php")
            .then(response => response.text())
            .then(data => {
                nextImage = data;
                preloadImages([nextImage]);
            });
    }, settings.get("background_refresh_rate", 10000));
}
window.onload = function () {
    widgets = settings.get("widgets", [
        {
            name: "Traffic",
            url: "https://www.google.com/maps/"
        },
        {
            name: "Weather",
            url: "https://weather.com/weather/today/"
        },
        {
            name: "Calendar",
            url: "https://calendar.google.com/calendar/u/0/r/customday"
        }]);
    widgets.forEach(widget => {
        var webview = document.createElement("webview");
        if (!settings.get("editingHome", false)) {
            if (settings.get("autoloadWidgets", false)) {
                webview.src = widget.url;
            }
            else {
                webview.setAttribute("src", "notloaded.html?url=" + widget.url);
            }
        }
        else {
            webview.src = "about:blank";
            webview.style.userSelect = "none";
        }
        webview.setAttribute("useragent", "Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36 SmartDisplayPi");

        var div = document.createElement("div");
        div.classList.add("widget");
        var h3 = document.createElement("h3");
        h3.innerHTML = widget.name + ` <span onclick="kill(parentElement.parentElement.getElementsByTagName('webview')[0])" style="float: right; display: none;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
            <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
        </svg></span>`;
        div.appendChild(h3);
        div.appendChild(webview);
        div.setAttribute("data-item-id", widgets.indexOf(widget));
        document.getElementById("grid").appendChild(div);
        webview.addEventListener("did-start-loading", function () {
            if (webview.src.includes("notloaded.html?url=")) {
                this.parentElement.getElementsByTagName("h3")[0].getElementsByTagName("span")[0].style.display = "none";

            }
            else {
                this.parentElement.getElementsByTagName("h3")[0].getElementsByTagName("span")[0].style.display = "block";

            }
        });
    });

    updateBackground();
    setInterval(updateBackground, settings.get("background_refresh_rate", 10000));
    widgets = document.getElementsByClassName("widget");
    for (let i = 0; i < widgets.length; i++) {
        widgets[i].style.width = settings.get("widgetWidth", 200) + "px";
        widgets[i].style.height = settings.get("widgetHeight", 200) + "px";
    }
    const Packery = require('packery');
    var grid = document.querySelector('#grid');
    var pckry = new Packery(grid, {
        itemSelector: '.widget',
        percentPosition: true,
        columnWidth: parseInt(settings.get("widgetWidth", 200)) + 10,
        initLayout: false, // disable initial layout
    });
    if (settings.get("editingHome", false)) {
        const Draggabilly = require('draggabilly');
        // external js: packery.pkgd.js, draggabilly.pkgd.js

        // add Packery.prototype methods

        // get JSON-friendly data for items positions
        Packery.prototype.getShiftPositions = function (attrName) {
            attrName = attrName || 'id';
            var _this = this;
            return this.items.map(function (item) {
                return {
                    attr: item.element.getAttribute(attrName),
                    x: item.rect.x / _this.packer.width
                }
            });
        };

        // -----------------------------//

        // make draggable
        var items = grid.querySelectorAll('.widget');
        for (var i = 0; i < items.length; i++) {
            var itemElem = items[i];
            var draggie = new Draggabilly(itemElem);
            pckry.bindDraggabillyEvents(draggie);
        }

        // save drag positions on event
        pckry.on('dragItemPositioned', function () {
            var positions = pckry.getShiftPositions('data-item-id');
            // save drag positions
            settings.set('dragPositions', JSON.stringify(positions));
        });
        editingBar = document.createElement("div");
        editingBar.id = "editingBar";
        editingBar.innerHTML = `Editing Home <span id='editingBarButton' onclick="settings.set('editingHome', false);  window.location = 'settings/home.html'"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg></span>`;
        document.body.appendChild(editingBar);
        document.getElementById("shortcuts").style.display = "none";
        document.getElementById("homebutton").style.display = "none";

    }
    Packery.prototype.initShiftLayout = function (positions, attr) {
        if (!positions) {
            // if no initial positions, run packery layout
            this.layout();
            return;
        }
        // parse string to JSON
        if (typeof positions == 'string') {
            try {
                positions = JSON.parse(positions);
            } catch (error) {
                console.error('JSON parse error: ' + error);
                this.layout();
                return;
            }
        }

        attr = attr || 'id'; // default to id attribute
        this._resetLayout();
        // set item order and horizontal position from saved positions
        this.items = positions.map(function (itemPosition) {
            var selector = '[' + attr + '="' + itemPosition.attr + '"]'
            var itemElem = this.element.querySelector(selector);
            var item = this.getItem(itemElem);
            item.rect.x = itemPosition.x * this.packer.width;
            return item;
        }, this);
        this.shiftLayout();

    };
    // get saved dragged positions
    var initPositions = settings.get('dragPositions');
    // init layout with saved positions
    pckry.initShiftLayout(initPositions, 'data-item-id');
}
function kill(webview) {
    let oldsrc = webview.src;
    webview.src = "notloaded.html?url=" + oldsrc;
}
