function init_gauge() {

	var opts = {
	  lines: 12,				// The number of lines to draw
	  angle: 0.15,				// The length of each line
	  lineWidth: 0.44,			// The line thickness
	  pointer: {
	    length: 0.9,			// The radius of the inner circle
	    strokeWidth: 0.035,		// The rotation offset
	    color: '#000000'		// Fill color
	  },
	  limitMax: 'false',		// If true, the pointer will not go past the end of the gauge
	  colorStart: '#FFFFFF',	// Colors
	  strokeColor: '#E0E0E0',	// to see which ones work best for you
	  generateGradient: true
	};
	var target = document.getElementById('canvas_gauge');	// your canvas element
	var gauge = new Gauge(target).setOptions(opts);			// create sexy gauge!
	gauge.maxValue = 100;		// set max gauge value
	gauge.animationSpeed = 32;	// set animation speed (32 is default value)

	return gauge;
}

function init_donut() {

	var donut = Morris.Donut({
		  element: 'canvas_donut',
		  data: [
		    {label: "Inbound", value: 382},
		    {label: "Outbound", value: 164},
		    {label: "Manual", value: 49},
		    {label: "Internal", value: 31}
		  ],
		  colors: ["#5DB2FF", "#FB6E52", "#A0D468", "#FFCE55"]
		});

	return donut;
}

function init_spline(spline_data) {

	var spline = new Morris.Area({
		  element: 'canvas_spline',
		  data: spline_data,
		  xkey: 'x',
		  ykeys: ['y2', 'y'],
		  labels: ['Shadow', 'Total calls'],
		  xLabelFormat: function(x) {
			  return ''; // x.toString();
		  },
		  axes: true,
		  grid: true,
		  ymax: 100,
		  ymin: 0,
		  lineColors: ["#FAFAFA", "#2DC3E8"],
		  lineWidth: [1,1],
		  fillOpacity: 0.5,
		  parseTime: false,
		  pointSize: 0,
		  hideHover: true,
		  behaveLikeLine: true,
		  hoverCallback: function (index, options, content, row) {
			  var dt = new Date(row.x);
			  return "<b>" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "</b><br>" + row.y + " calls";
			}
		});

	return spline;
}

function getColor(value){
    //value from 0 to 1
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
// FROM: #A0D468
//   TO: #FB6E52
}

function stepChange(gauge, from, to) {

	$('#chart_gauge .chart_value').each(function() {
		var $this = $(this);
		jQuery({ cnt: from }).animate({ cnt: to }, {
			duration: 1000,
			easing: 'swing',
			step: function () {
	        	$this.html(Math.ceil(this.cnt)+"%");
	        	gauge.setOptions({
	        		colorStop: getColor(this.cnt/100)
	        	});
	        }
		});
	})
}


$( document ).ready(function() {

	var gauge = init_gauge();
    var donut = init_donut();


    /* *** */
    // initial value for gauge
    var gauge_val = Math.floor( Math.random()*100 );
    var gauge_prv = gauge_val;
    var gauge_switch = 0;

    gauge.set(gauge_val);
    $('#chart_gauge .chart_value').html(gauge_val+"%");
	gauge.setOptions({
		colorStop: getColor(gauge_val/100)
	});

	/* *** */
	var spline_data = [];
	var spline_val = Math.floor( Math.random()*100 );
	var spline_switch = 0;

	for(var i=0;i<20;i++) {

		spline_data.push({
			'x': new Date(),
			'y': spline_val,
			'y2': spline_val+40
		});

    	if(spline_val > 90 || spline_val < 10)
    		spline_val = 50;

    	var spline_chg = Math.floor( Math.random()*10 );
    	if(spline_switch == 1) {
    		spline_chg -= spline_chg*2;
    		spline_switch = 0;
    	} else {
    		spline_switch = 1;
    	}

    	spline_val += spline_chg;
	}
	
    var spline= init_spline(spline_data);

	/* *** */
	// initial value for donut
	var donut_val = 1;
	var donut_max = 3;


	var counter = 0;

	/* *** */
    // Bring life to the dials
    setInterval(function () {

    	/* * every 3 seconds * */
    	if(counter % 6 == 0) {
	    	// gauge interactivity
	    	if(gauge_val > 90 || gauge_val < 10)
	    		gauge_val = 50;
	
	    	var gauge_chg = Math.floor( Math.random()*10 );
	    	if(gauge_switch == 1) {
	    		gauge_chg -= gauge_chg*2;
	    		gauge_switch = 0;
	    	} else {
	    		gauge_switch = 1;
	    	}
	
	    	gauge_val += gauge_chg;
	    	gauge.set(gauge_val);
			stepChange(gauge, gauge_prv, gauge_val);
			gauge_prv = gauge_val;
    	}

    	/* * every 1 seconds * */
    	if(counter % 3 == 0) {
			// spline interactivity
	    	if(spline_val > 90 || spline_val < 10)
	    		spline_val = 50;
	
	    	var spline_chg = Math.floor( Math.random()*10 );
	    	if(spline_switch == 1) {
	    		spline_chg -= spline_chg*2;
	    		spline_switch = 0;
	    	} else {
	    		spline_switch = 1;
	    	}
	
	    	spline_val += spline_chg;
	
	    	// remove first point
	    	spline_data.splice(0,1);
	    	// add new point at the end
			spline_data.push({
				'x': new Date(),
				'y': spline_val,
				'y2': spline_val+40
			});
			spline.setData(spline_data);
    	}

		/* * every 5 seconds * */
		if(counter % 10 == 0) {
			// donut interactivity
			if(donut_val > donut_max)
				donut_val = 0;
			donut.select(donut_val++);
		}

		counter++;

    }, 500);
});