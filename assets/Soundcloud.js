var Sc = {
	api: "http://api.soundcloud.com/tracks.json?consumer_key=aDFM43qGZDyjYewkCkELhA&",
	page_index: 0,
	items_by_page: 50,
	minutes_min: 40,
	order_by: "time",
    type: "streamable",
	query: null,
    
	initSearch: function(){
		switch( $('select[name$="duration"]').val() ){
    	    case "medium": this.minutes_min = 30; break;
            case "long":   this.minutes_min = 55; break;
        }
        switch( $('select[name$="order"]').val() ){
	        case("time"):    this.order_by = "created_at"; break;
            case("hotness"): this.order_by = "hotness"; break;
        }
        switch( $('select[name$="type"]').val() ){
	        case("stream"):    this.type = "streamable"; break;
            case("download"): this.type = "downloadable"; break;
        }
        this.page_index = 0;
        this.query = $("#search input").val();
          
        // reset playlist tracks
        $target = $("#playlist");
        $target.html("<ul></ul>");
        $('#loader').show();
        this.getTracks();
  
        // add next page button
        $("#actions").html("");
        $("#actions").append("<a href='#' class='next'>Load next page</a>");
        $("a.next", "#actions").click(function(event){
            //$(this).hide();
            event.preventDefault();
            Sc.page_index++;
            Sc.getTracks();
            return false;
        });
    },
    
	getTracks: function(){
        var q = this.query;
		var offset = this.page_index * this.items_by_page;
		var minlength = "&duration[from]=" + this.minutes_min * ( 1000 * 60 );
		console.log(this.api+'filter='+ this.type +'&order=' + this.order_by + '&limit=' + this.items_by_page + '&offset=' + offset + minlength + '&tags=' + q, Sc.onGetTracks);
		$.getJSON(this.api+'filter='+ this.type +'&order=' + this.order_by + '&limit=' + this.items_by_page + '&offset=' + offset + minlength + '&tags=' + q, Sc.onGetTracks);

	},
	
	onGetTracks: function(e){
		var data = e;
		$target = $("#playlist ul");
          $('#loader').hide();
	    // add the loaded tracks to playlist
	    for( var i = 0; i < data.length; i++ ){
	        var cl = "odd";
	        var dl = '';
            if( i % 2 == 0 ) cl = "even";
			if (data[i].downloadable) dl = "<a class='down' title='Download' href='"+data[i].permalink_url+"/download'><img src='assets/images/down.png'></a>";  
	        var s = "<li class='" + cl + "'><span class='left'><a class='track' href='"+ data[i].uri +"'>"+ data[i].title +"</a>";
            s += "<span class='info'><i>"+ data[i].genre +"</i> <i>"+ data[i].playback_count +" plays</i></span></span>";
            s += "<span class='right'>"+ mkTime(data[i].duration) +"<br>"+dl+"</span></li>"; // <a class='web' title='Go to Soundcloud' href='"+data[i].permalink_url+"'><img src='assets/images/web.png'></a>
	        $("ul", "#playlist").append(s);
	    }
	      
	    // add click listener to tracks
	    $("a", "#playlist ul").click(function(event){
            
            if (!$(this).hasClass('down')) {					
				event.preventDefault();
				Sc.loadTrack($(this).attr('href'));
				$("li", "#playlist").removeClass("selected");
				$(this).parent().parent().addClass("selected");
				$(this).parent().parent().find('a').show();
				return false;
			}
	    });
        $('#actions a').show();
        
	      
	},
	
	loadTrack: function(url) {
		$.getJSON('http://soundcloud.com/oembed?format=js&iframe=false&show_comments=false&show_artwork=false&url='+url+'&callback=?', Sc.onLoadTrack);	
	},
	
	onLoadTrack: function(e) {
		var data = e;
		$('#player').html(data.html);
	}
}