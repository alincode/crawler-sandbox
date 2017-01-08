var webdriverio = require('webdriverio');
var options = {
  desiredCapabilities: {
    browserName: 'phantomjs'
  }
};
var client = webdriverio.remote(options);
client
  .init()
  .url(
    'http://www.digikey.com.cn/search/zh/VLP-500-F/492-1517-ND?recordId=3091702'
  )
  .getSource().then(function(source) {
    console.log('source: ' + source);
  })
  .end();
