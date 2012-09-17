function sender(data)
    {
    var send=function(to)
        {
        document.dispatchEvent( new window.CustomEvent('CustomDataSend',{detail:
            {
                'to':to,
                'from':widget.id,
                'data':data
            }}));
        };
    
    //check if this function was already called once and we need to remove listener
    if(this.listener)
        document.removeEventListener('CustomDataRequest',this.listener,false);
    
    //reply to data requests (from extensions which will be loaded later)
    this.listener=function(ev)
        {
        if(ev.detail.to=='*' || ev.detail.to==widget.id)
            send(ev.detail.from);
        };
    
    document.addEventListener('CustomDataRequest',this.listener,false);
    
    //send data to everyone (to extensions which were loaded earlier)
    send('*');
    };
