var ROOT_URL = 'http://cn.element14.com/prl/results';

var Crawler = require('simplecrawler');
var crawler = new Crawler(ROOT_URL);
var utils = require('utility');
var cheerio = require('cheerio');
var ApiService = require('../services/ApiService');

crawler.interval = 30 * 1000;
crawler.maxConcurrency = 1;
crawler.decodeResponses = false;
crawler.urlEncoding = 'utf8';
crawler.decompressResponses = false;

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
  return queueItem.path.indexOf('/dp/') > -1
})

crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
  console.log('=== fetchcomplete === url:', queueItem.url);
  if (ROOT_URL == queueItem.url) return;
  var url = queueItem.url;
  var html = utils.base64encode(responseBuffer.toString());
  ApiService.save(url, html);
});

crawler.on('complete', function() {
  console.log('Finished!', ROOT_URL);
});

crawler.start();
