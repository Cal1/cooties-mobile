var canvas = document.getElementById("offspringPanel");
var c_context = canvas.getContext("2d");

offspringImg = new Image();
offspringImg.src = 'images/bbPLb.png';
offspringImg.onload = function() {
	c_context.drawImage(offspringImg, 100, 100);
}

var geneSequence = [0,0,0,0,0,0,0,0,0,0];
var offSpring = new Array();
var rightPanel = new ScrollPanel();
var gPanel = new Array();
var genePanelManifest = new Array();
  for (var i = 0; i < 10; i++) {
    genePanelManifest[i] = new Array(20);
  }



var genePanelIndex = 0;

var offspringParts = [ ['body',  'r'],
					   ['ear',   'w'], 
					   ['eyes',  'p'],
					   ['mouth', 'l'],
					   ['feet',  'b'] ];
					   
function Gene(allele) {
	this.allele = allele;
	this.getGene = function() {
		
		var dominantAlleles = new Array(this.momDominantSelected, this.dadDominantSelected)
		var recessiveAlleles = new Array(this.momRecessiveSelected, this.dadRecessiveSelected);
		
		if(dominantAlleles[0] && dominantAlleles[1]) {
			return allele.toUpperCase() + allele.toUpperCase();
		} else if(recessiveAlleles[0] && recessiveAlleles[1]) {
			return allele + allele;
		} else {
			if(dominantAlleles[0] && recessiveAlleles[1]) {
				return allele.toUpperCase() + allele;
			} else {
				return allele + allele.toUpperCase();
			}
		}
	}
}

var updateGenePanel = function(index) {
	console.log(genePanelManifest[index].length);
	for(var i = 0; i < genePanelManifest[index].length; i++) {
		var a = genePanelManifest[index][i].getSelected();
		for(var j = 0; j < offspringParts.length; j++) {
			$('#' + offspringParts[i][0] + ' .alleleBox' + ' button').css('background-color', 'transparent');
			if(a[0]) {
				$("#" + offspringParts[i][0] + " button.momRecessive").css('background-color', 'cyan');
			}
		}
	}
}

var switchPanel = function(index) {

		var position = 0;
		for(var i = 0; i < offspringParts.length; i++) {
			geneSequence = [0,0,0,0,0,0,0,0,0,0];
			$('#' + offspringParts[i][0] + ' .alleleBox' + ' button').css('background-color', 'transparent');
			
			gPanel.push(new GenePanel(offspringParts[i], position));
			gPanel[i].setMomAlleles();
			gPanel[i].setDadAlleles();
			gPanel[i].addClicker();
			
			position += 2;
		}
}


var confirm = function(arr) {
	for(var i = 0; i < arr.length; i++) {
		if(typeof arr[i] !== 'string') {
			return false;
		}
	}
	return true;	
}


function GenePanel(offspringParts, pos) {
	var momClicked = false;
	var dadClicked = false;
	
	var trait = offspringParts[0];
	var allele = offspringParts[1];
	
	var g = new Gene(allele);	
	
	this.setMomAlleles = function() {
		g.momDominantSelected = false;
		g.momRecessiveSelected = false;
		var dominantAttr = "#" + trait + " button.momDominant";
		var recessiveAttr = "#" + trait + " button.momRecessive";		
		$(dominantAttr).click(function() {
			g.momDominantSelected = true;
			$(this).css('background-color', 'cyan');
				if(g.momRecessiveSelected === true) {
					$(recessiveAttr).css('background-color', 'transparent');
					g.momRecessiveSelected = false;
				}
				momClicked = true;
			});
		$(recessiveAttr).click(function() {
			g.momRecessiveSelected = true;
			$(this).css('background-color', 'cyan');
				if(g.momDominantSelected === true) {
					$(dominantAttr).css('background-color', 'transparent');
					g.momDominantSelected = false;
				}
				momClicked = true;			
		});
	}
	
	this.setDadAlleles = function(className) {
		g.dadDominantSelected = false;
		g.dadRecessiveSelected = false;
		var dominantAttr = "#" + trait + " button.dadDominant";
		var recessiveAttr = "#" + trait + " button.dadRecessive";		
		$(dominantAttr).click(function() {
			g.dadDominantSelected = true;
			$(this).css('background-color', 'cyan');
				if(g.dadRecessiveSelected === true) {
					$(recessiveAttr).css('background-color', 'transparent');
					g.dadRecessiveSelected = false;
				}
				dadClicked = true;
		});
		$(recessiveAttr).click(function() {
			g.dadRecessiveSelected = true;
			$(this).css('background-color', 'cyan');
				if(g.dadDominantSelected === true) {
					$(dominantAttr).css('background-color', 'transparent');
					g.dadDominantSelected = false;
				}
				dadClicked = true;
		});
	}
		
	this.getSelected = function() {
			return [g.momRecessiveSelected, g.momDominantSelected, g.dadRecessiveSelected, g.dadDominantSelected];
	}
	
	this.reset = function() {
		g.dadRecessiveSelected = false;
		g.dadDominantSelected = false;	
		g.momRecessiveSelected = false;
		g.momDominantSelected = false;
	}
	var checkIt = true;
	this.addClicker = function() {
		$('#' + trait + ' .alleleBox').unbind();
		$('#genePanel').unbind();
		$('#' + trait + ' .alleleBox').click(function() {
		if(momClicked && dadClicked) {
			geneSequence[pos] = g.getGene()[0];
			geneSequence[pos+1] = g.getGene()[1];
			if(confirm(geneSequence) && checkIt === true) {
				console.log(genePanelIndex.toString() + offSpring.length);
				if(genePanelIndex <= offSpring.length) {
					offSpring.push(geneSequence);
					rightPanel.addOffspring(geneSequence);
					offSpring.push(geneSequence);
					checkIt = true;
				}
				checkIt = false;
			}
			$('#test').text(geneSequence);
		}
		});
	}

	this.getGeneSeq = function() {
		return g.getGene();
	}
}

function ScrollPanel() {
	var offspringCells = new Array();
	
	this.addOffspring = function(seq) {
		var cellLabel = $('<p' + genePanelIndex + '"> Offspring' + genePanelIndex + '</p><br />');
		var cell = $('<p>' + seq + '</p>');
		cell.index = genePanelIndex;
		$('#genePanel').click(function() {
			offspringCells[genePanelIndex].text(geneSequence);
		});
		cell.click(function() {
			genePanelIndex = this.index;
			updateGenePanel(0);
		})
		cellLabel.appendTo('#rightPanel');
		cell.appendTo('#rightPanel');
		offspringCells.push(cell);
	}
	
	this.updateOffspring = function(index) {
		$(index.toString()).text('testing');
		this.draw();
	}
	
	this.draw = function() {
			for(var i = 0; i < offspringCells.length; i++) {
				
			}
	}
}

var initializeCooties = function() {
	
	var position = 0;

	for(var i = 0; i < offspringParts.length; i++) {
		gPanel.push(new GenePanel(offspringParts[i], position));
		gPanel[i].setMomAlleles();
		gPanel[i].setDadAlleles();
		gPanel[i].addClicker();
		position += 2;
	}
	$('#next').click(function() {
		if(offSpring[genePanelIndex+1] !== undefined) {
				
		for(var i = 0; i < gPanel.length; i++) {
			genePanelManifest[genePanelIndex][i] = gPanel[i];
		}
		gPanel = new Array();
		switchPanel();
		genePanelIndex++;
		} else {
			updateGenePanel(genePanelIndex+1);
		}
	});
}

$('#sss').click(function() {
	rightPanel.updateOffspring(0);

});

initializeCooties();
