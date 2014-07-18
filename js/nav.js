var storageKeys = {
    sessionInput: "sessionInput",
	sessionOutput: "sessionOutput",
	savedOutput: "savedOutput"
};

var vmKeys = {
	screen1: "screen1vm"
}

function navigateTo(page)
{
    window.location = page;
}

function selectViewport()
{
	if($.mobile.media("screen and (min-width: 320px)")) {
        // Check for iPhone4 Retina Display
        if($.mobile.media("screen and (-webkit-min-device-pixel-ratio: 2)")) {
            $('meta[name=viewport]').attr('content','user-scalable=no, initial-scale=0.5, maximum-scale=1, minimum-scale=0.5, width=device-width, height=device-height, target-densitydpi=device-dpi');
        }
        else
        {
            $('meta[name=viewport]').attr('content','user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi');
        }
    }
}

//ko extension
ko.bindingHandlers.isolatedOptions = {
    init: function(element, valueAccessor) {
        var args = arguments;
        ko.computed({
            read:  function() {
               ko.utils.unwrapObservable(valueAccessor());
               ko.bindingHandlers.options.update.apply(this, args);
            },
            owner: this,
            disposeWhenNodeIsRemoved: element
        });
    }
};
