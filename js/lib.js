//defaults. Looks like <preference> tags in config.xml are kinda broken :(
defaults={
    saved:0,
    showBadge:1,
    showXXBadge:0,
    badgeBGcolor:'#000000',
    badgeTXcolor:'#ffffff',
    disableButton:1,
    debugMode:0,
    popupWidth:200,
    linksCfg:'{}',
    linksStyle:0,
    iconsCfg:'{}',
};
for(var q in defaults)
    defaults.saved++;
try {
    if(lang.defLinks)
	defaults.linksCfg=JSON.stringify(lang.defLinks);
    if(lang.defWidth)
	defaults.popupWidth=lang.defWidth;
    }
catch(e){};



// debug ;)
function aalert(o){
var str='';
for(var qwe in o)
    str+=''+qwe+':'+typeof(o[qwe])+'='+o[qwe]+'\n';
opera.postError('('+typeof(o)+')='+o+'\n\n'+str);
}



var cache={
    getItem:function(name)
        {
        return this.data[name];
        },
    setItem:function(name,val,d)
        {
        val.t=Math.round((new Date()).getTime()/1000)-1327000000;
        try {
            this.data[name]=val;
            }
        catch(e)
            {
            if(d==undefined) d=1;
            this.trunc(d);
            this.setItem(name,val,d+1);
            }
        },
    trunc:function(d)//we will delete approximately d*10% of all cache elements
        {
        if(d==undefined) d=1;
        var top10=[],n=0,max=0,min=0;
        for(var q in this.data)
            {
            var t=this.data[q].t;
            if(n<10)//<-- amount of elements we first skip
                {
                //on first element: be sure that min and max will be set to its value
                if(n==0) min=t;
                //for fist 10 elements: just measure, don't try to delete
                if(t>max) max=t;
                if(t<min) min=t;
                top10.push(q);
                }
            else
                {//for all other elements: measure and think about deleting
                if(t>max) max=t;
                if(t<min) min=t;
                if(t<(max-min)*d/10+min)
                    delete this.data[q];
                }
            }
        //back to first 10 elements: consider deleting
        for(var q in top10)
            {
            if(this.data[q].t<(max-min)*d/10+min)
                delete this.data[q];
            }
        },
    clear:function()
        {
        this.data={};
        },
    load:function()
        {
        this.data=JSON.parse(widget.preferences.cache);
        },
    save:function(d)//d has the same meaning as in trunc
        {
        if(d==undefined) d=1;
        if(d>10) this.clear();
        try {
            widget.preferences.cache=JSON.stringify(this.data);
            }
        catch(e)
            {
            this.trunc(d);
            this.save(d+1);
            }
        },
    data:{}//{host:{t:timestamp,...},..}
    }


function clearCache()
    {
    cache.clear();
    cache.save();
    }


function clearPrefs()
    {
    //this might whipe your cache
    widget.preferences.clear();
    }


function gebi(id)
    {
    return document.getElementById(id)
    }