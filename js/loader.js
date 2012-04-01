domain='';
result={};
function grabNext()
    {
    if(domain=domains.shift())
	{
	getTabInfo(receive,domain);
	opera.postError('asking for '+domain+' with '+domains.length+' domains left');
	}
    else
	{
	opera.postError('stop asking with '+domains.length+' domains left');
	precache=result;
	input('','precache='+JSON.stringify(result));
	}
    }

function receive(a)
    {
    if(a['code']=='ok' && flags[a['co'].toLowerCase()])
	{
	var d=[a['code'],a['err'],a['ip'],a['co'],a['country'],a['region'],a['city'],a['zip'],a['lat'],a['lng'],a['tz'],a['src'],a['cmp']].join('|');
	result[domain]=d;
	//~ opera.postError(domain+':'+d);
	}
    else
	{
	opera.postError(domain+' FAIL:');
	aalert(a);
	}
    timer=setTimeout("grabNext()",1500);
    }
