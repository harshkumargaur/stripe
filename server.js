const http = require('http');
const app = require('./app');
const server = http.createServer(app); 



// console.log(stripePublicKey,stripeSecretKey);

server.listen(3000,(req,res)=>{
    console.log('listening on port 3000');
})