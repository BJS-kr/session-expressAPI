const jwt = require('jsonwebtoken');
const [YELLOW, BLUE, MAGENTA, WHITE, RED, CYAN] = [
  '\x1b[33m',
  '\x1b[34m',
  '\x1b[35m',
  '\x1b[37m',
  '\x1b[31m',
  '\x1b[36m',
];
const parts = ['Head', 'Body', 'Tail'];

function getPartsValue(JWTStructure) {
  return [
    JWTStructure.structure.Head,
    JWTStructure.structure.Body,
    JWTStructure.structure.Tail,
  ];
}

function doubleForEach(arr_1, arr_2, fn) {
  if (arr_1.length !== arr_2.length)
    throw new Error('doubleForEach must called on two arrays with same length');

  for (let i = 0; i < arr_1.length; i++) {
    fn([arr_1[i], arr_2[i]], i);
  }
}

function makeJWTStructure(jwt, name = 'jwt') {
  return jwt.split('.').reduce(
    (jwtObj, curr, i) => {
      jwtObj.structure[parts[i]] = curr;
      return jwtObj;
    },
    {
      original: jwt,
      name,
      modify(obj, name) {
        const copied = JSON.parse(JSON.stringify(this));
        copied.name = name;
        Object.keys(obj).forEach((key) => (copied.structure[key] = obj[key]));
        copied.original = getPartsValue(copied).join('.');
        return copied;
      },
      structure: {},
    }
  );
}

function generateCompareString(length1, length2) {
  return `${WHITE + length1} ${
    length1 === length2 ? YELLOW + '==' : MAGENTA + '!='
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
      firstJWT.structure[key].length == secondJWT.structure[key].length;
    const isEqual = firstJWT.structure[key] == secondJWT.structure[key];
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
    return e;
  }
}

function verified(verify, jwt) {
  try {
    return verify(jwt, 'secret');
  } catch (e) {
    return e;
  }
}

function showInformation(JWTStructure) {
  console.log(WHITE);
  console.log(`${JWTStructure.name}:\n`, JWTStructure.structure);
  console.log(CYAN, 'decoded: ', decoded(jwt.decode, JWTStructure.original));
  console.log(
    CYAN,
    'verified: ',
    verified(jwt.verify, JWTStructure.original),
    '\n'
  );
}

function showAndCompare(firstJWT, secondJWT) {
  showInformation(firstJWT);
  showInformation(secondJWT);
  compareLength(firstJWT, secondJWT);
  compareEquality(firstJWT, secondJWT);
  instruct(firstJWT, secondJWT);
}

const withPayload = makeJWTStructure(
  jwt.sign({ session: 'HangHae99_JWT' }, 'secret'),
  'w_payload'
);
const withoutPayload = makeJWTStructure(jwt.sign({}, 'secret'), 'wo_payload');

const secret_1 = makeJWTStructure(jwt.sign({}, 'secret'), 'secret_1');
const secret_2 = makeJWTStructure(
  jwt.sign({}, 'anotherLongerSecret'),
  'secret_2'
);

const same_1 = makeJWTStructure(jwt.sign({}, 'secret'), 'same1');
const same_2 = makeJWTStructure(jwt.sign({}, 'secret'), 'same2');

const sameExpiration_1 = makeJWTStructure(
  jwt.sign({}, 'secret', { expiresIn: 10 }),
  'same_exp_1'
);
const sameExpiration_2 = makeJWTStructure(
  jwt.sign({}, 'secret', { expiresIn: 10 }),
  'same_exp_2'
);

const expiration_1 = makeJWTStructure(
  jwt.sign({}, 'secret', { expiresIn: 10 }),
  'exp_1'
);
const expiration_2 = makeJWTStructure(
  jwt.sign({}, 'secret', { expiresIn: 100 }),
  'exp_2'
);

const algorithm_1 = makeJWTStructure(
  jwt.sign({}, 'secret', { algorithm: 'HS256' }),
  'alg_1'
);
const algorithm_2 = makeJWTStructure(
  jwt.sign({}, 'secret', { algorithm: 'HS512' }),
  'alg_2'
);

const immediateExpiration = makeJWTStructure(
  jwt.sign({ session: 'HangHae99_JWT' }, 'secret', { expiresIn: 0 }),
  'original'
);
const noExpiration = makeJWTStructure(
  jwt.sign({ session: 'HangHae99_JWT' }, 'secret'),
  'original'
);
showAndCompare(withPayload, withoutPayload);
showAndCompare(secret_1, secret_2);
showAndCompare(same_1, same_2);
showAndCompare(sameExpiration_1, sameExpiration_2);
showAndCompare(expiration_1, expiration_2);
showAndCompare(algorithm_1, algorithm_2);
showAndCompare(immediateExpiration, noExpiration);
