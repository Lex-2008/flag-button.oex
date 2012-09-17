//defaults. Looks like preferences tags in config.xml are not 100% reliable
defaults={
    showBadge:1,
    showXXBadge:0,
    badgeBGcolor:'#000000',
    badgeTXcolor:'#ffffff',
    disableButton:1,
    debugMode:0,
    source:2,//0=freegeoip.net,2=ipinfodb.com,1000=flag-button.tk
    eventType:0,//0=tab API,1=focus events,2=both
    userkey:' ',
    offlineMode:0,
    showInfo:1,
    popupWidth:200,
    linksCfg:'{}',
    linksStyle:0,
    iconsCfg:'{}',
    cache:'{}',
    statsEnabled:0,
    statsData:'{}',
    statsNextTime:0,
    statsHosts:'{}',
    statsLast:'{}',
};
hiddenFromStats={
    userkey:1,
    linksCfg:1,
    iconsCfg:1,
    cache:1,
    statsEnabled:1,
    statsData:1,
    statsNextTime:1,
    statsHosts:1,
    statsLast:1,
};
try {
    if(lang.defLinks)
	defaults.linksCfg=JSON.stringify(lang.defLinks);
    if(lang.defWidth)
	defaults.popupWidth=lang.defWidth;
    if(parseInt(opera.version())<12)
        defaults.eventType=1;//on Opera versions prior to 12 
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
        var cut=0;//cache items with time below this value will be deleted
        for(var q in this.data)
            {
            //assume that time of first element is earliest time.
            //assume that latest time is 'now'.
            var min=(this.data[q].t);
            var max=Math.round((new Date()).getTime()/100000)-13270000;
            cut=min+(max-min)*d/10;
            break;
            }
        for(var q in this.data)
            if(this.data[q].t<cut)
                delete this.data[q];
        },
    clear:function()
        {
        this.data={};
        },
    load:function()
        {
        this.data=sJSON.parse(widget.preferences.cache);
        },
    save:function()
        {
        this.savePref('cache',sJSON.stringify(this.data));
        },
    savePref:function(name,value,d)//d has the same meaning as in trunc
        {
        if(d==undefined) d=1;
        if(d>10) this.clear();
        try {
            widget.preferences.setItem(name,value);
            }
        catch(e)
            {
            this.trunc(d);
            this.savePref(name,value,d+1);
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



var stats={
    freq:1,//DAYS how often to report stats
    host:'flag-button.tk',
    logLists:{'precache':1,'precache100':1,'groupHosts0':1,'groupHosts2':1,'statsHosts':1,'requested':1},
    add1:function(group,host)
        {
        if(!this.data[group])
            this.data[group]={};
        this.data[group][host]=1;
        },
    logHost:function(host)
        {
        if(widget.preferences.statsEnabled!='1')
            return;
        //check lists with these names and log if the host is there
        for(q in this.logLists)
            if(window[q] && window[q][host])
                this.add1(q,host);
        //this one needs special care
        if(!cache.getItem(host))
            this.add1('requested',host);
        if((new Date()).getTime()>this.nextTime)
            this.sendData();
        },
    save:function()
        {
        cache.savePref('statsData',sJSON.stringify(this.data));
        },
    load:function()
        {
        this.data=sJSON.parse(widget.preferences.statsData);
        this.nextTime=parseInt(widget.preferences.statsNextTime);
        statsHosts=sJSON.parse(widget.preferences.statsHosts);
        },
    clear:function()
        {
        //init data
        this.data={};
        for(var q in this.logLists)
            this.data[q]={};
        this.save();
        statsHosts={};
        cache.savePref('statsHosts','{}');
        cache.savePref('statsLast','{}');
        },
    setNextTime:function()
        {
        this.nextTime=(new Date()).getTime()+(this.freq*24*60*60*1000);
        cache.savePref('statsNextTime',this.nextTime);
        },
    enable:function(state)
        {
        cache.savePref('statsEnabled',state?'1':'0');
        this.clear();
        this.setNextTime();
        if(state)
            {
            //get statsHosts
            var XHR=new window.XMLHttpRequest();
            XHR.onreadystatechange=function()
                {
                if(XHR.readyState!=4)
                    return;
                statsHosts=sJSON.parse(XHR.responseText);
                cache.savePref('statsHosts',XHR.responseText);
                }
            XHR.open("get","http://"+this.host+"/statsHosts.js",true)
            XHR.send();
            }
        },
    makeData:function()
        {
        var params={
            ver:{
                opera:opera.version(),
                ext:widget.version,
                statsHosts:statsHosts.ver
                },
            len:{cache:0},
            pref:{lang:navigator.language},
            };
        for(var q in cache.data)
            params.len.cache++;
        for(q in this.data)
            {
            params.len[q]=0;
            for(var w in this.data[q])
                params.len[q]++;
            }
        for(q in defaults)
            if(!hiddenFromStats[q])
                params.pref[q]=widget.preferences[q];
        return params;
        },
    sendData:function()
        {
        this.setNextTime();
        //prepare data to be sent
        var params=this.makeData();
        this.clear();
        cache.savePref('statsLast',sJSON.stringify(params));
        
        //send data
        var XHR=new window.XMLHttpRequest();
        XHR.onreadystatechange=function()
            {
            if(XHR.readyState!=4)
                return;
            statsHosts=sJSON.parse(XHR.responseText);
            cache.savePref('statsHosts',XHR.responseText);
            }
        //~ console.log(params);
        //~ console.log(sJSON.stringify(params));
        params='stat='+encodeURIComponent(sJSON.stringify(params));
        console.log(params);
        XHR.open("POST","http://"+this.host+"/stat.php",true)
        XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        XHR.send(params);
        },
    data:{},
    nextTime:0,
    }

var sJSON={
    stringify:function(o)
        {
        try{
            return JSON.stringify(o)
            }
        catch(e)
            {
            return '{}';
            }
        },
    parse:function(s)
        {
        try{
            return JSON.parse(s)
            }
        catch(e)
            {
            return {};
            }
        },
    prettify:function(o)
        {
        try{
            var a=JSON.stringify(o).replace(/(,)/g,'$1\n').replace(/({)/g,'$1\n').replace(/(})/g,'$1').split('\n');
            var t='';
            var i=0;
            for(var q in a)
                {
                t+=(new Array(i).join("\t"))+a[q]+'\n';
                if(a[q].charAt(a[q].length-1)=='{')
                    i++;
                if(a[q].charAt(a[q].length-2)=='}')
                    i--;
                }
            return t;
            //~ return JSON.stringify(o);
            }
        catch(e)
            {
            alert(e);
            return '{}';
            }
        }
    }
