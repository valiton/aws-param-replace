const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

const ssmPattern = /\$\{ssm:.*?\}/g;
const extractKey = match => match.slice(6, -1);

const responseToMap = data =>
  data.Parameters.reduce(
    (acc, current) => ({ ...acc, [current.Name]: current.Value }),
    {}
  );

const makeError = invalidParameters => {
  const formattedParams = invalidParameters.join(', ');
  const errMsg = `The following Parameters could not be fetched from SSM. [${formattedParams}]`;
  return new Error(errMsg);
};

const fetchParameters = names =>
  ssm
    .getParameters({ Names: names, WithDecryption: true })
    .promise()
    .then(
      data =>
        data.InvalidParameters.length === 0
          ? Promise.resolve(responseToMap(data))
          : Promise.reject(makeError(data.InvalidParameters))
    );

const replaceParameters = input => paramsMap =>
  input.replace(ssmPattern, match => paramsMap[extractKey(match)]);

module.exports = input =>
  Promise.resolve(input.match(ssmPattern).map(extractKey))
    .then(fetchParameters)
    .then(replaceParameters(input));
