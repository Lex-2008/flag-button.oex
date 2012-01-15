//init

var theButton;
var ToolbarUIItemProperties =
    {
    title:lang.defTitle,
    icon:'icons/svg2raster-16.png',
    disabled:true,
    badge:
	{
	display: "block",
	textContent:'',
	},
    popup:
	{
	href: "popup.html",
	width: 200,
	height:230,
	}
    };
theButton = opera.contexts.toolbar.createItem(ToolbarUIItemProperties);
opera.contexts.toolbar.addItem(theButton);

opera.extension.tabs.addEventListener( "create", toggleIfExists, false);
opera.extension.tabs.addEventListener( "focus", toggleIfExists, false);
opera.extension.tabs.addEventListener( "blur", toggleIfExists, false);
opera.extension.windows.addEventListener( "create", toggleIfExists, false);
opera.extension.windows.addEventListener( "focus", toggleIfExists, false);
opera.extension.windows.addEventListener( "blur", toggleIfExists, false);
opera.extension.addEventListener( "message", function(event)
    {
    switch(event.data.q)
	{
	case 'on':
	    toggleIfExists();
	break;
	case 'popup':
	    popupHelper(event);
	break;
	case 'size':
	    theButton.popup.height=event.data.h;
	break;
	case 'badgeColor':
	    theButton.badge.backgroundColor=widget.preferences.badgeBGcolor;
	    theButton.badge.color=widget.preferences.badgeTXcolor;
	    theButton.popup.width=parseInt(widget.preferences.popupWidth);
	    iconsCfg=JSON.parse(widget.preferences.iconsCfg);
	break;
	}
    }, false);



//button function
function toggleIfExists()
    {
    
    var onFail=function(){
	theButton.title=lang.defTitle;
	if(iconsCfg['XX'])
	    theButton.icon=iconsCfg['XX'];
	else
	    theButton.icon='icons/svg2raster-16.png';
	if(widget.preferences.showXXBadge!=0)
	    theButton.badge.textContent='XX';
	else
	    theButton.badge.textContent='';
	theButton.disabled=true;
	return;
	}
    
    var onOk=function(arg){
	{
	if(arg.statusCode=='OK')
	    {
	    theButton.title=arg.ipAddress+' - '+arg.countryName;
	    //~ theButton.icon='flags/'+arg.countryCode.toLowerCase()+".png";
	    var key=arg.countryCode.toUpperCase();
	    if(iconsCfg[key])
		theButton.icon=iconsCfg[key];
	    else
		theButton.icon='flags/'+key.toLowerCase()+".png";
	    if(widget.preferences.showBadge!=0)
		theButton.badge.textContent=arg.countryCode;
	    else
		theButton.badge.textContent='';
	    theButton.disabled=false;
	    }
	else
	    {
	    theButton.title=arg.ipAddress+' - '+arg.statusCode+': '+arg.statusMessage;
	    if(iconsCfg['XX'])
		theButton.icon=iconsCfg['XX'];
	    else
		theButton.icon='icons/svg2raster-16.png';
	    if(widget.preferences.showXXBadge!=0)
		theButton.badge.textContent='XX';
	    else
		theButton.badge.textContent='';
	    theButton.disabled=true;
	    }
	return true;
	}
    
    getTabInfo(onOk,onFail);    
    }

//main function
function getTabInfo(onOk,onFail)
    {
    //that is my key
    var key;
    if(widget.preferences.usekey=='0')//NB! if('0') is true
	key='8ab4dafef4a713f5097cb50706e861b38ebf6972a44167aa9426cde1768fed5e';
    else
	key=widget.preferences.userkey;
    //~ opera.postError(key);
    
    //get tab URL
    var fail=false;
    try
	{
    var url=opera.extension.tabs.getFocused().url;
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    var host=url.match(re)[1].toString();
	if(!host)
	    fail=true;
	}
    catch(e)
	{
	fail=true;
	}
    //~ opera.postError(host);
    
    if(fail)
	{
	onFail();
	return;
	}
    
    //try cache
    var q=cache.getItem('cache:'+host);
    if(q && (arg=JSON.parse(q)) && arg.cityName)//using new cache
	onOk(arg);
    else
	{
	//get remotely data
	var XHR=new window.XMLHttpRequest();
	XHR.onreadystatechange=function()
	    {
	    if(XHR.readyState==4)
		{
		if(cache.length>widget.preferences.cacheMax+cache.saved)
		    clearCache();
		cache.setItem('cache:'+host,XHR.responseText);
		//~ opera.postError('i2cache:'+host+':'+XHR.responseText);
		onOk(arg);
		}
	    };
	//~ XHR.open("GET","http://api.ipinfodb.com/v3/ip-country/?key="+key+"&ip="+host+"&format=json",true);
	//~ XHR.open("GET","http://api.ipinfodb.com/v3/ip-city/?key="+key+"&ip="+host+"&format=json",true);
	XHR.open("GET","http://flag-button.tk/api.php?host="+host,true);
	XHR.send(null);
	}
    }



// 'clearCache on exit' option
//~ window.addEventListener('unload', function()
    //~ {
    //~ if(widget.preferences.cacheClear==1)
	//~ clearCache();
    //~ },false);



//almost like main
function popupHelper(event)
    {
    var onOk=function(text)
	{
	arg=JSON.parse(text);
	arg.host=host;
	event.source.postMessage(arg);
	}    
    getTabInfo(onOk);
    }



//default prefs
for(var q in defaults)
    if(typeof widget.preferences[q]=='undefined')
	widget.preferences[q]=defaults[q];



//apply prefs
theButton.badge.backgroundColor=widget.preferences.badgeBGcolor;
theButton.badge.color=widget.preferences.badgeTXcolor;
theButton.popup.width=widget.preferences.popupWidth;
var iconsCfg=JSON.parse(widget.preferences.iconsCfg);



// set location for cache
var cache;
if(widget.preferences.cacheClear==1)
    {
    cache=widget.preferences;
    clearCache();
    cache=sessionStorage;
    cache.saved=0;
    }
else
    cache=widget.preferences;
