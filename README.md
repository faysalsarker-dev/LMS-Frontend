# 1. Navigate to the frontend directory
cd /var/www/humanistic-frontend

# 2. Clear out the old deployment files
# Why: To ensure no old cached files or 'ghost' files remain.
sudo rm -rf *

# 3. Unzip the new files (assuming you uploaded dist.zip)
# Why: This extracts the production-ready HTML/JS/CSS.
sudo unzip dist.zip

# 4. Move files out of the 'dist' folder if necessary
# Why: Sometimes the zip creates a 'dist/' subfolder; Nginx looks at the root.
sudo mv dist/* . 2>/dev/null

# 5. Set correct permissions
# Why: Nginx needs 'read' access to show the files to users (prevents 403 Forbidden).
sudo chown -R nginx:nginx /var/www/humanistic-frontend
sudo chmod -R 755 /var/www/humanistic-frontend

# 6. Clean up
sudo rm dist.zip






# 1. Navigate to the backend directory
cd /var/www/humanistic-backend

# 2. Pull latest changes (if using Git) or upload files, then:
# Why: Node.js cannot run .ts files directly; this creates .js files in 'dist/'.
npm run build

# 3. Restart the process with PM2
# Why: PM2 keeps your app running in the background. Restarting loads the new code.
pm2 restart humanistic-api

# 4. Check status and logs
# Why: To verify the server started correctly and is connected to MongoDB.
pm2 status
pm2 logs humanistic-api --lines 30




# Check for syntax errors
# Why: If there is a typo in nginx.conf, Nginx will crash if you restart it.
sudo nginx -t

# Reload configuration (Zero downtime)
# Why: Applies changes without disconnecting current users.
sudo systemctl reload nginx

# Full Restart
# Why: Used if the service is stuck or after major system changes.
sudo systemctl restart nginx




# Test the auto-renewal process
# Why: Verifies that Certbot can talk to the certificate authority.
sudo certbot renew --dry-run

# Manually force a renewal
sudo certbot renew