/* Author:
 * Kevin ALBESSARD
 */

(function ($) {
	var datasources = Joshfire.factory.getDataSource("various"),
      options     = Joshfire.factory.config.template.options || {},
      icons       = new Array(),
      sourceBase  = new Object,
      allSources  = new Object,
      containerW  = $('#container').width();

  icons['Twitter']  = 'img/windows/Twitter.png';
  icons['Flickr']   = 'img/windows/Photoshop.png';
  icons['Instagram']= 'img/windows/Text.png';
  icons['Blog']     = 'img/windows/Wapedia.png';

  var app = {

  	getDatasources: function() {
  		var main = $('.view1 .datasources');

      $('.view1').after('<section class="view view2 hidden"><aside class="aside"><img src="img/arrow-back.png" title="See more" class="changeView" /></aside><section class="datasources"></section></section>');

      for(var i = 0, len = datasources.children.length; i < len; i++) {
        sourceBase[datasources.children[i].name] = i;
      }

      datasources.find({}, function (err, data) {
        if(err) {
          console.log('erreur : '+err);
          alert('Une erreur est survenue pendant le chargement de l\'application. Merci de recharger la page.');
        } else {
          $.map(data.entries, function (entry, idx) {
            allSources[entry.name] = {
              'name'  : entry.name,
              'items' : entry.entries
            };
            var source = entry.entries;

            if(idx <= 5) {
      				main.append('<article class="datasource" data-source="'+entry.name+'"><img src="'+icons[entry.name]+'" /><p class="number">'+source.length+'</p><h2>'+entry.name+'</h2></article>');
    	  		} else {
    	  			$('.view2 .datasources').append('<article class="datasource" data-source="'+entry.name+'"><img src="'+icons[entry.name]+'" /><p class="number">'+source.length+'</p><h2>'+entry.name+'</h2></article>');
    	  			$('.view1 .changeView').removeClass('hidden');
    	  		}
          });
          app.resizeItem();
        }
  		});

      // Place views
      $('#detailSource, #detailItem').css('left', containerW);
  	},

    getUniqueSource: function(result) {
      console.log(result);
    },

    loadMoreEntries: function(source) {
      $('#detailSource').addClass('loading');
      $('#loadmore span').addClass('hidden');

      var src = sourceBase[source];

      datasources.children[src].fetch({
        success: function(result) {
          $('#detailSource').removeClass('loading');
          $('#loadmore span').removeClass('hidden');
          app.getUniqueSource(result);
        }
      });
    },

  	displayDatasource: function(source) {
			var content = allSources[source],
          list    = $('#sourceList ol');

      list.attr('data-name', source);

      if(content.name == 'Twitter') {
        for(var i = 0, len = content.items.length; i < len; i++) {
          var image = (content.items[i].author[0].image.contentURL) ? content.items[i].author[0].image.contentURL : 'img/noimage.png';
          list.append('<li class="clearfix" data-item="'+i+'"><img class="thumbnail" src="'+image+'" /><p class="title">'+content.items[i].name+'</p></li>');
        }
      } else if(content.name == 'Blog') {
        for(var i = 0, len = content.items.length; i < len; i++) {
          if(content.items[i].image.contentURL != undefined)
            console.log(content.items[i].image.contentURL);
          else
            console.log('no image');
          var image = (content.items[i].image.contentURL) ? content.items[i].image.contentURL : 'img/noimage.png';
          list.append('<li class="clearfix" data-item="'+i+'"><img class="large" src="'+image+'" /></li>');
        }
      } else {
        for(var i = 0, len = content.items.length; i < len; i++) {
          var image = (content.items[i].contentURL) ? content.items[i].contentURL : 'img/noimage.png';
          list.append('<li class="clearfix" data-item="'+i+'"><img class="large" src="'+image+'" /></li>');
        }
      }

      app.slideView('#main', '#detailSource');
  	},

  	displayItem: function(source, item) {
      var content = allSources[source],
          item    = content.items[item],
          daddy   = $('#detail'),
          date;

      if(content.name == 'Twitter' || content.name == 'Blog') {
        date = app.getDate(item.datePublished);
        if(content.name == 'Twitter') {
          daddy.children('img').attr({ 'src': item.author[0].image.contentURL, 'title': item.name });
          daddy.children('.author').html((item.author[0].name).toUpperCase());
        } else if(content.name == 'Blog') {
          daddy.children('img').attr({ 'src': item.image.contentURL, 'title': item.name });
          daddy.children('.author').html((item.author.name).toUpperCase());
          daddy.children('.text').html(item.articleBody);
        }
      } else {
        date = app.getDate(item.dateCreated);
        daddy.children('.author').html((item.author[0].name).toUpperCase());
        daddy.children('img').attr({ 'src': item.contentURL, 'title': item.name });
      }

      daddy.children('.date').html(date);
      daddy.children('h3').html(item.name);

      app.slideView('#detailSource', '#detailItem');
  	},

    slideView: function(hide, show) {
      $(hide).animate({ left:'-'+(containerW+40)+'px' }, function() { $(this).addClass('hidden'); });
      $(show).removeClass('hidden').animate({ left:'4%' });
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
  	app.displayDatasource($(this).attr('data-source'));
	});

  $('#sourceList li').live('click', function() {
    var source  = $('#sourceList ol').attr('data-name'),
        item    = $(this).attr('data-item');

    app.displayItem(source, item);
  });

  $('#loadmore').click(function() {
    var source = $('#sourceList ol').attr('data-name');
    app.loadMoreEntries(source);
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
    $('#detail').children().html('');
    $('#detail').children('img').attr({'title': '', 'src': ''});
    app.slideView('#detailItem', '#detailSource');
  });

// --- Launch app
	$(document).ready(function() {
		app.getDatasources();
	  $(window).resize(app.onResize);
	});

})(jQuery);