const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    refreshToken = req.body.refreshToken;
    let access_token_link = "https://www.arcgis.com/sharing/rest/oauth2/token?client_id=raIlJpkSMoStBPOs&grant_type=refresh_token&refresh_token=" + refreshToken;

    https.get(access_token_link, https_res => {
        let data = [];

        https_res.on('data', chunk => {
            data.push(chunk);
        }); // end https_res.on data

        https_res.on('end', () => {
            var content = JSON.parse(Buffer.concat(data).toString());
            // console.log(content);

            fs.writeFile('./access_token.txt', JSON.stringify(content, null, 4), err => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("Access token file written successfully");
                } // end if else
            }) // end writeFile
        }) // end https_res.on end
    }).on('error', err => {
        console.log("Error: " + err.message);
    }); // end https.get
    
    res.sendStatus(200);
}); // end app.get

app.listen(port, () => {
    console.log("Server for reading and writing ArcGIS access token.")
    console.log(`Listening on port ${port}`);
});