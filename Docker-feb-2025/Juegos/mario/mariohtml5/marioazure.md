# Azure Container Registry (ACR) - Deploying a Custom Nginx Container

## 🚀 Objective
This guide walks you through:
1. Creating an **Azure Container Registry (ACR)**.
2. Building a **custom Nginx container with a custom HTML page**.
3. Pushing the image to **myacrdemo01.azurecr.io**.
4. Deploying the container on **Azure Container Instances (ACI)**.

---

## 🔹 Step 1: Login to Azure
```sh
az login
```
If you have multiple subscriptions, set the correct one:
```sh
az account set --subscription "YOUR_SUBSCRIPTION_NAME"
```

---

## 🔹 Step 2: Create Azure Container Registry (ACR)
```sh
az group create --name ACRDemoRG --location "East US"
az acr create --resource-group ACRDemoRG --name myacrdemo01 --sku Basic
```
Ensure **Admin User** is enabled:
```sh
az acr update --name myacrdemo01 --admin-enabled true
```

---

## 🔹 Step 3: Login to ACR
```sh
az acr login --name myacrdemo01
```
For manual authentication:
```sh
az acr credential show --name myacrdemo01
docker login myacrdemo01.azurecr.io
```
Enter the username and password retrieved from `az acr credential show`.

---

## 🔹 Step 4: Build and Tag the Image
1. **Check if the local image exists**:
   ```sh
   docker images
   ```
2. **Tag the image for ACR**:
   ```sh
   docker tag my-nginx myacrdemo01.azurecr.io/my-nginx:v1
   ```
3. **Verify the new tag**:
   ```sh
   docker images
   ```
   It should display:
   ```
   REPOSITORY                          TAG      IMAGE ID       CREATED
   myacrdemo01.azurecr.io/my-nginx     v1       abc123456789   10 minutes ago
   ```

---

## 🔹 Step 5: Push Image to ACR
```sh
docker push myacrdemo01.azurecr.io/my-nginx:v1
```
Verify if the image is available in ACR:
```sh
az acr repository list --name myacrdemo01 --output table
```

---

## 🔹 Step 6: Deploy to Azure Container Instances (ACI)
```sh
az container create \
  --resource-group ACRDemoRG \
  --name my-nginx-container \
  --image myacrdemo01.azurecr.io/my-nginx:v1 \
  --dns-name-label mynginxdemo01 \
  --ports 80
```

---

## 🔹 Step 7: Get the Container's Public URL
```sh
az container show --resource-group ACRDemoRG --name my-nginx-container --query ipAddress.fqdn --output tsv
```
Copy the **FQDN** and open it in your browser. It should display:
👉 **"Hola, esta es mi aplicación en Docker"**

---

## 🔹 Step 8: (Optional) Cleanup Resources
To avoid unnecessary charges, delete the resources:
```sh
az group delete --name ACRDemoRG --yes --no-wait
```

---

## 🎯 Summary
1. **Login to Azure and ACR** (`myacrdemo01`)
2. **Tag and push the image** to ACR
3. **Deploy to Azure Container Instances (ACI)**
4. **Access the running container via public URL**

---

