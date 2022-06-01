#!/bin/bash
sudo apt install git -y
git fetch origin --recurse-submodules=no --progress --prune
npm install
sudo apt update
sudo apt upgrade -y
