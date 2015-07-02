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

	// Google map
	 function initialize() {
        var mapCanvas = document.getElementById('map-canvas');
        var mapOptions = {
          center: new google.maps.LatLng(33.3111327, -111.9770588,665),
          zoom: 20,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(mapCanvas, mapOptions)
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      
});