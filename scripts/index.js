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
nextImage = "https://pixabay.com/get/gf662d049a10581eecc0f7a1b25104e8ee04a5f61c86a19a542123b0e5a4f407c64a5021a433885414ef7f104618a8b9391dfdb0390bbf8a96190db4bb17ba7f2_1280.jpg";
function updateBackground() {
    document.getElementById("background").style.backgroundImage = "url(" + nextImage + ")";
    setTimeout(() => {
        fetch("https://www.vestal.ml/smartdisplaypi-backend/background.php")
            .then(response => response.text())
            .then(data => {
                nextImage = data;
                preloadImages([nextImage]);
            });
    }, 2000);
}
window.onload = function () {
    setTimeout(() => {
        updateBackground();
        setInterval(updateBackground, 30000);
    }, 2000);
    const Packery = require('packery');
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

    // -----------------------------//

    // init Packery
    var grid = document.querySelector('#grid');
    var pckry = new Packery(grid, {
        itemSelector: '.widget',
        percentPosition: true,
        columnWidth: 200,
        initLayout: false, // disable initial layout
    });

    // get saved dragged positions
    var initPositions = settings.get('dragPositions');
    // init layout with saved positions
    pckry.initShiftLayout(initPositions, 'data-item-id');

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


}