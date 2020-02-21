xset s off
xset -dpms
xset s noblank
sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium-browser Default/Preferences
chromium-browser --noerrdialogs --kiosk file:///home/pi/SmartDisplayPi/Web/index2.html --window-size=800,480 --window-position=0,0
