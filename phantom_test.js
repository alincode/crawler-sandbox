console.log('Loading a web page');
var page = require('webpage').create();
var url =
  'http://www.digikey.com.cn/search/zh/VLP-500-F/492-1517-ND?recordId=3091702';

// page.open(url, function(status) {
//   console.log(status);
//   phantom.exit();
// });

page.open(url, function(status) {
  console.log('Stripped down page text:\n' + page.plainText);
  phantom.exit();
});
