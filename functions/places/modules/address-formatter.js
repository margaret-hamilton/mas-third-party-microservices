/**
 * Address Formatter
 * @module addressFormatter
 */

const gPlaceHashTable = {
  city: {
    type: 'administrative_area_level_2',
    response: 'long_name',
  },
  district: {
    type: 'sublocality_level_1',
    response: 'long_name',
  },
  state: {
    type: 'administrative_area_level_1',
    response: 'short_name',
  },
  street: {
    type: 'route',
    response: 'long_name',
  },
  zipcode: {
    type: 'postal_code',
    response: 'long_name',
  },
};

const viaCepHashTable = {
  city: 'localidade',
  district: 'bairro',
  state: 'uf',
  street: 'logradouro',
  zipcode: 'cep',
};

/**
 * Parsse the Google places api output to the application expected response
 * @param { object } addressComponents
 * @returns {{}}
 */
const gPlaceFormatter = (addressComponents) => Object.keys(gPlaceHashTable).reduce((acc, key) => {
  const matchValue = addressComponents.filter(({ types }) => types.includes(gPlaceHashTable[key].type));

  if (matchValue.length) {
    acc[key] = matchValue[0][gPlaceHashTable[key].response];
  }
  else {
    acc[key] = null;
  }

  return acc;
}, {});

/**
 * Parses the viaCEP api output to the application expected response
 * @param { object } viaCepAddress
 * @returns {{}}
 */
const viaCepFormatter = (viaCepAddress) => Object.keys(viaCepHashTable).reduce((acc, key) => {
  const matchValue = Object.keys(viaCepAddress).filter((d) => viaCepHashTable[key] === d).join();

  if (matchValue) {
    acc[key] = viaCepAddress[matchValue];
  }
  else {
    acc[key] = null;
  }

  return acc;
}, {});

module.exports = {
  gPlaceFormatter,
  viaCepFormatter,
};
