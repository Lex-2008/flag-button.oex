function send1(s) //'on' or 'off'
    {
    var host=window.location.hostname;
    opera.extension.postMessage({q:s,w:host});
    }

//note: window.addEventListener is required because sender.js might not be loaded yet
window.addEventListener('DOMContentLoaded', function () {
    opera.extension.addEventListener( "message", function(event)
        {
        switch(event.data.q)
            {
            case 'data':
                window['flag-button']=event.data.w;
            break;
            }
        },false);
    },false);

if (window.top === window.self)
    {
    window.addEventListener( "focus",function(){
        send1('focus');
        },false);
    
    window.addEventListener( "blur", function(){
        send1('blur');
        },false);
    
    window.addEventListener('load', function(){
        if(!testMediaQuery('screen and (view-mode:minimized)'))
            {
            opera.postError('loaded page normal: '+window.location.hostname);
            send1('loaded')
            }
        else
            opera.postError('loaded page in SD: '+window.location.hostname);
        },false);
    
    }
else
    opera.postError('loaded page iframe: '+window.location.hostname);
