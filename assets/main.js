$(document).ready(function() {
  $("#loader").hide();
   $("#search").keyup( function(event){
    if (event.keyCode == 13) Sc.initSearch();
    return false;
  });
   
  $("select").change( function(event){
    setTimeout(function(){
        Sc.initSearch();    
    },400);
    
    return false;
  }); 
  
  $("a", "#tags").click(function(event){
    event.preventDefault();
    $("#search input").val($(this).text());
    Sc.initSearch();
    return false;
  });
  $('#tags a').eq(0).click();
});

function mkTime(dur) {
    dur /= 1000;
	var m = parseInt(dur/60);
	var s = parseInt(dur % 60);
	var duration = (m > 9 ? m : '0'+m) +':'+ (s > 9 ? s : "0"+s);
	return duration;
}
