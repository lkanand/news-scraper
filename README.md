# Texas Sports Wire

This program scrapes news articles from three websites that cover University of Texas sports: 
* <a href = 'https://www.burntorangenation.com/football'>Burnt Orange Nation</a>
* <a href = 'https://www.hookem.com/sport/football/'>Hook 'Em</a>
* <a href = 'https://www.diehards.com/texas'>Texas Diehards</a>

Additionally, it allows users to save articles and leave comments about them.

## How to Use

To begin scraping for UT sports news, click <a href = 'https://texas-sports-wire.herokuapp.com/'>here</a>. Once the homepage has loaded, click on "Burnt Orange Nation", "Hook 'Em" or "Texas Diehards" in the menu to pull articles from the respective websites. For each article, the web page will display its title (embedded with a link to the original version), its author, its summary and image. If you would like to save a particular article for future reference, click on the "Save" button below its summary. Upon doing so, the button will read "Saved" and turn burnt orange. If you decide that an article is no longer important, you can unsave it by clicking on the "Saved" button. This will cause the button to return to its original state. 

To access a list of your saved articles, click on the "Saved Articles" label in the menu. This will lead you to a separate page that groups all of your saved articles by news source. To remove an article from this list, click the "Unsave" button below its summary. If you would like to comment on an article, click the "Comment" button. This will trigger a modal that will display all previous comments about the article. To leave your own comment, fill in the text field and click "Submit". To delete a comment, click on its "Delete" button.

## Development

This full-stack application uses jQuery, Express, Express Handlebars, Node.js, Axios, Cheerio, MongoDB and Mongoose.
