function send1(s) //'on' or 'off'
    {
    var host=window.location.hostname;
    opera.extension.postMessage({q:s,w:host});
    }

if (window.top === window.self)
    {
    window.addEventListener( "focus",function()
        {
        send1('on');
        //~ this.isFocused=true;
        },false);
    
    window.addEventListener( "blur", function()
        {
        send1('off');
        //~ this.isFocused=false;
        },false);
    
    send1('on');
    }
