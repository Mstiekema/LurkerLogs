$( document ).ready(function() {
  // Sets current page by highlighting it in the menu
  var url = location.href.split('/');
  var urlEnd = "/" + url[3];
  var div = $('a[href^="'+urlEnd+'"]')[0];
  $(div).addClass('active');

  // Code for search engine
  // The way we look for users will be improved in the future
  $('#search').click(function () {
    // Look up user
    location.href = "/user/" + $("#searchInput").val();
  });

  $("#searchInput").keyup(function(e) {
    if (e.which === 13) { // Continue if the user has pressed enter
      // Look up user
      location.href = "/user/" + $("#searchInput").val();
    }
  });
});
