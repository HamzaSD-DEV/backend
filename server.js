const app = require('./app');
const { serverPort } = require('./config/config');
app.listen(serverPort, () => {
    console.log(`Server is running on http://localhost:${serverPort}`);
});