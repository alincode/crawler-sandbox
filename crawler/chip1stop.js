var ROOT_URL = 'http://www.chip1stop.com/web/TWN/zh/dispClassSearchTop.do';

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

crawler.addFetchCondition(function(queueItem, referrerQueueItem) {
  return queueItem.path.indexOf('search') > -1 || queueItem.path.indexOf(
    'dispDetail') > -1;
});

crawler.discoverResources = function(buffer, queueItem) {
  var $ = cheerio.load(buffer.toString("utf8"));
  return $("a[href]").map(function() {
    return $(this).attr("href");
  }).get();
};

crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
  console.log('=== fetchcomplete === url:', queueItem.url);
  if (queueItem.path.indexOf('dispDetail') == -1) return;
  if (ROOT_URL == queueItem.url) return;
  var url = queueItem.url;
  var html = utils.base64encode(responseBuffer.toString());
  ApiService.save(url, html);
});

crawler.on('complete', function() {
  console.log('Finished!', ROOT_URL);
});

crawler.start();
