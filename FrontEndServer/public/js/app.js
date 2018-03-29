//Page Loaded
$(function(){

    $('img').each(function(){
        images.push($(this));
    });

    $(window).scroll(ScrollUpdate());
    ScrollUpdate();

});

var images = new Array()

function ScrollUpdate()
{
try {
    
for (var i = 0; i < images.length; i++) {
    if (elementInViewport(images[i])) {
        console.log('loading images');
        loadImage(images[i], function () {
        images.pop(images[i]);
        });
    }
}

} catch (error) {
 console.log(error);   
}

}

function elementInViewport(el) {

    var top_of_element = el.offset().top;
    var bottom_of_element = el.offset().top + el.outerHeight();
    var bottom_of_screen = $(window).scrollTop() + window.innerHeight;
    var top_of_screen = $(window).scrollTop();

    if((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
        return true;
    }
    else {
        return false;
    }

}

function loadImage (el, fn) {
    
    el.on("load",function(){fn();});
    el.attr("src", el.attr('data-src'));	
    
}
