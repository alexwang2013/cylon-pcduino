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


Todo:
	1, add pwm-pin.
	2, add analog pin.
	3, add i2c

License:

Copyright (c) 2014 Zhaoqiang Wang. Licensed under the Apache 2.0 license.
