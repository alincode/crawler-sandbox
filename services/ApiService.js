var rp = require('request-promise');

// TODO: fix https problems

function save(url, html) {
  let options = {
    method: 'POST',
    // rejectUnauthorized: true,
    // uri: 'https://www.icquery.com/api/v1/parsers',
    uri: 'http://114.35.96.3:9960/api/v1/parsers',
    // uri: 'http://127.0.0.1:9960/api/v1/parsers',
    body: {
      url: url,
      html: html,
      ip: '127.0.0.1'
    },
    json: true
  };

  rp(options)
    .then(function(body) {
      console.log('body:', body);
    })
    .catch(function(err) {
      console.log('send api-server bot api failure. because ', err.message)
    });
}

exports.save = save;
