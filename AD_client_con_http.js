const http = require('http');
const fs = require('fs'); // To read files
var dgram = require('dgram');
var s = dgram.createSocket('udp4');
s.bind(5004, () => {
    console.log('UDP socket bound to port:', s.address().port);
});
var abody;
var n;
let microresp = ''; 
let newresp=0;  


const server = http.createServer((req, res) => {
    if (req.url === '/') {
// Serve the main HTML page
        fs.readFile('AD index submit.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/submit1' && req.method === 'POST') {
        let body = '';
        let abody='';
        // let n='';
// Collect data from the POST request
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
            abody=decodeURIComponent(body);
           // if(abody!='') n=Number(abody);
              n=Number(abody);
        });
           // Collect data from the POST request
              req.on('end', () => {
            console.log('Received data:', body); // Log data for server-side processing
            console.log('Received ASCII:', abody); // Log data for server-side processing
            console.log('Received number:', n); // Log data for server-side processing
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Data received successfully');
// Send the data to the UDP server
           // s.send(Buffer.from(abody), 5004, '192.168.1.142'); // modem home
              s.send(Buffer.from(abody), 5004, 'alblab2.ddns.net'); // from internet
          //    s.send(Buffer.from(abody), 5001, '37.102.234.194'); // from internet
          //  s.send(Buffer.from(abody), 5004, '192.168.81.75'); // smartphone hot spot
          console.log('UDP socket local port:', s.address().port);
            console.log('Sent data:', abody); // Log data for server-side processing
        });
// update the HTML page with time
    } else if (req.url === '/microresponse' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify({ time: timeString }));
    if (newresp==1) {
        newresp=0;
  //  res.end(microresp);
    let index= microresp.indexOf(': ');
    let nume= microresp.slice(index+2);
    console.log('Received number from microcontroller:', nume); // Log data for server-side processing
    if (n == Number(nume)) { console.log('Number matches:', n, nume); res.end(`Number matches: ${n}, ${nume}`);}
    else { console.log('Number does not match:', n, nume); res.end(`Number does not match: ${n}, ${nume}`);}
    } else {
      //  res.end('No new response from microcontroller');
        console.log('No new response from microcontroller');
    } 
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
// Listen for responses
s.on('message', function (msg, rinfo) {
    microresp = msg.toString();
    console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
    newresp=1;
});
// Optional: Handle errors
s.on('error', function (err) {
    console.error(`Socket error:\n${err.stack}`);
    s.close();
});
