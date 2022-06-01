#!/bin/bash
git fetch origin --recurse-submodules=no --progress --prune
npm install
pkexec apt update && apt upgrade -y
