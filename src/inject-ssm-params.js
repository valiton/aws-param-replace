const AWS = require("aws-sdk");

const ssm = new AWS.SSM();

// aws has a hard limit on the number of keys it can return and errors of there
// are too many https://amzn.to/2QhXRTf
const keyPerRequestLimit = 10;
const ssmPattern = /\$\{ssm:.*?\}/g;
const extractKey = match => match.slice(6, -1);

const responseToParams = data => data.Parameters;

const paramsToMap = params =>
  params.reduce(
    (acc, current) => ({ ...acc, [current.Name]: current.Value }),
    {}
  );

const makeError = invalidParameters => {
  const formattedParams = invalidParameters.join(", ");
  const errMsg = `The following Parameters could not be fetched from SSM. [${formattedParams}]`;
  return new Error(errMsg);
};

const createChunks = (chunkSize, array) => {
  const numberOfChunks = Math.ceil(array.length / chunkSize);
  return Array.from({ length: numberOfChunks }, (_, index) => {
    const start = index * chunkSize;
    return array.slice(index * chunkSize, start + chunkSize);
  });
};

const flatten = arr => arr.reduce((acc, current) => acc.concat(current), []);

const fetchParameters = names =>
  ssm
    .getParameters({ Names: names, WithDecryption: true })
    .promise()
    .then(
      data =>
        data.InvalidParameters.length === 0
          ? Promise.resolve(responseToParams(data))
          : Promise.reject(makeError(data.InvalidParameters))
    );

const replaceParameters = input => paramsMap =>
  input.replace(ssmPattern, match => paramsMap[extractKey(match)]);

module.exports = input => {
  const names = input.match(ssmPattern).map(extractKey);
  const requests = createChunks(keyPerRequestLimit, names).map(fetchParameters);
  return Promise.all(requests)
    .then(flatten)
    .then(paramsToMap)
    .then(replaceParameters(input));
};
