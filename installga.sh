echo "Visit https://developers.google.com/assistant/sdk/guides/library/python/embed/config-dev-project-and-account"
echo "If you need help setting up your Google Assistant SDK credentials."
echo "This is designed for ARM v7 devices (If you have a Raspberry Pi 4, try using GassistPi.)"
echo ""
read -r -p "Please include your credential file with the .json file." configfile
echo ""
read -r -p "Enter your project id from Google Cloud Console." projid
echo ""
read -r -p "Enter the modelid from your Actions on Google Console." modelid
sudo apt-get update
sudo apt-get install python3-dev python3-venv portaudio19-dev libffi-dev libssl-dev libmpg123-dev -y
python3 -m venv env
env/bin/python -m pip install --upgrade pip setuptools wheel
source env/bin/activate
python -m pip install --upgrade google-assistant-library==1.0.1
python -m pip install --upgrade google-assistant-sdk[samples]==0.5.1
python -m pip install --upgrade google-auth-oauthlib[tool]
google-oauthlib-tool --scope https://www.googleapis.com/auth/assistant-sdk-prototype \
      --scope https://www.googleapis.com/auth/gcm \
      --save --headless --client-secrets $configfile
echo "We are almost done, hang on tight!"
sed -i 's/modelid/'$modelid'/g' /home/pi/SmartDisplayPi/assistant.service
sed -i 's/projectid/'$projid'/g' /home/pi/SmartDisplayPi/assistant.service
sudo mv /home/pi/SmartDisplayPi/assistant.service /lib/systemd/system/assistant.service
sudo systemctl enable assistant.service
sudo systemctl start assistant.service
echo "The script is officially done. You can now reboot if you want."
