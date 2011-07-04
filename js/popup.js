var ids=['host','ipAddress','countryName','regionName','cityName','zipCode','latitude','longitude','timeZone'];
var reps=[['whois','http://who.is/[host]'],['ipinfo','http://ipinfodb.com/ip_locator.php?ip=[host]'],['gmaps','http://maps.google.com/?ie=UTF8&ll=[latitude],[longitude]']];

opera.extension.addEventListener( "message", function(arg)
    {
    //~ opera.postError('received: '+JSON.stringify(arg.data));
    var q,w,s;
    for(q in ids)
	gebi(ids[q]).innerHTML=arg.data[ids[q]];
    for(w in reps)
	{
	s=reps[w][1];
	for(q in ids)
	    s=s.replace('['+ids[q]+']',arg.data[ids[q]]);
	gebi(reps[w][0]).href=s;
	}
    opera.extension.postMessage( {q:"size",h:gebi('wrap').offsetHeight+gebi('wrap').offsetTop*2} );
    }, false);

opera.extension.postMessage( {q:"popup"} );
