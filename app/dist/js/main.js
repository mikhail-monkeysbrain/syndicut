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
		$('.form-registration').show(500)
	});
	$('#jsSignClose').click(function(){
		$('.form-registration').hide(500)
	});
});