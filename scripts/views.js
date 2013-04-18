$('document').ready(function() {
	$('.previous').click(function() {
		$('#offspring-list ul').animate({
			marginLeft: "+=114px"
		}, "fast");
	});
	$('.next').click(function() {
		$('#offspring-list ul').animate({
			marginLeft: "+=-114px"
		}, "fast");
	});

	$("#image").droppable({
    	drop: function(event, ui) {
			$(this).html(ui.draggable.attr('id'));
    		$('div').removeAttr('style');
    	},
    	hoverClass: 'cootie-hover'
    });
    $('#remove').droppable({
    	drop: function(event, ui) {
    		$(this).html('Dropped');
    	},
    	hoverClass: 'remove-hover'
    })

	$('li').draggable({
		start:  function(event, ui) {	
			$('div li').not('.ui-header, #wrapper, .ui-page, #offspring-panel, #image, #offspring-list').css('opacity', .75);
			$(this).css('opacity', 1); 
		},
		stop: function(event, ui) {
			$('div li').removeAttr('style');
		},
		appendTo: 'body',
		delay: 1000,
		opacity: .75,
		helper: 'clone',
		cursorAt: {left: 35, top: 35},
		tolerance: 'pointer'
	});

$(function() {      
      //Enable swiping...
      $("#offspring-scroll").swipe({
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount) {
			if(direction === 'right') {
					$('#offspring-list ul').animate({
						marginLeft: "+=-114px"
					}, "fast");
			} else if(direction === 'left') {
				$('#offspring-list ul').animate({
					marginLeft: "+=114px"
		}, "fast");
		}
			
		},
         threshold:0
		}
    );
	});
});
