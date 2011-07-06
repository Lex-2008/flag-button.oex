var cache=opera.extension.bgProcess.cache;

gebi('showBadge').onclick=function() { widget.preferences.showBadge=this.checked?'1':'0'; };
gebi('showXXBadge').onclick=function() { widget.preferences.showXXBadge=this.checked?'1':'0'; };

gebi('badgeBGcolor').onchange=gebi('badgeBGcolor').onkeyup=function()
    {
    widget.preferences.badgeBGcolor=this.value;
    opera.extension.postMessage({q:"badgeColor"});
    };
gebi('badgeTXcolor').onchange=gebi('badgeTXcolor').onkeyup=function()
    {
    widget.preferences.badgeTXcolor=this.value;
    opera.extension.postMessage({q:"badgeColor"});
    };

gebi('popupWidth').onchange=gebi('popupWidth').onkeyup=function()
    {
    widget.preferences.popupWidth=this.value;
    };
gebi('linksCfg').onkeyup=function()
    {
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
    widget.preferences.linksCfg=JSON.stringify(linksCfg);
    opera.extension.postMessage({q:"badgeColor"});
    }
gebi('linksStyle0').onclick=function() { widget.preferences.linksStyle=0 };
gebi('linksStyle1').onclick=function() { widget.preferences.linksStyle=1 };
gebi('linksStyle2').onclick=function() { widget.preferences.linksStyle=2 };

gebi('cacheClear0').onclick=function() { widget.preferences.cacheClear=0; };
gebi('cacheClear1').onclick=function() { widget.preferences.cacheClear=1; };

gebi('cacheMax').onchange=gebi('cacheMax').onkeyup=function() { widget.preferences.cacheMax=this.value; };
gebi('cacheClearNow').onclick=function() { clearCache();gebi('cache1').innerHTML=cache.length-cache.saved; };

gebi('usekey0').onclick=function() { widget.preferences.usekey=0; };
gebi('usekey1').onclick=function() { widget.preferences.usekey=1; };
gebi('userkey').onchange=function() { widget.preferences.userkey=this.value; };

gebi('iconsCfg').onkeydown=gebi('iconsCfg').onkeyup=function()
    {
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
    widget.preferences.iconsCfg=JSON.stringify(iconsCfg);
    opera.extension.postMessage({q:"badgeColor"});
    }

gebi('prefsClearNow').onclick=function()
    {
    if(confirm(lang.confirmReset))
	{
	clearPrefs();
	loadPrefs();
	}
    };
//~ gebi('test').onclick=function() { aalert(JSON.parse(widget.preferences.iconsCfg)); }; 



function loadPrefs()
    {
    gebi('showBadge').checked=widget.preferences.showBadge!='0';
    gebi('showXXBadge').checked=widget.preferences.showXXBadge!='0';
    gebi('badgeBGcolor').value=widget.preferences.badgeBGcolor;
    gebi('badgeTXcolor').value=widget.preferences.badgeTXcolor;
    
    gebi('popupWidth').value=widget.preferences.popupWidth;
    var linksCfg=JSON.parse(widget.preferences.linksCfg);
    var str='';
    for(var q in linksCfg)
	str+=q+'='+linksCfg[q]+'\n';
    gebi('linksCfg').value=str;
    if(widget.preferences.linksStyle=='1')
	gebi('linksStyle1').checked=true;
    else if(widget.preferences.linksStyle=='2')
	gebi('linksStyle2').checked=true;
    else
	gebi('linksStyle0').checked=true;
    
    gebi('cache1').innerHTML=cache.length-cache.saved;
    if(widget.preferences.cacheClear==1)
	gebi('cacheClear1').checked=true;
    else
	gebi('cacheClear0').checked=true;
    gebi('cacheMax').value=widget.preferences.cacheMax;
    
    if(widget.preferences.usekey=='1')
	gebi('usekey1').checked=true;
    else
	gebi('usekey0').checked=true;
    gebi('userkey').value=widget.preferences.userkey;
    
    var iconsCfg=JSON.parse(widget.preferences.iconsCfg);
    var str='';
    for(var q in iconsCfg)
	str+=q+'='+iconsCfg[q]+'\n';
    gebi('iconsCfg').value=str;
    }
loadPrefs();