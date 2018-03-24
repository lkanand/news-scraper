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

			response = response.split("<body>")[1].split("</body>")[0];
			$("footer").append(response);

			$('.news-article-img').each(function(i, element){
				$(this).css({'height': ($(this).next().height() + 'px')});
			});

			$("footer h1").addClass("display-none");
			$("#articles-added").text($(".news-article").length);
			$(".modal").modal("show");
		});
	});
});