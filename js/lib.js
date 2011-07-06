//default settings. Looks like <preference> tags in config.xml are kinda broken :(
defaults={
    saved:-2+15,
    showBadge:1,
    showXXBadge:0,
    badgeBGcolor:'#000000',
    badgeTXcolor:'#ffffff',
    cacheMax:1000,
    cacheClear:0,
    usekey:0,
    userkey:' ',
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



function clearCache()
    {
    var save={};
    //save
    for(var q in defaults)
	if(widget.preferences.getItem(q) !== undefined)
	    save[q]=cache.getItem(q);
    //clear
    cache.clear();
    //restore
    for(var q in save)
	cache.setItem(q,save[q]);
    }



function clearPrefs()
    {
    for(var q in widget.preferences)
	if(q.substr(0,6)!=='cache:')
	    widget.preferences[q]=defaults[q];
    }


function gebi(id)
    {
    return document.getElementById(id)
    }