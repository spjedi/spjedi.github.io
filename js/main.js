$(document).ready(function(){
	$('.clients-slider').slick({
		infinite: true,
		dots: false,
		speed: 100,
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
				slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
				slidesToShow: 1,
				slidesToScroll: 1
				}
			}
		]
	});

	$('.testimonials').slick({
		infinite: true,
		dots: false,
		speed: 400,
		autoplay: true,
		arrows: false,
		verticalSwiping: true,
		vertical: true,
		slidesToShow: 1,
		slidesToScroll: 1,
	});

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

});