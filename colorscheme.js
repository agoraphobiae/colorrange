$(document).ready(function () {
	function validateHexCode(hex) {
		console.log(hex);
		var validator = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
		if (validator.test(hex)) {
			if (hex[0] === "#") { hex = hex.slice(1); }
			return parseInt(hex, 16);
		} else {
			return NaN;
		}
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
		if (steps > 100) { steps = 100; }

		var output = [];
		steps += 1;
		console.log(steps);

		// linear lol
		for (var i = 0; i <= steps; i++) {
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
		bar.siblings().closest(".color_array").val("");
		colors.forEach( function(color) {
			console.log("appending " + color + " as " + "rgb("+color[0]+","+color[1]+","+color[2]+")");
			bar.append(
				$('<div><a class="swatch-hex">'+RGBTripletToHex(color)+'</a></div>')
					.addClass("swatch")
					.css("background-color", "rgb("+color[0]+","+color[1]+","+color[2]+")")
					.width(width + "%")
					.animate({height: "50px"}, 200)
			);

			bar.siblings().closest(".color_array").val(function (i, val) {
				if (val === "") {
					return '["' + RGBTripletToHex(color) + '"';
				} else {
					return val + ',"' + RGBTripletToHex(color) + '"';
				}
			});
		});

		bar.siblings().closest(".color_array").val(function (i, val) {
			return val + "]";
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

	$("#content").on("keyup", ".color_start", function() {
		keyupEventHandler($(this), $(this).next(".color_end"));
	});
	$("#content").on("keyup", ".color_end", function() {
		keyupEventHandler($(this).prev(".color_start"), $(this), "end");
	});
	$("#content").on("focusout", ".color_steps", function() {
		keyupEventHandler($(this).siblings().closest(".color_start"),
			$(this).siblings().closest(".color_end"), $(this));
	});
	function colorLostFocus(elem) {
		console.log("replacing" + elem.val() + " with " + elem.data("lastGoodValue"));
		elem.val( elem.data("lastGoodValue") );
	}
	$("#content").on("focusout", ".color_start", function() {
		colorLostFocus($(this));
	});
	$("#content").on("focusout", ".color_end", function() {
		colorLostFocus($(this));
	});


	var default_colors = [
		["#FD971F", "#F92672"],
		["#F9F5C2", "#66D9EF"],
		["#B8E7CB", "#D2304B"],
		["#FFFFFF", "#000000"]
	];
	var i = 0;
	function addColorScheme(addbutton) {
		addbutton.before(
			$('<div class="color_scheme"></div>')
				.append($('<input class="color_start">')
					.data({lastGoodValue: default_colors[i][0]})
					.val(default_colors[i][0]))
				.append($('<input class="color_end">')
					.data({lastGoodValue: default_colors[i][1]})
					.val(default_colors[i][1]))
				.append($('<input class="color_steps" value="5">'))
				.append($('<input class="color_array" readonly>'))
				.append($('<div class="colorbar"></div>'))
				.animate({height: "auto"}, 200)
		);
		i = 1+i < default_colors.length ? i + 1 : i;

		var newscheme = addbutton.prev();
		updateColorBar(newscheme.find(".colorbar"),
			calculateColorRange(
				validateHexCode(newscheme.find(".color_start").val()),
				validateHexCode(newscheme.find(".color_end").val()),
				parseInt(newscheme.find(".color_steps").val())
			)
		);
	}

	$(".button-add").click( function() {
		addColorScheme($(this));
	});


	// initialize
	addColorScheme($(".button-add"));
});
