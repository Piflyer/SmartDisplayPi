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
nextImage = "https://pixabay.com/get/ge4ce8133906f0076c8779cde35ee0cffa499a722ff6664c7ba50190a1bc553a28cb19ad2502ad74f2fc35406119dedee50b56f306e28c771ba2a09f761392596_1280.jpg";
function updateBackground() {
    document.getElementById("background").style.backgroundImage = "url(" + nextImage + ")";
    setTimeout(() => {
        fetch("http://192.168.1.181/smartdisplaypi-backend/background.php")
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