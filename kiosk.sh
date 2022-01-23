xset s off
echo "[DEV]: SCREENSAVER: OFF"
xset -dpms
echo "[DEV]: ENERGY STAR FEATURES: OFF"
xset s noblank
echo "[DEV]: BLANKING: OFF"
# sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium-browser Default/Preferences
echo "[DEV]: CHROME: STARTING"
chromium-browser file:///home/pi/SmartDisplayPi/Web/index.html --window-position=0,0
