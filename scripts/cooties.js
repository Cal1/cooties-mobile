$('document').ready(function() {
/*
    var c = function(){
        getImage: function() {
            return this.offspring[0].imgName;
        },
    };
    c.offspring = new Array(100);


    var cootieOne = {}
    cootieOne.seq = ['r','r','b','b','l','l']
    cootieOne.imgName = 'rbl.png'

    c.offspring.push(cootieOne);

    var myString = JSON.stringify(c);
    // document.write(myString);

*/
    var sequence = [];
    var offspring = [""];
    var genePanelIndex = 0;
    var rightPanel = new ScrollPanel();
    for (var i = 0; i < 5; i++) {
        sequence[i] = [];
    }
    var parts = [   ['body',  'r'],
                    ['ear',   'w'], 
                    ['eyes',  'p'],
                    ['mouth', 'l'],
                    ['feet',  'b']  ];

    var canvas = document.getElementById("offspring-image");
    var c_context = canvas.getContext("2d");


var loadOffspring = function(seq) {
    canvas.width = canvas.width;
    var imgName = "";
    for (var i = 0; i < seq.length; i++) {
        imgName += seq[i];
    }
    offspringImg = new Image();
    offspringImg.src = 'images/' + imgName + '.png';
    offspringImg.onload = function() {
        c_context.drawImage(offspringImg, 50, 70);
    };
};

var readSequence = function(seq) {
    if(seq[0] == seq[0].toUpperCase() || seq[1] == seq[1].toUpperCase()) {
        return seq[0].toUpperCase();
}
    return seq[0].toLowerCase();
};

function ScrollPanel() {
	var offspringCells = [];
        var sequences = [];
    	var lastCellIndex = 0;
	$('#gene-panel').click(function() {
		if(offspringCells[genePanelIndex] !== undefined) {
			offspringCells[genePanelIndex].find('p').text(sequence);
                        offspringCells[genePanelIndex].find('img').attr('src', 'images/' + getParts(sequence) +'.png');
		}
	});
	this.addOffspring = function(seq) {
                var $div = $('<li/>').attr('id', 'offspring' + genePanelIndex);
                var $offspringImg = $('<img/>');
                $offspringImg.attr('src', 'images/' + getParts(sequence) + '.png');
                $offspringImg.attr('width', '114px');
				$offspringImg.attr('height', '70px');
		var cell = $('<div ' + 'id="offspring' + (genePanelIndex+1) + '"><p>Offspring' + (genePanelIndex) + '</p><br />' + '<p>' + seq + '</p></div>');
		$div.click(function() {	
			for(var i = 0; i < offspringCells.length; i++) {
				if(offspringCells[i].attr('id') === $(this).attr('id')) {
					genePanelIndex = i;
					switchPanel();                             
					break;
				}
			}
		});
		//var a = $('<img src="images/' + getParts(sequence) + '.png" height="100" />')       
	//	cell.appendTo('#rightPanel');
        //        a.appendTo('#rightPanel');
             
                $div.append($offspringImg);
                $div.appendTo('#offspring-list ul');
		     //   offspringCells.push($div);
				createPopup(genePanelIndex);
	};
    
    this.setSelectedCell = function(index) {
     if(lastCellIndex!=undefined) offspringCells[lastCellIndex].css('background-color', 'white');
     offspringCells[index].css('background-color', 'blue');
     lastCellIndex = index;
        
    }
}

function Gene(trait, index) {
    this.trait = trait;
    this.addClicker = function() {
        $('#' + trait + ' .allele-box fieldset:eq(0) input[type="radio"]').on("click", {value: index}, function(event) {
	
            sequence[event.data.value][0] = event.target.value;
            changeSeq();
        });

        $('#' + trait + ' .allele-box fieldset:eq(1) input[type="radio"]').on("click", {value: index}, function(event) {
            sequence[event.data.value][1] = event.target.value;
            changeSeq();
        });
    }
}

var setParts = function(seq) {
    var pos = 0;
    var offspringParts = [];
    offspring[genePanelIndex] = "";
    
    for (var i = 0; i < seq.length; i+=2) {
        offspringParts[pos] = readSequence(seq[i] + seq[i+1]);
	offspring[genePanelIndex] += seq[i] + seq[i+1];
	pos++;
    }  
 	loadOffspring(offspringParts);
};

var getParts = function(seq) {
     
    var offspringParts = ""
    
    for (var i = 0; i < seq.length; i++) {
        offspringParts += readSequence(seq[i][0] + seq[i][1]);
    }  
    return offspringParts;

}

var done = false;
var changeSeq = function() {
    $('#debug').text(function() {
        var newSeq = "";
        for (var i = 0; i < sequence.length; i++) {
            if(sequence[i][0] == undefined) {
                newSeq += "";
                if(sequence[i][1] !== undefined) {
                    newSeq += sequence[i][1];
                }	
                    } else {
                            newSeq += sequence[i][0];
                            if(sequence[i][1] == undefined) {
                                    newSeq += ""
                            } else {
                                    newSeq += sequence[i][1];
                            }
                    }
       }
       if(done === false && (newSeq[9] === 'B' || newSeq[9] === 'b')) {
           done = true;
	       rightPanel.addOffspring(newSeq);
	       setParts(newSeq);
	       offspring[genePanelIndex] = newSeq;
       }   
       if(done === true) {
          
	       setParts(newSeq);
	       $('#gene-panel').trigger('click');
       }
        return "Index: " + genePanelIndex + " Sequence: " + newSeq;
    });
}

$('#next-button').on('click', function() {
    if(done) {
		genePanelIndex++;
		offspring.push();
        switchPanel();
    }
});

$('#previous-button').on('click', function() {
	if(genePanelIndex != 0) {
	    genePanelIndex--;
	    switchPanel();
	}
});

var setRadio = function(seq) {
	$('input[type="radio"]').prop('checked', false);
	var pos = 0;
	for(var i = 0; i < seq.length; i+=2) {
		if(seq[i] === seq[i].toUpperCase()) {
			$('#' + parts[pos][0] + ' .allele-box fieldset:eq(0) input:eq(0)').prop('checked', true);	
		} else {
			$('#' + parts[pos][0] + ' .allele-box fieldset:eq(0)  input:eq(1)').prop('checked', true);	
		} 
		if(seq[i+1] === seq[i+1].toUpperCase()) {
			$('#' + parts[pos][0] + ' .allele-box fieldset:eq(1) input:eq(0)').prop('checked', true);	
		} else {
			$('#' + parts[pos][0] + ' .allele-box fieldset:eq(1) input:eq(1)').prop('checked', true);	
		}
		pos++;	
	}

	$('input[type="radio"]').checkboxradio('refresh')
	done = true;
}

var switchPanel = function() {	
	var pos = 0;
	if(offspring[genePanelIndex] === undefined) {
		sequence = [];
		for (var i = 0; i < 5; i++) {
            		sequence[i] = [];
 	   	}
		$('input[type="radio"]').prop('checked', false);
		$('input[type="radio"]').checkboxradio('refresh');
		done = false;
	} else {
		if(offspring[genePanelIndex].length === 5) { return; }
		for(var i = 0; i < 10; i+=2) {
			sequence[pos][0] = offspring[genePanelIndex][i];
			sequence[pos][1] = offspring[genePanelIndex][i+1];
			pos++;
		}
		setRadio(offspring[genePanelIndex]);
	        var newSeq = "";
                for (var i = 0; i < sequence.length; i++) {
                    if(sequence[i][0] == undefined) {
                        newSeq += "";
                        if(sequence[i][1] !== undefined) {
                            newSeq += sequence[i][1];
                        }	
                            } else {
                                    newSeq += sequence[i][0];
                                    if(sequence[i][1] == undefined) {
                                            newSeq += ""
                                    } else {
                                            newSeq += sequence[i][1];
                                    }
                            }
	        }
	        setParts(newSeq);
                
            	rightPanel.setSelectedCell(genePanelIndex);
	}
	$('#debug').text("Index: " + genePanelIndex + " Sequence: " + sequence);
}
$('#debug').click(function() {
    console.log(offspring);

});


var createPopup = function(index) {
	var popup = '<div data-role="popup" class="popup" id="popup' + index + '"><a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a><center><p>Offspring ' + index + '</p></center><center><p class="allele-label"></p></center></div>'

	var lst = '<li id="offspring0"><a href="#popup' + index + '" data-rel="popup" data-transition="pop"><img src="images/RwPLB.png" width="114" height="70"/></a></li>'

	$('.ui-page').append(popup).trigger('create');	
	$('#offspring-list ul').append(lst).trigger('create');
}

var initializeCooties = function() {
	var genes = []
	for (var i = 0; i < parts.length; i++) {
	    genes.push(new Gene(parts[i][0], i));	
	    genes[i].addClicker();
	}
	$('#quit').on('click', function() {
		$('#debug').toggle();
	});
}
initializeCooties();
});

