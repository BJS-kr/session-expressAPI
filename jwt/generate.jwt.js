// www.telerik.com/blogs/json-web-token-jwt-implementation-using-nodejs를 번역했습니다.

/**
 * 1. base64 encoded header를 만듭니다.
 * 2. base64 encoded payload를 만듭니다.
 * 3. header, payload, secret을 사용해 signature를 만듭니다.
 * 4. header, payload, signature를 합칩니다.
 */

// 아래의 구현은 HS256 algorithm을 사용합니다.

/**
 * 0. base64 인코딩 함수
 */
function toBase64(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

// base64 문자열 중 특정 symbol들은 URL에 사용되었을때 오류를 일으킬 수 있습니다.
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

/**
 * 1. header 생성
 */
const header = {
  alg: 'HS256',
  typ: 'JWT',
};

const b64Header = toBase64(header);
const jwtB64Header = replaceSpecialChars(b64Header);
console.log('the header is: ', jwtB64Header);

/**
 * 2. payload 생성
 */
const payload = {
  iss: 'a_random_server_name',
  exp: 872990,
  name: 'John Bobo',
  email: 'myemail@test.com',
  isHuman: true,
};

const b64Payload = toBase64(payload);
const jwtB64Payload = replaceSpecialChars(b64Payload);
console.log('the payload is: ', jwtB64Payload);

/**
 * 3. header, payload, secret을 사용하여 signature 생성
 */
// 아래의 코드는 nodejs의 api를 따르므로, 공식문서를 참조하시길 바랍니다.
// https://nodejs.org/api/crypto.html#class-hmac
const crypto = require('crypto');
const createSignature = (jwtB64Header, jwtB64Payload, secret) => {
  // HS256은 HMAC SHA-256임을 기억합시다.
  /**
   * HMAC이란?
   * HMAC은 hash based message authentication code의 약어입니다.
   * 이름에서도 알 수 있듯, message의 유효성을 검사하기 위해 사용됩니다.
   * 사전에 client와 server가 공유한 secret으로 MAC을 생성합니다.
   * client는 message와 MAC을 모두 server로 전송하며,
   * 서버 요청이 도착하면 message와 secret으로 MAC을 생성후 비교합니다.
   * 이 때, MAC이 일치한다면 메세지가 중간에 위변조되지 않은 것으로 판단하는 것입니다.
   * HMAC도 동작 순서는 완전히 같으나, hash를 생성 후 비교하기 때문에 HMAC이라는 이름이 붙은 것입니다.
   * message가 전송 중에 숨겨지는 것은 아니기에, https 통신이 필수로 여겨진다.
   */

  let signature = crypto.createHmac('sha256', secret);

  signature.update(jwtB64Header + '.' + jwtB64Payload);

  signature = signature.digest('base64');

  signature = replaceSpecialChars(signature);
  return signature;
};
// create your secret to sign the token
const secret = crypto.randomBytes(32);
console.log('secret: ', secret);
const signature = createSignature(jwtB64Header, jwtB64Payload, secret);
console.log('the signature is: ', signature);
const jsonWebToken = jwtB64Header + '.' + jwtB64Payload + '.' + signature;
console.log('the JWT is :', jsonWebToken);
