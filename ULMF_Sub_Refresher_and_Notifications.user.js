// ==UserScript==
// @name        ULMF Sub Refresher and Notifications
// @namespace   ulmfrefresher
// @description Refreshes Page and Checks for Unread Subs
// @include     http://www.ulmf.org/bbs/subscription.php*
// @include     http://www.ulmf.org/bbs/usercp.php
// @version     1.0.8
// @downloadURL https://github.com/emerladCoder/ULMF_Subscription_Refresher/raw/master/ULMF_Sub_Refresher_and_Notifications.user.js
// @grant       unsafeWindow
// ==/UserScript==

// Prevent script from running in frames and iframes
if (window.top != window.self) {
    return;
}

////////////////////////////////////////////////////////////////////////////
// SubRefresher                                                           //
////////////////////////////////////////////////////////////////////////////

console.log("Userscript SubRefresher version " + GM_info.script.version);

// function to call after all resources are loaded (console restored, jqeury loaded)
var userScriptResume = function() {
    // Global Scope variable
    var SubRefresher = {

//////////////////////////////////////////////////////////////////////////////////////////////////
//      CUSTOMIZATION OPTIONS                                                                   //
        minutes_to_refresh: 2,                                                                  // How long to wait to refresh page (minutes)
        audio_source: "http://docs.google.com/uc?export=open&id=0ByupedyEGgmpWXZlaDd6T19Rb1k",  // where to get notification sound to play
        audio_time: 2.5,                                                                        // How long between each play of audio (seconds)
        initialization_time: 2.5,                                                               // How long to wait before performing checks (seconds)
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////

        refresh_timeout: null,                                                                  // id of timeout
        new_sub_interval: null,                                                                 // id of interval for sound
        new_sub_urls: [],                                                                       // list of new sub urls
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
            var new_posts = $("img[title='Go to first new post']");

            // check if anythying new
            if (new_posts.length > 0) {
                SubRefresher.new_sub_urls = [];
                update = true;

                // get links for opening
                for( var i = 0; i < new_posts.length; i++) {
                    var link = new_posts[i].parentElement.href;
                    SubRefresher.new_sub_urls[SubRefresher.new_sub_urls.length] = link;
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
                popup.style.cssText = 'color:black;width:150px;height:70px;background-color:white;position:fixed;top:0;bottom:0;left:0;right:0;margin:auto;border:5px solid;border-color:#738FBF;padding:10px;z-index:5;';
                var button_style = "border-color:gray;border-width:2px;border-style:solid;padding:3px;color:white;background-color:#738FBF;";
                popup.innerHTML = '<table><tr><td colspan="2" style="padding-bottom:10px;"><center>New Subscription(s)!!!</center></td></tr><tr><td id="sr_open_all" style='+ button_style +'><center>Open All</center></td><td id="sr_close" style='+ button_style +'><center>Close</center></td></tr></table>';

                
                // attach it to the page
                $("body").append(popup);

                // stop audio and close popup function
                var stop_sound_and_close = function() {
                    clearInterval(SubRefresher.new_sub_interval);
                    popup.remove();

                    console.log("SubRefresher:\t Closing popup and stopping notification sound");
                }

                // button handlers

                // just stop audio and close popup
                $("#sr_close").click(function() {
                   stop_sound_and_close();
                });

                // open all new subs on click
                $("#sr_open_all").click(function() {
                    stop_sound_and_close()

                    console.log("SubRefresher:\t Opening all in new tabs");

                    for (var i = 0; i < SubRefresher.new_sub_urls.length; i++) {
                        window.open(SubRefresher.new_sub_urls[i]);
                    }
                });

            }
            else {
                console.log("SubRefresher:\t Found no new subscriptions(s), refreshing page in " + SubRefresher.minutes_to_refresh + " minutes");
                // set refresh timer
                SubRefresher.start_timeout(SubRefresher.minutes_to_refresh);
            }
        }
    };

    // inject SubRefresher functions onto page
    inject_script("SubRefresher", SubRefresher);

    console.log("SubRefresher:\t Waiting " + unsafeWindow.SubRefresher.initialization_time + " seconds to check for new subscription(s)");

    // give page some time, then call check function
    setTimeout(function() {
        unsafeWindow.SubRefresher.check_for_update();
    }, unsafeWindow.SubRefresher.initialization_time * 1000);
}


////////////////////////////////////////////////////////////////////////////
// Script Injector                                                        //
////////////////////////////////////////////////////////////////////////////

// Inject a script into the page header
//      script name     - name of script for logging and if script is object for name of object variable
//      script_source   - object to add to the page, or url of script to loaded
//      onload          - callback function for when script is loaded (only applicable if script_source is url)
var inject_script = function (script_name, script_source, onload = null) {
    
    console.log("Injecting:\t " + script_name);

    // create the script
    var script = document.createElement('script');
    script.type = "text/javascript";

    // script source is an object to add to the page
    if (typeof(script_source) == "object") {
        script.innerHTML = 'var ' + script_name + ' = ' + script_source.toSource();
    }
    // script is a url source to add
    else if (typeof(script_source) == "string") {
        script.src = script_source;
    }
    
    // callback function for script done loading (mainly for url sources)
    if (onload != null && typeof(onload) == "function") {
        script.onload = onload;
    }

    // Inject the script
    document.getElementsByTagName('head')[0].appendChild(script);

    console.log("Injected:\t " + script_name);
}


////////////////////////////////////////////////////////////////////////////
// consoleRestore                                                         //
////////////////////////////////////////////////////////////////////////////

// resotre console, which is removed by vbulleting_global.js
var consoleRestore = {
restore: function() {                                                                           // function that restores the console via an iframe
        var temp_frame = document.createElement('iframe');
        temp_frame.style.display = 'none';
        document.body.appendChild(temp_frame);
        window.console = temp_frame.contentWindow.console;
        //temp_frame.remove();
    }
};


// inject the consoleRestore functions onto page
inject_script("consoleRestore", consoleRestore);

// call function to restore the console
unsafeWindow.consoleRestore.restore();


////////////////////////////////////////////////////////////////////////////
// jQuery                                                                 //
////////////////////////////////////////////////////////////////////////////

// jQuery onload callback
var jQuery_loaded = function () {
    // version of jQuery
    console.log("jQuery:\t\t v" + unsafeWindow.jQuery.fn.jquery);

    // continue with the rest of the script
    userScriptResume();
};

// inject jQuery
inject_script("jQuery", "http://code.jquery.com/jquery-latest.min.js", jQuery_loaded);

