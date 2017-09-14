// With Node.js-style callbacks
// A couple of functions to save repetiton
function handleError(err) {
  addTextToPage("Argh, broken: " + err.message);
  hideSpinner();
}

function hideSpinner() {
  document.querySelector('.spinner').style.display = 'none';
}

getJsonCallback('story.json', function(err, story) {
  // In Node.js callbacks, the first param is an error
  if (err) {
    handleError(err);
    return;
  }

  addHtmlToPage(story.heading);

  // We need to track if anything failed
  var errored = false;
  // Track the next chapter that can appear on the page
  var nextChapterToAdd = 0;
  var chapterHtmls = [];

  story.chapterUrls.forEach(function(chapterUrl, i) {
    getJsonCallback(chapterUrl, function(err, chapter) {
      // If we've already errored, don't want to do anything
      if (errored) {
        return;
      }
      // If this is an error, handle it
      if (err) {
        errored = true;
        handleError(err);
        return;
      }

      // Store this chapter, we might not be able to deal with it yet
      chapterHtmls[i] = chapter.html;

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
    });
  });
});