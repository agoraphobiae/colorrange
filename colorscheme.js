$(document).ready( function () {
	function validateHexCode(hex) {
		console.log("validate called with ", hex);
		if (hex[0] === "#") hex = hex.slice(1);
		if (hex.length != 6) return NaN;
		return parseInt(hex, 16);
	}
	function hexToRGBTriplet(hex) {
		return [
			Math.round(hex / 65536),
			Math.round(hex / 256 % 256),
			hex % 256];
	}
	function calculateColorRange(start, end, steps) {
		start = hexToRGBTriplet(start);
		end = hexToRGBTriplet(end);

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
					$("<div></div>")
						.addClass("swatch")
						.css("background-color", "rgb("+color[0]+","+color[1]+","+color[2]+")")
						.width(width + "%")
						.animate({height: "50px"}, 200)
				);
		});
	}


	$(".color_start").keyup(function() {
		console.log("keyup");
		start = validateHexCode($(this).val());
		end = validateHexCode($(this).next(".color_end").val());
		steps = parseInt($(this).siblings().closest(".color_steps").val());
		console.log(start + " " + end + " " + steps);
		if (!isNaN(start)) {
			console.log("updating " + $(this).val());
			$(this).data({
				lastGoodValue: $(this).val()
			});
		} else { return; }
		if( isNaN(end) || isNaN(steps)
			|| $(this).data("lastGoodValue") == $(this).val()) return;

		updateColorBar($(this).siblings().closest(".colorbar"),
			calculateColorRange(start, end, steps)
		);
	});
	$(".color_end").keyup(function() {
		start = parseInt($(this).prev(".color_start").val().slice(1), 16);
		end = parseInt($(this).val().slice(1), 16);
		steps = parseInt($(this).siblings().closest(".color_steps").val());
		if (!isNaN(end)) {
			console.log("updating " + $(this).val());
			$(this).data({
				lastGoodValue: $(this).val()
			});
		} else { return; }
		if( isNaN(start) || isNaN(steps) ) return;

		updateColorBar($(this).siblings().closest(".colorbar"),
			calculateColorRange(start, end, steps)
		);
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

	$(".color_start").data({lastGoodValue: $(".color_start").val()});
	$(".color_end").data({lastGoodValue: $(".color_end").val()});
});
