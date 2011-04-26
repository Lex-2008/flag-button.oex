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