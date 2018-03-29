//Page Loaded
$(function(){

    $('img').each(function(){
        images.imagesdata.push($(this));
    });

    $(window).scroll(function(){
        images.ScrollUpdate()
    });
    images.ScrollUpdate();

});

var images = {
    
    ScrollUpdate: function(){

        try { 

            images.imagesdata.filter(img => images.elementInViewport(img)).forEach(element => {
                images.loadImage(element, function(){
                    console.log("Image loaded");
                });
            });
            images.imagesdata = images.imagesdata.filter((img) => !images.elementInViewport(img))
        
        } catch (error) {
         console.log(error);   
        }
        

    },

    elementInViewport: function(el) {

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
    
    },

    loadImage:  function(el, fn) {

        if(el.attr('data-src') == 'done')
        {
        return;
        }
        el.attr("src", el.attr('data-src'));
        el.attr('data-src', 'done');
        
        el.on("load",function(){fn();});
        
    },


    imagesdata : Array(),

};







