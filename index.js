require('dotenv').config();

const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Require the service.zohocrm.js file
const zohoCRMService = require('./service.zohocrm');

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const queryParameters = querystring.parse(parsedUrl.query);

    if (queryParameters.code) {
        const code = queryParameters.code;
        console.log('Code:', code);
        // const getToken = zohoCRMService.getAccessToken(code)
        
        const getToken = zohoCRMService.getAccessToken(code, function (error, token) {
            if (error) {
                console.error('Error getting access token:', error);
            } else {
                // console.log('getToken:', token.body.access_token);
                res.end('code'+token.body.access_token);
            }
        });


    } else {
        res.statusCode = 302;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Location', zohoCRMService.getCRMURL()); // Set the URL to redirect to
        res.end();
    }

});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});