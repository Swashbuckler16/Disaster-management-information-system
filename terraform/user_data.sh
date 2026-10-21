#!/bin/bash
set -euo pipefail

# System update
apt-get update -y
apt-get install -y ca-certificates curl gnupg git iptables

# Set up Docker repository
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker
systemctl start docker

# Forward port 80 to port 8000 so both URLs work
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8000 || true

# Clone repository and deploy with Docker Compose
mkdir -p /opt/dmis
cd /opt/dmis
git clone https://github.com/Swashbuckler16/Disaster-management-information-system.git .
docker compose -p dmis up -d --build
