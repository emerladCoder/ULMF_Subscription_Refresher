ULMF Subscription Refresher and Notification Sounds
===================================================

Features
--------
This is a user script for ULMF.org that runs on the subscription pages. The script checks if there are any new subscriptions on the page. If there are new subscriptions the script will display a popup on the page and play notification sounds, otherwise if there are not the script will refresh the page after a set duration.

From the popup you can either choose to open all new subscriptions, or close the popup and stop the notification sound playback.

Install
-------
1. Open the script in GitHub by clicking on it above (or [here](https://github.com/emerladCoder/ULMF_Subscription_Refresher/blob/master/ULMF_Sub_Refresher_and_Notifications.user.js))
2. Click the Raw button
3. Your userscript add-on (greasemonkey or tampermonkey) should recognize the script and prompt you to install it.

Customization
-------------
To modify the settings of the script you can change the following variables (look for the CUSTOMIZATION OPTIONS section in the script)
  
|       Variable     | Default Value                                                                 | Explanation |
|:-------------------|:-----------------------------------------------------------------------------:|:------------|
|minutes_to_refresh  | 2                                                                             | How long to wait to refresh the page when there are no new subscriptions (in minutes)  |
|audio_source        | [ding](http://docs.google.com/uc?export=open&id=0ByupedyEGgmpWXZlaDd6T19Rb1k) | Where to load the notification sound to play from (URL to audio file)  |
|audio_time          | 2.5                                                                           | How long to wait between repeat plays of the notification sound (in seconds)  |
|initialization_time | 2.5                                                                           | How long to wait before checking the page for subscriptions (in seconds)  |
