require('dotenv').config();

const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Require the service.zohocrm.js file
const zohoCRMService = require('./service.zohocrm');

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const accessToken = process.env.ZOHO_ACCESS_TOKEN;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const queryParameters = querystring.parse(parsedUrl.query);

    if (queryParameters.code) {
        const code = queryParameters.code;
        console.log('Code:', code);
        // const getToken = zohoCRMService.getAccessToken(code)
        
        if(accessToken != '' && refreshToken != ''){

            res.statusCode = 302;
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Location', '/'); // Set the URL to redirect to
            res.end();

        } else {

            zohoCRMService.getAccessToken(code, function (error, token) {
                if (error) {
                    console.error('Error getting access token:', error);
                } else {
                    // console.log('getToken:', token.body.access_token);
                    res.end('Kindly update ZOHO_ACCESS_TOKEN='+token.body.access_token+' and ZOHO_REFRESH_TOKEN='+token.body.refresh_token+' in your .env file.');
                }
            });

        }
        


    } else {
        if(accessToken != '' && refreshToken != ''){
            
            const parsedUrl = url.parse(req.url);
            const queryParameters = querystring.parse(parsedUrl.query);

            if (queryParameters.email) {
                const formData = {
                    Email: queryParameters.email,
                    Last_Name: queryParameters.last_name,
                }
                zohoCRMService.addContact(formData, function (error, contactRes) {
                    if (error) {
                        console.error('Error getting access token:', error);
                    } else {
                        res.end(contactRes.message);
                    }
                });
            } else {
                res.end('email and last_name field is required');
            }

        } else {
            if(clientId != '' && clientSecret != ''){
                res.statusCode = 302;
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Location', zohoCRMService.getCRMURL()); // Set the URL to redirect to
                res.end();
            } else {
                res.end('Kindly update ZOHO_CLIENT_ID="" and ZOHO_CLIENT_SECRET="" in your .env file.');
            }
        }
    }

});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});