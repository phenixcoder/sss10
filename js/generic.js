$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    // if($.mobile.media("screen and (min-width: 320px)")) {
    //     // Check for iPhone4 Retina Display
    //     if($.mobile.media("screen and (-webkit-min-device-pixel-ratio: 2)")) {
    //         $('meta[name=viewport]').attr('content','user-scalable=no, initial-scale=0.5, maximum-scale=1, minimum-scale=0.5, width=device-width, height=device-height, target-densitydpi=device-dpi');
    //     }
    //     else
    //     {
    //         $('meta[name=viewport]').attr('content','user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi');
    //     }
    // }
});

function onDeviceReady()
{
    console.log("onDeviceReady");
}