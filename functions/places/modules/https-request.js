/**
 * HTTPS Request
 * @module httpsRequest
 */

const { request } = require('https');

/**
 * Handles the https request
 * @param {object} OPTIONS
 * @returns {Promise<any>}
 */
module.exports = (OPTIONS) => new Promise((resolve, reject) => {
  if (!OPTIONS) {
    throw new Error('[requestHandler] - OPTIONS parameter is missing');
  }

  const req = request(OPTIONS, (response) => {
    const { headers, statusCode } = response;

    const isJSON = headers['content-type'].includes('application/json');
    const body = [];

    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => {
      const content = body.join('');
      const responseData = isJSON ? JSON.parse(content) : content;

      if (statusCode < 200 || statusCode > 299) {
        const { errorMessages } = responseData;
        const error = errorMessages && Array.isArray(errorMessages) ? ` -- ${errorMessages[0]}` : '';

        reject(new Error(`Request failed [${response.statusCode}]${error}`));

        return;
      }

      resolve(responseData);
    });
  });

  // handle connection errors of the request
  req.on('error', (err) => reject(err));
  req.end();
});
