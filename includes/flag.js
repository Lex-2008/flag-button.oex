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
                //prevent from sending again
                if(!this.data_was_sent)
                    {
                    sender(event.data.w);
                    this.data_was_sent=true;
                    }
            break;
            }
        },false);
    },false);

if (window.top === window.self)
    {
    window.addEventListener( "focus",function()
        {
        send1('on');
        },false);
    
    window.addEventListener( "blur", function()
        {
        send1('off');
        },false);
    
    send1('on');
    }

