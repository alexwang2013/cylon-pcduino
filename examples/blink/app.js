'use strict';
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

