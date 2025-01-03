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

#### 3. Sign into Portainer
   - Open Portainer in your web browser and log in.
   - Locate the app's container, pull the latest version, and add the env variables and redeploy it to apply the changes.

