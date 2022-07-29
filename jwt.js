const YELLOW = "\x1b[33m";
const BLUE= "\x1b[34m";
const MAGENTA = "\x1b[35m";
const WHITE = "\x1b[37m";
const RED = "\x1b[31m";
const parts = ['Head', 'Body', 'Tail'];

function getPartsValue(JWTStructure) {
  return [JWTStructure.structure.Head, JWTStructure.structure.Body, JWTStructure.structure.Tail];
}

function doubleMap(arr_1, arr_2, fn) {
  if (arr_1.length !== arr_2.length) throw new Error('doubleMap must called on two arrays with same length');

  for (let i = 0; i < arr_1.length; i++) {
    fn([arr_1[i], arr_2[i]], i);
  }
}

function makeJWTStructure(jwt, name) {
  return jwt.split('.').reduce((jwtObj, curr, i) => {
    i === 0 && (jwtObj.structure.Head = curr);
    i === 1 && (jwtObj.structure.Body = curr);
    i === 2 && (jwtObj.structure.Tail = curr);

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
  const [firstJWTLengths, secondJWTLengths] = [getPartsValue(firstJWT).map(x => x.length), getPartsValue(secondJWT).map(x => x.length)];

  doubleMap(firstJWTLengths, secondJWTLengths, (curr, i) => {
    console.log(BLUE, `${parts[i]} length comparison: `, generateCompareString(...curr))
  })
}

function compareEquality(firstJWT, secondJWT) {
  const [firstJWTValues, secondJWTValues] = [getPartsValue(firstJWT), getPartsValue(secondJWT)];
  
  doubleMap(firstJWTValues, secondJWTValues, (curr, i) => {
    console.log(` ${parts[i]} equal: `, curr[0] == curr[1]);
  });
}

function instruct(firstJWT, secondJWT) {
  parts.reduce((instructions, key) => {
    const isSameLength = firstJWT.structure[key].length == secondJWT.structure[key].length;
    const isEqual = firstJWT.structure[key] == secondJWT.structure[key];
    isSameLength !== isEqual && instructions.push(`${RED}> ${key} lengths ${ isSameLength ? 'matches' : 'not matches'} but equality is ${isEqual} <`);

    return instructions;
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




