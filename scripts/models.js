$(function() {
var Offspring = Backbone.Model.extend({

	defaults: {
		body: '',
		ear: '',
		eyes: '',
		mouth: '',
		feet: ''
	},
	
	validate: function(attrs, options) {
		for(var key in this.toJSON()) {
			if(!isNaN(this.toJSON()[key])) {
				return 'Some alleles have not been set!';
			}
		}
	},

    imageName: function() {
    	var imgName = "";
    	for(var key in this.toJSON()) {
			imgName += this.createTrait(this.toJSON()[key]);
		}
		imgName += '.png';
		return imgName;
    },
    createTrait: function(alleles) {
  	  if(alleles[0] == alleles[0].toUpperCase() || alleles[1] == alleles[1].toUpperCase()) {
   	     return alleles[0].toUpperCase();
		}
    return alleles[0].toLowerCase();
}
});


// use this to store all the offspring
var OffspringCollection = Backbone.Collection.extend({
	model: Offspring,

	initialize: function() {

		// a remove event will trigger and remove the offspring thumbnail in the html
		// the popup for the corresponding thumbnail will also need to be removed
		this.on('remove', function(offspring) {
			console.log('Removed!');
		})
		// this will add an offspring thumbnail
	},

	comparator: 'order'
});

var offspringList = new OffspringCollection;
var offspringIndex = 0;

var GenePanel = Backbone.View.extend({

	initialize: function() {
		this.canvas = document.getElementById("offspring-image");
		this.c_context = this.canvas.getContext("2d");
	},

	setGenes: function() {
		console.log('Index: ' + offspringIndex);
		$('input[type="radio"]').prop('checked', false).checkboxradio('refresh');
		if(offspringList.at(offspringIndex).isValid()) {
			for(var key in offspringList.at(offspringIndex).toJSON()) {
				
				var seq = offspringList.at(offspringIndex).toJSON()[key] 
				if(seq[0] === seq[0].toUpperCase()) {
					$('#' + key + ' .allele-box fieldset:eq(0) input:eq(0)').prop('checked', true).checkboxradio('refresh');	
				} else {
					$('#' + key + ' .allele-box fieldset:eq(0)  input:eq(1)').prop('checked', true).checkboxradio('refresh');	
				} 
				if(seq[1] === seq[1].toUpperCase()) {
					$('#' + key + ' .allele-box fieldset:eq(1) input:eq(0)').prop('checked', true).checkboxradio('refresh');	
				} else {
					$('#' + key + ' .allele-box fieldset:eq(1) input:eq(1)').prop('checked', true).checkboxradio('refresh');	
				}			
			}
		this.canvas.width = this.canvas.width;
		var offspringImg = new Image();
		offspringImg.src = 'images/' + offspringList.at(offspringIndex).imageName();
		this.c_context.drawImage(offspringImg, 50, 70);
			
		}
	}
});

var genePanel = new GenePanel;

var OffspringPreview = Backbone.View.extend({

	tagName: 'li',

	template: _.template($('#offspring-scroll').html()),

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		$('input[type="radio"]').prop('checked', false);
		$(this.el).draggable({

			start:  function(event, ui) {	
			//	$('div li').not('.ui-header, #wrapper, .ui-page, #offspring-panel, #image, #offspring-list').css('opacity', .75);
			//	$(this).css('opacity', 1); 
			},
			stop: function(event, ui) {
			//	$('div li').removeAttr('style');
			},
			
			appendTo: 'body',
			delay: 1000,
			opacity: .75,
		//	helper: 'clone',
			cursorAt: {left: 35, top: 35},
			tolerance: 'pointer',
	});
	
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		
		if(this.model.isValid()) {
			this.$el.append('<img width="114" height="70" src="images/' + this.model.imageName() + '" />');
		}
		return this;
	},

	switchOffspring: function() {
		offspringIndex = offspringList.indexOf(this.model);
		console.log(this.model)
		genePanel.setGenes();
	},

	events: {
		// click event on thumbnail will switch to that offspring
		'click .offspring-thumbnail': 'switchOffspring',

	},
});

// This will add event listeners to the next/previous buttons 
var Cooties = Backbone.View.extend({

	el: $('#app'),

	initialize: function() {
	//	this.listenTo(offspringList, 'add', this.addOffpring);
	//	this.listenTo(offspringList, 'change', this.render)
		this.addOffspring(new Offspring);
		this.canvas = document.getElementById("offspring-image");
    	this.c_context = this.canvas.getContext("2d");
		$("#image").droppable({
    	drop: function(event, ui) {
			$(this).html(ui.draggable.attr('id'));
    		$('div').removeAttr('style');
    	},
    		hoverClass: 'cootie-hover'
    	});
    	console.log(offspringList);
    	
		$('#save').click(function() {
			var sequence = []
    		for(var i = 0; i < offspringList.length; i++) {
    			sequence.push("");
    			sequence[i] += offspringList.at(i).get('body');
    			sequence[i] += offspringList.at(i).get('ear');
    			sequence[i] += offspringList.at(i).get('eyes');
    			sequence[i] += offspringList.at(i).get('mouth');
   				sequence[i] += offspringList.at(i).get('feet');
    		}
    		var file = cooties.writeToCSV(sequence);
    		setSaveFile(file, 'offspring.csv', 'text/plain')
    	});

		$('#file_input').on('click', function(e){
    	    readFile(this.files[0], function(e) {
    	    	var content = $.csv.toObjects(e.target.result);
    		    setSaveFile(e.target.result, 'stuff.csv', 'text/plain');
    		 	var offspring = getOffspring(content);
    		 	cooties.loadFromFile(offspring);
       		}); 
    	});

    	$('#load').click(function(e) {
    		e.stopImmediatePropagation();
    		$('#file_input').trigger('click');
    	});
	},

	writeToCSV: function(seqList) {
		var csvFile = '"ID","Genotype 1","Phenotype 1","Genotype 2","Phenotype 2","Genotype3","Phenotype 3","Genotype 4","Phenotype 4","Genotype 5","Phenotype 5"';
		csvFile += '\n';
		var parts = ['Body', 'Ear', 'Eyes', 'Mouth', 'Feet']
		for(var i = 0; i < seqList.length; i++) {
			csvFile += '"' + (i+1).toString() + '",';
			for(var j = 0; j < 8; j+=2) {
				csvFile += '"' +  parts[j/2] +'",';
				csvFile += '"' + seqList[i][j] + seqList[i][j+1] + '",';
			}
			csvFile += '"Feet",' + '"' + seqList[i][8] + seqList[i][9] + '"';
			csvFile += '\n';
		}
		return csvFile;
	},

	events: {
		'click #body': 'changeSequence',
		'click #ear': 'changeSequence',
		'click #eyes': 'changeSequence',
		'click #mouth': 'changeSequence',
		'click #feet': 'changeSequence',
		'click #next-button': 'nextOffspring',
		'click #previous-button': 'previousOffspring'
	},

	addOffspring: function(offspring) {
		console.log('Added!');
		var view = new OffspringPreview({model: offspring});
		offspringList.add(offspring);
		this.$("#offspring-list ul").append(view.render().el)
	},

	loadFromFile: function(seqList) {
		for(seq in seqList) {
			offspringModel = new Offspring(seq);
			console.log(offspringModel);
			this.addOffspring(offspringModel);
		}
	},

	changeSequence: function(event) {
		var offspringPart = event.currentTarget.id;
		var momAllele = $('#' + offspringPart + ' .mom-alleles input[type="radio"]:checked');
		var dadAllele = $('#' + offspringPart + ' .dad-alleles input[type="radio"]:checked');
		console.log($(event.target).val())
		console.log('Mom ' + momAllele.length + ' Dad' + dadAllele.length);
		if(momAllele.length > 0 && dadAllele.length > 0) {
			console.log('..');
			var gene = momAllele.val() + dadAllele.val();
			(offspringList.at(offspringIndex)).set(offspringPart , gene);
		}
	if(offspringList.at(offspringIndex).isValid()) {
		this.canvas.width = this.canvas.width;
		var offspringImg = new Image();
		offspringImg.src = 'images/' + offspringList.at(offspringIndex).imageName();
		this.c_context.drawImage(offspringImg, 50, 70);
	}
		var parts = ""
		for(var key in offspringList.at(offspringIndex).toJSON()) {
			parts += offspringList.at(offspringIndex).toJSON()[key];
		}
		console.log('Index: ' + offspringIndex + ' Clicked on: ' + ' Sequence: ' + parts);
	},

	nextOffspring: function() {
		if((offspringList.at(offspringIndex+1) != undefined)) {
  			offspringIndex++;
  			genePanel.setGenes();
		} else {
			if(offspringList.at(offspringIndex).isValid()) {
				this.addOffspring(new Offspring);
				offspringIndex++;
				genePanel.setGenes();
			} else {
				console.log('Can\'t move to next. Please finish current offspring');
			}
		}
	}, 

	previousOffspring: function() {
		if(offspringIndex != 0) {
			offspringIndex--;
			genePanel.setGenes();
		}
	}
})
var cooties = new Cooties
});