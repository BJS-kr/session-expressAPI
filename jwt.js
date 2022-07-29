const YELLOW = "\x1b[33m";
const BLUE= "\x1b[34m";
const MAGENTA = "\x1b[35m";
const WHITE = "\x1b[37m";
const RED = "\x1b[31m";

function makeJWTStructure(jwt, name) {
  return jwt.split('.').reduce((jwtObj, curr, i) => {
    i === 0 && (jwtObj.structure.head = curr);
    i === 1 && (jwtObj.structure.body = curr);
    i === 2 && (jwtObj.structure.tail = curr);

    return jwtObj;
  }, {
    original: jwt,
    name,
    structure:{}
  })
}

function generateCompareString(length1, length2) {
 return `${WHITE + length1} ${length1 === length2 ? YELLOW + '==' : MAGENTA + '!='} ${WHITE + length2}`
}

function compareLength(firstJWT, secondJWT) {
  const { structure:{ head:FH, body:FB, tail:FT } } = firstJWT;
  const { structure:{ head:SH, body:SB, tail:ST } } = secondJWT;

  const [FTTL, FHL, FBL, FTL] = [firstJWT.original.length, FH.length, FB.length, FT.length];
  const [STTL, SHL, SBL, STL] = [secondJWT.original.length, SH.length, SB.length, ST.length];
  console.log(BLUE,'Total length comparison: ', generateCompareString(FTTL, STTL));
  console.log(BLUE, 'Head length comparison: ', generateCompareString(FHL, SHL));
  console.log(BLUE, 'Body length comparison: ', generateCompareString(FBL, SBL));
  console.log(BLUE, 'Tail length comparison: ', generateCompareString(FTL, STL));
}

function compareEquality(firstJWT, secondJWT) {
  console.log(' Head equal: ', firstJWT.structure.head == secondJWT.structure.head);
  console.log(' Body equal: ', firstJWT.structure.body == secondJWT.structure.body);
  console.log(' Tail equal: ', firstJWT.structure.tail == secondJWT.structure.tail);
}

function instruct(firstJWT, secondJWT) {
['head', 'body', 'tail'].reduce((instructions, key) => {
  const isSameLength = firstJWT.structure[key].length == secondJWT.structure[key].length;
  const isEqual = firstJWT.structure[key] == secondJWT.structure[key];
  isSameLength !== isEqual && instructions.push(`${RED}> ${key} lengths ${ isSameLength ? 'matches' : 'not matches'} but equality is ${isEqual} <`);

  return instructions
  }, []).forEach(instruction => console.log(instruction))
}

function showAndCompare(firstJWT, secondJWT) {
  console.log(`${firstJWT.name}:\n`, firstJWT.structure,'\n');
  console.log(`${secondJWT.name}:\n`, secondJWT.structure,'\n');
  compareLength(firstJWT, secondJWT);
  compareEquality(firstJWT, secondJWT);
  instruct(firstJWT, secondJWT);
}


const jwt = require('jsonwebtoken');

const withPayload = makeJWTStructure(jwt.sign({session:'HangHae99_JWT'}, 'secret', ), 'wPayload');
const withoutPayload = makeJWTStructure(jwt.sign({}, 'secret'), 'woPayload');

showAndCompare(withPayload, withoutPayload);




