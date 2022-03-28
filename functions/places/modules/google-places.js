/**
 * Google Places
 * @module googlePlaces
 */

const httpsRequest = require('./https-request');
const { pathnameBuilder } = require('./helpers');

const { googlePlaces } = require('../config/apiKeys');

/**
 * Fetches the Google Places Details API
 * @param { string } placeId
 * @returns {Promise<*>}
 */
const detailsSearchRequest = (placeId) => {
  const parametersMap = {
    place_id: placeId,
    language: 'pt-BR',
    fielts: 'address_component,name',
    key: googlePlaces,
  };

  const OPTIONS = {
    hostname: 'maps.googleapis.com',
    path: pathnameBuilder('maps/api/place/details/json', parametersMap),
    port: 443,
    method: 'GET',
  };

  return httpsRequest(OPTIONS);
};

/**
 * Fetches the Google Places text search API
 * @param {string} query
 * @param {string} region
 * @param {string} language
 * @returns {Promise<*>}
 */
const zipcodeSearchRequest = ({ query, region, language }) => {
  const parametersMap = {
    query,
    region,
    language,
    key: googlePlaces,
  };

  const OPTIONS = {
    hostname: 'maps.googleapis.com',
    path: pathnameBuilder('maps/api/place/textsearch/json', parametersMap),
    port: 443,
    method: 'GET',
  };

  return httpsRequest(OPTIONS);
};

module.exports = {
  detailsSearchRequest,
  zipcodeSearchRequest,
};
