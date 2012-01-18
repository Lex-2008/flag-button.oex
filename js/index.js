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

//~ opera.extension.tabs.addEventListener( "create", bad1, false);
//~ opera.extension.tabs.addEventListener( "focus", bad1, false);
//~ opera.extension.tabs.addEventListener( "blur", bad1, false);
//~ opera.extension.windows.addEventListener( "create", bad1, false);
//~ opera.extension.windows.addEventListener( "focus", bad1, false);
//~ opera.extension.windows.addEventListener( "blur", bad1, false);

function disableButton(text)
    {
    if(text)
	theButton.title=text;
    else
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
    }


opera.extension.addEventListener( "message", function(event)
    {
    switch(event.data.q)
	{
	case 'on':
	    toggleIfExists(event.data.w);
	break;
	case 'off':
	    if(!widget.preferences.disableButton)
		disableButton();
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


var lastHost='';


//button function
function toggleIfExists(host)
    {
    var onOk=function(arg)
	{
	if(arg.code=='ok')
	    {
	    theButton.title=arg.ip+' - '+arg.country;
	    var key=arg.co.toUpperCase();
	    if(iconsCfg[key])
		theButton.icon=iconsCfg[key];
	    else
		theButton.icon='flags/'+key.toLowerCase()+".png";
	    if(widget.preferences.showBadge!=0)
		theButton.badge.textContent=arg.co;
	    else
		theButton.badge.textContent='';
	    theButton.disabled=false;
	    }
	else
	    {
	    if(arg.ip)
		disableButton(arg.ip+' - '+arg.code+': '+arg.err);
	    else
		disableButton(arg.code+': '+arg.err);
	    }
	}
    
    getTabInfo(onOk,host);    
    }

//main function
function getTabInfo(onOk,host)
    {
    //get host
    if(host)
	lastHost=host;
    else
	host=lastHost;

    //try cache
    var q=cache.getItem('cache:'+host);
    if(q && (arg=JSON.parse(q)))
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
		arg=JSON.parse(XHR.responseText);
		onOk(arg);
		}
	    };
	//~ XHR.open("GET","http://api.ipinfodb.com/v3/ip-country/?key="+key+"&ip="+host+"&format=json",true);
	//~ XHR.open("GET","http://api.ipinfodb.com/v3/ip-city/?key="+key+"&ip="+host+"&format=json",true);
	XHR.open("GET","http://flag-button.tk/api.php?host="+host,true);
	XHR.send(null);
	}
    }



//almost like main
function popupHelper(event)
    {
    var onOk=function(arg)
	{
	//get host
	arg.host=lastHost;
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
