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

opera.extension.tabs.addEventListener( "create", tabFocusEvent, false);
opera.extension.tabs.addEventListener( "focus", tabFocusEvent, false);
opera.extension.tabs.addEventListener( "blur", tabBlurEvent, false);
opera.extension.windows.addEventListener( "create", tabFocusEvent, false);
opera.extension.windows.addEventListener( "focus", tabFocusEvent, false);
opera.extension.windows.addEventListener( "blur", tabBlurEvent, false);

function tabFocusEvent()
    {
    //"old" method (0) or "both (2)
    if(widget.preferences.eventType%2==0)//0 or 2
	toggleIfExists();//active tab will be called by tab api
    }

function tabBlurEvent()
    {
    if(widget.preferences.eventType%2==0 && widget.preferences.disableButton=='1')
	disableButton();
    }

function disableButton(text)
    {
    if(text)
	theButton.title=text;
    else
	theButton.title=lang.defTitle;
    if(window.iconsCfg && window.iconsCfg['XX'])
	theButton.icon=iconsCfg['XX'];
    else
	theButton.icon='icons/svg2raster-16.png';
    if(widget.preferences.showXXBadge=='1')
	theButton.badge.textContent='XX';
    else
	theButton.badge.textContent='';
    //~ theButton.disabled=true;
    }

groupHosts3={'blog.onet.pl':1};
groupHosts2={'deviantart.com':1,'deviantart.net':1,'dns-shop.ru':1,'facebook.com':1,'fastpic.ru':1,'gazeta.pl':1,'gittigidiyor.com':1,'ifolder.ru':1,'imagevenue.com':1,'imageshack.us':1,'interia.pl':1,'lento.pl':1,'letitbit.net':1,'livejournal.com':1,'megafon.ru':1,'mirtesen.ru':1,'narod.ru':1,'newsweek.pl':1,'nnm.ru':1,'olx.ru':1,'onet.pl':1,'radikal.ru':1,'raduga.su':1,'rapidshare.com':1,'sexfotka.pl':1,'sourceforge.net':1,'skryptoteka.pl':1,'tripod.com':1,'vk.com':1,'vkontakte.ru':1,'wikia.com':1,'wikimedia.org':1,'wikipedia.org':1,'wiktionary.org':1,'wrzuta.pl':1,'yvision.kz':1};
groupHosts0={'accounts.google.com':1,'addons.opera.com':1,'crash.opera.com':1,'localhost':1,'my.opera.com':1,'nk.pl':1,'plus.google.com':1,'support.google.com':1,'windows.microsoft.com':1};
statsHosts={ver:0};

function normalizeHost(host)
    {
    host=host.replace(/^www\.(.+\..+)/,"$1");//cut off www. only if there's a dot to the right
    host=host.replace(/^(amazon|blogspot|google)(\.com?)?\.[a-z][a-z]$/,'$1.com');//google.ru, google.co.uk
    host3=host.split('.').slice(-3).join('.');//whatever.prov.ider.tld
    host2=host.split('.').slice(-2).join('.');//whatever.provider.tld
    if(groupHosts3[host3])
	host=host3;
    else if(groupHosts2[host2])
	host=host2;
    host=punycode.toASCII(host);
    return host;
    }

function normalizeText(s)
    {
    return s.toLowerCase().replace(/^.|[ -]./g, function(letter) {
	return letter.toUpperCase();
	});
    }

//workaround: prevent disableButton from closing popup
var popupIsOpening=false;
theButton.addEventListener('click',function()
    {
    popupIsOpening=true;
    },false);


opera.extension.addEventListener( "message", function(event)
    {
    switch(event.data.q)
	{
	case 'on':
	    //"new" method (1) or "both" (2)
	    if(widget.preferences.eventType>0)
		{
		//~ opera.postError('new on '+event.data.w);
		lastActiveTab=event.source;
		toggleIfExists(event.data.w);
		}
	break;
	case 'off':
	    if(popupIsOpening)//do not disable the button while popup is opening
		popupIsOpening=false;
	    else
		if(widget.preferences.eventType>0)
		    {
		    lastActiveTab=0;
		    if(widget.preferences.disableButton=='1')
			disableButton();
		    }
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
var lastRequestTime=0;
var lastActiveTab=0;


//button function
function toggleIfExists(host)
    {
    var onOk=function(arg)
	{
	if(arg.code=='ok')
	    {
	    theButton.title=arg.ip+' - '+arg.country;
	    var key=arg.co.toUpperCase();
	    if(iconsCfg[key])//custom flag
		theButton.icon=iconsCfg[key];
	    else if(flags[key.toLowerCase()])//standard flag
		theButton.icon='flags/'+key.toLowerCase()+".png";
	    else//no such (standard) flag
		if(iconsCfg['XX'])//custom error flag
		    theButton.icon=iconsCfg['XX'];
		else//standard error flag
		    theButton.icon='icons/svg2raster-16.png';
	    if(widget.preferences.showBadge==1)
		theButton.badge.textContent=arg.co.toUpperCase();
	    else
		theButton.badge.textContent='';
	    theButton.disabled=false;
	    //send data to injected process
	    arg.meta={'geoData':{'country':'country','countryCode':'co','region':'region','city':'city','coordinates':{'latitude':'lat','longitude':'lng'},'timeZone':'tz','source':'src'},'hostIP':{'ip':'ip'}};
	    var tabAPIFail=false;
	    if(widget.preferences.eventType%2==0)//try tab API
		{
		try
		    {
		    //try to get from active tab
		    var tab=opera.extension.tabs.getFocused();
		    tab.postMessage({q:'data',w:arg});
		    }
		catch(e)
		    {
		    tabAPIFail=true;
		    }
		}
	    if((widget.preferences.eventType==1 || //try lastActiveTab if using "new" method
		(widget.preferences.eventType==2 && tabAPIFail)) //or using "both" AND tab API failed
		&& lastActiveTab)		// AND last active tab is known
		{
		//~ opera.postError('sending to: '+lastActiveTab);
		lastActiveTab.postMessage({q:'data',w:arg});
		}
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

hostWait={};

//main function
function getTabInfo(onOk,host)
    {
    //NB! if('0') is true
    //that is my key
    var key='8ab4dafef4a713f5097cb50706e861b38ebf6972a44167aa9426cde1768fed5e';
    if(widget.preferences.userkey.length>30) key=widget.preferences.userkey;
    
    //get host
    if(host)
	lastHost=host;
    else
	try
	    {
	    //try to get from active tab
	    var tab=opera.extension.tabs.getFocused();
	    var url=tab.url;
	    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
	    if(url.match(re)[1].toString())
		{
		host=url.match(re)[1].toString();
		lastHost=host;
		}
	    else
		host=lastHost;
	    }
	catch(e)
	    {
	    //can't get from active tab - get last known
	    host=lastHost;
	    }
    
    host=normalizeHost(host);
    stats.logHost(host);
    
    //try cache
    var arg=cache.getItem(host);
    if(arg)
	{
	onOk(arg);
	return;
	}
    //err on offline mode
    if(widget.preferences.offlineMode==1)
	{
	onOk({code:'err',err:lang.offlineText});
	return;
	}
    //check if request have already been sent
    if(hostWait[host])
	{
	//wait 1 second and retry
	setTimeout(function()
	    {
	    getTabInfo(onOk,host)
	    },1000);
	return;
	}
    else
	hostWait[host]=1;
    //get remotely data
    var XHR=new window.XMLHttpRequest();
    XHR.onreadystatechange=function()
	{
	var data,arg;
	if(XHR.readyState!=4)
	    return;
	switch(widget.preferences.source)
	    {
	    case '0':
		//freegeoip.net
		//ip,co,country,region_code,region_name,city,zip,lat,lon
		if(XHR.responseText.match('404: Not Found'))
		    {
		    arg=['404','Not Found','','','','','','','','','','freegeoip.net',''];
		    break;
		    }
		if(XHR.responseText.match('<html>'))
		    {
		    arg=['html',XHR.responseText,'','','','','','','','','','freegeoip.net',''];
		    break;
		    }
		data=XHR.responseText.split(',');
		if(data.length<9)
		    {
		    arg=['too short('+data.length+'<9)',XHR.responseText,'','','','','','','','','','freegeoip.net',''];
		    break;
		    }
		if(!data[0].match(/^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/))
		    {
		    //IP address doesn't look like IP address - FAIL
		    arg=['not an IP address',XHR.responseText,'','','','','','','','','','ipinfodb.com',''];
		    break;
		    }
		//code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp
		arg=['ok','',data[0],data[1],data[2],data[4],data[5],data[6],data[7],data[8],'','freegeoip.net',''];
	    break;
	    case '2':
		//ipinfodb.com
		//statuscode;statusmessage;ip;co;country;region;city;zip;lat;lon;timezone
		data=XHR.responseText.split(';');
		if(data.length<11)
		    {
		    arg=['too short('+data.length+'<11)',XHR.responseText,'','','','','','','','','','ipinfodb.com',''];
		    break;
		    }
		for(var q in data)
		    if(data[q]=='-')
			data[q]='';
		if(!data[2].match(/^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/))
		    {
		    //IP address doesn't look like IP address - FAIL
		    arg=['not an IP address',XHR.responseText,'','','','','','','','','','ipinfodb.com',''];
		    break;
		    }
		//code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp
		arg=[data[0].toLowerCase(),data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],'ipinfodb.com',''];
	    break;
	    default:
		//flag-button.tk
		data=XHR.responseText.split('|');
		if(data.length<13)
		    arg=['too short('+data.length+'<13)',data.join('!'),'','','','','','','','','','flag-button.tk',''];
		else
		    //code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp
		    arg=[data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12]];
	    break;
	    }
	arg[4]=normalizeText(arg[4]);
	arg[5]=normalizeText(arg[5]);
	arg[6]=normalizeText(arg[6]);
	if(arg[8]=='0' && arg[9]=='0')
	    arg[8]=arg[9]='';//forbid 0-0
	arg=arg.join('|');
	cache.setItem(host,arg);
	arg=cache.getItem(host);
	if(arg) onOk(arg);
	};
    switch(widget.preferences.source)
	{
	case '0':
	    XHR.open("GET","http://freegeoip.net/csv/"+host,true);
	break;
	case '2':
	    XHR.open("GET","http://api.ipinfodb.com/v3/ip-city/?key="+key+"&ip="+host+"&format=raw",true);
	break;
	case '1001':
	    XHR.open("GET","http://localhost/api.php?host="+host,true);
	break;
	default:
	    XHR.open("GET","http://flag-button.tk/api.php?host="+host,true);
	break;
	}
    
    sendRequest(XHR);
    }//getTabInfo



function sendRequest(XHR)
    {
    //prevent requests from being sent faster then once a second
    if(lastRequestTime+1000>(new Date()).getTime())
	{
	setTimeout(function()
	    {
	    sendRequest(XHR);
	    },lastRequestTime+1000-(new Date()).getTime());
	}
    else
	{
	lastRequestTime=(new Date()).getTime();
	XHR.send(null);
	};
    }


//almost like main
function popupHelper(event)
    {
    var onOk=function(arg)
	{
	arg.host=lastHost;
	event.source.postMessage(arg);
	}
    getTabInfo(onOk);
    }



//init prefs
ensureAllPrefs();


//init cache
if(widget.preferences.cache)
    cache.load();
setInterval("cache.save()",60000);
setInterval("stats.save()",60000);


//apply prefs
theButton.badge.backgroundColor=widget.preferences.badgeBGcolor;
theButton.badge.color=widget.preferences.badgeTXcolor;
theButton.popup.width=widget.preferences.popupWidth;
iconsCfg=JSON.parse(widget.preferences.iconsCfg);
