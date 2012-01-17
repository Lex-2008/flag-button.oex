var ids=['host','ipAddress','countryName','regionName','cityName','zipCode','latitude','longitude','timeZone'];
//~ var reps=[['whois','http://who.is/[host]'],['ipinfo','http://ipinfodb.com/ip_locator.php?ip=[host]'],['gmaps','http://maps.google.com/?ie=UTF8&ll=[latitude],[longitude]']];

opera.extension.addEventListener( "message", function(arg)
    {
    //~ opera.postError('received: '+JSON.stringify(arg.data));
    
    //close on error
    if(arg.fail)
	window.close();
    
    var q,w,s;
    for(q in ids)
	{
	gebi(ids[q]).innerHTML=arg.data[ids[q]];
	//~ opera.postError('data: ['+arg.data[ids[q]]+']');
	if(arg.data[ids[q]]=='' || arg.data[ids[q]]=='-')
	    gebi(ids[q]+'_gr').style.display='none';
	else
	    gebi(ids[q]+'_gr').style.display='';
	}
    var linksCfg=JSON.parse(widget.preferences.linksCfg);
    var root=gebi('links');
    for(q in linksCfg)
	{
	var elem=document.createElement('a');
	s=linksCfg[q];
	for(w in ids)
	    s=s.replace('['+ids[w]+']',arg.data[ids[w]]);
	elem.href=s;
	s=q;
	for(w in ids)
	    s=s.replace('['+ids[w]+']',arg.data[ids[w]]);
	elem.appendChild(document.createTextNode(s));
	root.appendChild(elem);
	switch(widget.preferences.linksStyle)
	    {
	    case '0':
		root.appendChild(w=document.createTextNode(' '));
	    break;
	    case '1':
		root.appendChild(w=document.createTextNode(', '));
	    break;
	    case '2':
		root.appendChild(w=document.createElement('br'));
	    break;
	    }
	}
    root.removeChild(w);
    opera.extension.postMessage( {q:"size",h:gebi('wrap').offsetHeight+gebi('wrap').offsetTop*2} );
    }, false);

opera.extension.postMessage( {q:"popup"} );
