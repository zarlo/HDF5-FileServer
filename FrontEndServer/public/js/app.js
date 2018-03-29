//Page Loaded
$(function(){

    $('img').each(function(){
        images.push($(this));
    });

    $(window).scroll(function(){
         ScrollUpdate()
    });
    ScrollUpdate();

});

var images = new Array()

function ScrollUpdate()
{
try { 

    images.filter(img => elementInViewport(img)).forEach(element => {
        loadImage(element, function(){
            console.log("Image loaded");
        });
    });
    images = images.filter((img) => !elementInViewport(img))

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
    

    el.attr("src", el.attr('data-src'));
    el.on("load",function(){fn();});
    	
    
}
