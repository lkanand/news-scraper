$(document).ready(function(){
	$('.news-article-img').css({'height': ($('.news-article-info').height() + 'px')});

	$("button").hover(function(){
		if($(this).hasClass("not-saved")){
			$(this).removeClass("not-saved");
			$(this).addClass("saved");
		}
		else{
			$(this).removeClass("saved");
			$(this).addClass("not-saved");
		}
	}, function(){
		if($(this).hasClass("saved")){
			$(this).removeClass("saved");
			$(this).addClass("not-saved");
		}
		else{
			$(this).removeClass("not-saved");
			$(this).addClass("saved");
		}
	});

	$("#scrape-options li").on("click", function(){
		$("footer h1").addClass("display-none");
		$(".news-article").remove();
		var choice = $(this).text();
		var request;

		if(choice === "Burnt Orange Nation")
			request = "/scrape/burnt-orange-nation";
		else if(choice === "Hook 'Em")
			request = "/scrape/hook-em";
		else
			request = "/scrape/texas-diehards";

		$.ajax({
			type: "GET", 
			url: request
		}).then(function(response){
			$("#articles-added").text(response.length);
			$(".modal").modal("show");

			for(var i = 0; i < response.length; i++) {
				var newsArticle = $("<div>");
				newsArticle.addClass("news-article");
				var newsImage = $("<div>");
				newsImage.addClass("news-article-img");
				newsImage.attr("style", "background-image: url('" + response[i].imageLink + "')");
				newsArticle.append(newsImage);
				var articleInfo = $("<div>");
				articleInfo.addClass("news-article-info");
				articleInfo.append("<h3><a href = '" + response[i].link + "' target = '_blank'>" + response[i].title + "</a></h3>");
				articleInfo.append("<p class = 'author'>By: " + response[i].author + "</p>");
				articleInfo.append("<p class = 'summary'>" + response[i].summary + "</p>");
				if(response[i].saved === true)
					articleInfo.append("<button class = 'saved' saved = 'true' article-id = '" + response[i]._id + "'>Save</button>");
				else
					articleInfo.append("<button class = 'not-saved' saved = 'false' article-id = '" + response[i]._id + "'>Save</button>");
				newsArticle.append(articleInfo);
				$("footer").append(newsArticle);
			}
		});
	});
});