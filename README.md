cylon-pcduino
=============

adapter for cylon on pcduino


usage:
	install the cylon-pcduino by the following command:
	npm install cylon-pcduino

example:
	'use strict';

	console.log("hello test");
	var Cylon = require("cylon");

	Cylon.robot({
	  connections: {
	    pcduino: { adaptor: 'pcduino' }
	  },

	  devices: {
	    led: { driver: 'led', pin: 10 }
	  },

	  work: function(my) {
	   every((1).second(), my.led.toggle);
	  }
	}).start();


