var overlay = document.getElementById("shortcuts");
document.documentElement.style.setProperty('--animate-duration', '.75s');

function closeopen() {
    if (overlay.style.display == "none") {
        console.log("opening");
        overlay.style.display = "block";
        overlay.classList.replace('animate__slideOutDown', 'animate__slideInUp');
        overlay.addEventListener('animationend', () => {
            overlay.style.display = "block";
        });
    } else {
        console.log("closing");
        overlay.classList.replace("animate__slideInUp", 'animate__slideOutDown');
        overlay.addEventListener('animationend', () => {
            overlay.style.display = "none";
        });
    }
}
const Packery = require('packery');
const Draggabilly = require('draggabilly');
var pckry = new Packery('.grid', {
    itemSelector: '.widget',
    columnWidth: 10,
    gutter: 10,
});
pckry.getItemElements().forEach(function (itemElem) {
    var draggie = new Draggabilly(itemElem);
    pckry.bindDraggabillyEvents(draggie);
});
document.getElementById("first-image").style.marginLeft = document.getElementById("first-image").offsetWidth + "px";