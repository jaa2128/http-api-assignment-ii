// object to contain book object
const fs = require('fs');
const rawData = fs.readFileSync(`${__dirname}/../src/books.json`);
const books = JSON.parse(rawData);

// error messages
const responses = {
    'notFound' : {
        message: 'The page you are looking for was not found',
        id: 'notFound'
    },
    'created' : {
        message: 'Created Successfully'
    },
    'badRequest': {
        message: 'Name and age are both required.',
        id: 'addUserMissingParams'
    }
};

// function to respond with a JSON object
const respondJSON = (request, response, status, object) => {
    
    const content = JSON.stringify(object);

    // Set Headers including the type and length
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    // only write content if it is not a head request
    if(request.method !== 'HEAD'){
        response.write(content);
    }
    
    response.end();
}

// return user object as JSON
const getUsers = (request, response) => {
    respondJSON(request, response, 200, books);
}

const notFound = (request, response) => {
    respondJSON(request, response, 404, responses['notFound']);
}

const addUsers = (request, response) => {
    let isNewUserCreated = false;

    // use JS destructing to easily grab request's body
    const {name, age} = request.body;

    // make sure that both fields exist otherwise send proper response
    if(!name || !age){
        return respondJSON(request, response, 400, responses['badRequest']);
    }

    // check if the user exists, if it doesn't, create new user
    if(!books[name]){

        books[name] = {
            name: name,
        };

        // new user is created
        isNewUserCreated = true;
    }

    // add or update age for this user name
    books[name].age = age;

    // If a new user was created send 201 response
    if(isNewUserCreated){
        return respondJSON(request, response, 201, responses['created']);
    }

    // If the user existed and was updated, send 204 response with no body
    return respondJSON(request, response, 204, {});
}

module.exports = {
    getUsers,
    notFound,
    addUsers
}
