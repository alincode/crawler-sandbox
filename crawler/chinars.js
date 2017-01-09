// supplierId = 4
var ROOT_URL =
  'http://china.rs-online.com/web/c/';

var randomUA = require('random-ua');
var Crawler = require('simplecrawler');
var crawler = new Crawler(ROOT_URL);
var utils = require('utility');
var cheerio = require('cheerio');
var ApiService = require('../services/ApiService');

crawler.interval = 5 * 1000;
crawler.maxConcurrency = 1;
crawler.decodeResponses = true;
crawler.urlEncoding = 'utf8';
crawler.userAgent = randomUA.generate();

crawler.on('crawlstart', function() {
  console.log('Crawl starting ', ROOT_URL);
});

crawler.discoverResources = function(buffer, queueItem) {
  var $ = cheerio.load(buffer.toString("utf8"));
  return $("a[href]").map(function() {
    return $(this).attr("href");
  }).get();
};

crawler.addFetchCondition(function(queueItem, referrerQueueItem) {
  return queueItem.path.indexOf('/web/c/') > -1 || queueItem.path.indexOf(
    '/web/p/') > -1;
});

crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
  console.log('=== fetchcomplete === url:', queueItem.url);
  var url = queueItem.url;

  // var webdriverio = require('webdriverio');
  // var options = {
  //   desiredCapabilities: {
  //     // browserName: 'phantomjs'
  //     browserName: 'chrome'
  //   }
  // };
  // var client = webdriverio.remote(options);
  // client
  //   .init()
  //   .url(url)
  //   .getSource().then(function(source) {})
  //   .end();


  if (queueItem.path.indexOf('/web/p/') == -1) return;
  if (ROOT_URL == queueItem.url) return;
  var url = queueItem.url;
  var html = utils.base64encode(responseBuffer.toString());
  ApiService.save(url, html);


});

crawler.on('complete', function() {
  console.log('Finished!', ROOT_URL);
});

crawler.start();
