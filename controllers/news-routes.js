var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
	app.get("/", function(req, res){
		res.render("index");
	});

	app.get("/scrape/burnt-orange-nation", function(req, res){
		axios.get("https://www.burntorangenation.com/football").then(function(response){
			var articles = [];
			var promises = [];
			var $ = cheerio.load(response.data);
			$(".has-group-header .c-entry-box--compact--article").each(function(i, element){
				var article = {};
				var author = $(this).find(".c-byline").first(".c-byline__item").find("a").text().split(" ");
				author = author[0] + " " + author[1]
				author = author.split("\n");
				author = author[0];
				article.source = "Burnt Orange Nation";
				article.title = $(this).find(".c-entry-box--compact__title a").text();
				article.summary = $(this).find(".p-dek").text();
				article.author = author;
				article.imageLink = $(this).find("noscript").text().split('"')[1];
				article.link = $(this).find(".c-entry-box--compact__title a").attr("href");
				var promise = db.Article.findOne(article).then(function(foundArticle){
					if(foundArticle === null) {
						db.Article.create(article).then(function(dbArticle){
							articles.push(dbArticle);
						}).catch(function(err) {
							return res.json(err);
						});
					}
					else
						articles.push(foundArticle);
				});
				promises.push(promise);
			});
			Promise.all(promises).then(function(){
				res.json(articles);
			});
		});
	});

	app.get("/scrape/hook-em", function(req, res){
		axios.get("https://www.hookem.com/sport/football/").then(function(response){
			var articles = [];
			var promises = [];
			var $ = cheerio.load(response.data);
			$(".entry-tease-hookem_story, .entry-tease-post").each(function(i, element){
				var article = {};
				article.source = "Hook 'Em";
				article.title = $(this).find("h2").children("a").text();
				article.summary = $(this).find(".col-md-7").clone().children().remove().end().text();
				article.author = $(this).find(".author-name").children("a").eq(0).text();
				article.imageLink = $(this).find(".wp-post-image").attr("src");
				article.link = $(this).find(".read-more").attr("href");
				var promise = db.Article.findOne(article).then(function(foundArticle){
					if(foundArticle === null) {
						db.Article.create(article).then(function(dbArticle){
							articles.push(dbArticle);
						}).catch(function(err) {
							return res.json(err);
						});
					}
					else
						articles.push(foundArticle);
				});
				promises.push(promise);
			});
			Promise.all(promises).then(function(){
				res.json(articles);
			});
		});
	});

	app.get("/scrape/texas-diehards", function(req, res){
		axios.get("https://www.diehards.com/texas").then(function(response){
			var articles = [];
			var promises = [];
			var $ = cheerio.load(response.data);
			$("div.cm-media-block").each(function(i, element){
				var article = {};
				article.source = "Texas Diehards";
				article.title = $(this).find("h2").children("a").eq(0).text();
				article.summary = $(this).find(".cm-stream__intro").text();
				article.author = $(this).find(".cm-stream__byline").text();
				article.imageLink = $(this).find("img").attr("srcset");
				article.link = $(this).find("h2").children("a").eq(0).attr("href");
				var promise = db.Article.findOne(article).then(function(foundArticle){
					if(foundArticle === null) {
						db.Article.create(article).then(function(dbArticle){
							articles.push(dbArticle);
						}).catch(function(err) {
							return res.json(err);
						});
					}
					else
						articles.push(foundArticle);
				});
				promises.push(promise);
			});
			Promise.all(promises).then(function(){
				res.json(articles);
			});
		});
	});
};