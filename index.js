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
    const Packery = require('packery');
    new Packery('.grid', {
        itemSelector: '.widget',
    });
    setTimeout(() => {
        updateBackground();
        setInterval(updateBackground, 30000);
    }, 2000);
};