var ids=['host','ip','country','region','city','zip','lat','lng','tz','src','cmp'];
var host=opera.extension.bgProcess.lastHost;

opera.extension.addEventListener( "message", function(arg)
    {
    //close on error
    if(arg.data.code=='err')
	{
	window.close();
	alert('i should close');
	}
    
    var q,w,s;
    for(q in ids)
	{
	gebi(ids[q]).innerHTML=arg.data[ids[q]];
	if(arg.data[ids[q]])
	    gebi(ids[q]+'_gr').style.display='';
	else
	    gebi(ids[q]+'_gr').style.display='none';
	}
    //~ gebi('host').innerHTML=host;
    gebi('src').href='http://'+arg.data[ids[q]];
    if(widget.preferences.debugMode=='0') gebi('cmp_gr').style.display='none';
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
