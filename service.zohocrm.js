const request = require('request');
const fs = require('fs');

const baseURL = process.env.BASE_URL;
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const baseUrl = process.env.BASE_URL;
const accessToken = process.env.ZOHO_ACCESS_TOKEN;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

// CREATE URL
function getCRMURL() {
    console.log('Getting CRM data...');
    const baseURL = process.env.BASE_URL
    const clientId = process.env.ZOHO_CLIENT_ID;

    // ZOHO CRM URL
    const zohoUrl = process.env.ZOHO_API_AUTH+"?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&client_id="+clientId+"&response_type=code&access_type=offline&redirect_uri="+baseURL

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
      'url': process.env.ZOHO_API_TOKEN,
      formData: data
    };
  
    request(options, function (error, response, body) {
      if (error) {
        console.error('Error:', error);
        if (typeof callback === 'function') {
          return callback(error); // Pass the error to the callback if it's a function
        }
      }
      
      var token = {
        'status': true,
        'message': 'success',
        'body': JSON.parse(body)
      };

      if (typeof callback === 'function') {
        return callback(null, token); // Pass the token to the callback if it's a function
      }

    });
}

// GET REFRESH TOKEN
function getAccessTokenRefreshToken(callback) {
    var data = {
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token'
    };
  
    var options = {
      'method': 'POST',
      'url': process.env.ZOHO_API_TOKEN,
      formData: data
    };
  
    request(options, function (error, response, body) {
      if (error) {
        console.error('Error:', error);
        if (typeof callback === 'function') {
          return callback(error); // Pass the error to the callback if it's a function
        }
      }

      var bodyData = JSON.parse(body)
      var status = true
      var msg = 'success'

      if(Object.keys(bodyData).length > 0){
        if('error' in bodyData){
          status = false
          msg = bodyData.error
        }
      } 

      console.log('JSON.parse(body)=',bodyData)
      
      var token = {
        'status': status,
        'message': msg,
        'body': JSON.parse(body)
      };

      if (typeof callback === 'function') {
        return callback(null, token); // Pass the token to the callback if it's a function
      }

    });
}

// ADD CONTACT
function addContact(Email,Last_Name, callback) {
  getAccessTokenRefreshToken(function (tokenError, token) {
    // console.error('Error getting access token:', tokenError, token.status);
    if (!token.status) {

      var data = {
        'status': false,
        'message': token.message,
        'body': ''
      };
    
      if (typeof callback === 'function') {
        return callback(null, data);
      }

    } else {
        var options = {
          'method': 'POST',
          'url': process.env.ZOHO_API_CONTACTS,
          'headers': {
            'Authorization': 'Zoho-oauthtoken '+token.body.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "data": [{
              Email: Email,
              Last_Name: Last_Name
            }]
          })
        };
        request(options, function (error, response, body) {
          if (error) {
            console.error('Error:', error);
            if (typeof callback === 'function') {
              return callback(error); // Pass the error to the callback if it's a function
            }
          }
    
          const resData = JSON.parse(body)
          console.log('addContact resData=',resData)
          
          var data = {
            'status': true,
            'message': resData.data[0].message+' '+Email,
            'body': resData,
            'Email': Email,
            'Last_Name': Last_Name,
          };
    
          if (typeof callback === 'function') {
            return callback(null, data);
          }
    
        });
      }
    })
  
}
  
// Export the functions to make them accessible from other files
module.exports = {
    getCRMURL,
    getAccessToken,
    getAccessTokenRefreshToken,
    addContact
};