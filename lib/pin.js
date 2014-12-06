'use strict';

var FS = require('fs'),
    EventEmitter = require('events').EventEmitter;

var Cylon = require('cylon');

var GPIO_INPUT = 0,
GPIO_OUTPUT = 1,
GPIO_SERIAL = 3,
GPIO_INPUT_PU = 8,
GPIO_LOW = 0,
GPIO_HIGH = 1,
GPIO_PIN_COUNT = 50;

var GPIO_MODE_PATH = "/sys/devices/virtual/misc/gpio/mode/";
var GPIO_STATE_Path = "/sys/devices/virtual/misc/gpio/pin/";

var Pin = module.exports = function PwmPin(opts) {
	this.pinNum = opts.pin;
	this.mode = opts.mode;
	this.status = 'low';
	this.ready = false;
	this._mode_path = GPIO_MODE_PATH + "gpio" + this.pinNum;
	this._state_path = GPIO_STATE_Path + "gpio" + this.pinNum;
};

Cylon.Utils.subclass(Pin, EventEmitter);

Pin.prototype.connect = function() {
	if (this.mode == null) {
		this.mode = mode;
	}
	this._setMode(this.mode, true);
	this.emit('open');
};

Pin.prototype.close = function() {
	this.emit('close', this.pinNum);
};

Pin.prototype.closeSync = Pin.prototype.close;

Pin.prototype.digitalWrite = function(value) {
	if (this.mode !== 'w') {
		this._setMode('w');
	}
	this.status = value === 1 ? 'high' : 'low';

	FS.writeFile(this._state_path, value, function(err) {
		if (err) {
			this.emit('error', "Error occurred while writing value " + value + " to pin " + this.pinNum);
		} else {
			this.emit('digitalWrite', value);
		}
	}.bind(this));

	return value;
};

Pin.prototype.digitalRead = function(interval) {
	if (this.mode !== 'r') { this._setMode('r'); }

	Cylon.IO.Utils.every(interval, function() {
		FS.readFile(this._state_path, function(err, data) {
			if (err) {
				var error = "Error occurred while reading from pin " + this.pinNum;
				this.emit('error', error);
			} else {
				var readData = parseInt(data.toString());
				this.emit('digitalRead', readData);
			}
		}.bind(this));
	}.bind(this));
};

Pin.prototype.setHigh = function() {
	return this.digitalWrite(1);
};

Pin.prototype.setLow = function() {
	return this.digitalWrite(0);
};

Pin.prototype.toggle = function() {
	return (this.status === 'low') ? this.setHigh() : this.setLow();
};

Pin.prototype._setMode = function(mode, emitConnect) {
	if (emitConnect == null) { emitConnect = false; }

	this.mode = mode;

	var data = (mode === 'w') ? GPIO_OUTPUT : GPIO_INPUT;

	FS.writeFile(this._mode_path, String(data), function(err) {
		this._setModeCallback(err, emitConnect);
	}.bind(this));
};

Pin.prototype._setModeCallback = function(err, emitConnect) {
	if (err) {
		return this.emit('error', "Setting up pin direction failed");
	}

	this.ready = true;

	if (emitConnect) {
		this.emit('connect', this.mode);
	}
};
