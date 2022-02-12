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
sudo apt install xdm npm -y
if [ $? != 0 ]; then
    echo "There was an error installing XDM or NPM. Look above for more info."
    echo -n "Would you like to continue anyway? (y/n): "
    read continue3
    if [ $continue3 = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
git clone https://github.com/Sid220/SmartDisplayPi.git
if [ $? != 0 ]; then
    echo "There was an error cloning the git repo. Look above for more info. It could be you are not connected to the internet."
    echo -n "Would you like to continue anyway? (y/n): "
    read continue4
    if [ $continue4 = "y" ]; then
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
    read continue5
    if [ $continue5 = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
sudo systemctl enable xdm
sudo systemctl start xdm