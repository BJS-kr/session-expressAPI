const jwt = require('jsonwebtoken');
const [YELLOW, BLUE, MAGENTA, WHITE, RED, CYAN] = [
  '\x1b[33m',
  '\x1b[34m',
  '\x1b[35m',
  '\x1b[37m',
  '\x1b[31m',
  '\x1b[36m',
];
const parts = ['Header', 'Payload', 'Signature'];

function getPartsValue(JWTStructure) {
  return [
    JWTStructure.parts.Header,
    JWTStructure.parts.Payload,
    JWTStructure.parts.Signature,
  ];
}

function doubleForEach(arr_1, arr_2, fn) {
  if (arr_1.length !== arr_2.length)
    throw new Error('doubleForEach must called on two arrays with same length');

  arr_1.forEach((x, i) => {
    fn([x, arr_2[i]], i);
  });
}

function makeJWTStructure(name, payload, secretOrPrivateKey, options) {
  const JWT = jwt.sign(payload, secretOrPrivateKey, options);
  const base = {
    original: JWT,
    name,
    modify(obj, name) {
      const copied = JSON.parse(JSON.stringify(this));
      copied.name = name;
      Object.keys(obj).forEach((key) => (copied.parts[key] = obj[key]));
      copied.original = getPartsValue(copied).join('.');
      copied.modify = this.modify;
      return copied;
    },
    secretOrPrivateKey,
    parts: {},
  };

  return JWT.split('.').reduce((jwtObj, curr, i) => {
    jwtObj.parts[parts[i]] = curr;
    return jwtObj;
  }, base);
}

function generateCompareString(length1, length2) {
  return `${WHITE + length1} ${
    length1 === length2 ? YELLOW + '==' : RED + '!='
  } ${WHITE + length2}`;
}

function compareLength(firstJWT, secondJWT) {
  const [firstJWTLengths, secondJWTLengths] = [
    getPartsValue(firstJWT).map((x) => x.length),
    getPartsValue(secondJWT).map((x) => x.length),
  ];

  doubleForEach(firstJWTLengths, secondJWTLengths, (curr, i) => {
    console.log(
      BLUE,
      `${parts[i]} length comparison: `,
      generateCompareString(...curr)
    );
  });
}

function compareEquality(firstJWT, secondJWT) {
  const [firstJWTValues, secondJWTValues] = [
    getPartsValue(firstJWT),
    getPartsValue(secondJWT),
  ];

  doubleForEach(firstJWTValues, secondJWTValues, (curr, i) => {
    console.log(` ${parts[i]} equal: `, curr[0] == curr[1]);
  });
}

function instruct(firstJWT, secondJWT) {
  const possiblyEmptyInstructions = parts.reduce((instructions, key) => {
    const isSameLength =
      firstJWT.parts[key].length == secondJWT.parts[key].length;
    const isEqual = firstJWT.parts[key] == secondJWT.parts[key];
    isSameLength !== isEqual &&
      instructions.push(
        `${RED}> ${key} lengths ${
          isSameLength ? 'matches' : 'not matches'
        } but equality is ${isEqual} <`
      );

    return instructions;
  }, []);

  const instructions = !possiblyEmptyInstructions.length
    ? [`${BLUE}> no inconsistency between length and equality <`]
    : possiblyEmptyInstructions;

  instructions.forEach((instruction) => console.log(instruction));
}

function decoded(decode, jwt) {
  try {
    return decode(jwt);
  } catch (e) {
    return e.message;
  }
}

function verified(verify, jwt, secretOrPrivateKey) {
  try {
    return verify(jwt, secretOrPrivateKey);
  } catch (e) {
    return e.message;
  }
}

function showInformation(firstJWT, secondJWT) {
  [firstJWT, secondJWT].forEach((JWTStructure) => {
    const decodedStringified = JSON.stringify(
      decoded(jwt.decode, JWTStructure.original)
    );

    const verifiedStringified = JSON.stringify(
      verified(
        jwt.verify,
        JWTStructure.original,
        JWTStructure.secretOrPrivateKey
      )
    );

    const headerPayloadSignature = getPartsValue(JWTStructure)
      .map((x, i) => MAGENTA + parts[i] + ': ' + x)
      .join('\n');

    console.log(
      `${WHITE}${JWTStructure.name}:\n${headerPayloadSignature}\n${CYAN}decoded: ${decodedStringified}\n${CYAN}verified: ${verifiedStringified}\n`
    );
  });
}

function showAndCompare(firstJWT, secondJWT) {
  showInformation(firstJWT, secondJWT);
  compareLength(firstJWT, secondJWT);
  compareEquality(firstJWT, secondJWT);
  instruct(firstJWT, secondJWT);
}

const withPayload = makeJWTStructure(
  'w_payload',
  { session: 'HangHae99_JWT' },
  'secret',
  { expiresIn: 200, algorithm: 'HS512' }
);
const withoutPayload = makeJWTStructure('wo_payload', {}, 'secret', {
  expiresIn: 200,
  algorithm: 'HS256',
});
const original = makeJWTStructure('original', { name: 'HangHae' }, 'secret');
const [oHeader, oPayload, oSignature] = getPartsValue(original);
const headerModified = original.modify(
  {
    Header: oHeader.slice(0, oHeader.length - 3),
  },
  'header_modified'
);
const payloadModified = original.modify(
  {
    Payload: oPayload.slice(0, oPayload.length - 3),
  },
  'payload_modified'
);
const signatureModified = original.modify(
  {
    Signature: oSignature.slice(0, oSignature.length - 3),
  },
  'signature_modified'
);

showAndCompare(withPayload, withoutPayload);
showAndCompare(original, headerModified);
showAndCompare(payloadModified, signatureModified);

str = '4h';

console.log(
  str +
    ': ' +
    str.length +
    ' characters, ' +
    Buffer.byteLength(str, 'utf8') +
    ' bytes'
);
