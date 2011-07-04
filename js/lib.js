// debug ;)
function aalert(o){
var str='';
for(var qwe in o)
    str+=''+qwe+':'+typeof(o[qwe])+'='+o[qwe]+'\n';
opera.postError('('+typeof(o)+')='+o+'\n\n'+str);
}

function clearCache()
    {
    var keys=widget.preferences.save.split(',');
    var save={};
    //save
    for(var q in keys)
	save[q]=widget.preferences.getItem(keys[q]);
    //clear
    widget.preferences.clear();
    //restore
    for(var q in keys)
	widget.preferences.setItem(keys[q],save[q]);
    }

function gebi(id)
    {
    return document.getElementById(id)
    }