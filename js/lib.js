//defaults. Looks like <preference> tags in config.xml are kinda broken :(
defaults={
    showBadge:1,
    showXXBadge:0,
    badgeBGcolor:'#000000',
    badgeTXcolor:'#ffffff',
    disableButton:1,
    debugMode:0,
    source:2,//0=freegeoip.net,2=ipinfodb.com,1000=flag-button.tk
    eventType:1,
    userkey:' ',
    offlineMode:0,
    showInfo:1,
    popupWidth:200,
    linksCfg:'{}',
    linksStyle:0,
    iconsCfg:'{}',
};
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
        if(window.precache && precache[name])
            {
            var q=precache[name].split('|');
            //code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp
            return {"code":q[0],"err":q[1],"ip":q[2],"co":q[3],"country":q[4],"region":q[5],"city":q[6],"zip":q[7],"lat":q[8],"lng":q[9],"tz":q[10],"src":q[11],"cmp":q[12]};
            }
        if(this.data[name])
            {
            var q=this.data[name].d.split('|');
            //code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp
            return {"code":q[0],"err":q[1],"ip":q[2],"co":q[3],"country":q[4],"region":q[5],"city":q[6],"zip":q[7],"lat":q[8],"lng":q[9],"tz":q[10],"src":q[11],"cmp":q[12]};
            }
        else return false;
        },
    setItem:function(name,val,t,d)//val=string
        {
        if(t===undefined)
            t=Math.round((new Date()).getTime()/100000)-13270000;
        try {
            this.data[name]={'t':t,'d':val};
            }
        catch(e)
            {
            if(d==undefined) d=1;
            this.trunc(d);
            this.setItem(name,val,t,d+1);
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
    data:{}//{host:{t:timestamp,d:'code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp'},..}
    }


function clearCache()
    {
    cache.clear();
    cache.save();
    }


function ensureAllPrefs()
    {
    for(var q in defaults)
        if(widget.preferences[q]===undefined)
            widget.preferences[q]=defaults[q];
    }



function clearPrefs()
    {
    //this might whipe your cache
    widget.preferences.clear();
    ensureAllPrefs();
    }


function gebi(id)
    {
    return document.getElementById(id)
    }