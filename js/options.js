var cache=opera.extension.bgProcess.cache;
var stats=opera.extension.bgProcess.stats;

function addCSS(cssCode)
    {
    var styleElement = document.createElement("style");
    styleElement.type = "text/css";
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = cssCode;
    } else {
        styleElement.appendChild(document.createTextNode(cssCode));
    }
    document.getElementsByTagName("head")[0].appendChild(styleElement);
    }

//note: it must be safe to run this function several times
function loadPrefs()
    {
    //===badge===
    gebi('showBadge').checked=widget.preferences.showBadge=='1';
    gebi('showBadge').onclick=function() { widget.preferences.showBadge=this.checked?'1':'0'; };
    gebi('showXXBadge').checked=widget.preferences.showXXBadge=='1';
    gebi('showXXBadge').onclick=function() { widget.preferences.showXXBadge=this.checked?'1':'0'; };
    gebi('badgeBGcolor').value=widget.preferences.badgeBGcolor;
    gebi('badgeBGcolor').onchange=gebi('badgeBGcolor').onkeyup=function()
        {
        widget.preferences.badgeBGcolor=this.value;
        opera.extension.postMessage({q:"badgeColor"});
        };
    gebi('badgeTXcolor').value=widget.preferences.badgeTXcolor;
    gebi('badgeTXcolor').onchange=gebi('badgeTXcolor').onkeyup=function()
        {
        widget.preferences.badgeTXcolor=this.value;
        opera.extension.postMessage({q:"badgeColor"});
        };
    
    //===icons===
    gebi('iconsCfg').border_size=(gebi('iconsCfg').offsetHeight-gebi('iconsCfg').scrollHeight)/2;
    gebi('iconsCfg').onkeyup=function()
        {
        this.style.height='auto';
        this.style.height=(this.border_size+this.scrollHeight)+'px';
        var q=this.value;
        var iconsCfg={};	//that's temporary
        q=q.split('\n');	//split strings
        for(var w in q)	//for each string
            {
            var e=q[w].search('=');				//'=' position
            if(!(e>0)) continue;				//must exist
            e=[q[w].substring(0,e),q[w].substring(e+1)]	//[0..'='),('='..end]
            iconsCfg[e[0].toUpperCase()]=e[1];		//assign
            }
        widget.preferences.iconsCfg=sJSON.stringify(iconsCfg);
        opera.extension.postMessage({q:"badgeColor"});
        }
    var iconsCfg=sJSON.parse(widget.preferences.iconsCfg);
    var str='';
    for(var q in iconsCfg)
	str+=q+'='+iconsCfg[q]+'\n';
    gebi('iconsCfg').value=str;
    gebi('iconsCfg').style.height='auto';
    gebi('iconsCfg').style.height=(gebi('iconsCfg').border_size+gebi('iconsCfg').scrollHeight)+'px';
    
    //===popup===
    gebi('popupWidth').onchange=gebi('popupWidth').onkeyup=function()
	{
	widget.preferences.popupWidth=this.value;
        opera.extension.postMessage({q:"badgeColor"});
	};
    gebi('linksCfg').border_size=(gebi('linksCfg').offsetHeight-gebi('linksCfg').scrollHeight)/2;
    gebi('linksCfg').onkeyup=function()
        {
        this.style.height='auto';
        this.style.height=(this.border_size+this.scrollHeight)+'px';
        var q=this.value;
        var linksCfg={};	//that's temporary
        q=q.split('\n');	//split strings
        for(var w in q)	//for each string
            {
            var e=q[w].search('=');				//'=' position
            if(!(e>0)) continue;				//must exist
            e=[q[w].substring(0,e),q[w].substring(e+1)]	//[0..'='),('='..end]
            linksCfg[e[0]]=e[1];		//assign
            }
        widget.preferences.linksCfg=sJSON.stringify(linksCfg);
        opera.extension.postMessage({q:"badgeColor"});
        }
    
    //===links===
    gebi('linksStyle0').onclick=function() { widget.preferences.linksStyle=0 };
    gebi('linksStyle1').onclick=function() { widget.preferences.linksStyle=1 };
    gebi('linksStyle2').onclick=function() { widget.preferences.linksStyle=2 };
    gebi('popupWidth').value=widget.preferences.popupWidth;
    var linksCfg=sJSON.parse(widget.preferences.linksCfg);
    var str='';
    for(var q in linksCfg)
	str+=q+'='+linksCfg[q]+'\n';
    gebi('linksCfg').value=str;
    gebi('linksCfg').style.height='auto';
    gebi('linksCfg').style.height=(gebi('linksCfg').border_size+gebi('linksCfg').scrollHeight)+'px';
    gebi('linksResetNow').onclick=function()
        {
        widget.preferences.linksCfg=defaults.linksCfg;
        loadPrefs();
        };
    if(widget.preferences.linksStyle=='1')
	gebi('linksStyle1').checked=true;
    else if(widget.preferences.linksStyle=='2')
	gebi('linksStyle2').checked=true;
    else
	gebi('linksStyle0').checked=true;
    
    //===source===
    gebi('source0').onclick=function() { widget.preferences.source=0; };
    gebi('source2').onclick=function() { widget.preferences.source=2; };
    gebi('source1000').onclick=function() { widget.preferences.source=1000; };
    gebi('source1001').onclick=function() { widget.preferences.source=1001; };
    if(widget.preferences.source=='0')
	gebi('source0').checked=true;
    else if(widget.preferences.source=='2')
	gebi('source2').checked=true;
    else if(widget.preferences.source=='1001')
	gebi('source1001').checked=true;
    else
	gebi('source1000').checked=true;
    gebi('userkey').onchange=function() { widget.preferences.userkey=this.value; };
    gebi('userkey').value=widget.preferences.userkey;
    gebi('offlineMode').onclick=function() { widget.preferences.offlineMode=this.checked?'1':'0'; };
    gebi('offlineMode').checked=widget.preferences.offlineMode=='1';

    
    //===general===
    gebi('disableButton').onclick=function() { widget.preferences.disableButton=this.checked?'1':'0'; };
    gebi('disableButton').checked=widget.preferences.disableButton=='1';
    gebi('showInfo').onclick=function() { widget.preferences.showInfo=this.checked?'1':'0'; };
    gebi('showInfo').checked=widget.preferences.showInfo=='1';
    if(widget.preferences.showInfo=='0') addCSS('.info{display:none}');
    gebi('debugMode').onclick=function() { widget.preferences.debugMode=this.checked?'1':'0'; };
    gebi('debugMode').checked=widget.preferences.debugMode=='1';
    if(widget.preferences.debugMode=='0') addCSS('.debugMode{display:none}');
    
    //===stats===
    gebi('statsEnable').onclick=function() { stats.enable(this.checked); loadPrefs() };
    gebi('statsEnable').checked=widget.preferences.statsEnabled=='1';
    if(widget.preferences.statsEnabled=='0')
        gebi('stats_gr').style.display='none';
    else
        {
        gebi('stats_gr').style.display='';
        var next=new Date(stats.nextTime);
        gebi('statsNextTime').innerText=lang.dateFormat.replace('%month%',lang.dateMonths[next.getMonth()]).replace('%day%',next.getDate()).replace('%hour%',next.getHours()).replace('%minute%',next.getMinutes());
        };
    gebi('statsShowPrev').onclick=function()
        {
        if(widget.preferences.statsLast=='{}')
            alert(lang.noOldData);
        else
            alert(sJSON.prettify(sJSON.parse(widget.preferences.statsLast)))
        };
    gebi('statsShowCurr').onclick=function()
        {
        alert(sJSON.prettify(stats.makeData()))
        };
    
    gebi('eventType0').onclick=function() { widget.preferences.eventType=0 };
    gebi('eventType1').onclick=function() { widget.preferences.eventType=1 };
    gebi('eventType2').onclick=function() { widget.preferences.eventType=2 };
    if(widget.preferences.eventType=='0')
	gebi('eventType0').checked=true;
    else if(widget.preferences.eventType=='1')
	gebi('eventType1').checked=true;
    else
	gebi('eventType2').checked=true;
    
    //===test===
    gebi('prefsClearNow').onclick=function()
        {
        if(confirm(lang.confirmReset))
            {
            clearPrefs();
            loadPrefs();
            }
        };
    gebi('cacheClearNow').onclick=function() { clearCache() };
    gebi('cacheClearErr').onclick=function()
        {
        for(var q in cache.data)
            {
            if(cache.data[q].d.substr(0,3)!='ok|')
                delete cache.data[q];
            }
        };
    gebi('cacheTruncNow').onclick=function() { cache.trunc() };
    gebi('cacheShow').onclick=function()
        {
        var q=sJSON.stringify(cache.data);
        var l=q.length;
        var n=0;
        var u=0;
        for(var w in cache.data)
            {
            n++;
            u+=w.length+cache.data[w].d.length;
            }
        alert('cache: '+l+'chars/'+n+'strings='+Math.round(l/n)+'avg;\n'+
                'overhead: '+(l-u)+'chars/...='+Math.round((l-u)/n)+'avg; '+
                            Math.round((l-u)/l*100)+'%');
        };
    gebi('cacheShow1').onclick=function()
        {
        precache=opera.extension.bgProcess.precache;
        var q=sJSON.stringify(precache);
        var l=q.length;
        var n=0;
        var u=0;
        //~ clearCache();
        for(var w in precache)
            {
            n++;
            u+=w.length+precache[w].length;
            //~ cache.setItem(w,precache[w]);
            }
        alert('precache: '+l+'chars/'+n+'strings='+Math.round(l/n)+'avg;\n'+
                'overhead: '+(l-u)+'chars/...='+Math.round((l-u)/n)+'avg; '+
                            Math.round((l-u)/l*100)+'%');
        //~ gebi('cacheShow').click();
        }
    
    //===maps===
    gebi('mapUsersBtn').onclick=function()
        {
        gebi('mapUsersImg').src='http://flag-button.tk/map.php?for=flag-button';
        gebi('mapUsersImg').style.display='block';
        gebi('mapUsersWarning').style.display='none';
        gebi('mapUsersBtn').style.display='none';
        }

    gebi('mapSitesBtn').onclick=function()
        {
        gebi('mapSitesImg').src='http://flag-button.tk/sitemap.php';
        gebi('mapSitesImg').style.display='block';
        gebi('mapSitesBtn').style.display='none';
        }

    //===licence===
    gebi('lic').onload=gebi('prv').onload=function()
        {
        this.height=this.contentWindow.document.body.scrollHeight
        }
    gebi('lic').height=gebi('lic').contentWindow.document.body.scrollHeight;
    gebi('prv').height=gebi('prv').contentWindow.document.body.scrollHeight;
    }

loadPrefs();
