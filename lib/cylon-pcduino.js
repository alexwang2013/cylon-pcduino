'use strict';

var PcDuino = require("./pcduino");

module.exports = {
  adaptors: ['pcduino'],
  dependencies: ['cylon-gpio'],

  adaptor: function(args) {
    return new PcDuino(args);
  }
};