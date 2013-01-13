function send1(s) //'on' or 'off'
    {
    var host=window.location.hostname;
    opera.extension.postMessage({q:s,w:host});
    }

opera.extension.addEventListener( "message", function(event)
    {
    switch(event.data.q)
        {
        case 'data':
            window['flag-button']=event.data.w;
        break;
        }
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
        //~ try{
            //~ if(widget.preferences.eventType>0)
                if(!testMediaQuery('screen and (view-mode:minimized)'))
                    send1('loaded')
            //~ }
        //~ catch(e){}
        },false);
    
    }
