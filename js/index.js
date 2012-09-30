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
    if(widget.preferences.eventType%2==0)//0 or 2
	toggleIfExists();//let them grab the tab bar themselves
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
    theButton.disabled=true;
    }

groupHosts3={'blog.onet.pl':1};
groupHosts2={'allanalpass.com':1,'deviantart.com':1,'deviantart.net':1,'dns-shop.ru':1,'est.ua':1,'facebook.com':1,'fastpic.ru':1,'gazeta.pl':1,'gittigidiyor.com':1,'ifolder.ru':1,'imagevenue.com':1,'imageshack.us':1,'interia.pl':1,'ivao.aero':1,'lento.pl':1,'letitbit.net':1,'livejournal.com':1,'megafon.ru':1,'minecraftwiki.net':1,'mirtesen.ru':1,'moole.ru':1,'mts.ru':1,'narod.ru':1,'newsweek.pl':1,'nnm.ru':1,'onet.pl':1,'radikal.ru':1,'raduga.su':1,'rapidshare.com':1,'sexfotka.pl':1,'sex-zone.pl':1,'softonic.com':1,'softonic.pl':1,'sourceforge.net':1,'skryptoteka.pl':1,'tiu.ru':1,'tripod.com':1,'tumblr.com':1,'urlcash.net':1,'vk.com':1,'vkontakte.ru':1,'wikia.com':1,'wikidot.com':1,'wikimedia.org':1,'wikipedia.org':1,'wiktionary.org':1,'wordpress.com':1,'wrzuta.pl':1,'yvision.kz':1,
    //https://addons.opera.com/ru/extensions/details/block-linkbucks-opera-edition/?display=en
'linkbucks.com':1,'any.gs':1,'cash4links.co':1,'cash4files.com':1,'dyo.gs':1,'filesonthe.net':1,'goneviral.com':1,'megaline.co':1,'miniurls.co':1,'qqc.co':1,'seriousdeals.net':1,'theseblogs.com':1,'theseforums.com':1,'tinylinks.co':1,'tubeviral.com':1,'ultrafiles.net':1,'urlbeat.net':1,'whackyvidz.com':1,'yyv.co':1,
    //more
'seriousfiles.com':1,'picbucks.com':1,'ultrafiles.net':1,'zff.co':1,
    };
groupHosts0={'accounts.google.com':1,'addons.opera.com':1,'crash.opera.com':1,'encrypted.google.com':1,'forum.hr':1,'forum.pcekspert.com':1,'get3.adobe.com':1,'kriz-zivota.com':1,'localhost':1,'mail.google.com':1,'my.opera.com':1,'nk.pl':1,'opera.com':1,'plus.google.com':1,'support.google.com':1,'titlovi.com':1,'webstoregames.com':1,'windows.microsoft.com':1};
statsHosts={ver:0};

function normalizeHost(host)
    {
    host=host.replace(/^www\.(.+\..+)/,"$1");//cut off www. only if there's a dot to the right
    host=host.replace(/^(amazon|google)(\.com?)?\.[a-z][a-z]$/,'$1.com');//google.ru, google.co.uk
    host=host.replace(/^.*\.(blogspot)(\.com?)?\.[a-z][a-z]$/,'$1.com');//whatever.blogspot.co.uk
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
	    if(widget.preferences.eventType<2)//0 or 1
		toggleIfExists(event.data.w);
	break;
	case 'off':
	    if(popupIsOpening)//do not disable the button while popup is opening
		popupIsOpening=false;
	    else
		if(widget.preferences.eventType<2 && widget.preferences.disableButton=='1')
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
var lastRequestTime=0;


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
		//remove quotes at the beginning and end
		for(ind in data)
		    if(data[ind][0]=='"' && data[ind][data[ind].length-1]=='"')
			data[ind]=data[ind].substring(1,data[ind].length-1);
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



//init cache
function importOldCache()
    {
    var counter=Math.round((new Date()).getTime()/100000)-13270000;
    for(var q in widget.preferences)
	if(q.substr(0,6)=='cache:')
	    {
	    try {
		var o=JSON.parse(widget.preferences[q]);
		var t=counter++;
		q=normalizeHost(q.substr(6));
		for(var w in o)
		    if(o[w]=='-')
			o[w]='';
		if(!o.ipAddress.match(/^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/))
		    continue; //IP address doesn't look like IP address - FAIL
		    //code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp
		var n=[o.statusCode.toLowerCase(),o.statusMessage,o.ipAddress,o.countryCode,normalizeText(o.countryName),normalizeText(o.regionName),normalizeText(o.cityName),o.zipCode,o.latitude,o.longitude,o.timeZone,'ipinfodb.com','I'].join('|');
		cache.setItem(q,n,t);
		}
	    catch(e)
		{}
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

//init prefs
ensureAllPrefs();


//init cache
if(widget.preferences.cache==undefined)
    {
    importOldCache();
    widget.preferences.linksCfg=widget.preferences.linksCfg.replace(/\[ipAddress\]/g,'[ip]').replace(/\[countryName\]/g,'[country]').replace(/\[regionName\]/g,'[region]','').replace(/\[cityName\]/g,'[city]').replace(/\[zipCode\]/g,'[zip]').replace(/\[latitude\]/g,'[lat]').replace(/\[longitude\]/g,'[lng]').replace(/\[timeZone\]/g,'[tz]');
    }
else
    cache.load();
setInterval("cache.save()",60000);


//apply prefs
theButton.badge.backgroundColor=widget.preferences.badgeBGcolor;
theButton.badge.color=widget.preferences.badgeTXcolor;
theButton.popup.width=widget.preferences.popupWidth;
iconsCfg=JSON.parse(widget.preferences.iconsCfg);
