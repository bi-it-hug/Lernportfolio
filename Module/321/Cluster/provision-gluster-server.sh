#!/usr/bin/env bash
set -euo pipefail

add-apt-repository -y ppa:gluster/glusterfs-9
apt-get -q update
apt-get -q -y install glusterfs-server

systemctl enable glusterd.service
systemctl start glusterd.service

DEVICE=/dev/sdc
MOUNT_PATH=/mnt/data

mkfs.xfs -i size=512 "$DEVICE"
mkdir -p "$MOUNT_PATH"
echo "$DEVICE $MOUNT_PATH xfs defaults 1 2" >> /etc/fstab
mount "$MOUNT_PATH"
mkdir "$MOUNT_PATH/gv0"

# gluster peer probe 192.168.10.20
# gluster peer probe 192.168.10.30
# gluster volume create gv0 replica 3 192.168.10.{10,20,30}:/mnt/data/gv0
# gluster volume start gv0
