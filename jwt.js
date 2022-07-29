function makeJWTStructure(jwt) {
  return jwt.split('.').reduce((jwtStructure, curr, i) => {
    i === 0 && (jwtStructure.head = curr);
    i === 1 && (jwtStructure.body = curr);
    i === 2 && (jwtStructure.tail = curr);

    return jwtStructure;
  }, {
    original: jwt
  })
}

function compareLength(firstJWT, secondJWT) {
  const [FTT, FH, FB, FT] = [firstJWT.original.length, firstJWT.head.length, firstJWT.body.length, firstJWT.tail.length];
  const [STT, SH, SB, ST] = [secondJWT.original.length, secondJWT.head.length, secondJWT.body.length, secondJWT.tail.length];
  console.log('Total length comparison: ', FTT, FTT === STT ? '==' : '!=', STT);
  console.log('Head length comparison: ', FH, FH === SH ? '==' : '!=', SH);
  console.log('Body length comparison: ', FB, FB === SB ? '==' : '!=', SB);
  console.log('Tail length comparison: ', FT, FT === ST ? '==' : '!=', ST);
}

/**
 * 1. jwt의 원리
 * 2. jwt를 변형했을 때?
 * 3. validate와 decode의 차이
 * 4. payload와 각종 옵션들의 의미
 * 5. jwt는 암호화?
 * 6. jwt에 해쉬알고리즘이 필요한 이유
 * 7. jwt의 용도
 * 8. jwt는 어디에 위치해야 하는가
 */

const jwt = require('jsonwebtoken');
// jwt의 원리
const withPayload = makeJWTStructure(jwt.sign({session:'HangHae99_JWT'}, 'firstSecret', { expiresIn: 0, algorithm: 'HS256' }));
const withoutPayload = makeJWTStructure(jwt.sign({}, 'secondLongerSecret', { expiresIn: '10d', algorithm: 'HS512'}));


console.log({ withPayload }, '\n');
console.log({ withoutPayload }, '\n');
compareLength(withPayload, withoutPayload);




