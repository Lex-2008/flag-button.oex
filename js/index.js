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
    if(widget.preferences.showXXBadge=='1')
	theButton.badge.textContent='XX';
    else
	theButton.badge.textContent='';
    theButton.disabled=true;
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
	    toggleIfExists(event.data.w);
	break;
	case 'off':
	    if(popupIsOpening)//do not disable the button
		popupIsOpening=false;
	    else
		if(widget.preferences.disableButton=='1')
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
	    if(widget.preferences.showBadge=='1')
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
    //NB! if('0') is true
    //that is my key
    var key='8ab4dafef4a713f5097cb50706e861b38ebf6972a44167aa9426cde1768fed5e';
    if(widget.preferences.userkey.length()>30) key=widget.preferences.userkey;
    
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
	if(widget.preferences.offlineMode==1)
	    {
	    onOk({code:'err',err:lang.offlineText});
	    }
	else
	    {
	    var XHR=new window.XMLHttpRequest();
	    XHR.onreadystatechange=function()
		{
		if(XHR.readyState==4)
		    {
		    switch(widget.preferences.source)
			{
			case 0:
			    //freegeoip.net
			    //ip,co,country,region_code,region_name,city,zip,lat,lon
			    data=XHR.responseText.split(',');
			    //code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp
			    arg=['ok','',data[0],data[1],data[2],data[4],data[5],data[6],data[7],data[8],'','freegeoip.net',''].join('|');
			break;
			case 2:
			    //ipinfodb.com
			    //statuscode;statusmessage;ip;co;country;region;city;zip;lat;lon;timezone
			    data=XHR.responseText.split(';');
			    //code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp
			    arg=[data[0].toLowerCase(),data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],'ipinfodb.com',''].join('|');
			break;
			default:
			    //flag-button.tk
			    arg=XHR.responseText;
			break;
			}
		    cache.setItem(host,arg);
		    arg=cache.getItem(host);
		    if(arg) onOk(arg);
		    }
		};
	    switch(widget.preferences.source)
		{
		case 0:
		    XHR.open("GET","http://freegeoip.net/csv/"+host,true);
		break;
		case 2:
		    XHR.open("GET","http://api.ipinfodb.com/v3/ip-country/?key="+key+"&ip="+host+"&format=raw",true);
		break;
		default:
		    XHR.open("GET","http://flag-button.tk/api.php?host="+host,true);
		break;
		}
	    XHR.send(null);
	    }//online
	}//get data
    }//getTabInfo



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
	    var t=counter;
	    counter+=100;//add some number so all records don't disappear at once
		//code|err|ip|co|country|region|city|zip|lat|lng|tz|src|cmp
	    n.d=[o.statusCode.toLowerCase(),o.statusMessage,o.ipAddress,o.countryCode,o.countryName,o.regionName,o.cityName,o.zipCode,o.latitude,o.longitude,o.timeZone,'ipinfodb.com',''];
	    cache.setItem(q.substr(6),n,t);
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
    if(widget.preferences[q]===undefined)
	widget.preferences[q]=defaults[q];



//apply prefs
theButton.badge.backgroundColor=widget.preferences.badgeBGcolor;
theButton.badge.color=widget.preferences.badgeTXcolor;
theButton.popup.width=widget.preferences.popupWidth;
var iconsCfg=JSON.parse(widget.preferences.iconsCfg);
