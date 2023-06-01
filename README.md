# zohocrm-api-integration

## Follow these commands, if you dont already have a refresh token for your project.

1. Clone this repository
2. Go to the project directory through command line and copy .env.example to .env
3. Paste ClientID and Client Secret from Zoho Client in .env
4. Run <code>npm install</code>
5. Run <code>node index.js</code>
6. Click the link on your app at http://localhost:3000
7. Approve your zoho account access
8. You will get back to a localhost screen. Copy ZOHO_ACCESS_TOKEN and ZOHO_REFRESH_TOKEN in your .env
9. Restart your application Ctrl+C and then run <code>node index.js</code> again.
10. Re-open your app at http://localhost:3000
11. Fill the email and last name. Both of these fields are mandatory in zoho crm. You cannot leave empty any of them.
12. Click Submit and this contact will get created in Zoho CRM

## Follow these commands, if already have a refresh token and you want to use this service in a pre-existing application

1. Copy ZOHO_REFRESH_TOKEN in your .env
2. Copy service.zohocrm.js in your project
3. import service.zohocrm.js e.g. <code>const zohoCRMService = require('./service.zohocrm');</code>
4. Use this code, where you have data and you want to create a contact in nodejs
<code>
  zohoCRMService.addContact(<email>, <lastname>, function (error, contactRes) {
    if (error) {
      console.error('Error getting access token:', error);
     } else {
      res.end(contactRes.message);
     }
  });
  <code>
