const request = require('request');
const fs = require('fs');

const baseURL = process.env.BASE_URL;
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const baseUrl = process.env.BASE_URL;

// CREATE URL
function getCRMURL() {
    console.log('Getting CRM data...');
    const baseURL = process.env.BASE_URL
    const clientId = process.env.ZOHO_CLIENT_ID;

    // ZOHO CRM URL
    const zohoUrl = "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&client_id="+clientId+"&response_type=code&access_type=offline&redirect_uri="+baseURL

    return zohoUrl
}

// GET ACCESS TOKEN
function getAccessToken(code, callback) {
    var data = {
      'grant_type': 'authorization_code',
      'client_id': clientId,
      'client_secret': clientSecret,
      'redirect_uri': baseUrl,
      'code': code
    };
  
    var options = {
      'method': 'POST',
      'url': 'https://accounts.zoho.com/oauth/v2/token',
      formData: data
    };
  
    request(options, function (error, response, body) {
      if (error) {
        console.error('Error:', error);
        if (typeof callback === 'function') {
          return callback(error); // Pass the error to the callback if it's a function
        }
      }
  
      fs.writeFile(process.env.ZOHO_TOKEN_FILE, body, (err) => {
        if (err) {
          console.error('Error writing JSON file:', err);
          if (typeof callback === 'function') {
            return callback(err); // Pass the error to the callback if it's a function
          }
        }
  
        console.log('Data saved to data.json');
  
        var token = {
          'status': true,
          'message': 'success',
          'url': body
        };
  
        if (typeof callback === 'function') {
          return callback(null, token); // Pass the token to the callback if it's a function
        }
      });
    });
}
  
  // Export the functions to make them accessible from other files
module.exports = {
    getCRMURL,
    getAccessToken
};
  