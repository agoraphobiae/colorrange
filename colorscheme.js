$(document).ready( function () {
	function validateHexCode(hex) {
		console.log("validate called with ", hex);
		if (hex[0] === "#") hex = hex.slice(1);
		if (hex.length != 6) return NaN;
		return parseInt(hex, 16);
	}
	function hexToRGBTriplet(hex) {
		return [
			Math.floor(hex / 65536),
			Math.floor(hex / 256 % 256),
			hex % 256];
	}
	function RGBTripletToHex(rgb) {
		return ("#" + rgb[0].toString(16) +
			rgb[1].toString(16) +
			rgb[2].toString(16)).toUpperCase();
	}
	function calculateColorRange(start, end, steps) {
		start = hexToRGBTriplet(start);
		end = hexToRGBTriplet(end);
		if (steps > 100) steps = 100;

		var output = [];
		steps += 1;
		console.log(steps);

		// linear lol
		for(var i = 0; i <= steps; i++) {
			output.push( [
				Math.round(start[0] + i*((end[0] - start[0]) / steps)),
				Math.round(start[1] + i*((end[1] - start[1]) / steps)),
				Math.round(start[2] + i*((end[2] - start[2]) / steps)),
			] );
		}

		console.log(output);
		return output;
	}
	function updateColorBar(bar, colors) {
		var width = 100 / colors.length;
		console.log(bar);
		bar.empty();
		colors.forEach( function(color) {
			console.log("appending " + color + " as " + "rgb("+color[0]+","+color[1]+","+color[2]+")");
			bar
				.append(
					$('<div><a class="swatch-hex">'+RGBTripletToHex(color)+'</a></div>')
						.addClass("swatch")
						.css("background-color", "rgb("+color[0]+","+color[1]+","+color[2]+")")
						.width(width + "%")
						.animate({height: "50px"}, 200)
				);
		});
	}

	// DRY: start and end have very similar functionality
	// the me parameter identifies start vs endelem...
	// definitely a better way to design this
	function keyupEventHandler(startelem, endelem, me) {
		console.log("keyup");
		var start = validateHexCode(startelem.val());
		var end = validateHexCode(endelem.val());
		var steps = parseInt(startelem.siblings().closest(".color_steps").val());
		console.log(start + " " + end + " " + steps);
		if (!me) { // this is very not DRY
			if( isNaN(end) || isNaN(steps)
				|| startelem.data("lastGoodValue") == startelem.val()) return;
			if (!isNaN(start)) {
				console.log("updating " + startelem.val());
				startelem.data({
					lastGoodValue: startelem.val()
				});
			} else { return; }
		} else if (me === "end") {
			if( isNaN(start) || isNaN(steps)
				|| endelem.data("lastGoodValue") == endelem.val()) return;
			if (!isNaN(end)) {
				console.log("updating " + endelem.val());
				endelem.data({
					lastGoodValue: endelem.val()
				});
			} else { return; }
		}

		console.log("making update call");
		updateColorBar(startelem.siblings().closest(".colorbar"),
			calculateColorRange(start, end, steps)
		);
	}

	$(".color_start").keyup(function() {
		keyupEventHandler($(this), $(this).next(".color_end"));
	});
	$(".color_end").keyup(function() {
		keyupEventHandler($(this).prev(".color_start"), $(this), "end");
	});
	$(".color_steps").focusout(function() {
		keyupEventHandler($(this).siblings().closest(".color_start"),
			$(this).siblings().closest(".color_end"), $(this));
	});
	function colorLostFocus(elem) {
		console.log("replacing" + elem.val() + " with " + elem.data("lastGoodValue"));
		elem.val( elem.data("lastGoodValue") );
	}
	$(".color_start").focusout( function() {
		colorLostFocus($(this));
	});
	$(".color_end").focusout( function() {
		colorLostFocus($(this));
	});

	// initialize
	$(".color_start").data({lastGoodValue: $(".color_start").val()});
	$(".color_end").data({lastGoodValue: $(".color_end").val()});
	updateColorBar($(".colorbar"), // this will be wonky if bare index has more than 1 bar
		calculateColorRange(
			validateHexCode($(".color_start").val()),
			validateHexCode($(".color_end").val()),
			parseInt($(".color_steps").val())
		)
	);

});
