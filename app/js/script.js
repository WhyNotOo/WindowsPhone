/* Author:
 * Kevin ALBESSARD
 */

(function ($) {
	var datasources = Joshfire.factory.getDataSource("various"),
      options     = Joshfire.factory.config.template.options || {},
      icons       = new Array(),
      allSources  = new Object;

  icons['Twitter']  = 'img/windows/Twitter.png';
  icons['Flickr']   = 'img/windows/Photoshop.png';
  icons['Instagram']= 'img/windows/Text.png';

  var app = {

  	getDatasources: function() {
  		var main = $('.view1 .datasources'), i;

      $('.view1').after('<section class="view view2 hidden"><aside class="aside"><img src="img/arrow-back.png" title="See more" class="changeView" /></aside><section class="datasources"></section></section>');

      datasources.find({}, function (err, data) {
        if(err) {
          console.log('erreur : '+err);
          alert('Une erreur est survenue pendant le chargement de l\'application. Merci de recharger la page.');
        } else {
          $.map(data.entries, function (entry, idx) {
            allSources['source'+idx] = {
              'name'  : entry.name,
              'items' : entry.entries
            };
            var source = entry.entries;

            if(idx <= 5) {
      				main.append('<article class="datasource" data-id="source'+idx+'"><img src="'+icons[entry.name]+'" /><p class="number">'+source.length+'</p><h2>'+entry.name+'</h2></article>');
    	  		} else {
    	  			$('.view2 .datasources').append('<article class="datasource" data-id="'+idx+'"><img src="'+icons[entry.name]+'" /><p class="number">'+source.length+'</p><h2>'+entry.name+'</h2></article>');
    	  			$('.view1 .changeView').removeClass('hidden');
    	  		}
          });
          app.resizeItem();
        }
  		});
  	},

  	displayDatasource: function(source) {
			var content = allSources[source],
          list    = $('#sourceList ol');

      list.attr('data-name', source);

      if(content.name == "Twitter") {
        for(var i = 0, len = content.items.length; i < len; i++) {
          list.append('<li class="clearfix" data-item="'+i+'"><img class="thumbnail" src="'+content.items[i].author[0].image.contentURL+'" /><p class="title">'+content.items[i].name+'</p></li>');
        }
      } else {
        for(var i = 0, len = content.items.length; i < len; i++) {
          list.append('<li class="clearfix" data-item="'+i+'"><img class="large" src="'+content.items[i].contentURL+'" /></li>');
        }
      }

      app.slideView('#main', '#detailSource');
  	},

  	displayItem: function(source, item) {
      var content = allSources[source].items[item],
          daddy   = $('#detail'),
          date    = app.getDate(content.dateCreated);

      console.log(content);

      daddy.children('h3').html(content.name);
      daddy.children('.date').html(date);
      daddy.children('img').attr({ 'src': content.contentURL, 'title': content.name });
      daddy.children('.author').html(content.author[0].name);

      app.slideView('#detailSource', '#detailItem');
  	},

    slideView: function(start, end) {
      $(start).slideUp();
      $(end).removeClass('hidden').slideDown();
    },

    getDate: function(date) {
      Date.prototype.setISO8601 = function (string) {
          var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
              "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
              "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
          var d = string.match(new RegExp(regexp)),
              offset = 0,
              date = new Date(d[1], 0, 1);

          if (d[3]) { date.setMonth(d[3] - 1); }
          if (d[5]) { date.setDate(d[5]); }
          if (d[7]) { date.setHours(d[7]); }
          if (d[8]) { date.setMinutes(d[8]); }
          if (d[10]) { date.setSeconds(d[10]); }
          if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
          if (d[14]) {
              offset = (Number(d[16]) * 60) + Number(d[17]);
              offset *= ((d[15] == '-') ? 1 : -1);
          }
          offset -= date.getTimezoneOffset();
          time = (Number(date) + (offset * 60 * 1000));
          this.setTime(Number(time));
      }

      var dateCreated = new Date();
      dateCreated.setISO8601(date);

      var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          dateD = dateCreated.getDate(),
          dateM = dateCreated.getMonth(),
          dateY = dateCreated.getFullYear(),
          month = monthNames[dateM];
      return month+' '+dateD+' '+dateY;
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
  $('.datasource').live('click', function() {
  	app.displayDatasource($(this).attr('data-id'));
	});

  $('#sourceList li').live('click', function() {
    var source  = $('#sourceList ol').attr('data-name'),
        item    = $(this).attr('data-item');

    app.displayItem(source, item);
  });

// HAMMER JS + inclide js files in html
  // var hammer = new Hammer(document.getElementById("container"));
  // hammer.ondragstart = function(ev) { };
  // hammer.ondrag = function(ev) { };
  // hammer.ondragend = function(ev) { };
  // hammer.onswipe = function(ev) { };

  // hammer.ontap = function(ev) { };
  // hammer.ondoubletap = function(ev) { };
  // hammer.onhold = function(ev) { };

  // hammer.ontransformstart = function(ev) { };
  // hammer.ontransform = function(ev) { };
  // hammer.ontransformend = function(ev) { };

  // hammer.onrelease = function(ev) { };


  $('.changeView').live('click', function() {
  	$('.view1, .view2').toggleClass('hidden');
  });

  $('.backHome').live('click', function() {
    $('#sourceList ol').html('').attr('data-name', '');

    app.slideView('#detailSource', '#main');
  });

  $('.backList').live('click', function() {
    $('#detail').children('h3, .date, .desc').html('');
    $('#detail').children('img').attr({'title': '', 'src': ''});

    app.slideView('#detailItem', '#detailSource');
  });

// --- Launch app
	$(document).ready(function() {
		app.getDatasources();
	  $(window).resize(app.onResize);
	});

})(jQuery);