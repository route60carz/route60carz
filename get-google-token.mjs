import http from 'http';
import url from 'url';
import { google } from 'googleapis';
import fs from 'fs';

// IMPORTANT: Replace with your actual Client ID and Secret before running this script.
// These values should NOT be committed to Git.
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
// Make sure this exact URI is added in your Google Cloud Console "Authorized redirect URIs"
const REDIRECT_URI = 'http://localhost:3001/oauth2callback';

console.log('IMPORTANT: If you set up your OAuth Client as a "Web application",');
console.log(`make sure you add ${REDIRECT_URI} to 'Authorized redirect URIs' in Google Cloud Console.\n`);

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    // Scope required to send email
    scope: ['https://mail.google.com/'],
    prompt: 'consent' // Forces consent screen to get refresh_token
});

const server = http.createServer(async (req, res) => {
    if (req.url && req.url.startsWith('/oauth2callback')) {
        const q = new url.URL(req.url, 'http://localhost:3001').searchParams;
        const code = q.get('code');
        const error = q.get('error');

        if (error) {
            res.end(`Error: ${error}`);
            console.error('\n❌ Error from Google:', error);
            process.exit(1);
        }

        if (code) {
            try {
                const { tokens } = await oauth2Client.getToken(code);
                console.log('\n✅ SUCCESS! Received Tokens.');
                console.log('Refresh Token:', tokens.refresh_token);

                if (tokens.refresh_token) {
                    const envPath = '.env.local';
                    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

                    const newVars = `\nGOOGLE_CLIENT_ID=${CLIENT_ID}\nGOOGLE_CLIENT_SECRET=${CLIENT_SECRET}\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\nEMAIL_USER=route60carzz@gmail.com\n`;

                    fs.appendFileSync(envPath, newVars);
                    console.log('\n📝 Automatically saved the credentials to your .env.local file!');
                    res.end('Success! You can close this tab and return to the terminal.');
                } else {
                    console.log('\n⚠️ Could not get a refresh token. Maybe you already consented? Try completely deleting the app from your Google Account connection settings and trying again.');
                    res.end('Oops! No refresh token found. Check console.');
                }

                setTimeout(() => process.exit(0), 1000);
            } catch (e) {
                console.error('Error getting tokens:', e);
                res.end('Error getting tokens. Check console.');
                setTimeout(() => process.exit(1), 1000);
            }
        } else {
            res.end('No code found in URL.');
        }
    }
}).listen(3001, () => {
    console.log('=== Google OAuth2 Authentication Generator ===');
    console.log('\n1. Open the following URL in your browser:');
    console.log('\n\x1b[36m%s\x1b[0m', authorizeUrl);
    console.log('\n2. Sign in with route60carzz@gmail.com and approve the permissions.');
    console.log('3. Waiting for authentication callback on port 3001...');
});
