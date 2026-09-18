#!/usr/bin/env bash
set -euo pipefail

add-apt-repository -y ppa:gluster/glusterfs-9
apt-get -q update
apt-get -q -y install glusterfs-client

# mkdir -p /mnt/gv0
# echo "192.168.10.10:/gv0 /mnt/gv0 glusterfs defaults,_netdev,backup-volfile-servers=192.168.10.20:192.168.10.30 0 0" >> /etc/fstab
# mount /mnt/gv0
