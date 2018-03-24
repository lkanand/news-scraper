var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
	function sendScrapedArticles (res, articles, newArticles){
		var promises = [];
		for(var i = 0; i < newArticles.length; i++) {
			var promise = db.Article.create(newArticles[i]).then(function(dbArticle){
				articles.push(dbArticle);
			}).catch(function(err) {
				return res.json(err);
			});
			promises.push(promise);		
		}
		Promise.all(promises).then(function(){
			var data = {
				articles: articles
			};

			res.render("partials/scraped-article", data);
		});
	}

	app.get("/", function(req, res){
		res.render("index");
	});

	app.get("/saved", function(req, res){
		db.Article.find({saved: true}).sort({articleAdded: "descending"}).then(function(response){
			var data = {
				articles: response
			};
			res.render("saved", data);
		});
	});

	app.get("/scrape/burnt-orange-nation", function(req, res){
		var articles = [];
		var newArticles = [];
		var promises = [];
		axios.get("https://www.burntorangenation.com/football").then(function(response){
			var $ = cheerio.load(response.data);
			$(".has-group-header .c-entry-box--compact--article").each(function(i, element){
				var article = {};
				var author = $(this).find(".c-byline").first(".c-byline__item").find("a").text().split(" ");
				author = author[0] + " " + author[1]
				author = author.split("\n");
				author = author[0];
				article.burntorange = true;
				article.title = $(this).find(".c-entry-box--compact__title a").text();
				article.summary = $(this).find(".p-dek").text();
				article.author = author;
				article.imageLink = $(this).find("noscript").text().split('"')[1];
				article.link = $(this).find(".c-entry-box--compact__title a").attr("href");
				var promise = db.Article.findOne(article).then(function(foundArticle){
					if(foundArticle === null)
						newArticles.push(article);
					else
						articles.push(foundArticle);
				});
				promises.push(promise);
			});
			Promise.all(promises).then(function(){
				sendScrapedArticles(res, articles, newArticles);
			});
		});
	});

	app.get("/scrape/hook-em", function(req, res){
		var articles = [];
		var newArticles = [];
		var promises = [];
		axios.get("https://www.hookem.com/sport/football/").then(function(response){
			var $ = cheerio.load(response.data);
			$(".entry-tease-hookem_story, .entry-tease-post").each(function(i, element){
				var article = {};
				article.hookem = true;
				article.title = $(this).find("h2").children("a").text();
				article.summary = $(this).find(".col-md-7").clone().children().remove().end().text();
				article.author = $(this).find(".author-name").children("a").eq(0).text();
				article.imageLink = $(this).find(".wp-post-image").attr("src");
				article.link = $(this).find(".read-more").attr("href");
				var promise = db.Article.findOne(article).then(function(foundArticle){
					if(foundArticle === null)
						newArticles.push(article);
					else
						articles.push(foundArticle);
				});
				promises.push(promise);
			});
			Promise.all(promises).then(function(){
				sendScrapedArticles(res, articles, newArticles);
			});
		});
	});

	app.get("/scrape/texas-diehards", function(req, res){
		var articles = [];
		var newArticles = [];
		var promises = [];
		axios.get("https://www.diehards.com/texas").then(function(response){
			var $ = cheerio.load(response.data);
			$("div.cm-media-block").each(function(i, element){
				var article = {};
				article.texasdiehards = true;
				article.title = $(this).find("h2").children("a").eq(0).text();
				article.summary = $(this).find(".cm-stream__intro").text();
				article.author = $(this).find(".cm-stream__byline").text();
				article.imageLink = $(this).find("img").attr("srcset");
				article.link = $(this).find("h2").children("a").eq(0).attr("href");
				var promise = db.Article.findOne(article).then(function(foundArticle){
					if(foundArticle === null)
						newArticles.push(article);
					else
						articles.push(foundArticle);
				});
				promises.push(promise);
			});
			Promise.all(promises).then(function(){
				sendScrapedArticles(res, articles, newArticles);
			});
		});
	});

	app.put("/update-saved", function(req, res){
		db.Article.update({_id: req.body.id}, {
			$set: {
				saved: req.body.saved,
				notes: []
			}
		}).catch(function(err){
			res.json(err);
		});
		res.json("success");
	});

	app.get("/get-comments/:id", function(req, res){
		db.Article.findOne({_id: req.params.id}).populate("notes").then(function(response){
			res.json(response.notes);
		}).catch(function(err){
			res.json(err);
		});
	});

	app.post("/post-comment", function(req, res){
		db.Note.create({body: req.body.comment}).then(function(note){
			db.Article.update({_id: req.body.id}, {
				$push: {
					notes: note._id
				}
			}).catch(function(err){
				res.json(err);
			});
			res.json(note);
		}).catch(function(error){
			res.json(error);
		});
	});

	app.delete("/delete-comment", function(req, res){
		db.Note.remove({_id: req.body.commentId}).then(function(removedNote){
			db.Article.update({_id: req.body.articleId}, {
				$pull: {
					notes: req.body.commentId
				}
			}).catch(function(err){
				res.json(err);
			});
			res.json("success");
		}).catch(function(error){
			res.json(error);
		});
	});

	app.get("/*", function(req, res){
		res.render("index");
	});
};