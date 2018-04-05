
//Page Loaded
$(function(){

    $(window).scroll(function(){
        app.ui.images.ScrollUpdate()
    });


});

var app = {

BackGroundWorker : undefined,

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
    
    settings.apiURL = settings.apiURL || $(location).attr('host') + '/proxy';

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
        BaseDIV.append("<div id='" + app.settings.PageDIV + "-Controls'>");
        var UI_DIV = $('#' + app.settings.PageDIV + "-Controls");
        this.AddButton(UI_DIV, "Go Back", "app.page.GoBack();");
        this.AddButton(UI_DIV, "Reload", "app.page.RefreshPage();");


        BaseDIV.append('<div data-backdrop="static" class="modal" id="' + app.settings.PageDIV + '-loading" tabindex="-1" role="dialog">'+
        '<div class="modal-dialog modal-dialog-centered" role="document">'+
        '<div class="modal-content">'+
        '<p id="' + app.settings.PageDIV + '-loading-msg"></p>'+
        '</div>'+
        '</div>'+
        '</div>');

        BaseDIV.append("<div id='" + app.settings.PageDIV + "-Data'>");
        callback();

    },

    AddButton: function(parent, name, onClick, cooldown, style)
    {
        parent.append("<button type='button' style='" + style + "' class='btn' onclick='" + onClick + ";'>" + name + "</button>");
    },

    AddCoolDownButton: function(parent, name, onClick, cooldown, style)
    {
        parent.append("<button type='button' style='" + style + "' class='btn' onclick='app.ui.ButtonCoolDown('" + name + "', function(){" + onClick + ";});'>" + name + "</button>");
    },

    ButtonCoolDown: function(id, time, fn)
    {


        fn();

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


        $( "#" + app.settings.PageDIV + "-Data" ).append("<div id='photos' style='width: " + app.settings.ImageSize + "vh; height: " + app.settings.ImageSize + "vh; float:left;'><a href='" + app.settings.BaseURL + app.settings.WorkingPath + "/" + name + "' onclick='return app.page.LoadPage(\"" + app.settings.WorkingPath + "/" + name + "\");'><p style='width: " + app.settings.ImageSize + "vh;'>" + name + "</p><img data-src='" + FileURL + "' style='width: " + (app.settings.ImageSize - 5) + "vh; height: " + (app.settings.ImageSize - 5) + "vh;'>");

    },  


    LoadingPage: function(status, msg)
    {

        if(status === "done")
        {
            $("#" + app.settings.PageDIV + "-loading").modal('hide');
        }
        else
        {
            $("#" + app.settings.PageDIV + "-loading").modal('show');
        }

        if(msg)
        {
            $("#" + app.settings.PageDIV + "-loading-msg").text(msg);
        }

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
        app.ui.LoadingPage("loading", "loading page data");
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
        app.ui.LoadingPage("done");

    },

    RefreshPage: function()
    {
        this.LoadPage(app.settings.WorkingPath);
    },

    //just load the data for the page DO NOT EDIT THE UI HERE
    LoadPage: function(page){
        app.settings.WorkingPath = page.replace("\/\/", "/");
        app.ui.LoadingPage("loading", "getting page data");
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
            var URL = "/proxy/" + encodeURI(app.settings.apiURL + "/api/" + page);
            
            if(page === "/list")
            {
                URL = "/proxy/" + encodeURI(app.settings.apiURL + "/api/");
            }

            $.getJSON(URL, function(data) {
        
                console.log("Loading Page Data");
        
                app.page.PageData = data;
                app.cache.setData(page, JSON.stringify(app.page.PageData));
                app.page.ReloadPage();

            });

        }
        // this must return false 
        return false;
    },


    PageData : "",


},

cache : {

    getData: function(key)
    {
        key = key.replace(/\/$/, "");
        if(localStorage){
            console.log("getting " + key + " from localStorage");
            
            if(localStorage[key])
            {
                try {
                    var temp = JSON.parse(localStorage[key]);
                    console.log(new Date().getTime());
                    console.log(temp.TTL);
                    var TTLdif = Math.floor((new Date().getTime() - temp.TTL)/1000);
                    console.log(TTLdif + ":" + app.settings.TTL);
                    if(TTLdif < app.settings.TTL)
                    {
                    return JSON.parse(temp.data);
                    }
                    localStorage.removeItem(key);
                    console.log(key + " out of date");
                    return false;    
                } catch (error) {
                    localStorage.removeItem(key);
                    console.log(key + " FAILED :(");
                    return false;
                }
                
            }
            console.log(key + " not in localStorage");
            return false;
        }
        console.log("whats localStorage???");
        return false;

    },

    setData: function(key, value)
    {
        key = key.replace(/\/$/, "");
        if(localStorage)
        {

            localStorage[key] = JSON.stringify({'TTL': this.addTTL(app.settings.TTL), 'data' : value});
            return;
        }
        console.log("whats localStorage???");
        return false;
    },

    removeOld: function(){
        if(localStorage){
            for (i = 0; localStorage.length > i; i++){
                app.cache.getData(localStorage.key(i))
            }
        }

    },

    addTTL: function(minutes) {
        return new Date(new Date() + minutes*60000).getTime();
    }

}


};