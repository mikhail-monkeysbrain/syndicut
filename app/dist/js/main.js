$(document).ready(function(){
  $('.slider-top').owlCarousel({
    items:1,
    loop: true,
    autoplay: true,
    smartSpeed:1000,
    autoplayTimeout: 3000
  });
});


$(function () {
	$('#jsAddOpen').click(function(){
		$('.form-add').show(500)
	});
	//Не понял, что будет происходтиь по клику. Пока сделал так.
	//TODO funcname or with this
	$('#jsAddClose').click(function(){
		$('.form-add').hide(500)
	});

	$('#jsSignOpen').click(function(){
		$('.form-signin').show(500)
	});
	$('#jsSignClose').click(function(){
		$('.form-signin').hide(500)
	});
	
	$('#jsSignOpen').click(function(){
		$('.form-signin').show(500)
	});
	$('#jsSignClose').click(function(){
		$('.form-signin').hide(500)
	});
	
	$('#jsRegistrationOpen').click(function(){
		$('.form-registration').show(500)
	});
	$('#jsRegistrationClose').click(function(){
		$('.form-registration').hide(500)
	});
});