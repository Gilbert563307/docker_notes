# Pushing to Production

Follow these steps to deploy your project to production:

### 1. Test with Local Docker-Compose Production

Before pushing to production, ensure everything works as expected by running the production Docker Compose file locally.

```bash
docker-compose -f docker-compose-prod.yml up
```

If the local environment runs without issues, you can proceed to deploy.

### 2. Deploying to the Production Server

To deploy your code to the production server, use the `scp` (secure copy) command to transfer your files.

#### Command Format:

```bash
scp -r "path_to_local_repo" root@{server_ip}:~/docker_notes
```

- Replace `path_to_local_repo` with the actual path of your repository on your local machine.
- Replace `{server_ip}` with the IP address of your production server.
- The folder `~/docker_notes` should already exist on the server, as this is where your files will be copied.


3.
After that build the container on the vps(server) with docker compose -f docker-compose-prod.yaml build
then run  docker compose up 


### 10. Notes:

- Always make sure the `docker-compose-prod.yml` file reflects your production setup correctly.
- Ensure you have appropriate SSH access to the server.
- Test thoroughly in the local environment before transferring to production.

---
