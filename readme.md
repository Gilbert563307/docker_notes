### Debelopment Setup Guide
1.docker-compose -f "docker-compose-dev.yaml" build
2.docker-compose -f "docker-compose-dev.yaml" up


### Production Setup Guide

#### 1. Connect to the VPS
   - SSH into the VPS as the root user. You can use either Putty or your terminal to do this:
     ```bash
     ssh root@your_vps_ip
     ```
   - Enter the root password when prompted.



### ✅ **Steps to Deploy a Stack via GitHub Repository in Portainer**

#### **1. Sign into Portainer**

* Open Portainer in your web browser.
* Log in with your admin credentials.

#### **2. Navigate to the Stacks Section**

* In the left-hand sidebar, click on **"Stacks"**.
* Click **"Add Stack"**.

#### **3. Configure Stack Settings**

* **Name** your stack:
  `docker_notes_live_production`

#### **4. Set Build Method**

* Under **"Build Method"**, choose:
  **Repository**

#### **5. Configure Git Repository Settings**

* **Enable Authentication**.

* **GitHub Username**: Enter your GitHub username.

* **GitHub Access Token**:
  Paste your [personal access token (PAT)](https://github.com/settings/tokens)

  > ⚠️ This token **expires every 30 days** if using fine-grained tokens. You may need to generate a new one periodically.
  > Required permissions:
  >
  > * `contents` (**read/write**)
  > * `deployments` (**read/write**)
  > * `pull requests` (**read**)
  > * `workflows` (**read/write**)

* **Repository URL**:
  Add the full HTTPS link to your GitHub repo, e.g.:
  `https://github.com/your-username/your-repo.git`

* **Reference (branch/tag)**:
  Use the full Git reference, for example:
  `refs/heads/main-dev`
  *(This means you're deploying from the `main-dev` branch.)*

* **Compose Path**:
  Specify the relative path to your Docker Compose file in the repo:
  `docker-compose-prod.yaml`

---

#### **6. Set Environment Variables**

* Scroll down to the **Environment Variables** section.
* Manually add all required variables from your `.env` files:

  * Include **both frontend and backend** environment variables.
  * Use the **same keys and values** as in your local `.env` files.

---

#### **7. Deploy the Stack**

* Double-check all information.
* Click **"Deploy the Stack"**.


