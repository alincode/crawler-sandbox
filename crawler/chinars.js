var ROOT_URL = 'http://china.rs-online.com/web/c/semiconductors/';

var Crawler = require('simplecrawler');
var crawler = new Crawler(ROOT_URL);
var utils = require('utility');
var ApiService = require('../services/ApiService');

crawler.interval = 30 * 1000;
crawler.maxConcurrency = 1;
crawler.decodeResponses = true;
crawler.urlEncoding = 'utf8';

crawler.on('crawlstart', function() {
  console.log('Crawl starting ', ROOT_URL);
});

crawler.addFetchCondition(function(queueItem, referrerQueueItem) {
  return queueItem.path.indexOf('/web/c/') > -1 || queueItem.path.indexOf(
    '/web/p/') > -1;
});

crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
  console.log('=== fetchcomplete === url:', queueItem.url);
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
