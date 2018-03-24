function switchState(selector) {
	if(selector.hasClass("not-saved")){
		selector.removeClass("not-saved");
		selector.addClass("saved");
	}
	else{
		selector.removeClass("saved");
		selector.addClass("not-saved");
	}
}

$(document).ready(function(){
	$(document).on("mouseenter", "footer button", function(){
		var selector = $(this);
		switchState(selector);
	});

	$(document).on("mouseleave", "footer button", function(){
		var selector = $(this);
		switchState(selector);
	});

	$(document).on("click", "footer button", function(){
		var selector = $(this);
		switchState(selector);
		var id = selector.attr("article-id");
		var isSaved = selector.attr("saved");
		if(isSaved === "true"){
			isSaved = false;
			selector.text("Save");
			selector.attr("saved", false);
		}
		else {
			isSaved = true;
			selector.text("Saved");
			selector.attr("saved", true);
		}
		var info = {
			id: id,
			saved: isSaved
		};

		$.ajax({
			type: "PUT",
			url: "/update-saved",
			data: info
		}).then(function(response){
			if(response === "success")
				console.log("saved state updated");
			else
				console.log("There was an error in saving file.");
		});
	});

	$(document).on("click", "#scrape-options li", function(){
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
			$(".news-article").remove();
			for(var i = 0; i < response.length; i++) {
				var newsArticle = $("<div>");
				newsArticle.addClass("news-article");
				var newsImage = $("<div>");
				newsImage.addClass("news-article-img");
				newsImage.attr("style", "background-image: url('" + response[i].imageLink + "')");
				newsArticle.append(newsImage);
				var newsInfo = $("<div>");
				newsInfo.addClass("news-article-info");
				newsInfo.append("<h3><a href = '" + response[i].link + "' target = '_blank'>" + response[i].title + "</a></h3>");
				newsInfo.append("<p class = 'author'>By: " + response[i].author + "</p>");
				newsInfo.append("<p class = 'summary'>" + response[i].summary + "</p>");
				if(response[i].saved === true)
					newsInfo.append("<button class = 'saved' saved = 'true' article-id = '" + response[i]._id + "'>Saved</button>");
				else
					newsInfo.append("<button class = 'not-saved' saved = 'false' article-id = '" + response[i]._id + "'>Save</button>");
				newsArticle.append(newsInfo);
				$("footer").append(newsArticle);
			}

			$('.news-article-img').each(function(i, element){
				$(this).css({'height': ($(this).next().height() + 'px')});
			});

			$("footer h1").addClass("display-none");
			$("#articles-added").text($(".news-article").length);
			$(".modal").modal("show");
		});
	});
});