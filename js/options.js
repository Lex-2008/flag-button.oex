var cache=opera.extension.bgProcess.cache;

function loadPrefs()
    {
    //===badge===
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
    gebi('showBadge').checked=widget.preferences.showBadge!='0';
    gebi('showXXBadge').checked=widget.preferences.showXXBadge!='0';
    gebi('badgeBGcolor').value=widget.preferences.badgeBGcolor;
    gebi('badgeTXcolor').value=widget.preferences.badgeTXcolor;
    
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
        widget.preferences.iconsCfg=JSON.stringify(iconsCfg);
        opera.extension.postMessage({q:"badgeColor"});
        }
    var iconsCfg=JSON.parse(widget.preferences.iconsCfg);
    var str='';
    for(var q in iconsCfg)
	str+=q+'='+iconsCfg[q]+'\n';
    gebi('iconsCfg').value=str;
    gebi('iconsCfg').style.height='auto';
    gebi('iconsCfg').style.height=(gebi('iconsCfg').border_size+gebi('iconsCfg').scrollHeight)+'px';

    
    //===popup===
    gebi('popupWidth').onchange=gebi('popupWidth').onkeyup=function(){ widget.preferences.popupWidth=this.value; };
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
        widget.preferences.linksCfg=JSON.stringify(linksCfg);
        opera.extension.postMessage({q:"badgeColor"});
        }
    gebi('linksStyle0').onclick=function() { widget.preferences.linksStyle=0 };
    gebi('linksStyle1').onclick=function() { widget.preferences.linksStyle=1 };
    gebi('linksStyle2').onclick=function() { widget.preferences.linksStyle=2 };
    gebi('popupWidth').value=widget.preferences.popupWidth;
    var linksCfg=JSON.parse(widget.preferences.linksCfg);
    var str='';
    for(var q in linksCfg)
	str+=q+'='+linksCfg[q]+'\n';
    gebi('linksCfg').value=str;
    gebi('linksCfg').style.height=(gebi('linksCfg').border_size+gebi('linksCfg').scrollHeight)+'px';
    if(widget.preferences.linksStyle=='1')
	gebi('linksStyle1').checked=true;
    else if(widget.preferences.linksStyle=='2')
	gebi('linksStyle2').checked=true;
    else
	gebi('linksStyle0').checked=true;
    
    //===general===
    gebi('disableButton').onclick=function() { widget.preferences.disableButton=this.checked?'1':'0'; };
    gebi('disableButton').checked=widget.preferences.disableButton!='0';
    gebi('debugMode').onclick=function() { widget.preferences.debugMode=this.checked?'1':'0'; };
    gebi('debugMode').checked=widget.preferences.debugMode!='0';

    gebi('cacheClearNow').onclick=function() { clearCache() };
    gebi('prefsClearNow').onclick=function()
        {
        if(confirm(lang.confirmReset))
            {
            clearPrefs();
            loadPrefs();
            }
        };
    if(widget.preferences.debugMode!='1') gebi('test').style.display='none';
    gebi('test').onclick=function() { prompt('',JSON.stringify(cache.data)); }; 
    
    //===maps===
    gebi('mapUsersBtn').onclick=function()
        {
        gebi('mapUsersImg').src='http://flag-button.tk/map.php?for=flag-button';
        gebi('mapUsersImg').style.display='block';
        gebi('mapUsersBtn').style.display='none';
        gebi('mapUsersWarning').style.display='none';
        }

    gebi('mapSitesBtn').onclick=function()
        {
        gebi('mapSitesImg').src='http://flag-button.tk/sitemap.php';
        gebi('mapSitesImg').style.display='block';
        gebi('mapSitesBtn').style.display='none';
        }

    
    
    }
loadPrefs();