#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
pip3 install aiohttp==3.6.2 aiohttp-cors==0.7.0 youtube_dl==2020.5.8
sudo cp ${DIR}/link-extension.service /etc/systemd/system/link-extension.service
sudo systemctl enable link-extension.service
sudo systemctl start link-extension.service
