
### Production Setup Guide

#### 1. Connect to the VPS
   - SSH into the VPS as the root user. You can use either Putty or your terminal to do this:
     ```bash
     ssh root@your_vps_ip
     ```
   - Enter the root password when prompted.

#### 2. Create the `Caddyfile`
   - In the root directory, create a `Caddyfile`.
   - You can refer to the example configuration in the `Caddyfile` provided. This configuration is essential for enabling SSH access in the production environment.

#### 3. Sign into Portainer
   - Open Portainer in your web browser and log in.
   - Locate the app's container, pull the latest version, and redeploy it to apply the changes.

