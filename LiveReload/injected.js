(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LiveReloadInjected, liveReloadInjected;

LiveReloadInjected = require('../common/injected').LiveReloadInjected;

LiveReloadInjected.prototype.send = function(message, data) {
  return chrome.runtime.sendMessage([message, data]);
};

liveReloadInjected = new LiveReloadInjected(document, window, 'Chrome');

chrome.runtime.onMessage.addListener(function(arg, sender, sendResponse) {
  var data, eventName;
  eventName = arg[0], data = arg[1];
  switch (eventName) {
    case 'alert':
      return alert(data);
    case 'enable':
      return liveReloadInjected.enable(data);
    case 'disable':
      return liveReloadInjected.disable();
  }
});


},{"../common/injected":2}],2:[function(require,module,exports){
var CustomEvents, ExtVersion, LiveReloadInjected;

CustomEvents = {
  bind: function(element, eventName, handler) {
    if (element.addEventListener) {
      return element.addEventListener(eventName, handler, false);
    } else if (element.attachEvent) {
      element[eventName] = 1;
      return element.attachEvent('onpropertychange', function(event) {
        if (event.propertyName === eventName) {
          return handler();
        }
      });
    } else {
      throw new Error("Attempt to attach custom event " + eventName + " to something which isn't a DOMElement");
    }
  },
  fire: function(element, eventName) {
    var document, event;
    document = element instanceof HTMLDocument ? element : element.ownerDocument;
    if (element.addEventListener) {
      event = document.createEvent('HTMLEvents');
      event.initEvent(eventName, true, true);
      return document.dispatchEvent(event);
    } else if (element.attachEvent) {
      if (element[eventName]) {
        return element[eventName]++;
      }
    } else {
      throw new Error("Attempt to fire custom event " + eventName + " on something which isn't a DOMElement");
    }
  }
};

ExtVersion = require('./version');

LiveReloadInjected = (function() {
  function LiveReloadInjected(document1, window, extName) {
    var ref, ref1, ref2;
    this.document = document1;
    this.window = window;
    this.extName = extName;
    this._hooked = false;
    this._verbose = !!((ref = this.window) != null ? (ref1 = ref.location) != null ? (ref2 = ref1.href) != null ? ref2.match(/LR-verbose/) : void 0 : void 0 : void 0);
    setTimeout(((function(_this) {
      return function() {
        return _this.determineInitialState();
      };
    })(this)), 1);
  }

  LiveReloadInjected.prototype.determineInitialState = function() {
    if (this.findScriptTag()) {
      this.send('status', {
        enabled: true,
        active: true,
        initial: true
      });
      return this.hook();
    } else {
      return this.send('status', {
        enabled: false,
        active: false,
        initial: true
      });
    }
  };

  LiveReloadInjected.prototype.findScriptTag = function() {
    var element, i, len, m, ref, src;
    ref = this.document.getElementsByTagName('script');
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      if (src = element.src) {
        if (m = src.match(/\/livereload\.js(?:\?(.*))?$/)) {
          return element;
        }
      }
    }
    return null;
  };

  LiveReloadInjected.prototype.doDisable = function(callback) {
    var element;
    element = this.findScriptTag();
    if (element) {
      CustomEvents.fire(this.document, 'LiveReloadShutDown');
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
    return callback();
  };

  LiveReloadInjected.prototype.doEnable = function(arg) {
    var element, ref, scriptURI, url, useFallback;
    useFallback = arg.useFallback, scriptURI = arg.scriptURI, this.host = arg.host, this.port = arg.port;
    if (((ref = this.document.documentElement) != null ? ref.contentEditable : void 0) === 'true') {
      return;
    }
    if (useFallback) {
      url = scriptURI + "?ext=" + this.extName + "&extver=" + ExtVersion + "&host=" + this.host + "&port=" + this.port;
      if (this._verbose) {
        console.log("Loading LiveReload.js bundled with the browser extension...");
      }
    } else {
      url = "http://" + this.host + ":" + this.port + "/livereload.js?ext=" + this.extName + "&extver=" + ExtVersion;
      if (this._verbose) {
        console.log("Loading LiveReload.js from " + (url.replace(/\?.*$/, '')) + "...");
      }
    }
    this.hook();
    element = this.document.createElement('script');
    element.src = url;
    return this.document.body.appendChild(element);
  };

  LiveReloadInjected.prototype.hook = function() {
    if (this._hooked) {
      return;
    }
    this._hooked = true;
    CustomEvents.bind(this.document, 'LiveReloadConnect', (function(_this) {
      return function() {
        return _this.send('status', {
          active: true
        });
      };
    })(this));
    return CustomEvents.bind(this.document, 'LiveReloadDisconnect', (function(_this) {
      return function() {
        return _this.send('status', {
          active: false
        });
      };
    })(this));
  };

  LiveReloadInjected.prototype.disable = function() {
    return this.doDisable((function(_this) {
      return function() {
        return _this.send('status', {
          enabled: false,
          active: false
        });
      };
    })(this));
  };

  LiveReloadInjected.prototype.enable = function(options) {
    return this.doDisable((function(_this) {
      return function() {
        _this.doEnable(options);
        return _this.send('status', {
          enabled: true
        });
      };
    })(this));
  };

  return LiveReloadInjected;

})();

exports.LiveReloadInjected = LiveReloadInjected;


},{"./version":3}],3:[function(require,module,exports){
var ExtVersion;

module.exports = ExtVersion = '2.1.0';


},{}]},{},[1]);
