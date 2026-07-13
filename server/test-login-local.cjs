const { exec } = require('child_process');
const axios = require('axios');

const server = exec('node index.js');

setTimeout(async () => {
    try {
        const res = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'testcustomer@kaari.com',
            password: 'test'
        });
        console.log("Login success:", res.data);
    } catch(err) {
        console.error("Login failed:", err.response?.data || err.message);
    }
    server.kill();
}, 2000);

server.stdout.on('data', console.log);
server.stderr.on('data', console.error);
