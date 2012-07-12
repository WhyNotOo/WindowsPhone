/* Author:
 * Kevin ALBESSARD
 */

(function ($) {
	var datasources = ['twitter', 'wordpress', 'flickr', 'blabla', 'awesome', 'biloute', 'omg omg'];


  var app = {

  	getDatasources: function() {
  		var main = $('.view1 .datasources'), i;
  		for(i = 0, len = datasources.length; i < len; i++) {
  			if(i <= 5) {
  				main.append('<article class="datasource" data-id="'+i+'">'+datasources[i]+'</article>');
	  		} else {
	  			$('.view1').after('<section class="view view2 hidden"><aside class="aside"><img src="img/arrow-back.png" title="See more" class="changeView" /></aside><section class="datasources"></section></section>');
	  			$('.view2 .datasources').append('<article class="datasource" data-id="'+i+'">'+datasources[i]+'</article>');
	  			$('.view1 .changeView').removeClass('hidden');
	  		}
  		}
  		app.resizeItem();
  	},

  	changeView: function() {
  		$('.view1, .view2').toggleClass('hidden');
  	},

  	displayDatasource: function(source) {
			var id 			= $(source).attr('data-id'),
					content = datasources[id];

			$('#main').addClass('hidden');
			$('#detailSource').removeClass('hidden');
  		$('#detailSource #sourceList').html(content);
  	},

  	displayItem: function() {


  		$('#detailSource').addClass('hidden');
  		$('#detailItem').removeClass('hidden');
  	},

  	resizeItem: function() {
  		$('.datasource').each(function() {
  			var $this = $(this),
  					itemW = $this.width();

  			$this.height(itemW);
  		});
  	},

  	onResize: function() {
  		app.resizeItem();
  	},

  };
	// End app


// --- ACTIONS
  $('.datasource').live('click', function(e) {
  	app.displayDatasource(e.target);
	});

  $('.changeView').live('click', function() {
  	app.changeView();
  });

  $('.backHome').live('click', function() {
  	$('#detailSource').addClass('hidden');
  	$('#main').removeClass('hidden');
  });

  $('.backList').live('click', function() {
  	$('#detailItem').addClass('hidden');
  	$('#detailSource').removeClass('hidden');
  });

// --- Launch app
	$(document).ready(function() {
		app.getDatasources();
	  $(window).resize(app.onResize);
	});

})(jQuery);