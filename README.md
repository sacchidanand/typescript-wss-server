# typescript-wss-server
typescript-wss-server

Reinstall
rm -rf node_modules package-lock.json
npm install

rm -rf dist
npm run build

npm run dev


1. How to run the project
npm install ws
npm install --save react react-dom
rm -rf node_modules package-lock.json
npm install

#Compile 
npx tsc -b
#run java script
node dist/server.js

npm run dev
OR
npm install --save-dev concurrently

2. How to test from client

- Open browser console and type below

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => ws.send('Hello from Client 1!');

ws.onmessage = (event) => console.log(event.data);

3. Install express
npm install express @types/express

npx tsc -b; node dist/server.js