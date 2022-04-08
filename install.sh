cd ~/
echo "  ______                                       __      _______   __                      __                      _______   __ 
 /      \                                     /  |    /       \ /  |                    /  |                    /       \ /  |
/$$$$$$  | _____  ____    ______    ______   _$$ |_   $$$$$$$  |$$/   _______   ______  $$ |  ______   __    __ $$$$$$$  |$$/ 
$$ \__$$/ /     \/    \  /      \  /      \ / $$   |  $$ |  $$ |/  | /       | /      \ $$ | /      \ /  |  /  |$$ |__$$ |/  |
$$      \ $$$$$$ $$$$  | $$$$$$  |/$$$$$$  |$$$$$$/   $$ |  $$ |$$ |/$$$$$$$/ /$$$$$$  |$$ | $$$$$$  |$$ |  $$ |$$    $$/ $$ |
 $$$$$$  |$$ | $$ | $$ | /    $$ |$$ |  $$/   $$ | __ $$ |  $$ |$$ |$$      \ $$ |  $$ |$$ | /    $$ |$$ |  $$ |$$$$$$$/  $$ |
/  \__$$ |$$ | $$ | $$ |/$$$$$$$ |$$ |        $$ |/  |$$ |__$$ |$$ | $$$$$$  |$$ |__$$ |$$ |/$$$$$$$ |$$ \__$$ |$$ |      $$ |
$$    $$/ $$ | $$ | $$ |$$    $$ |$$ |        $$  $$/ $$    $$/ $$ |/     $$/ $$    $$/ $$ |$$    $$ |$$    $$ |$$ |      $$ |
 $$$$$$/  $$/  $$/  $$/  $$$$$$$/ $$/          $$$$/  $$$$$$$/  $$/ $$$$$$$/  $$$$$$$/  $$/  $$$$$$$/  $$$$$$$ |$$/       $$/ 
                                                                              $$ |                    /  \__$$ |              
                                                                              $$ |                    $$    $$/               
                                                                              $$/                      $$$$$$/                "
if [ $USER = "root" ]; then
    echo "You are root. Please run this script as a normal user with sudo powers."
    exit 1
fi
release=$(lsb_release -ds)
if [ "$release" != 'Ubuntu 21.10' ]; then
    echo "This script is only intented for fresh installations of Ubuntu 21.10, you are running $release"
    echo -n "Would you like to continue anyway? (y/n): "
    read continue0
    if [ $continue0 = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
echo "Please note: This script is only intented for fresh installations of Ubuntu 21.10 on Raspberry Pis and will make breaking changes to your computer."
echo -n "Would you like to continue? (y/n): "
read continue1
if [ $continue1 = "y" ]; then
    echo "Continuing..."
else
    exit 1
fi
sudo apt update && sudo apt upgrade -y
if [ $? != 0 ]; then
    echo "There was an error updating. Look above for more info."
    echo -n "Would you like to continue anyway? (y/n): "
    read continue7
    if [ $continue7 = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
sudo apt-get install xserver-xorg-core --no-install-recommends --no-install-suggests -y
if [ $? != 0 ]; then
    echo "There was an error installing X. Look above for more info."
    echo -n "Would you like to continue anyway? (y/n): "
    read continue2
    if [ $continue2 = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
sudo apt install npm openbox xinit slim dbus-x11 network-manager -y
if [ $? != 0 ]; then
    echo "There was an error installing Slim, NetworkManager, OpenBox, Xinit, or NPM. Look above for more info."
    echo -n "Would you like to continue anyway? (y/n): "
    read continue3
    if [ $continue3 = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
sudo apt install gnome-control-center --no-install-recommends --no-install-suggests -y
if [ $? != 0 ]; then
    echo "There was an error installing GNOME Control Centre. Look above for more info."
    echo -n "Would you like to continue anyway? (y/n): "
    read continue4
    if [ $continue4 = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
git clone https://github.com/Sid220/SmartDisplayPi.git
if [ $? != 0 ]; then
    echo "There was an error cloning the git repo. Look above for more info. It could be you are not connected to the internet."
    echo -n "Would you like to continue anyway? (y/n): "
    read continue5
    if [ $continue5 = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
cd ~/SmartDisplayPi
npm install
if [ $? != 0 ]; then
    echo "There was an error installing the required NPM packages. Look above for more info."
    echo -n "Would you like to continue anyway? (y/n): "
    read continue6
    if [ $continue6 = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
mkdir ~/.config/autostart
echo "[Desktop Entry]
Name=SmartDisplayPi
Exec=bash -c 'cd ~/SmartDisplayPi && ./kiosk.sh'
Terminal=false
Type=Application" | sudo tee ~/.config/autostart/smartdisplay.desktop
sudo setcap CAP_SYS_BOOT=+ep /usr/bin/node
echo "Rebooting..."
sudo reboot
