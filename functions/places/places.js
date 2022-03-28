/**
 * Places Request
 * @module Places
 */

const fs = require('fs');
const buscaCep = require('busca-cep');

const { detailsSearchRequest, zipcodeSearchRequest } = require('./modules/google-places');
const { gPlaceFormatter, viaCepFormatter } = require('./modules/address-formatter');
const { slugify } = require('./modules/helpers');

const currentDir = process.env.LAMBDA_TASK_ROOT;

/**
 * Netlify Places Handler
 * @param { object } queryStringParameters
 * @returns {Promise<*>}
 */

exports.handler = async ({ queryStringParameters }) => {
  const { query, region, language } = queryStringParameters;
  try {
    // performs google place first request
    const { results: zipcodeResults, status: zipcodeStatus } = await zipcodeSearchRequest(queryStringParameters);

    if (zipcodeStatus !== 'OK') {
      // tries to perform the viaCEP request as fallback
      const viaCepResponse = buscaCep(query, { sync: true });

      if (viaCepResponse.erro) {
        // tries to perform a new google place request with just the first part of the zipcode
        const partialZipcode = query.slice(0, 5);
        const {
          results: partialZipcodeResults,
          status: partialZipcodeStatus,
        } = await zipcodeSearchRequest({ query: partialZipcode, region, language });

        if (partialZipcodeStatus === 'OK') {
          const { place_id: placeId } = partialZipcodeResults[0] || { place_id: null };
          const { result: partialDetailsResult, status: partialDetailsStatus } = await detailsSearchRequest(placeId);

          if (partialDetailsStatus === 'OK') {
            const gPlaceAddress = gPlaceFormatter(partialDetailsResult.address_components);
            const { city, state } = gPlaceAddress;
            const filePath = `${currentDir}/src/functions/places/addresses/${state}/${slugify(city)}.json`;
            const rawAddresses = fs.readFileSync(filePath, 'utf8');
            const addresses = JSON.parse(rawAddresses);

            const address = addresses.find(({ zipcode }) => zipcode === query) || {};

            if (address.street) {
              const mergedAdress = {
                ...gPlaceAddress,
                street: address.street,
                district: address.district ? address.district : null,
              };

              return {
                statusCode: 200,
                body: JSON.stringify(mergedAdress),
              };
            }

            return {
              statusCode: 200,
              body: JSON.stringify(gPlaceAddress),
            };
          }
        }

        return {
          statusCode: 400,
          body: JSON.stringify({ error: zipcodeStatus.toString() }),
        };
      }

      const response = viaCepFormatter(viaCepResponse);

      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }

    const { place_id: placeId } = zipcodeResults[0] || { place_id: null };
    const { result, status: detailsStatus } = await detailsSearchRequest(placeId);

    if (detailsStatus !== 'OK') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: zipcodeStatus.toString() }),
      };
    }

    const addressData = gPlaceFormatter(result.address_components);

    return {
      statusCode: 200,
      body: JSON.stringify(addressData),
    };
  }
  catch(error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};
