// http and handlers
const http = require('http');
const htmlHandler = require('./htmlResponses.js');
//const respondHandler = require('./responses.js');

// Port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// url struct to easily handle responses
const urlStruct ={
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCss,
    getIndex: htmlHandler.getIndex
}

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    const handler = urlStruct[parsedUrl.pathname];
    if(handler){
        handler(request, response);
    } 
    else{
        urlStruct.getIndex(request, response);
    }
};

// Create Server 
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});