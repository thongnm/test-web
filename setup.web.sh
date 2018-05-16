# install nodejs and npm
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# go to home folder (/home/ubuntu)
cd ~
# clone source code from git, update your [username] and [password] to access git
rm -r -f test-web
git clone -b master https://github.com/thongnm/test-web.git

# Copy nginx config file
sudo cp test-web/default.conf /etc/nginx/conf.d/
# Remove default config
sudo rm /etc/nginx/sites-enabled/default
# Reload nginx 
sudo systemctl reload nginx

# install node_modules
cd test-web
npm install
# run build app
npm run build

# install pm2
sudo npm install -g pm2

## Start server 
pm2 start server.js 