function toBase64(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

const replaceSpecialChars = (b64string) => {
  return b64string.replace(/[=+/]/g, (charToBeReplaced) => {
    switch (charToBeReplaced) {
      case '=':
        return '';
      case '+':
        return '-';
      case '/':
        return '_';
    }
  });
};

const header = {
  alg: 'HS256',
  typ: 'JWT',
};
const b64Header = toBase64(header);
const jwtB64Header = replaceSpecialChars(b64Header);
console.log('the header is: ', jwtB64Header);

const payload = {
  iss: 'a_random_server_name', //information about the server that issued the token
  exp: 872990, // tokens expiry date in milliseconds
  // information about some random user
  name: 'John Bobo',
  email: 'myemail@test.com',
  isHuman: true,
};
// converts payload to base64
const b64Payload = toBase64(payload);
const jwtB64Payload = replaceSpecialChars(b64Payload);
console.log('the payload is: ', jwtB64Payload);

// bring in the crypto module
const crypto = require('crypto');
const createSignature = (jwtB64Header, jwtB64Payload, secret) => {
  // create a HMAC(hash based message authentication code) using sha256 hashing alg
  let signature = crypto.createHmac('sha256', secret);

  // use the update method to hash a string formed from our jwtB64Header a period and
  //jwtB64Payload
  signature.update(jwtB64Header + '.' + jwtB64Payload);

  //signature needs to be converted to base64 to make it usable
  signature = signature.digest('base64');

  //of course we need to clean the base64 string of URL special characters
  signature = replaceSpecialChars(signature);
  return signature;
};
// create your secret to sign the token
const secret = 'super_secret_society';
const signature = createSignature(jwtB64Header, jwtB64Payload, secret);
console.log('the signature is: ', signature);

const jsonWebToken = jwtB64Header + '.' + jwtB64Payload + '.' + signature;
console.log('the JWT is :', jsonWebToken);
