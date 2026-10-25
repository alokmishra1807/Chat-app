# Kubeadm Installation Guide on Microsoft Azure

This guide explains how to set up a Kubernetes cluster using `kubeadm` on Azure Virtual Machines.

## Prerequisites

- Azure subscription
- Two Ubuntu Linux VMs
- SSH access and `sudo` privileges
- Internet access
- Recommended: 2 vCPUs and 4 GB RAM per VM

---

## Azure Setup

### Step 1: Create a Virtual Network (VNet)

1. Create a Resource Group in Azure.
2. Create a VNet named `kubernetes-vnet`.
3. Create a subnet named `kubernetes-subnet`.
4. Use the same VNet and subnet for both the Master and Worker VMs.

> **Important:** Both VMs must be in the same VNet to communicate using their private IP addresses.

### Step 2: Create a Network Security Group (NSG)

Create an NSG named `kubernetes-nsg` and configure the following inbound rules:

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| 22 | TCP | Your public IP | SSH access |
| 6443 | TCP | VNet subnet | Kubernetes API server |
| 10250 | TCP | VNet subnet | Kubelet communication |
| 4789 | UDP | VNet subnet | Calico VXLAN networking |

Restrict internal Kubernetes traffic to the VNet or required node IPs.

### Step 3: Create the Virtual Machines

Create two Ubuntu VMs:

- **Master VM:** `k8s-master`
- **Worker VM:** `k8s-worker`

While creating each VM:

1. Select the same Resource Group, region, VNet, and subnet.
2. Configure SSH authentication.
3. Under **Advanced → Network security group**, select the existing `kubernetes-nsg`. If this option is unavailable, associate the NSG through the Networking settings.
4. Enable public IPs if required for SSH access.

Note down the private IP addresses of both VMs. Use private IPs for Kubernetes communication.

---

## Execute on Both Master and Worker Nodes

### Step 4: Disable Swap

```bash
sudo swapoff -a
```

Disable any active swap entry in `/etc/fstab` to make this persistent across reboots.

### Step 5: Load Kernel Modules

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter
```

### Step 6: Configure Networking

```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward = 1
EOF

sudo sysctl --system
```

### Step 7: Install Containerd

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl

sudo install -m 0755 -d /etc/apt/keyrings

sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc

sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y containerd.io

sudo mkdir -p /etc/containerd

containerd config default | sudo tee /etc/containerd/config.toml

sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' \
  /etc/containerd/config.toml

sudo systemctl restart containerd
sudo systemctl enable containerd
```

### Step 8: Install Kubernetes Components

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gpg

sudo mkdir -p /etc/apt/keyrings

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.37/deb/Release.key \
  | sudo gpg --dearmor \
      -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.37/deb/ /' \
  | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

sudo systemctl enable --now kubelet
```

---

## Execute ONLY on the Master Node

### Step 9: Initialize the Cluster

Replace `<MASTER_PRIVATE_IP>` with the master VM's actual private IP.

```bash
sudo kubeadm init \
  --apiserver-advertise-address=<MASTER_PRIVATE_IP> \
  --pod-network-cidr=192.168.0.0/16
```

### Step 10: Configure kubectl

```bash
mkdir -p "$HOME/.kube"

sudo cp -i /etc/kubernetes/admin.conf "$HOME/.kube/config"

sudo chown "$(id -u):$(id -g)" "$HOME/.kube/config"
```

### Step 11: Install Calico Network Plugin

```bash
kubectl apply -f \
  https://raw.githubusercontent.com/projectcalico/calico/master/manifests/calico.yaml
```

Wait for the network plugin to initialize:

```bash
kubectl get pods -n kube-system
```

### Step 12: Generate the Worker Join Command

```bash
sudo kubeadm token create --print-join-command
```

Copy the generated command for use on the Worker node.

---

## Execute ONLY on the Worker Node

### Step 13: Join the Cluster

If the worker has a previous failed kubeadm setup, reset it first. Skip this on a fresh VM.

```bash
sudo kubeadm reset -f
```

Run the join command generated on the master, adding `sudo`, the containerd socket, and `--v=5`:

```bash
sudo kubeadm join <MASTER_PRIVATE_IP>:6443 \
  --token <TOKEN> \
  --discovery-token-ca-cert-hash sha256:<HASH> \
  --cri-socket unix:///run/containerd/containerd.sock \
  --v=5
```

Replace all placeholders with the actual values generated by the master.

---

## Verify the Cluster

Execute on the Master node:

```bash
kubectl get nodes -o wide
```

Check all cluster pods:

```bash
kubectl get pods -A
```

Both nodes should eventually show `Ready`.

---

