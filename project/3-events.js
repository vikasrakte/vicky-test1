// With events (using simpler on* properties)
// A couple of functions to save repetiton
function handleError(err) {
  addTextToPage("Argh, broken: " + err.message);
  hideSpinner();
}

function hideSpinner() {
  document.querySelector('.spinner').style.display = 'none';
}

// In this example, we get an object we add load & error listeners to
var request = getJsonEvent('story.json');

request.onload = function() {
  addHtmlToPage(request.response.heading);
  
  // We need to track if anything failed
  var errored = false;
  // Track the next chapter that can appear on the page
  var nextChapterToAdd = 0;
  var chapterHtmls = [];


  // We store chapter requests so we can remove listeners later
  var chapterRequests = request.response.chapterUrls.map(function(chapterUrl, i) {
    var request = getJsonEvent(chapterUrl);

    request.onload = function() {
      // Store this chapter, we might not be able to deal with it yet
      chapterHtmls[i] = request.response.html;

      // Try and add new chapters to the page, in order.
      // Stop when we reach a chapter we've yet to download.
      for (; nextChapterToAdd in chapterHtmls; nextChapterToAdd++) {
        addHtmlToPage(chapterHtmls[nextChapterToAdd]);

        // Did we just add the final chapter?
        if (nextChapterToAdd == story.chapterUrls.length - 1) {
          addTextToPage("All done");
          hideSpinner();
        }
      }
    };

    request.onerror = function(event) {
      // prevent further events
      chapterRequests.forEach(function(request) {
        request.onload = null;
        request.onerror = null;
      });
      handleError(event.error);
    };

    return request;
  });
};

request.onerror = function(event) {
  handleError(event.error);
};