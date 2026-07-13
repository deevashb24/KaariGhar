import axios from 'axios';

async function test() {
    try {
        const res = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'testcustomer@kaari.com',
            password: 'test'
        });
        console.log("Login success:", res.data);
    } catch(err) {
        console.error("Login failed:", err.response?.data || err.message);
    }
}
test();
