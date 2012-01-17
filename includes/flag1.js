function send1(s) //'on' or 'off'
    {
    var url=document.location.href;
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/:]+)', 'im');
    var host=url.match(re)[1].toString();
    opera.extension.postMessage({q:s,w:host});
    }

window.addEventListener( "focus",function()
    {
    send1('on');
    this.isFocused=true;
    },false);

window.addEventListener( "blur", function()
    {
    send1('off');
    this.isFocused=false;
    },false);

send1('on');
