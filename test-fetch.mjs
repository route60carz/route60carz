fetch('https://google.com').then(r => console.log('google status:', r.status)).catch(console.error);
fetch('https://api.github.com').then(r => console.log('github status:', r.status)).catch(console.error);
