#!/bin/bash
# SSL Setup Script for EC2 Instance with Nginx and Let's Encrypt

set -e

echo "======================================"
echo "Setting up Nginx with SSL (Let's Encrypt)"
echo "======================================"

# Update system
sudo apt-get update

# Install Nginx
sudo apt-get install -y nginx

# Install Certbot for Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx

# Get the EC2 public hostname
EC2_HOSTNAME=$(ec2metadata --public-hostname 2>/dev/null || curl -s http://169.254.169.254/latest/meta-data/public-hostname)
echo "EC2 Hostname: $EC2_HOSTNAME"

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/tour-blog > /dev/null <<EOF
server {
    listen 80;
    server_name $EC2_HOSTNAME;

    # Frontend - serve from local if needed, or proxy to S3
    location / {
        # Option 1: Redirect to S3 frontend
        return 301 http://tour-blog-frontend-295054972.s3-website-us-east-1.amazonaws.com\$request_uri;
        
        # Option 2: Proxy to backend API (uncomment if you want API on root)
        # proxy_pass http://localhost:5000;
        # proxy_http_version 1.1;
        # proxy_set_header Upgrade \$http_upgrade;
        # proxy_set_header Connection 'upgrade';
        # proxy_set_header Host \$host;
        # proxy_cache_bypass \$http_upgrade;
        # proxy_set_header X-Real-IP \$remote_addr;
        # proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        # proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/api/test;
        proxy_http_version 1.1;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/tour-blog /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "======================================"
echo "Nginx installed and configured!"
echo "======================================"
echo ""
echo "Your site is now accessible at:"
echo "  HTTP: http://$EC2_HOSTNAME"
echo "  API:  http://$EC2_HOSTNAME/api"
echo ""
echo "======================================"
echo "IMPORTANT: SSL/HTTPS Setup"
echo "======================================"
echo ""
echo "Let's Encrypt SSL CANNOT be used with AWS EC2 auto-generated domains"
echo "(*.compute-1.amazonaws.com) because:"
echo "  1. You don't own the domain"
echo "  2. Let's Encrypt won't issue certificates for it"
echo ""
echo "To enable HTTPS, you need to:"
echo "  1. Purchase a domain name (e.g., from Route 53, Namecheap, etc.)"
echo "  2. Point domain to this EC2 IP: 13.218.231.9"
echo "  3. Update Nginx config with your domain"
echo "  4. Run: sudo certbot --nginx -d yourdomain.com"
echo ""
echo "For now, use HTTP URLs or the S3 frontend:"
echo "  Backend API: http://13.218.231.9:5000/api"
echo "  Frontend:    http://tour-blog-frontend-295054972.s3-website-us-east-1.amazonaws.com"
echo ""
echo "======================================"
