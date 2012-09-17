var ids=['host','ip','country','region','city','zip','lat','lng','tz','src','cmp'];
var host=opera.extension.bgProcess.lastHost;
var fail;//global flag if replaceIds shows that current line is "bad" -- contains ids which are not in data

function replaceIds(s,data)
    {
    var w,sp;
    for(w in ids)
	{
	sp=s.split('['+ids[w]+']');
	if(sp.length<2)
	    continue;//no id in string => nothing to do
	if(!data[ids[w]])
	    {
	    fail=true;
	    continue;//id in string, but not in args => fail line
	    }
	s=sp.join(data[ids[w]]);
	}
    return s;
    }

opera.extension.addEventListener( "message", function(arg)
    {
    //close on error
    if(arg.data.code=='err')
	{
	window.close();
	alert('i should close');
	}
    
    var q;
    for(q in ids)
	{
	gebi(ids[q]).appendChild(document.createTextNode(arg.data[ids[q]]));
	if(arg.data[ids[q]])
	    gebi(ids[q]+'_gr').style.display='';
	else
	    gebi(ids[q]+'_gr').style.display='none';
	}
    gebi('src').href='http://'+arg.data[ids[q]];
    if(widget.preferences.debugMode=='0') gebi('cmp_gr').style.display='none';
    
    var linksCfg=sJSON.parse(widget.preferences.linksCfg);
    var root=gebi('links');
    for(q in linksCfg)
	{
	var elem=document.createElement('a');
	var fail=false;
	elem.href=replaceIds(linksCfg[q],arg.data);
	elem.appendChild(document.createTextNode(replaceIds(q,arg.data)));
	if(fail) continue;
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
    root.removeChild(root.lastChild);
    opera.extension.postMessage( {q:"size",h:gebi('wrap').offsetHeight+gebi('wrap').offsetTop*2} );
    }, false);

opera.extension.postMessage( {q:"popup"} );
