#cylon-pcduino

adapter for cylon on pcduino

##Install Node.js

Make sure you have internet connection and open up the terminal on the RPi.

Installing an ARM-version of Node has become very easy:
````
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb
````
That's it, basically. It shouldn't take too long to download and install.

To make sure it ran correctly, run node -v. It should return the current version.

Running npm -v or npm --version still gave me the known Illegal instruction error. However, installing modules with npm install works.

##install cylon-pcduino by the following command:

````
npm install cylon-pcduino
````

if you face the issue ssl error: Cert_not_yet_valid, that is because your system date of Ubuntu. change the date to the current date by usting
````
sudo date 120622012014.59
````
replace the 120622012014.59 to current time

##example

````js
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
````

##Todo

1, add pwm-pin.
2, add analog pin.
3, add i2c

##License

Copyright (c) 2014 Zhaoqiang Wang. Licensed under the Apache 2.0 license.
