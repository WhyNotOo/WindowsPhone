/* Author:
 * Kevin ALBESSARD
 */

(function ($) {
	var datasources = Joshfire.factory.getDataSource("various"),
      options     = Joshfire.factory.config.template.options || {},
      icons       = new Array(),
      sourceBase  = new Object,
      allSources  = new Object,
      containerW  = $('#container').width(),
      scrollerHome   = new iScroll('datasources', { scrollbarClass: 'scrollbar', hScroll: false }),
      scrollerList   = new iScroll('sourceList', { scrollbarClass: 'scrollbar', hScroll: false }),
      scrollerDetail = new iScroll('detail', { scrollbarClass: 'scrollbar', hScroll: false });

  icons['Twitter']  = 'img/windows/Twitter.png';
  icons['Flickr']   = 'img/windows/Photoshop.png';
  icons['Instagram']= 'img/windows/Text.png';
  icons['Blog']     = 'img/windows/Wapedia.png';
  icons['Youtube']  = 'img/windows/Yahoo.png';

  var app = {

  	getDatasources: function() {
  		var main = $('.view1 .datasources ul');

      // $('.view1').after('<section class="view view2 hidden"><aside class="aside"><img src="img/arrow-back.png" title="See more" class="changeView" /></aside><section class="datasources"></section></section>');

      for(var i = 0, len = datasources.children.length; i < len; i++) {
        sourceBase[datasources.children[i].name] = i;
      }

      datasources.find({limit:20}, function (err, data) {
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

            // if(idx <= 5) {
      				main.append('<li><article class="datasource" data-source="'+entry.name+'"><a href="#" title="'+entry.name+'"><img src="'+icons[entry.name]+'" /><p class="number">'+source.length+'</p><h2>'+entry.name+'</h2></a></article></li>');
    	  		// } else {
    	  		// 	$('.view2 .datasources').append('<article class="datasource" data-source="'+entry.name+'"><a href="#" title="'+entry.name+'"><img src="'+icons[entry.name]+'" /><p class="number">'+source.length+'</p><h2>'+entry.name+'</h2></a></article>');
    	  		// 	$('.view1 .changeView').removeClass('hidden');
    	  		// }
          });
          app.resizeItem();
          scrollerHome.refresh();
        }
  		});

      // Place views
      $('#detailSource, #detailItem').css('left', containerW);
  	},

    loadMoreEntries: function(source) {
      $('#detailSource').addClass('loading');
      $('#loadmore span').addClass('hidden');

      var src = sourceBase[source],
          limitless = 15;

      datasources.children[src].fetch({
        dataSourceQuery: {
          nocache: false,
          limit: limitless
        },
        success: function() {
          app.getUniqueSource(datasources);
        },
        error: function(err) {
          console.log(err);
        }
      });
    },

    getUniqueSource: function() {
      console.log('getUniqueSource');
      // $('#detailSource').removeClass('loading');
      // $('#loadmore span').removeClass('hidden');
      // console.log(result);
    },

  	displayDatasource: function(source) {
			var content = allSources[source],
          list    = $('#sourceList ul');

      list.attr('data-name', source);

      if(content.name == 'Twitter') {
        for(var i = 0, len = content.items.length; i < len; i++) {
          var image = (content.items[i].author[0].image.contentURL) ? content.items[i].author[0].image.contentURL : 'img/noimage.png';
          list.append('<li class="clearfix" data-item="'+i+'"><a href="#" title="'+content.items[i].name+'"><img class="thumbnail" src="'+image+'" /><p class="title">'+content.items[i].name+'</p></a></li>');
          // if(i==len-1)
            // app.scrollContent();
        }
      } else if(content.name == 'Blog' || content.name == 'Youtube') {
        for(var i = 0, len = content.items.length; i < len; i++) {
          var image = (content.items[i].image && content.items[i].image.contentURL) ? content.items[i].image.contentURL : 'img/noimage.png';
          list.append('<li class="clearfix" data-item="'+i+'"><a href="#" title=""><img class="large" src="'+image+'" /></a></li>');
        }
      } else {
        for(var i = 0, len = content.items.length; i < len; i++) {
          var image = (content.items[i].contentURL) ? content.items[i].contentURL : 'img/noimage.png';
          list.append('<li class="clearfix" data-item="'+i+'"><a href="#" title=""><img class="large" src="'+image+'" /></a></li>');
        }
      }

      app.slideView('#main', '#detailSource');
      scrollerList.scrollTo(0, 0, 100);

      setTimeout(function () {
        scrollerList.refresh();
      }, 3000);
  	},

  	displayItem: function(source, item) {
      var content = allSources[source],
          item    = content.items[item],
          detail   = $('#detail ul'),
          date;

      if(content.name == 'Twitter' || content.name == 'Blog' || content.name == 'Youtube') {
        date = (item.datePublished) ? app.getDate(item.datePublished) : 'No date';
        if(content.name == 'Twitter') {
          detail.children('.image').children('img').attr({ 'src': item.author[0].image.contentURL, 'title': item.name });
          detail.children('.author').html((item.author[0].name).toUpperCase());
        } else if(content.name == 'Blog') {
          detail.children('.image').children('img').attr({ 'src': (item.image) ? item.image.contentURL : 'img/noimage.png', 'title': item.name });
          detail.children('.author').html(((item.author) ? item.author.name : 'No author designed').toUpperCase());
          detail.children('.text').html(item.articleBody);
        } else if(content.name == 'Youtube') {
          detail.children('.author').html((item.author[0].name).toUpperCase());
          detail.children('.text').html(item.description);
          detail.children('.video').html('<iframe width="100%" height="300" src="'+item.embedURL+'&autoplay=1&modestbranding=1&iv_load_policy=3" frameborder="0" allowfullscreen="no"></iframe>')
        }
      } else {
        date = (item.dateCreated) ? app.getDate(item.dateCreated) : 'No date';
        detail.children('.author').html((item.author[0].name).toUpperCase());
        detail.children('.image').children('img').attr({ 'src': item.contentURL, 'title': item.name });
      }

      detail.children('.date').html(date);
      detail.children('.title').html(item.name);

      detail.children('.text').find('a').attr('target', '_blank');

      app.slideView('#detailSource', '#detailItem');

      setTimeout(function () {
        scrollerDetail.refresh();
      }, 1000);
  	},

    slideView: function(hide, show) {
      $(hide).animate({ left:'-'+(containerW+40)+'px' }, function() { $(this).addClass('hidden'); });
      $(show).removeClass('hidden').animate({ left:'4%' });
    },

    touchEvents: function() {
      var hammer = new Hammer(document.getElementById("container"), { prevent_default: true });

      // hammer.ondrag = function(e) {
      //   console.log(e);
      // };

      hammer.onswipe = function(e) {
        if(e.direction == 'right') {
          var visible = $('#container').children(':visible').attr('id');
          if(visible == 'detailSource') {
            app.clearview('list');
            app.slideView('#detailSource', '#main');
          } else if (visible == 'detailItem') {
            app.clearview('item');
            app.slideView('#detailItem', '#detailSource');
          }
        }
      };

      // hammer.ondragstart = function(ev) { };
      // hammer.ondragend = function(ev) { };
      // hammer.ontap = function(ev) { };
      // hammer.ondoubletap = function(ev) { };
      // hammer.onhold = function(ev) { };
      // hammer.ontransformstart = function(ev) { };
      // hammer.ontransform = function(ev) { };
      // hammer.ontransformend = function(ev) { };
      // hammer.onrelease = function(ev) { };
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

    clearview: function(clear) {
      if(clear == 'list') {
        $('#sourceList ul').html('').attr('data-name', '');
      } else if(clear == 'item') {
        $('#detail ul').children(':not(.image)').html('');
        $('#detail .image').children('img').attr({'title': '', 'src': ''});
      }
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
      scrollerHome.refresh();
      scrollerList.refresh();
      scrollerDetail.refresh();
  	},

  };
	// End app


// --- ACTIONS
  $('.datasource').live('click', function() {
  	app.displayDatasource($(this).attr('data-source'));
	});

  $('#sourceList li').live('dblclick', function() {
    var source  = $('#sourceList ul').attr('data-name'),
        item    = $(this).attr('data-item');
    app.displayItem(source, item);
  });

  $('#loadmore').click(function() {
    var source = $('#sourceList ul').attr('data-name');
    app.loadMoreEntries(source);
  });

  $('.changeView').live('click', function() {
  	$('.view1, .view2').toggleClass('hidden');
  });

  $('.backHome').live('click', function() {
    app.clearview('list');
    app.slideView('#detailSource', '#main');
  });

  $('.backList').live('click', function() {
    app.clearview('item');
    app.slideView('#detailItem', '#detailSource');
  });

  var supportsOrientationChange = "onorientationchange" in window,
      orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

// --- Launch app
	$(document).ready(function() {
    window.addEventListener(orientationEvent, app.onResize());
    $(window).resize(app.onResize);
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		app.getDatasources();
    app.touchEvents();
	});

})(jQuery);