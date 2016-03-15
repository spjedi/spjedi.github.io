$(document).ready(function(){
	$('.clients-slider').slick({
		infinite: true,
		dots: false,
		autoplaySpeed: 4000,
		autoplay: true,
		arrows: false,
		slidesToShow: 5,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
				dots: false
				}
			},
			{
				breakpoint: 850,
				settings: {
				slidesToShow: 3,
				slidesToScroll: 1
				}
			},
			{
				breakpoint: 768,
				settings: {
				slidesToShow: 3,
				slidesToScroll: 1
				}
			},
			{
				breakpoint: 640,
				settings: {
				slidesToShow: 2,
				centerMode: true,
				slidesToScroll: 1
				}
			},
			{
				breakpoint: 535,
				settings: {
				slidesToShow: 1,
				centerMode: true,
				slidesToScroll: 1
				}
			}
		]
	});

	$('.testimonials').slick({
		infinite: true,
		dots: false,
		autoplay: true,
		arrows: false,
		verticalSwiping: true,
		vertical: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplaySpeed: 8500,
	});


	window.sr = new scrollReveal();
	// resize header on scroll
	$(window).on('scroll', headerResizeHandler);

	function headerResizeHandler() {
		var distanceY = window.pageYOffset || document.documentElement.scrollTop,
			shrinkOn = 0,
			$header = $('.navbar');

		if (distanceY > shrinkOn) {
			$header.addClass("smaller");
		} else {
			$header.removeClass("smaller");
		}
	}
	headerResizeHandler();

	// Fancy box
	$("a#single_image").fancybox();
	
	$("a.group").fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600, 
		'speedOut'		:	200, 
		'overlayShow'	:	false

	});

	$("a#single_image_2")
    .attr('rel', 'gallery')
    .fancybox({
        padding    : 0,
        margin     : 15,
        nextEffect : 'fade',
        prevEffect : 'none',
        autoCenter : false,
        afterLoad  : function () {
            $.extend(this, {
                aspectRatio : false,
        		scrollOutside : false,
        		autoResize : true,
        		fitToView : false,
        		scrollbars : 'auto',
                type    : 'html',
                maxWidth   : '80%',
                content : '<div class="fancybox-image" style="background-image:url(' + this.href + '); background-size: cover; background-position:50% 50%;background-repeat:no-repeat;height:100%;width:100%;" /></div>'
            });
        }
    });


	$("#contactForm").submit(function(e) {
		e.preventDefault();

		var $that = $(this);

		var $name = $that.find('[name=name]'),
			$email = $that.find('[name=email]'),
			$subject = $that.find('[name=subject]'),
			$message = $that.find('[name=message]');

		var $button = $that.find('#msg button');

		$button.addClass('loading').prop('disabled', true);

		$.ajax({
			type: "POST",
			url: "https://mandrillapp.com/api/1.0/messages/send.json",
			data: {
				'key': 'vkzXy4TRFE87bF0uGwcvwQ',
				'message': {
					'from_email': $email.val(),
					'from_name': $name.val(),
					'headers': {
						'Reply-To': $email.val()
					},
					'subject': $subject.val(),
					'text': $message.val(),
					'to': [
						{
							'email': 'info@spjedi.com',
							'name': 'Jed Elliott',
							'type': 'to'
						}
					]
				}
			}
		})
		.done(function(response) {
			$button.removeClass('loading').prop('disabled', false);
			$name.val('');
			$email.val('');
			$subject.val('');
			$message.val('');

			$('.status-message').addClass('hidden');
			$('.status-message.text-success').removeClass('hidden');
		})
		.fail(function(response) {
			$('.status-message').addClass('hidden');
			$('.status-message.text-danger').removeClass('hidden');
		});
	});

	if ($(".main").length) $(".main").onepage_scroll({
	   sectionContainer: ".section",     // sectionContainer accepts any kind of selector in case you don't want to use section
	   easing: "ease",                   // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in" //
	   animationTime: 800,             // AnimationTime let you define how long each section takes to animate
	   pagination: false,
	   updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
	   beforeMove: function(index) {},  // This option accepts a callback function. The function will be called before the page moves.
	   afterMove: function(index) {},   // This option accepts a callback function. The function will be called after the page moves.
	   loop: true,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
	   keyboard: true,                  // You can activate the keyboard controls
	   responsiveFallback: 992,        // You can fallback to normal page scroll by defining the width of the browser in which
	                                    // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
	                                    // the browser's width is less than 600, the fallback will kick in.
	   direction: "vertical"            // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".  
	});

	$('#myCarousel2').carousel({
        interval: 3000
    });
});

// payments
$(function() {
	var $paymentButton = $('.paymentButton');
	if (!$paymentButton.length) return;

	var handler = StripeCheckout.configure({
		key: paymentSettings.STRIPE_PUBLIC_KEY,
		image: paymentSettings.DEFAULT_IMAGE_URL,
		locale: 'auto'
	});

	$paymentButton.on('click', function(e) {
		var $button = $(this);
		var data = $button.data();

		data.token = function(token) {
			// Use the token to create the charge with a server-side script.
			// You can access the token ID with `token.id`
			tokenHandler(token, data, $button);
		};

		// Open Checkout with further options
		handler.open(data);
		e.preventDefault();
	});

	// Close Checkout on page navigation
	$(window).on('popstate', function() {
		handler.close();
	});

	function tokenHandler(token, data, $button) {
		waitingPayment($button);

		$.ajax({
			type: 'POST',
			url: paymentSettings.HEROKU_SERVER_URL,
			data: {				
				sku: data.sku,
				email: token.email,
				token: token.id
			},
			dataType: 'json'
		})
		.done(function(response) {
			if (response.code && response.code === 'ok') successfulPayment($button);
			else failedPayment($button);
		})
		.error(function(response) {
			failedPayment($button);
		});
	}

	var buttonClasses = 'btn-primary btn-success btn-danger btn-info';

	function waitingPayment($button) {
		$button
			.prop('disabled', true)
			.removeClass(buttonClasses)
			.addClass('btn-info')
			.text('Processing payment');
	}

	function successfulPayment($button) {
		$button
			.prop('disabled', false)
			.removeClass(buttonClasses)
			.addClass('btn-success')
			.text('Payment successful');
	}

	function failedPayment($button) {
		$button
			.prop('disabled', false)
			.removeClass(buttonClasses)
			.addClass('btn-danger')
			.text('Payment failed');
	}
});


// Trainings

if ($('.training-page').length) {
	
	$.getJSON('/training_data.json', function (json) {	
		var i, thisWeek = null, nextWeek = null, previous = [];
		var week = getWeekBounds();

		for (i in json) {
			var training = json[i];
			var date = training.date.split('.');
			var time = training.time.split(':');
			training.datetime = new Date(parseInt(date[2]), parseInt(date[0]) - 1, parseInt(date[1]), parseInt(time[0]), parseInt(time[1]));

			if (training.datetime >= week.this.start && training.datetime <= week.this.end) {
				thisWeek = training;
				thisWeek.heading = 'This Week Training';
			}

			if (training.datetime >= week.next.start && training.datetime <= week.next.end) {
				nextWeek = training;
				nextWeek.heading = 'Next Week Training';
			}

			if (training.datetime < week.this.start) {
				previous.push(training);
			}
		}

		var weekTemplate = $.templates("#week-training-template");
		var previousEventsTemplate = $.templates("#previous-events-template");

		$("#week-container").append(weekTemplate.render(thisWeek), weekTemplate.render(nextWeek));
		$("#previous-events-container").append(previousEventsTemplate.render(previous));
	});
}

function getWeekBounds() {
	var curr = new Date();
	var currDay = curr.getDay();
	var dayOfWeek = currDay == 0 ? 6 : currDay - 1;
	var first = curr.getDate() - dayOfWeek;

	return {
		this: {
			start: setDate(curr, first, 'start'),
			end: setDate(curr, first + 6, 'end')
		},
		next: {
			start: setDate(curr, first + 7, 'start'),
			end: setDate(curr, first + 13, 'end')
		}
	};
}

function setDate(curr, date, type) {
	curr = new Date(curr);
	var d = new Date(curr.setDate(date));
	if (type == 'start') d.setHours(0, 0, 0);
	if (type == 'end') d.setHours(23, 59, 59);
	return d;
}
