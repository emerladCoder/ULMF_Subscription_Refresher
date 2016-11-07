// ==UserScript==
// @name        ULMF Sub Refresher and Notifications
// @namespace   ulmfrefresher
// @description Refreshes Page and Checks for Unread Subs
// @include     http://www.ulmf.org/bbs/subscription.php*
// @version     1.0.2
// @downloadURL https://github.com/emerladCoder/ULMF_Subscription_Refresher/raw/master/ULMF_Sub_Refresher_and_Notifications.user.js
// @grant       unsafeWindow
// ==/UserScript==

// Prevent script from running in frames and iframes
if (window.top != window.self) {
    return;
}

// Global Scope variable
var SubRefresher = {
    minutes_to_refresh: 2,                                                                  // How long to wait to refresh page (minutes)
    audio_source: "http://docs.google.com/uc?export=open&id=0ByupedyEGgmpWXZlaDd6T19Rb1k",  // where to get notification sound to play
    audio_time: 2.5,                                                                        // How long between each play of audio (seconds)
    initializeation_time: 2.5,                                                              // How long to wait before performing checks (seconds)

    refresh_timeout: null,                                                                  // id of timeout
    new_sub_interval: null,                                                                 // id of interval for sound
    log_output: "",                                                                         // replacement for log output, since console.log is disabled on ulmf
    refresh: function() {                                                                   // refresh the page
        // reload without using cache
        location.reload(true);      
    },
    start_timeout: function(min) {                                                          // start the timeout for min minutes
        SubRefresher.refresh_timeout = setTimeout(SubRefresher.refresh, min * 60 * 1000);
    },
    check_for_update: function() {                                                          // main method that does the checking
        SubRefresher.log("Checking for new subscription");
       
        // check for updates on subs
        var update = false;

        // get titles
        var image_icons = jQuery("img[id^='thread_statusicon']");

        // check if anythying new
        for( var i = 0; i < image_icons.length; i++) {
            if (image_icons[i].src.indexOf("new") >= 0) {
                update = true;
                break;
            }
        }

        if (update) {
            SubRefresher.log("Found new subscription, playing sound and showing popup");
            // play sound until you make it stop

            // make audio element
            var audio = document.createElement("audio");
            audio.src = SubRefresher.audio_source;
            audio.preload = "auto";
            // attach it to the page
            $("body").append(audio);

            // play it
            audio.play();

            SubRefresher.log("Playing audio every " + SubRefresher.audio_time + " seconds");
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
            }
            // attach it to the page
            $("body").append(popup);
        }
        else {
            SubRefresher.log("Nothing new, refreshing in " + SubRefresher.minutes_to_refresh + " minutes");
            // set refresh timer
            SubRefresher.start_timeout(SubRefresher.minutes_to_refresh);
        }
    },
    log: function(text) {                                                                   // replacement for console.log for debug purposes
        SubRefresher.log_output += text.toString() + "\n";
    }
};


// inject the script functions onto page
SubRefresher.log("Injecting ULMF Sub Refresher and Notifications");

// Create script to inject
var script = document.createElement('script');
script.type = "text/javascript";
script.innerHTML = 'var SubRefresher = ' + SubRefresher.toSource();
// Inject the script
document.getElementsByTagName('head')[0].appendChild(script);


unsafeWindow.SubRefresher.log("Adding jQuery to the page");

// add jqeury to the page
var script_jquery = document.createElement('script');
script_jquery.type = "text/javascript";
script_jquery.src = "http://code.jquery.com/jquery-latest.min.js";
// Inject the script
document.getElementsByTagName('head')[0].appendChild(script_jquery);


unsafeWindow.SubRefresher.log("Waiting " + unsafeWindow.SubRefresher.initializeation_time + " seconds to start");

// give page some time, then call function
setTimeout(function() {
    unsafeWindow.SubRefresher.check_for_update(unsafeWindow.SubRefresher.initializeation_time * 1000);
}, 2500);

