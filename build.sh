sudo docker rm -f ecgeditor
sudo docker rmi -f ecgeditor

npm install

cd node_modeles_ext/connect-redis/
npm install

cd ../express-session/
npm install

 cd ../../

sudo docker build -t ecgeditor .
sudo docker  run -d --name ecgeditor -p 24000:24000 ecgeditor