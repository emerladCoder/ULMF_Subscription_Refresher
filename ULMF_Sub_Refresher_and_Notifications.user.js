// ==UserScript==
// @name        ULMF Sub Refresher and Notifications
// @namespace   ulmfrefresher
// @description Refreshes Page and Checks for Unread Subs
// @include     http://www.ulmf.org/bbs/subscription.php*
// @version     1.0.3
// @downloadURL https://github.com/emerladCoder/ULMF_Subscription_Refresher/raw/master/ULMF_Sub_Refresher_and_Notifications.user.js
// @grant       unsafeWindow
// ==/UserScript==

// Prevent script from running in frames and iframes
if (window.top != window.self) {
    return;
}

////////////////////////////////////////////////////////////////////////////
// userScriptResume                                                       //
////////////////////////////////////////////////////////////////////////////

console.log("Userscript SubRefresher version " + GM_info.script.version);

// function to call after all resources are loaded (console restored, jqeury loaded)
var userScriptResume = function() {
    // Global Scope variable
    var SubRefresher = {

        ////////////////////////////////////////////////////
        // CUSTOMIZATION OPTIONS
        minutes_to_refresh: 2,                                                                  // How long to wait to refresh page (minutes)
        audio_source: "http://docs.google.com/uc?export=open&id=0ByupedyEGgmpWXZlaDd6T19Rb1k",  // where to get notification sound to play
        audio_time: 2.5,                                                                        // How long between each play of audio (seconds)
        initializeation_time: 2.5,                                                              // How long to wait before performing checks (seconds)
        //
        ////////////////////////////////////////////////////

        refresh_timeout: null,                                                                  // id of timeout
        new_sub_interval: null,                                                                 // id of interval for sound
        refresh: function() {                                                                   // refresh the page
            // reload without using cache
            location.reload(true);      
        },
        start_timeout: function(min) {                                                          // start the timeout for min minutes
            SubRefresher.refresh_timeout = setTimeout(SubRefresher.refresh, min * 60 * 1000);
        },
        check_for_update: function() {                                                          // main method that does the checking
            console.log("SubRefresher:\t Checking for new subscription(s)");
        
            // check for updates on subs
            var update = false;

            // get titles
            var image_icons = $("img[id^='thread_statusicon']");

            // check if anythying new
            for( var i = 0; i < image_icons.length; i++) {
                if (image_icons[i].src.indexOf("new") >= 0) {
                    update = true;
                    break;
                }
            }

            if (update) {
                console.log("SubRefresher:\t Found new subscription(s), playing sound and showing popup");
                // play sound until you make it stop

                // make audio element
                var audio = document.createElement("audio");
                audio.src = SubRefresher.audio_source;
                audio.preload = "auto";
                // attach it to the page
                $("body").append(audio);

                // play it
                audio.play();

                console.log("SubRefresher:\t Playing audio every " + SubRefresher.audio_time + " seconds");
                // keep playing it until you make it stop
                SubRefresher.new_sub_interval = setInterval(function() {
                    audio.play();
                }, SubRefresher.audio_time * 1000);

                // notification popup
                var popup = document.createElement("div");
                popup.style.cssText = 'color:black;width:80px;height:70px;background-color:white;position:fixed;top:0;bottom:0;left:0;right:0;margin:auto;border:5px solid;border-color:#738FBF;padding:10px;z-index:5;';
                popup.innerHTML = '<center>New Sub!!!<br><br>Click to Close</center>';

                // close notification on click, and make audio stop
                popup.onclick = function() {
                    clearInterval(SubRefresher.new_sub_interval);
                    popup.remove();

                    console.log("SubRefresher:\t Closing popup and stopping notification sound");
                }
                // attach it to the page
                $("body").append(popup);
            }
            else {
                console.log("SubRefresher:\t Found no new subscriptions(s), refreshing page in " + SubRefresher.minutes_to_refresh + " minutes");
                // set refresh timer
                SubRefresher.start_timeout(SubRefresher.minutes_to_refresh);
            }
        }
    };

    // inject SubRefresher functions onto page
    console.log("Injecting:\t SubRefresher");

    // Create script to inject
    var scriptSubRefresher = document.createElement('script');
    scriptSubRefresher.type = "text/javascript";
    scriptSubRefresher.innerHTML = 'var SubRefresher = ' + SubRefresher.toSource();
    // Inject the script
    document.getElementsByTagName('head')[0].appendChild(scriptSubRefresher);
    console.log("Loaded:\t\t SubRefresher");


    console.log("SubRefresher:\t Waiting " + unsafeWindow.SubRefresher.initializeation_time + " seconds to check for new subscription(s)");

    // give page some time, then call check function
    setTimeout(function() {
        unsafeWindow.SubRefresher.check_for_update(unsafeWindow.SubRefresher.initializeation_time * 1000);
    }, unsafeWindow.SubRefresher.initializeation_time * 1000);
}


////////////////////////////////////////////////////////////////////////////
// consoleRestore                                                         //
////////////////////////////////////////////////////////////////////////////

// resotre console, which is removed by vbulleting_global.js
var consoleRestore = {
    restore: function() {
        var temp_frame = document.createElement('iframe');
        temp_frame.style.display = 'none';
        document.body.appendChild(temp_frame);
        window.console = temp_frame.contentWindow.console;
        temp_frame.remove();
    }
};


// inject the consoleRestore functions onto page
console.log("Injecting:\t consoleRestore");

// Create script to inject
var scriptConsoleRestore = document.createElement('script');
scriptConsoleRestore.type = "text/javascript";
scriptConsoleRestore.innerHTML = 'var consoleRestore = ' + consoleRestore.toSource();
// Inject the script
document.getElementsByTagName('head')[0].appendChild(scriptConsoleRestore);

// call the script
unsafeWindow.consoleRestore.restore();

// Everything after appending this script is run after the pages own js is loaded
//  including the vbulleting_global.js which removes the console
//  so if this shows up in the console, then the console has been restored
console.log("Loaded:\t\t consoleRestore => Console Restored");


////////////////////////////////////////////////////////////////////////////
// jQuery                                                                 //
////////////////////////////////////////////////////////////////////////////

// inject jQuery onto page
console.log("Injecting:\t jQuery");

// create script to inject
var script_jquery = document.createElement('script');
script_jquery.type = "text/javascript";
script_jquery.src = "http://code.jquery.com/jquery-latest.min.js";
script_jquery.onload = function () {
    // jquery is loaded, okay to run the rest of the user script
    console.log("Loaded:\t\t jQuery Version " + unsafeWindow.jQuery.fn.jquery);

    // continue with the rest of the script
    userScriptResume();
};
// Inject the script
document.getElementsByTagName('head')[0].appendChild(script_jquery);

