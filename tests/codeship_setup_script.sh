npm install -g phantomjs
npm install -g casperjs
nvm install 0.10.33
nvm use 0.10.33
curl -o meteor_install_script.sh https://install.meteor.com/
chmod +x meteor_install_script.sh
sed -i "s/type sudo >\/dev\/null 2>&1/\ false /g" meteor_install_script.sh
./meteor_install_script.sh
export PATH=$PATH:~/.meteor/
cd ../meteor
nohup bash -c "meteor 2>&1 &" && sleep 150; cat nohup.out
