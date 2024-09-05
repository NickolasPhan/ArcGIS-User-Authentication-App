const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

async function get_accessToken(refreshToken) {
    const url = 'https://www.arcgis.com/sharing/rest/oauth2/token?client_id=raIlJpkSMoStBPOs&grant_type=refresh_token&refresh_token=' + refreshToken

    return new Promise((resolve) => {
        https.get(url, res => {
            let data = [];
    
            res.on('data', chunk => {
                data.push(chunk);
            }); // end https_res.on data
    
            res.on('end', () => {
                var content = JSON.parse(Buffer.concat(data).toString());
                // console.log('\n' + content.access_token + '\n');
    
                fs.writeFile('./access_token.txt', JSON.stringify(content, null, 4), err => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log("Access token file written successfully");
                    } // end if else
                }) // end writeFile
    
                resolve(content.access_token);
            }) // end https_res.on end
        }).on('error', err => {
            console.log("Error: " + err.message);
        }); // end https.get
    }); // end return Promise
} // end get_accessToken

app.post('/', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    let access_token = await get_accessToken(req.body.refreshToken);

    // res.sendStatus(200);
    res.send({'Access Token': access_token});
}); // end app.get

app.listen(port, () => {
    console.log("Server for reading and writing ArcGIS access token.")
    console.log(`Listening on port ${port}`);
});