
(function($) {
  var scrollNav = function() {
    $('a.scroll-nav').click(function(){  
      $(".active").removeClass("active");      
      $(this).closest('li').addClass("active");
      var theClass = $(this).attr("class");
      $('.'+theClass).parent('li').addClass('active');
      
      //Animate
      $('html, body').stop().animate({
          scrollTop: $( $(this).attr('href') ).offset().top - 160
      }, 400);
      return false;
    });
  };

  var contactForm = function(selector){
    var formUrl = 'http://getsimpleform.com/messages/ajax?form_api_token=88ed0c44bcf06188fac43ee443f49fa2';
    var form = $(selector);

    form.on('submit', function(e){
      e.preventDefault();
      var submitBtn = $(this).find("input[type='submit']");
      var formData = $(this).serialize();
      var thank_you = $('<p></p>').addClass('alert alert-success')
                      .html("Thanks for contacting us, we will respond soon.")
      submitBtn.addClass('sending');

      $.ajax({
        dataType: 'jsonp',
        url: formUrl,
        data: formData
      }).done(function() {
        setTimeout(function(){
            submitBtn.removeClass('sending').addClass('success');
            form.find("input[type='text']").val('')
            form.append(thank_you);
          }, 600);
      });
    });
  };

  var initTracking = function(){
    if(window.analytics){
      analytics.ready(function(){
        analytics.trackLink($('.banner-actions a.bg-green'), 'Request Demo clicked');
        analytics.trackLink($('.freetrail-btn a'), 'Try clicked');
      });
    }
  };

  var getUrlVars = function(href){
    var vars = {}, hash, q, domain;
    domain = href.split('?')[0],
    q = href.split('?')[1];
    
    if(q != undefined){
      var hashes = q.split('&');
      for(var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars[hash[0]] = hash[1];
      }
    }
    return [domain, vars];
  };


  var appendQueryParam = function(element, key, value){
    var href = element.attr('href'), parts = getUrlVars(href), domain = parts[0], params = parts[1], newhref, delimiter;

    params[key] = value;
    query = Object.keys(params).map(function(key){ return key + "=" + params[key] }).join('&');
    newhref = domain + "?" + query;
    element.prop('href', newhref);
  };

  var appendAnalyticsKey = function(){
    if(window.analytics) {
      analytics.ready(function(){
        var mx_user_id = mixpanel.get_distinct_id();
        $('.callback').find('a.btn').each(function(){
          appendQueryParam($(this), 'mx_user_id', mx_user_id);
        });
      });
    }
  };

  var initPlanPopup = function(){
    var modal = $('#try-modal');

    $('.plan-item a[data-plan]').on('click', function(ev){
      ev.preventDefault();
      var plan = $(ev.currentTarget).data('plan');
      modal.find('.callback a.btn').each(function(){
        var element = $(this);
        appendQueryParam(element, 'plan', plan);
      });
      modal.modal('show');
    });
  };

  $(function() {
    contactForm('#contact');
    scrollNav();
    initTracking();
    appendAnalyticsKey();
    initPlanPopup();
  });

})(jQuery);