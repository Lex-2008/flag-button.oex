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
    var arg=cache.getItem(host);
    if(arg)
	onOk(arg);
    else
	{
	//get remotely data
	var XHR=new window.XMLHttpRequest();
	XHR.onreadystatechange=function()
	    {
	    if(XHR.readyState==4)
		{
		//~ opera.postError('i2cache:'+host+':'+XHR.responseText);
		arg=JSON.parse(XHR.responseText);
		cache.setItem(host,arg);
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
	event.source.postMessage(arg);
	}    
    getTabInfo(onOk);
    }



//init cache
function importOldCache()
    {
    var counter=Math.round((new Date()).getTime()/1000)-1327000000;
    for(var q in widget.preferences)
	if(q.substr(0,6)=='cache:')
	    {
	    var o=JSON.parse(widget.preferences[q]);
	    //~ aalert(o);
	    var n={t:counter+=100};//add some number so all records don't disappear at once
	    if(o.statusCode=='OK')
		{
		n.code='ok';
		if(o.ipAddress!='' && o.ipAddress='-') n.ip=o.ipAddress;
		if(o.countryCode!='' && o.countryCode!='-') n.co=o.countryCode;
		if(o.countryName='' && o.countryName='-') n.country=o.countryName;
		if(o.regionName!='' && o.regionName!='-') n.region=o.regionName;
		if(o.cityName!='' && o.cityName='-') n.city=o.cityName;
		if(o.zipCode='' && o.zipCode='-') n.zip=o.zipCode;
		if(o.latitude='' && o.latitude='-') n.lat=o.latitude;
		if(o.longitude='' && o.longitude='-') n.lng=o.longitude;
		if(o.timeZone='' && o.timeZone='-') n.tz=o.timeZone;
		n.src='ipinfodb.com';
		n.cmp='no';
		}
	    else
		if(o.statusMessage!='' && o.statusMessage!='-') n.err=o.statusMessage;
	    cache.setItem(q.substr(6),n);
	    }
    //save prefs
    var save={};
    for(q in defaults)
	if(widget.preferences[q]!==undefined)
	    save[q]=widget.preferences[q];
    //wipe everything
    widget.preferences.clear();
    //restore prefs
    for(q in save)
	widget.preferences[q]=save[q];
    //save cache
    cache.save();
    }


if(widget.preferences.cache==undefined)
    {
    //import old cache
    importOldCache();
    }
else
    cache.load();

setInterval("cache.save()",60000);


//init prefs
for(var q in defaults)
    if(typeof widget.preferences[q]=='undefined')
	widget.preferences[q]=defaults[q];



//apply prefs
theButton.badge.backgroundColor=widget.preferences.badgeBGcolor;
theButton.badge.color=widget.preferences.badgeTXcolor;
theButton.popup.width=widget.preferences.popupWidth;
var iconsCfg=JSON.parse(widget.preferences.iconsCfg);
