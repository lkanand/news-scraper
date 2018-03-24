arrayOfSources = ["burnt-orange-nation", "hook-em", "texas-diehards"]

$(document).ready(function(){
	for(var i = 0; i < arrayOfSources.length; i++) {
		if($("#" + arrayOfSources[i] + " .news-article").length === 0)
			$("#"+arrayOfSources[i]).addClass("display-none");
	}

	$('.news-article-img').each(function(i, element){
		$(this).css({'height': ($(this).next().height() + 'px')});
	});
});