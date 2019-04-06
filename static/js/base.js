$( document ).ready(function() {
  // Code for search engine
  $('#search').click(function () {
    location.href = "/user/" + $("#searchInput").val();
  });

  $("#searchInput").keyup(function(e) {
    if (e.which === 13) { // Continue if the user has pressed enter
      location.href = "/user/" + $("#searchInput").val();
    }
  });
});
