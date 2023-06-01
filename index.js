require('dotenv').config();

const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Require the service.zohocrm.js file
const zohoCRMService = require('./service.zohocrm');

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const baseUrl = process.env.BASE_URL;
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

            if (queryParameters.Email && queryParameters.Last_Name) {
                zohoCRMService.addContact(queryParameters.Email,queryParameters.Last_Name, function (error, contactRes) {
                    if (error) {
                        console.error('Getting error: ', error);
                    } else {
                        res.end('<html>'+
                        '<h4>'+contactRes.message+'</h4>'+
                        '<form action="'+baseUrl+'" method="get">'+
                            'Email: <input type="email" name="Email" value="'+contactRes.Email+'" />'+
                            ' Last Name: <input type="text" name="Last_Name" value="'+contactRes.Last_Name+'" />'+
                            ' <button type="submit">Submit</button>'+
                        '</form>'+
                    '</html>')
                    }
                });
            } else {
                var errorMsg = ''
                if(queryParameters.Email == '' && queryParameters.Last_Name == ''){
                    errorMsg = '<h4>Both fields are required</h4>'
                }
                res.end('<html>'+errorMsg+
                    '<form action="'+baseUrl+'" method="get">'+
                        'Email: <input type="email" name="Email" />'+
                        ' Last Name: <input type="text" name="Last_Name" />'+
                        ' <button type="submit">Submit</button>'+
                    '</form>'+
                '</html>');
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