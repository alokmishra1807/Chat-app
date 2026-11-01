# Argo CD Continuous Delivery Setup

This README documents how Argo CD was installed on a local `kind` Kubernetes cluster running on an Azure VM, and how it deploys the Chat App from Git.

## Overview

- **Kubernetes:** `kind` cluster named `argocd-cluster`
- **GitOps tool:** Argo CD, installed with Helm in the `argocd` namespace
- **Application repository:** `https://github.com/alokmishra1807/Chat-app.git`
- **Application namespace:** `chat-app-ns`
- **Deployment approach:** Argo CD watches the Git repository and reconciles the Kubernetes manifests with the cluster. A root Application (`root-app.yml`) is used to manage the app's child Applications.

> Keep credentials and Kubernetes secrets out of Git. Do not commit Argo CD passwords, private keys, or application secrets.

## 1. Create the kind cluster

From the VM, create the cluster using the kind configuration file:

```bash
kind create cluster --name argocd-cluster --config kind-config.yaml
kubectl cluster-info
kubectl get nodes
```

The `kind-config.yaml` should contain the cluster settings required by your VM setup, including any API-server address/port and host port mappings you configured.

## 2. Install Argo CD with Helm

Add the Argo Helm chart repository, create the namespace, and install Argo CD:

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

kubectl create namespace argocd
helm install argocd argo/argo-cd -n argocd
```

Wait for the Argo CD pods to become ready:

```bash
kubectl get pods -n argocd
```

## 3. Access the Argo CD API/UI

If you are using a VM public IP and a port-forward, make sure the VM's network/security rules allow the intended port and restrict access appropriately. For a safer setup, use an SSH tunnel or a private network rather than exposing the Argo CD API publicly.

Example port-forward (run in a terminal and keep it running):

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

The Argo CD server is then available locally at `https://localhost:8080`. If you expose it through a VM port, use your configured address and port instead.

## 4. Log in to Argo CD

Retrieve the initial admin password if the initial secret still exists:

```bash
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath='{.data.password}' | base64 -d
echo
```

Log in from the VM using the matching server address and port:

```bash
argocd login <ARGOCD_SERVER>:<PORT> --username admin --password '<PASSWORD>' --insecure
```

`--insecure` skips certificate verification. Use a trusted TLS certificate for a production deployment. Change the initial password after the first login and store it securely.

## 5. Register the kind cluster

Make sure the `kubectl` context for the kind cluster is selected:

```bash
kubectl config get-contexts
kubectl config use-context kind-argocd-cluster
```

Register it with Argo CD:

```bash
argocd cluster add kind-argocd-cluster --name argocd-cluster
argocd cluster list
```

This grants Argo CD access to deploy to the registered cluster. Review the permissions created by this step before using the setup beyond a learning environment.

## 6. Connect the Git repository

Clone the application repository and open its Argo CD configuration directory:

```bash
git clone https://github.com/alokmishra1807/Chat-app.git
cd Chat-app/argocd
```

The repository's `argocd/` directory contains `root-app.yml` and the child Application definitions. The root Application points Argo CD at the Git-managed application configuration, so the child Applications can deploy the frontend, backend, and database resources into `chat-app-ns`.

Confirm that `root-app.yml` contains the correct repository URL, target cluster, namespace, and manifest path for your repository layout before applying it.

## 7. Deploy with the root Application

Create the application namespace if it is not already managed by your manifests:

```bash
kubectl create namespace chat-app-ns
```

Apply the root Application:

```bash
kubectl apply -f root-app.yml -n argocd
```

Check the Applications and workloads:

```bash
argocd app list
kubectl get applications -n argocd
kubectl get all -n chat-app-ns
```

Argo CD will compare the desired state in Git with the live cluster state and sync the manifests according to each Application's sync policy. With automated sync enabled, changes committed and pushed to the tracked Git branch can be applied without manually running `kubectl apply` for each workload.

## 8. Continuous delivery workflow

1. Make an application or Kubernetes-manifest change in the Git repository.
2. Commit and push the change to the branch tracked by the Argo CD Application.
3. Argo CD detects the new Git revision and compares it with the cluster.
4. Argo CD syncs the changed resources, either automatically (if configured) or when you trigger a sync.
5. Verify the sync and workload rollout.

For container image updates, ensure the manifest's image tag changes in Git, or configure an image updater separately. Argo CD does not automatically rebuild an image; image building and pushing are typically handled by CI (for example, Jenkins), while Argo CD handles deployment from the desired state in Git.

## 9. Useful checks

```bash
# Argo CD application status
argocd app list
argocd app get root-app

# Kubernetes resources
kubectl get applications -n argocd
kubectl get pods,deployments,services -n chat-app-ns
kubectl get endpoints -n chat-app-ns

# Application logs
kubectl logs -n chat-app-ns deploy/backend-app-deployment --tail=100
kubectl logs -n chat-app-ns deploy/frontend-app-deployment --tail=100

# Argo CD controller/server logs
kubectl logs -n argocd deploy/argocd-application-controller --tail=100
kubectl logs -n argocd deploy/argocd-server --tail=100
```

## Notes

- The service ports shown in the cluster were `5001` for the backend, `2001` for the frontend, and `8001` for MongoDB. These are Kubernetes Service ports; they do not by themselves expose the services outside the cluster.
- Keep database credentials in Kubernetes Secrets or an external secret manager, not in plain-text manifests committed to Git.
- This is a learning setup on `kind`. For production, use a managed Kubernetes cluster, secure Argo CD ingress/TLS, least-privilege access, and a controlled secrets-management solution.
