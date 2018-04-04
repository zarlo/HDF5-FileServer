//Page Loaded
$(function(){

    $(window).scroll(function(){
        app.ui.images.ScrollUpdate()
    });


});

var app = {

settings: {

    apiURL: "",
    BaseURL: "",
    WorkingPath: "",
    PageDIV: "",
    ImageSize: 25,
    useThumbnails: true,
    TTL: 300,
    
},

Init: function(settings){
    
    settings.apiURL = settings.apiURL || $(location).attr('host') + ':5000/';

    settings.BaseURL = settings.BaseURL || '//' + $(location).attr('host') + '/db/';  

    settings.WorkingPath = settings.WorkingPath || '/';

    settings.PageDIV = settings.PageDIV || 'App';

    settings.ImageSize = settings.ImageSize || "25";

    settings.TTL = settings.TTL || "300";

    settings.useThumbnails = settings.useThumbnails || true;
    
    console.log(settings);

    if (history.pushState) {
        console.log("Live URL is on");
    }
    else
    {
        console.log("live URL is off");
    }

    if (localStorage)
    {
        console.log("localStorage is on");
        console.log(localStorage);
    }
    else
    {
        console.log("localStorageis off");
    }

    app.settings = settings;

    app.ui.Init(function(){
        app.page.LoadPage(settings.WorkingPath);
    });
    

},

ui: {

    Init: function(callback)
    {
        console.log('Making UI');
        console.log('App Div is ' + app.settings.PageDIV);
        var BaseDIV = $('#' + app.settings.PageDIV);
        BaseDIV.append("<a herf='javascript:;' onclick='app.page.GoBack();'><button type='button' class='btn'>Go Back</button></a>");
        BaseDIV.append("<div id='" + app.settings.PageDIV + "-Data'>");
        callback();

    },

    AddPhoto: function(name){

        var FileURL;
        if(app.settings.useThumbnails || app.settings.useThumbnails == "yes"){
            FileURL = app.settings.apiURL + "/thumbnail/" + app.settings.WorkingPath + "/" + name;
        }
        else
        {
            FileURL = app.settings.apiURL + "/" + app.settings.WorkingPath + "/" + name;
        }


        $( "#" + app.settings.PageDIV + "-Data" ).append("<div id='photos' style='width: " + app.settings.ImageSize + "vh; height: " + app.settings.ImageSize + "vh; float:left;'><a href='javascript:;' onclick='app.page.LoadPage(\"" + app.settings.WorkingPath + "/" + name + "\");'><p style='width: " + app.settings.ImageSize + "vh;'>" + name + "</p><img data-src='" + FileURL + "' style='width: " + (app.settings.ImageSize - 5) + "vh; height: " + (app.settings.ImageSize - 5) + "vh;'>");

    },
    
    LoadingPage: function()
    {

    },

    images: {
    
        reload: function(){
    
            this.imagesdata = Array();
            $('img').each(function(){
                app.ui.images.imagesdata.push($(this));
            });
    
        },
    
        ScrollUpdate: function(){
    
            try { 
    
                this.imagesdata.filter(img => this.elementInViewport(img)).forEach(element => {
                    this.loadImage(element, function(){
                        console.log("Image loaded");
                    });
                });
                this.imagesdata = this.imagesdata.filter((img) => !this.elementInViewport(img))
            
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
    
            el.attr("src", el.attr('data-src'));
            
            el.on("load",function(){fn();});
            
        },
    
        imagesdata : Array(),
    
    },

},

page: {

    GoBack: function(){

        if(app.settings.WorkingPath === '/')
        {
            return;
        }

        var to = app.settings.WorkingPath.lastIndexOf('/');
        app.settings.WorkingPath =  app.settings.WorkingPath.substring(0,to);
        
        if(app.settings.WorkingPath === "")
        {
            app.settings.WorkingPath = '/';            
        }

        console.log("New Working Path:" + app.settings.WorkingPath);

        this.LoadPage(app.settings.WorkingPath);

    },

    ReloadPage: function(){

        console.log("Page Type:" + this.PageData.type);

        if(this.PageData.type === "file")
        {
            this.GoBack();
            return;
        }


        console.log(this.PageData.data.length + " photos to load");


        for(i = 0; i < this.PageData.data.length; i++)
        {

            console.log("Adding Photo");
            app.ui.AddPhoto(this.PageData.data[i]);
        
        }

        app.ui.images.reload();
        app.ui.images.ScrollUpdate();

    },

    LoadPage: function(page){
        app.settings.WorkingPath = page;
        console.log(app.settings.WorkingPath);
        if (history.pushState) {
        window.history.pushState("","H5 FILES", app.settings.BaseURL + page);
        }
        
        $( "#" + app.settings.PageDIV + "-Data" ).empty(); 
        
        if(page === "/")
        {
            page = "/list";
        }
        
        if(app.cache.getData(page))
        {

            app.page.PageData = app.cache.getData(page);

            console.log("loadded from localStorage");
            app.page.ReloadPage();
            return;
            
        }
        else
        {

            $.getJSON("/proxy/" + encodeURI(app.settings.apiURL + "/api/" + page), function(data) {
        
                console.log("Loading Page Data");
        
                app.page.PageData = data;
                app.cache.setData(page, JSON.stringify(app.page.PageData));
                app.page.ReloadPage();

            });
        }
    },


    PageData : "",


},

cache : {

    getData: function(key)
    {
        if(localStorage){
            console.log("getting " + key + " from localStorage");
            var temp = localStorage[key];
            
            if(temp)
            {

                var TTLdif = new Date().getTime() < temp.TTL;
                console.log(TTLdif);
                if(TTLdif < (app.settings.TTL * 60000))
                {
                return JSON.parse(JSON.parse(localStorage[key]).data);
                }
                //localStorage.removeItem(key);
                console.log(key + " out of date");
                return false;
            }
            console.log(key + " not in localStorage");
            return false;
        }
        console.log("whats localStorage???");
        return false;

    },

    setData: function(key, value)
    {
        if(localStorage)
        {

            localStorage[key] = JSON.stringify({'TTL': this.addTTL(app.settings.TTL), 'data' : value});
            return;
        }
        console.log("whats localStorage???");
        return false;
    },

    addTTL: function(minutes) {
        return new Date(new Date() + minutes*60000).getTime();
    }

}


};