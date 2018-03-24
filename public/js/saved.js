arrayOfSources = ["burnt-orange-nation", "hook-em", "texas-diehards"]

function getComments(id) {
	$.ajax({
		type: "GET",
		url: "/get-comments/" + id
	}).then(function(response){
		$("#comments").empty();
		$('#submit-new-comment').attr("article-id", id);
		for(var i = 0; i < response.length; i++){
			var newOpinion = $("<div class='opinion'></div>");
			newOpinion.append("<span>" + response[i].body + "</span>");
			newOpinion.append("<button type = 'button' class = 'btn btn-secondary delete-comment' comment-id='" + response[i]._id + "'>Delete</button>");
			$("#comments").append(newOpinion);
		}
		$(".modal").modal("show");
	});
}

$(document).ready(function(){
	if($(".news-article").length > 0)
		$("#no-saved-articles").addClass("display-none");

	for(var i = 0; i < arrayOfSources.length; i++) {
		if($("#" + arrayOfSources[i] + " .news-article").length === 0)
			$("#"+arrayOfSources[i]).addClass("display-none");
	}

	$('.news-article-img').each(function(i, element){
		$(this).css({'height': ($(this).next().height() + 'px')});
	});

	$('.unsave').on("click", function(){
		var id = $(this).attr("article-id");

		var info = {
			id: id,
			saved: false
		};

		$.ajax({
			type: "PUT",
			url: "/update-saved",
			data: info
		}).then(function(response){
			if(response === "success")
				location.reload();
			else
				console.log("There was an error in unsaving file.");
		});
	});

	$('.comment').on("click", function(){
		var id = $(this).attr("article-id");
		getComments(id);
	});

	$('#submit-new-comment').on("click", function(){
		var id = $(this).attr("article-id");

		if($('#new-comment').val() === "")
			return;

		var info = {
			id: id,
			comment: $('#new-comment').val()
		};

		$.ajax({
			type: "POST",
			url: "/post-comment",
			data: info
		}).then(function(response){
			var newOpinion = $("<div class='opinion'></div>");
			newOpinion.append("<span>" + response.body + "</span>");
			newOpinion.append("<button type = 'button' class = 'btn btn-secondary delete-comment' comment-id='" + response._id + "'>Delete</button>");
			$("#comments").append(newOpinion);
			$("#new-comment").val("");
		});
	});

	$(document).on("click", ".delete-comment", function(){
		var commentId = $(this).attr("comment-id");
		var articleId = $("#submit-new-comment").attr("article-id");

		var idsToDelete = {
			commentId: commentId,
			articleId: articleId
		};

		$.ajax({
			type: "DELETE",
			url: "/delete-comment",
			data: idsToDelete
		}).then(function(response){
			if(response !== "success")
				console.log("Could not delete comment");
			else
				getComments(articleId);
		});
	});
});