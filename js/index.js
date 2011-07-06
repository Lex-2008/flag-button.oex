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


//main function
function toggleIfExists()
    {
    //that is my key
    var key;
    if(widget.preferences.usekey=='0')//NB! if('0') is true
	key='8ab4dafef4a713f5097cb50706e861b38ebf6972a44167aa9426cde1768fed5e';
    else
	key=widget.preferences.userkey;
    //~ opera.postError(key);
    
    //get data
    var fail=false;
    var tab=opera.extension.tabs.getFocused();
    if(!tab)
	fail=true;
    else
	{
	try
	    {
	    var url=tab.url;
	    if(!url)
		fail=true;
	    else
		{
		var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
		var host=url.match(re)[1].toString();
		    if(!host)
			fail=true;
		}
	    }
	catch(e)
	    {
	    fail=true;
	    }
	}
    //~ opera.postError(host);
    
    if(fail)
	{
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
    
    //try cache
    if(!setIt(host))
	{
	//write to cache
	var XHR=new window.XMLHttpRequest();
	XHR.onreadystatechange=function()
	    {
	    if(XHR.readyState==4)
		{
		if(cache.length>widget.preferences.cacheMax+cache.saved)
		    clearCache();
		cache.setItem('cache:'+host,XHR.responseText);
		//~ opera.postError('i2cache:'+host+':'+XHR.responseText);
		setIt(host);
		}
	    };
	//~ XHR.open("GET","http://api.ipinfodb.com/v3/ip-country/?key="+key+"&ip="+host+"&format=json",true);
	//~ opera.postError("GET http://api.ipinfodb.com/v3/ip-city/?key="+key+"&ip="+host+"&format=json");
	XHR.open("GET","http://api.ipinfodb.com/v3/ip-city/?key="+key+"&ip="+host+"&format=json",true);
	XHR.send(null);
	}
    }



//cache helper
function setIt(host)
    {
    var q=cache.getItem('cache:'+host);
    //~ opera.postError(q);
    if(q)
	{
	//~ opera.postError('i4cache:'+host+':'+q);
	arg=JSON.parse(q);
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
    else
	return false;
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
    var key;
    if(widget.preferences.usekey=='0')//NB! if('0') is true
	key=widget.preferences.mykey;
    else
	key=widget.preferences.userkey;
    
    //get data
    var tab=opera.extension.tabs.getFocused();
    if(!tab) return;
    var url=tab.url;
    if(!url) return;
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    var host=url.match(re)[1].toString();
    //~ opera.postError(host);
    
    var q=cache.getItem('cache:'+host);
    if(q && (arg=JSON.parse(q)) && arg.cityName)//using new cache
	{
	arg=JSON.parse(q);
	arg.host=host;
	event.source.postMessage(arg);
	//~ opera.postError('p4cache:'+host+':'+q);
	}
    else
	{//retreive again, and save to cache
	var XHR=new window.XMLHttpRequest();
	XHR.onreadystatechange=function()
	    {
	    if(XHR.readyState==4)
		{
		cache.setItem('cache:'+host,XHR.responseText);
		arg=JSON.parse(XHR.responseText);
		arg.host=host;
		event.source.postMessage(arg);
		//~ opera.postError('p2cache:'+host+':'+XHR.responseText);
		}
	    };
	//~ opera.postError("GET http://api.ipinfodb.com/v3/ip-city/?key="+key+"&ip="+host+"&format=json");
	XHR.open("GET","http://api.ipinfodb.com/v3/ip-city/?key="+key+"&ip="+host+"&format=json",true);
	XHR.send(null);
	}
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
if(widget.preferences.cacheClear)
    {
    cache=widget.preferences;
    clearCache();
    cache=sessionStorage;
    cache.saved=0;
    }
else
    cache=widget.preferences;
