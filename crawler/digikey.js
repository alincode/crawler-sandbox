// supplierId = 1

// 有假頁面
var ROOT_URL = 'http://www.digikey.com.cn/search/zh/-/-/4077';

var randomUA = require('random-ua');
var moduleName = 'digikey-cn-scraper';
var Crawler = require('simplecrawler');
var crawler = new Crawler(ROOT_URL);
var utils = require('utility');
var cheerio = require('cheerio');
var ApiService = require('../services/ApiService');

crawler.interval = 7 * 1000;
crawler.maxConcurrency = 1;
crawler.decodeResponses = true;
crawler.urlEncoding = 'utf8';
crawler.maxDepth = 2;
crawler.scanSubdomains = false;
crawler.userAgent = randomUA.generate();
crawler.respectRobotsTxt = false;

crawler.on('crawlstart', function() {
  console.log('Crawl starting ', ROOT_URL);
});

crawler.discoverResources = function(buffer, queueItem) {
  var $ = cheerio.load(buffer.toString());
  return $("a[href]").map(function() {
    return $(this).attr("href");
  }).get();
};

crawler.addFetchCondition(function(queueItem, referrerQueueItem) {
  return queueItem.path.indexOf('/search/zh') > -1 ||
    queueItem.path.indexOf('recordId') > -1;;
});

crawler.on('fetchcomplete', function(queueItem, responseBuffer, response) {
  console.log('=== fetchcomplete === url:', queueItem.url);
  if (queueItem.path.indexOf('recordId') == -1) return;
  if (ROOT_URL == queueItem.url) return;
  var url = queueItem.url;
  // var html = utils.base64encode(responseBuffer.toString());
  // var GrabStrategy = require(moduleName).default;
  // grabStrategy = new GrabStrategy(responseBuffer.toString(), url);
  // var result = grabStrategy.getResult();
  // ApiService.save(url, result);

  var webdriverio = require('webdriverio');
  var options = {
    desiredCapabilities: {
      browserName: 'phantomjs'
        // browserName: 'chrome'
    }
  };
  var client = webdriverio.remote(options);
  client
    .init()
    .url(url)
    .getSource().then(function(source) {
      ApiService.save(url, source);
    })
    .end();

});

crawler.on('complete', function() {
  console.log('Finished!', ROOT_URL);
});

crawler.start();
