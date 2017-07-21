/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var padEvents = ["a", "b", "x", "y", "start", "select", "rt-shoulder", "rb-shoulder", "lt-shoulder", "lb-shoulder", "l-axis", "r-axis"].reduce(function (acc, cur) {
	  acc[cur] = {
	    pressed: "gamepad-" + cur + "-pressed",
	    released: "gamepad-" + cur + "-released"
	  };
	  return acc;
	}, {});

	var defaultMappings = {
	  "0": "x",
	  "1": "a",
	  "2": "b",
	  "3": "y",
	  "9": "start",
	  "8": "select",
	  "5": "rt-shoulder",
	  "7": "rb-shoulder",
	  "4": "lt-shoulder",
	  "6": "lb-shoulder",
	  "10": "l-axis",
	  "11": "r-axis",
	  "12": "up",
	  "13": "down",
	  "14": "left",
	  "15": "right"
	};

	var knownMappings = {
	  "046d-c216-Logitech Dual Action": _extends({}, defaultMappings)
	};

	var controllers = {};
	var keymaps = {};
	var buttonstates = {};

	var initButtonStates = function initButtonStates(keymap) {
	  return Object.keys(keymap).reduce(function (acc, cur) {
	    acc[keymap[cur]] = false;
	    return acc;
	  }, {});
	};

	var registerController = function registerController(ev) {
	  controllers[ev.gamepad.index] = ev.gamepad;
	  keymaps[ev.gamepad.index] = knownMappings[ev.gamepad.id] || defaultMappings;
	  buttonstates[ev.gamepad.index] = initButtonStates(keymaps[ev.gamepad.index]);
	};

	var removeController = function removeController(_ref) {
	  var gamepad = _ref.gamepad;

	  delete controllers[gamepad.index];
	};

	function dispatchPadEvents() {
	  for (var idx in controllers) {
	    var controller = controllers[idx];

	    for (var i in controller.buttons) {
	      var _controller$buttons$i = controller.buttons[i],
	          pressed = _controller$buttons$i.pressed,
	          value = _controller$buttons$i.value;

	      var buttonMapping = keymaps[idx][i];

	      if (buttonMapping && buttonstates[idx][buttonMapping] !== pressed) {
	        buttonstates[idx][buttonMapping] = pressed;
	        window.dispatchEvent(new CustomEvent(padEvents[buttonMapping][pressed ? "pressed" : "released"], { detail: { controllerIndex: idx } }));
	      }

	      if (pressed && !buttonMapping) {
	        console.log("unmapped", i);
	      }
	    }
	  }

	  requestAnimationFrame(dispatchPadEvents);
	}

	dispatchPadEvents();

	window.addEventListener("gamepadconnected", registerController);
	window.addEventListener("gamepaddisconnected", removeController);
	Object.keys(padEvents).forEach(function (cur) {
	  window.addEventListener("gamepad-" + cur + "-pressed", function (ev) {
	    console.log("Controller " + ev.detail.controllerIndex + " pressed: " + cur);
	    console.log(JSON.stringify(controllers[0].buttons.map(function (b) {
	      return b.pressed;
	    })));
	  });
	  window.addEventListener("gamepad-" + cur + "-released", function (ev) {
	    return console.log("Controller " + ev.detail.controllerIndex + " released: " + cur);
	  });
	});

/***/ }
/******/ ]);