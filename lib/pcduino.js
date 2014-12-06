'use strict';

var Cylon = require('cylon');
var PIN = require('./pin')
var PINS = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  17: 17,
  18: 18
};

var PcDuino = module.exports = function PcDuino() {
	PcDuino.__super__.constructor.apply(this, arguments);
	this.board = "";
	this.pins = {};
	this.myself = this;
};

Cylon.Utils.subclass(PcDuino, Cylon.Adaptor);

PcDuino.prototype.commands = [
	'pins', 'pinMode', 'digitalRead', 'digitalWrite',
	'firmwareName'
];

PcDuino.prototype.connect = function(callback) {
	this.proxyMethods(this.commands, this.board, this.myself);
	callback();
};

PcDuino.prototype.disconnect = function(callback) {
	Cylon.Logger.debug("Disconnecting all pins...");
	this._disconnectPins();
	Cylon.Logger.debug("Disconnecting from board '" + this.name + "'...");
	this.emit('disconnect');
	callback();
};

PcDuino.prototype.firmwareName = function() {
	return 'pcDuino';
};

PcDuino.prototype.digitalRead = function(pinNum, drCallback) {
	var pin = this.pins[this._translatePin(pinNum)];

	if (pin == null) {
		pin = this._digitalPin(pinNum, 'r');
		pin.on('digitalRead', function(val) {
			this.emit('digitalRead', val);
			drCallback(null, val);
		}.bind(this));
		pin.on('connect', function() {
			pin.digitalRead(20);
		});
		pin.connect();
	}

	return true;
};

PcDuino.prototype.digitalWrite = function(pinNum, value) {
	var pin = this.pins[this._translatePin(pinNum)];

	if ((pin != null)) {
		pin.digitalWrite(value);
	} else {
		pin = this._digitalPin(pinNum, 'w');
		pin.on('digitalWrite', function(val) {
			this.emit('digitalWrite', val);
		}.bind(this));
		pin.on('connect', function() {
			pin.digitalWrite(value);
		});
		pin.connect();
	}

	return value;
};

PcDuino.prototype._digitalPin = function(pinNum, mode) {
	var gpioPinNum;
	gpioPinNum = this._translatePin(pinNum);

	if (this.pins[gpioPinNum] == null) {
		this.pins[gpioPinNum] = new PIN({
			pin: gpioPinNum,
			mode: mode
		});
	}

	return this.pins[gpioPinNum];
};

PcDuino.prototype._translatePin = function(pinNum) {
	return PINS[pinNum];
};

PcDuino.prototype._disconnectPins = function() {
	var key, pin, _ref, _ref1, _results;
	_ref = this.pins;

	for (key in _ref) {
		pin = _ref[key];
		pin.closeSync();
	}

	_ref1 = this.pwmPins;
	_results = [];

	for (key in _ref1) {
		pin = _ref1[key];
		_results.push(pin.closeSync());
	}

	return _results;
};
