ULMF Subscription Refresher and Notification Sounds
===================================================

This is a user script for ULMF.org that runs on the subscription pages. The script checks if there are any new subsciptions on the page. If there are new subsciptions the script will display a popup on the page and play notification sounds, otherwise if there are not the script will refresh the page after a set duration.

To modify the settings of the script you can change  
* minutes_to_refresh (default 2 minutes)                                                                
 * How long to wait to refresh page (in minutes)
* audio_source  (default [ding](http://docs.google.com/uc?export=open&id=0ByupedyEGgmpWXZlaDd6T19Rb1k))  
 * where to get notification sound to play (should be link to audio file)
* audio_time (default 2.5 seconds)                                                                        
 * How long between each play of the notification audio (in seconds)
* initialization_time (default 2.5 seconds)                                                              
 * How long to wait before performing checks (in seconds)
