/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 49);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(40)('wks');
var uid = __webpack_require__(28);
var Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(4);
var ctx = __webpack_require__(10);
var hide = __webpack_require__(6);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(11);
var IE8_DOM_DEFINE = __webpack_require__(59);
var toPrimitive = __webpack_require__(60);
var dP = Object.defineProperty;

exports.f = __webpack_require__(5) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(13)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(3);
var createDesc = __webpack_require__(25);
module.exports = __webpack_require__(5) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(37);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var G = window.G = {};
window.G.init = function () {
    var leftPlayerContainer = document.getElementsByClassName('leftPlayer')[0];
    var rightPlayerContainer = document.getElementsByClassName('rightPlayer')[0];
    var ownPlayerContainer = document.getElementsByClassName('player')[0];
    var mainAreaContainer = document.getElementsByClassName('mainArea')[0];
    var scoreAreaContainer = document.getElementsByClassName('scoreArea')[0];
    var timerAreaContainer = document.getElementsByClassName('timer')[0];
    var dipaiAreaContainer = document.getElementsByClassName('dipai')[0];
    var startBtn = document.getElementById('startBtn');

    G.leftPlayerContainer = leftPlayerContainer;
    G.rightPlayerContainer = rightPlayerContainer;
    G.ownPlayerContainer = ownPlayerContainer;
    G.mainAreaContainer = mainAreaContainer;
    G.scoreAreaContainer = scoreAreaContainer;
    G.timerAreaContainer = timerAreaContainer;
    G.dipaiAreaContainer = dipaiAreaContainer;
    G.startBtn = startBtn;

    G.PLAYER_CONTAINER_INSERT_DIRECTION_LTR = 'ltr'; //插入玩家区域的牌的方向，从左往右插
    G.PLAYER_CONTAINER_INSERT_DIRECTION_TTB = 'ttb'; //插入玩家区域的牌的方向，从上往下插
    G.CARD_CLASSNAME = 'card'; //卡牌div的类名

    G.CONTAINER_CLICK = 'auto'; //是否在某块区域上禁止鼠标操作
    G.CONTAINER_NO_CLICK = 'none';

    G.DEALCARD_RATE = 100; //发牌的快慢速率，默认100毫秒
    G.OVERLAP_FACTOR = 0.7; //玩家牌不重叠的宽度比例
    G.OVERLAP_FACTOR_TTB = 0.07;

    G.CADR_IMG_ADDR = '../assets/poker.png';
    G.CARD_BACK_POS = '-1729px -671px';

    G.players = [];

    //socketio的事件
    G.SOCKETIO_PLAYERREADY = 'playerReady';
    G.SOCKETIO_JOINROOM = 'room_1';
    G.SOCKETIO_ROBLORD = 'robLord'; //客户端发送
    G.SOCKETIO_DRAWCARD = 'drawCard'; //客户端发送


    G.SOCKETIO_NEWS_PRIVATE = 'news_private'; //服务端、客户端都可发送
    G.SOCKETIO_NEWS_BROADCAST = 'news_broadcast'; //服务端、客户端都可发送
    G.SOCKETIO_ASSIGNROBLORD_ON = 'assignRobLord_on'; //服务端发送
    G.SOCKETIO_ASSIGNROBLORD_OFF = 'assignRobLord_off'; //服务端发送
    G.SOCKETIO_ASSIGNLORD = 'assignLord'; //服务端发送
    G.SOCKETIO_ASSIGNWINNER = 'assignWinner'; //服务端发送
    G.SOCKETIO_ASSIGNLOSER = 'assignLoser'; //服务端发送
    G.SOCKETIO_ASSIGNDRAWCARD_ON = 'assignDrawCard_on'; //服务端发送
    G.SOCKETIO_ASSIGNDRAWCARD_OFF = 'assignDrawCard_off'; //服务端发送
};

exports.default = G;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(78);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 17 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(26);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(70)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(24)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(10);
var call = __webpack_require__(42);
var isArrayIter = __webpack_require__(43);
var anObject = __webpack_require__(11);
var toLength = __webpack_require__(18);
var getIterFn = __webpack_require__(32);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(56);
var global = __webpack_require__(2);
var hide = __webpack_require__(6);
var Iterators = __webpack_require__(9);
var TO_STRING_TAG = __webpack_require__(0)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(36);
var defined = __webpack_require__(17);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(58);
var $export = __webpack_require__(1);
var redefine = __webpack_require__(61);
var hide = __webpack_require__(6);
var has = __webpack_require__(14);
var Iterators = __webpack_require__(9);
var $iterCreate = __webpack_require__(62);
var setToStringTag = __webpack_require__(29);
var getPrototypeOf = __webpack_require__(69);
var ITERATOR = __webpack_require__(0)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(40)('keys');
var uid = __webpack_require__(28);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(3).f;
var has = __webpack_require__(14);
var TAG = __webpack_require__(0)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(17);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(23);
var TAG = __webpack_require__(0)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(31);
var ITERATOR = __webpack_require__(0)('iterator');
var Iterators = __webpack_require__(9);
module.exports = __webpack_require__(4).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__(54);

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__(15);

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(23);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(11);
var dPs = __webpack_require__(63);
var enumBugKeys = __webpack_require__(41);
var IE_PROTO = __webpack_require__(27)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(38)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(68).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(11);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(9);
var ITERATOR = __webpack_require__(0)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(6);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(28)('meta');
var isObject = __webpack_require__(7);
var has = __webpack_require__(14);
var setDesc = __webpack_require__(3).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(13)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _global = __webpack_require__(12);

var _global2 = _interopRequireDefault(_global);

var _PlayUI = __webpack_require__(50);

var _PlayUI2 = _interopRequireDefault(_PlayUI);

var _RobBtnUI = __webpack_require__(109);

var _RobBtnUI2 = _interopRequireDefault(_RobBtnUI);

var _StartBtnUI = __webpack_require__(110);

var _StartBtnUI2 = _interopRequireDefault(_StartBtnUI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ready(fn) {
    if (document.addEventListener) {
        var addlistener = function addlistener() {
            document.removeEventListener('DOMContentLoaded', addlistener, false);
            fn();
        };

        document.addEventListener('DOMContentLoaded', addlistener, false);
    } else if (document.attachEvent) {
        var _addlistener = function _addlistener() {
            if (document.readyState == 'complete') {
                document.detachEvent('onreadystatechange', arguments.callee);
                fn();
            }
        };

        document.attachEvent('onreadystatechange', _addlistener);
    }
}

ready(function () {
    _global2.default.init();

    var socket = io.connect('http://localhost:3000');
    socket.on(_global2.default.SOCKETIO_NEWS_PRIVATE, function (data) {
        window.console.log('receive server message: ' + data);
        socket.emit(_global2.default.SOCKETIO_JOINROOM);
        window.console.log('client emit join room event');
    });

    socket.on(_global2.default.SOCKETIO_JOINROOM, function (data) {
        alert(data);
    });

    _global2.default.socket = socket;
    _StartBtnUI2.default.show();
    _RobBtnUI2.default.show();

    var play = new _PlayUI2.default();
    play.initPlayers();
    play.shuffleNewCardList();
    play.dealCards(play.cardList);
});

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = __webpack_require__(51);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = __webpack_require__(34);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _from = __webpack_require__(33);

var _from2 = _interopRequireDefault(_from);

var _getIterator2 = __webpack_require__(15);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = __webpack_require__(8);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(16);

var _createClass3 = _interopRequireDefault(_createClass2);

var _GameRule = __webpack_require__(81);

var _GameRule2 = _interopRequireDefault(_GameRule);

var _CardUI = __webpack_require__(106);

var _CardUI2 = _interopRequireDefault(_CardUI);

var _global = __webpack_require__(12);

var _global2 = _interopRequireDefault(_global);

var _CardData = __webpack_require__(107);

var _CardData2 = _interopRequireDefault(_CardData);

var _Player = __webpack_require__(108);

var _Player2 = _interopRequireDefault(_Player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlayUI = function () {
    /**
     * 构造函数内移除除了本玩家手牌区域的鼠标事件
     */
    function PlayUI() {
        (0, _classCallCheck3.default)(this, PlayUI);

        var noclickContainers = [_global2.default.leftPlayerContainer, _global2.default.ownPlayerContainer, _global2.default.rightPlayerContainer, _global2.default.mainAreaContainer, _global2.default.scoreAreaContainer, _global2.default.timerAreaContainer, _global2.default.dipaiAreaContainer];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(noclickContainers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var dom = _step.value;

                this.disableClick(dom, _global2.default.CONTAINER_NO_CLICK);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        this.enableRightClick();
        this.disableDrag();

        this.playerStateGenerator = null;
        this.leftPlayer = null;
        this.rightPlayer = null;
        this.ownPlayer = null;
    }

    /**
     * 在容器内生成牌
     * @param {*} container 
     * @param {*} cardList 
     * @param {*} direction 
     */


    (0, _createClass3.default)(PlayUI, [{
        key: 'renderCards',
        value: function renderCards(container, cardList) {
            var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_LTR;

            this.removeAllCards(container);
            Array.prototype.sort.call(cardList, _GameRule2.default.cardSort);

            var left = 0,
                top = 0;
            var overlapFactor = _global2.default.OVERLAP_FACTOR,
                overlapFactor_TTB = _global2.default.OVERLAP_FACTOR_TTB; //两张牌不重叠的宽度比例

            for (var i = 0; i < cardList.length; i++) {
                var num = cardList[i].val,
                    type = cardList[i].type,
                    iconPos = cardList[i].iconPos;
                var card = new _CardUI2.default(num, type.toString(), iconPos, container);
                container.appendChild(card.domInstance);

                var len = cardList.length;
                var cardwidth = card.domInstance.offsetWidth,
                    cardheight = card.domInstance.offsetHeight;

                var cardsWidth = cardwidth + cardwidth * overlapFactor * (len - 1),
                    cardsHeight = cardheight + cardheight * overlapFactor_TTB * (len - 1);
                var gapwidth_ltr = (container.offsetWidth - cardsWidth) / 2,
                    gapheight_ltr = (container.offsetHeight - cardheight) / 2,
                    gapwidth_ttb = (container.offsetWidth - cardwidth) / 2,
                    gapheight_ttb = (container.offsetHeight - cardsHeight) / 2;

                switch (direction) {
                    case _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_LTR:
                        {
                            if (i == 0) {
                                left = left + gapwidth_ltr;
                            }
                            card.domInstance.style.left = left + 'px';
                            card.domInstance.style.bottom = gapheight_ltr + 'px';
                            left = left + cardwidth * overlapFactor;
                            break;
                        }
                    case _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_TTB:
                        {
                            if (i == 0) {
                                top = top + gapheight_ttb;
                            }
                            card.domInstance.style.top = top + 'px';
                            card.domInstance.style.left = gapwidth_ttb + 'px';
                            top = top + cardheight * overlapFactor_TTB;
                            break;
                        }
                }
            }
        }

        /**
         * 清楚容器内的所有牌
         * @param {*} container 
         */

    }, {
        key: 'removeAllCards',
        value: function removeAllCards(container) {
            var cards = (0, _from2.default)(container.getElementsByClassName(_global2.default.CARD_CLASSNAME));
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(cards), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var card = _step2.value;

                    container.removeChild(card);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: 'shuffleNewCardList',
        value: function shuffleNewCardList() {
            this.cardList = _CardData2.default.getNewCard();
        }

        /**
         * 从一个总的牌数组中随机抽取指定数量的牌
         * @param {需要分发掉的总的牌的数据数组} array 
         * @param {需要从总牌中发多少张出来} num 
         * @param {发出来的牌的数据数组} targetArray 
         */

    }, {
        key: 'randomShuffleCards',
        value: function randomShuffleCards(array, num, targetArray) {
            var len = array.length;
            if (targetArray.length < num) {
                var deleteIndex = Math.floor(Math.random() * len);
                var item = array[deleteIndex];
                Array.prototype.splice.call(array, deleteIndex, 1);
                targetArray.push(item);
                this.randomShuffleCards(array, num, targetArray);
            }
            return [targetArray, array];
        }
    }, {
        key: 'dealCards',
        value: function dealCards(cardList) {
            var _this = this;

            var _G$players = (0, _slicedToArray3.default)(_global2.default.players, 3),
                player1 = _G$players[0],
                player2 = _G$players[1],
                player3 = _G$players[2];

            var self = this;

            var dealer = /*#__PURE__*/_regenerator2.default.mark(function dealer() {
                var onecard, _onecard, _onecard2;

                return _regenerator2.default.wrap(function dealer$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (false) {
                                    _context.next = 18;
                                    break;
                                }

                                onecard = self.randomShuffleCards(cardList, 1, [])[0];

                                Array.prototype.push.call(player1.cardList, onecard[0]);
                                if (player1.isOwn == true) {
                                    self.renderCards(_global2.default.ownPlayerContainer, player1.cardList, _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                                } else {
                                    self.renderCards(_global2.default.leftPlayerContainer, player1.cardList, _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_TTB);
                                }
                                _context.next = 6;
                                return;

                            case 6:
                                _onecard = self.randomShuffleCards(cardList, 1, [])[0];

                                Array.prototype.push.call(player2.cardList, _onecard[0]);
                                if (player2.isOwn == true) {
                                    self.renderCards(_global2.default.ownPlayerContainer, player2.cardList, _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                                } else {
                                    self.renderCards(_global2.default.leftPlayerContainer, player2.cardList, _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_TTB);
                                }
                                _context.next = 11;
                                return;

                            case 11:
                                _onecard2 = self.randomShuffleCards(cardList, 1, [])[0];

                                Array.prototype.push.call(player3.cardList, _onecard2[0]);
                                if (player3.isOwn == true) {
                                    self.renderCards(_global2.default.ownPlayerContainer, player3.cardList, _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                                } else {
                                    self.renderCards(_global2.default.rightPlayerContainer, player3.cardList, _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_TTB);
                                }
                                _context.next = 16;
                                return;

                            case 16:
                                _context.next = 0;
                                break;

                            case 18:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, dealer, this);
            });

            var d = dealer();

            var itv = setInterval(function () {
                if (player1.cardList.length == 17 && player2.cardList.length == 17 && player3.cardList.length == 17) {
                    clearInterval(itv);
                    _this.renderCards(_global2.default.dipaiAreaContainer, cardList, _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
                    _this.disableClick(_global2.default.ownPlayerContainer, _global2.default.CONTAINER_CLICK);
                    _this.enableSwipeSelect();
                } else {
                    d.next();
                }
            }, _global2.default.DEALCARD_RATE);
        }
    }, {
        key: 'rightClickDrawCards',
        value: function rightClickDrawCards(e) {
            this.drawCards();
            window.event.returnValue = false;
            e.stopPropagation(); //阻止事件冒泡
            return false;
        }
    }, {
        key: 'drawCards',
        value: function drawCards() {
            var dom = _global2.default.ownPlayerContainer;
            var cardsArray = (0, _from2.default)(dom.getElementsByClassName(_global2.default.CARD_CLASSNAME));

            var selectedCards = []; //被选中的牌的div元素
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(cardsArray), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var div = _step3.value;

                    if (div.getAttribute('selected') == 'true') {
                        selectedCards.push(div);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var selectedCardList = []; //被选中的牌的数据
            var ownPlayer = void 0;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = (0, _getIterator3.default)(_global2.default.players), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var p = _step4.value;

                    if (p.isOwn == true) {
                        ownPlayer = p;
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)(selectedCards), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var card = _step5.value;
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = (0, _getIterator3.default)(ownPlayer.cardList.entries()), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var _step6$value = (0, _slicedToArray3.default)(_step6.value, 2),
                                index = _step6$value[0],
                                carddata = _step6$value[1];

                            if (carddata.val == card.getAttribute('val') && carddata.type == card.getAttribute('type')) {
                                selectedCardList.push(carddata);
                                ownPlayer.cardList.splice(index, 1);
                            }
                        }
                    } catch (err) {
                        _didIteratorError6 = true;
                        _iteratorError6 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }
                        } finally {
                            if (_didIteratorError6) {
                                throw _iteratorError6;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            this.renderCards(_global2.default.mainAreaContainer, selectedCardList, _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
            this.renderCards(_global2.default.ownPlayerContainer, ownPlayer.cardList, _global2.default.PLAYER_CONTAINER_INSERT_DIRECTION_LTR);
        }
    }, {
        key: 'initPlayers',
        value: function initPlayers() {
            var p1 = new _Player2.default('A'),
                p2 = new _Player2.default('B'),
                p3 = new _Player2.default('C');

            p1.isOwn = true;

            _global2.default.players = [p1, p2, p3];

            var flag = _GameRule2.default.random(0, 2);

            var generator = /*#__PURE__*/_regenerator2.default.mark(function generator() {
                return _regenerator2.default.wrap(function generator$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (false) {
                                    _context2.next = 9;
                                    break;
                                }

                                _context2.next = 3;
                                return _global2.default.players[0];

                            case 3:
                                _context2.next = 5;
                                return _global2.default.players[1];

                            case 5:
                                _context2.next = 7;
                                return _global2.default.players[2];

                            case 7:
                                _context2.next = 0;
                                break;

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, generator, this);
            });
            this.playerStateGenerator = generator();

            // this.setCurrentPlayer(G.players[flag]);
        }
    }, {
        key: 'setPlayerOrder',
        value: function setPlayerOrder() {}
    }, {
        key: 'nextPlayer',
        value: function nextPlayer() {
            var p = this.playerStateGenerator.next().value;
            return p;
        }
    }, {
        key: 'setCurrentPlayer',
        value: function setCurrentPlayer(player) {
            var flag = true;
            while (flag) {
                var p = this.nextPlayer();
                if (p.name == player.name && p.uuid == player.uuid) {
                    p.isCurrentPlayer = true;
                }
            }
        }
    }, {
        key: 'getCurrentPlayer',
        value: function getCurrentPlayer() {
            var players = _global2.default.players;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = (0, _getIterator3.default)(players), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var p = _step7.value;

                    if (p.isCurrentPlayer == true) {
                        return p;
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }
        }
    }, {
        key: 'disableClick',
        value: function disableClick(container, clicktype) {
            container.style.pointerEvents = clicktype;
        }

        /**
         * 启用新的右键单击监听处理函数，右键出牌
         */

    }, {
        key: 'enableRightClick',
        value: function enableRightClick() {
            var _this2 = this;

            var bd = document.getElementsByTagName('body')[0];

            bd.addEventListener('contextmenu', function (e) {
                _this2.drawCards();
                window.event.returnValue = false;
                e.stopPropagation(); //阻止事件冒泡
                return false;
            });
        }

        /**
         * 启用左键拖动选牌
         */

    }, {
        key: 'enableSwipeSelect',
        value: function enableSwipeSelect() {
            var dom = _global2.default.ownPlayerContainer;

            var lastDownX = 0,
                lastUpX = 0;

            dom.addEventListener('mousedown', function (e) {
                //js里mousedown、mouseup、click等事件左右键还是滚轮要区分一下，e.button=0是左键，1是滚轮，2是右键
                if (e.button != 0) {
                    return;
                }
                var m_x = e.clientX;

                //div居中的时候经过了translate平移，translate平移不会改变offsetLeft和offsetTop的值，直接减offsetLeft不准
                var x = m_x - (dom.offsetLeft - dom.offsetWidth / 2);
                lastDownX = x;
            });

            dom.addEventListener('mouseup', function (e) {
                //js里mousedown、mouseup、click等事件左右键还是滚轮要区分一下，e.button=0是左键，1是滚轮，2是右键
                if (e.button != 0) {
                    return;
                }

                var dom = _global2.default.ownPlayerContainer;

                var cardArray = (0, _from2.default)(dom.getElementsByClassName(_global2.default.CARD_CLASSNAME)),
                    firstCard = cardArray[0],
                    lastCard = cardArray[cardArray.length - 1];

                var cardwidth = firstCard.offsetWidth,
                    increment = cardwidth * _global2.default.OVERLAP_FACTOR;

                var m_x = e.clientX;

                //div居中的时候经过了translate平移，translate平移不会改变offsetLeft和offsetTop的值，直接减offsetLeft不准
                var x = m_x - (dom.offsetLeft - dom.offsetWidth / 2);
                lastUpX = x;

                var swipeWidth = lastUpX - lastDownX;

                var _ref = swipeWidth >= 0 ? [lastDownX, lastUpX] : [lastUpX, lastDownX],
                    _ref2 = (0, _slicedToArray3.default)(_ref, 2),
                    qidian = _ref2[0],
                    zhongdian = _ref2[1];

                if (zhongdian < firstCard.offsetLeft || qidian > lastCard.offsetRight) {
                    return;
                } else {
                    var qidian_index = (qidian - firstCard.offsetLeft) / increment;
                    if (qidian_index < 0) {
                        qidian_index = 0;
                    } else {
                        qidian_index = Math.floor(qidian_index);
                    }

                    var zhongdian_index = Math.floor((zhongdian - firstCard.offsetLeft) / increment);
                    if (zhongdian_index > cardArray.length - 1) {
                        zhongdian_index = cardArray.length - 1;
                    }

                    console.log(lastDownX, lastUpX, qidian_index, zhongdian_index);
                    for (var i = qidian_index; i <= zhongdian_index; i++) {
                        var _dom = cardArray[i];

                        if (_dom.getAttribute('selected') == 'false' || _dom.getAttribute('selected') == null) {
                            _dom.style.transform = 'translateY(-3rem)';
                            _dom.setAttribute('selected', true);
                        } else if (_dom.getAttribute('selected') == 'true') {
                            _dom.style.transform = 'translateY(0)';
                            _dom.setAttribute('selected', false);
                        }
                    }
                }
            });
        }

        /**
         * 禁止拖动功能，以免拖动选牌的时候造成第一次拖动完成后无法继续选牌的情况
         */

    }, {
        key: 'disableDrag',
        value: function disableDrag() {
            var bd = document.getElementsByTagName('body')[0];
            bd.ondragstart = function () {
                return false;
            };
        }
    }, {
        key: 'flipDiPai',
        value: function flipDiPai() {
            var dom = _global2.default.dipaiAreaContainer;
            var cardArray = (0, _from2.default)(dom.getElementsByClassName(_global2.default.CARD_CLASSNAME));
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = (0, _getIterator3.default)(cardArray), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var card = _step8.value;

                    var type = card.getAttribute('type'),
                        val = card.getAttribute('val'),
                        iconPos = _CardData2.default.getIconPos(type, val);
                    card.style.backgroundPosition = iconPos;
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }
        }
    }]);
    return PlayUI;
}();

exports.default = PlayUI;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(52);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(53);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 53 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(55), __esModule: true };

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(21);
__webpack_require__(19);
module.exports = __webpack_require__(71);


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(57);
var step = __webpack_require__(35);
var Iterators = __webpack_require__(9);
var toIObject = __webpack_require__(22);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(24)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(5) && !__webpack_require__(13)(function () {
  return Object.defineProperty(__webpack_require__(38)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(7);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(39);
var descriptor = __webpack_require__(25);
var setToStringTag = __webpack_require__(29);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(6)(IteratorPrototype, __webpack_require__(0)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(3);
var anObject = __webpack_require__(11);
var getKeys = __webpack_require__(64);

module.exports = __webpack_require__(5) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(65);
var enumBugKeys = __webpack_require__(41);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(14);
var toIObject = __webpack_require__(22);
var arrayIndexOf = __webpack_require__(66)(false);
var IE_PROTO = __webpack_require__(27)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(22);
var toLength = __webpack_require__(18);
var toAbsoluteIndex = __webpack_require__(67);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(2).document;
module.exports = document && document.documentElement;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(14);
var toObject = __webpack_require__(30);
var IE_PROTO = __webpack_require__(27)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26);
var defined = __webpack_require__(17);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(31);
var ITERATOR = __webpack_require__(0)('iterator');
var Iterators = __webpack_require__(9);
module.exports = __webpack_require__(4).isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(21);
__webpack_require__(19);
module.exports = __webpack_require__(73);


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(11);
var get = __webpack_require__(32);
module.exports = __webpack_require__(4).getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(19);
__webpack_require__(75);
module.exports = __webpack_require__(4).Array.from;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(10);
var $export = __webpack_require__(1);
var toObject = __webpack_require__(30);
var call = __webpack_require__(42);
var isArrayIter = __webpack_require__(43);
var toLength = __webpack_require__(18);
var createProperty = __webpack_require__(76);
var getIterFn = __webpack_require__(32);

$export($export.S + $export.F * !__webpack_require__(77)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(3);
var createDesc = __webpack_require__(25);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(0)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(80);
var $Object = __webpack_require__(4).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(5), 'Object', { defineProperty: __webpack_require__(3).f });


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parseInt = __webpack_require__(82);

var _parseInt2 = _interopRequireDefault(_parseInt);

var _map = __webpack_require__(87);

var _map2 = _interopRequireDefault(_map);

var _slicedToArray2 = __webpack_require__(34);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = __webpack_require__(15);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = __webpack_require__(105);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = __webpack_require__(8);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(16);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GameRule = function () {
    function GameRule() {
        (0, _classCallCheck3.default)(this, GameRule);
    }

    (0, _createClass3.default)(GameRule, null, [{
        key: 'typeJudge',


        /**
         * 牌型判断
         * @method function
         * @param  {[type]} cards [description]
         * @return {[type]}       [description]
         */
        value: function typeJudge(cards) {
            var len = cards.length;
            switch (len) {
                case 1:
                    {
                        return { 'cardKind': GameRule.ONE, 'val': cards[0].val, 'size': len };
                    }
                case 2:
                    {
                        if (GameRule.isPairs(cards)) {
                            return { 'cardKind': GameRule.PAIRS, 'val': cards[0].val, 'size': len };
                        } else if (GameRule.isKingBomb(cards)) {
                            return { 'cardKind': GameRule.KING_BOMB, 'val': cards[0].val, 'size': len };
                        } else {
                            return null;
                        }
                    }
                case 3:
                    {
                        if (GameRule.isThree(cards)) {
                            return { 'cardKind': GameRule.THREE, 'val': cards[0].val, 'size': len };
                        } else {
                            return null;
                        }
                    }
                case 4:
                    {
                        if (GameRule.isThreeWithOne(cards)) {
                            return { 'cardKind': GameRule.THREE_WITH_ONE, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                        } else if (GameRule.isBomb(cards)) {
                            return { 'cardKind': GameRule.BOMB, 'val': cards[0].val, 'size': len };
                        } else {
                            return null;
                        }
                    }
                default:
                    {
                        if (GameRule.isProgression(cards)) {
                            return { 'cardKind': GameRule.PROGRESSION, 'val': cards[0].val, 'size': len };
                        } else if (GameRule.isProgressionPairs(cards)) {
                            return { 'cardKind': GameRule.PROGRESSION_PAIRS, 'val': cards[0].val, 'size': len };
                        } else if (GameRule.isThreeWithPairs(cards)) {
                            return { 'cardKind': GameRule.THREE_WITH_PAIRS, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                        } else if (GameRule.isPlane(cards)) {
                            return { 'cardKind': GameRule.PLANE, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                        } else if (GameRule.isPlaneWithOne(cards)) {
                            return { 'cardKind': GameRule.PLANE_WITH_ONE, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                        } else if (GameRule.isPlaneWithPairs(cards)) {
                            return { 'cardKind': GameRule.PLANE_WITH_PAIRS, 'val': GameRule.getMaxVal(cards, 3), 'size': len };
                        } else if (GameRule.isFourWithTwo(cards)) {
                            return { 'cardKind': GameRule.FOUR_WITH_TWO, 'val': GameRule.getMaxVal(cards, 4), 'size': len };
                        } else if (GameRule.isFourWithPairs(cards)) {
                            return { 'cardKind': GameRule.FOUR_WITH_TWO_PAIRS, 'val': GameRule.getMaxVal(cards, 4), 'size': len };
                        } else {
                            return null;
                        }
                    }
            }
        }

        //是否是对子

    }, {
        key: 'isPairs',
        value: function isPairs(cards) {
            return cards.length == 2 && cards[0].val === cards[1].val;
        }

        //是否是三根

    }, {
        key: 'isThree',
        value: function isThree(cards) {
            return cards.length == 3 && cards[0].val === cards[1].val && cards[1].val === cards[2].val;
        }

        //是否是三带一

    }, {
        key: 'isThreeWithOne',
        value: function isThreeWithOne(cards) {
            if (cards.length != 4) {
                return false;
            }
            var m = GameRule.valCount(cards);
            var array = [].concat((0, _toConsumableArray3.default)(m.values()));
            return m.size() === 2 && (array[0] === 3 || array[0] === 3);
        }

        //是否是三带一对

    }, {
        key: 'isThreeWithPairs',
        value: function isThreeWithPairs(cards) {
            if (cards.length != 5) {
                return false;
            }
            var m = GameRule.valCount(cards);
            var array = [].concat((0, _toConsumableArray3.default)(m.values()));
            return m.size() === 2 && (array[0] === 3 || array[1] === 3);
        }

        //是否是顺子

    }, {
        key: 'isProgression',
        value: function isProgression(cards) {
            if (cards.length < 5 || cards[0].val === 15) {
                return false;
            }
            for (var i = 0; i < cards.length; i++) {
                if (i != cards.length - 1 && cards[i].val - 1 != cards[i + 1].val) {
                    return false;
                }
            }
            return true;
        }

        //是否是连对

    }, {
        key: 'isProgressionPairs',
        value: function isProgressionPairs(cards) {
            if (cards.length < 6 || cards.length % 2 != 0 || cards[0].val === 15) {
                return false;
            }
            for (var i = 0; i < cards.length; i = i + 2) {
                if (i != cards.length - 2 && (cards[i].val != cards[i + 1].val || cards[i].val - 1 != cards[i + 2].val)) {
                    return false;
                }
            }
            return true;
        }

        //是否是飞机

    }, {
        key: 'isPlane',
        value: function isPlane(cards) {
            if (cards.length < 6 || cards.length % 3 != 0 || cards[0].val === 15) {
                return false;
            }
            for (var i = 0; i < cards.length; i = i + 3) {
                if (i != cards.length - 3 && (cards[i].val != cards[i + 1].val || cards[i].val != cards[i + 2].val || cards[i].val - 1 != cards[i + 3].val)) {
                    return false;
                }
            }
            return true;
        }

        //是否是飞机带单

    }, {
        key: 'isPlaneWithOne',
        value: function isPlaneWithOne(cards) {
            if (cards.length < 8 || cards.length % 4 != 0) {
                return false;
            }

            var m = GameRule.valCount(cards),
                threeList = [],
                threeCount = cards.length / 4;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(m.entries()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
                        key = _step$value[0],
                        value = _step$value[1];

                    if (value == 3) {
                        threeList.push({ 'val': key, 'count': value });
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (threeList.length != threeCount || threeList[0].val === 15) {
                //检测三根数量和不能为2
                return false;
            }

            for (var i = 0; i < threeList.length; i++) {
                //检测三根是否连续
                if (i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val) {
                    return false;
                }
            }
            return true;
        }

        //是否是飞机带对

    }, {
        key: 'isPlaneWithPairs',
        value: function isPlaneWithPairs(cards) {
            if (cards.length < 10 || cards.length % 5 != 0) {
                return false;
            }

            var m = GameRule.valCount(cards),
                threeList = [],
                pairsList = [],
                groupCount = cards.length / 5;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(m.entries()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2),
                        key = _step2$value[0],
                        value = _step2$value[1];

                    if (value == 3) {
                        threeList.push({ 'val': key, 'count': value });
                    } else if (value == 2) {
                        pairsList.push({ 'val': key, 'count': value });
                    } else {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (threeList.length != groupCount || pairsList.length != groupCount || threeList[0].val === 15) {
                //检测三根数量和对子数量和不能为2
                return false;
            }

            for (var i = 0; i < threeList.length; i++) {
                //检测三根是否连续
                if (i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val) {
                    return false;
                }
            }
            return true;
        }

        //是否是四带二

    }, {
        key: 'isFourWithTwo',
        value: function isFourWithTwo(cards) {
            var m = GameRule.valCount(cards);
            if (cards.length != 6 || m.size() > 3) {
                return false;
            }
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(m.values()), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var value = _step3.value;

                    if (value === 4) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return false;
        }

        //是否是四带两个对

    }, {
        key: 'isFourWithPairs',
        value: function isFourWithPairs(cards) {
            if (cards.length != 8) {
                return false;
            }

            var m = GameRule.valCount(cards);
            if (m.size() != 3) {
                return false;
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = (0, _getIterator3.default)(m.values()), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var value = _step4.value;

                    if (value != 4 && value != 2) {
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return true;
        }

        //是否是炸弹

    }, {
        key: 'isBomb',
        value: function isBomb(cards) {
            return cards.length === 4 && cards[0].val === cards[1].val && cards[0].val === cards[2].val && cards[0].val === cards[3].val;
        }

        //是否是王炸

    }, {
        key: 'isKingBomb',
        value: function isKingBomb(cards) {
            return cards.length === 2 && cards[0].type == '0' && cards[1].type == '0';
        }

        /**
         * 获取min到max之间的随机整数，min和max值都取得到
         * @param {*} min 
         * @param {*} max 
         */

    }, {
        key: 'random',
        value: function random(min, max) {
            min = min == null ? 0 : min;
            max = max == null ? 1 : max;
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        /**
         * 牌统计，统计各个牌有多少张，比如2张A，一张8
         * @param {*} cards 
         */

    }, {
        key: 'valCount',
        value: function valCount(cards) {
            var resultMap = new _map2.default();

            var addCount = function addCount(rstMap, v) {
                if (rstMap.has(v) == true) {
                    var cnt = rstMap.get(v);
                    cnt = cnt + 1;
                    rstMap.set(v, cnt);
                } else {
                    rstMap.set(v, 1);
                }
            };

            for (var i = 0; i < cards.length; i++) {
                addCount(resultMap, cards[i].val);
            }

            return resultMap;
        }

        /**
         * 获取指定张数的最大牌值
         * @param {*} cards 
         * @param {*} n 
         */

    }, {
        key: 'getMaxVal',
        value: function getMaxVal(cards, n) {
            var map = GameRule.valCount(cards);
            var max = 0;

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)(map.entries()), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _step5$value = (0, _slicedToArray3.default)(_step5.value, 2),
                        key = _step5$value[0],
                        value = _step5$value[1];

                    if (value === n && key > max) {
                        max = key;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return max;
        }

        /**
         * 卡牌排序.
         * @param {*} a 
         * @param {*} b 
         */

    }, {
        key: 'cardSort',
        value: function cardSort(a, b) {
            var va = (0, _parseInt2.default)(a.val);
            var vb = (0, _parseInt2.default)(b.val);
            if (va === vb) {
                return a.type > b.type ? 1 : -1;
            } else if (va > vb) {
                return -1;
            } else {
                return 1;
            }
        }
    }]);
    return GameRule;
}();

GameRule.ONE = 1;
GameRule.PAIRS = 2;
GameRule.THREE = 3;
GameRule.THREE_WITH_ONE = 4;
GameRule.THREE_WITH_PAIRS = 5;
GameRule.PROGRESSION = 6;
GameRule.PROGRESSION_PAIRS = 7;
GameRule.PLANE = 8;
GameRule.PLANE_WITH_ONE = 9;
GameRule.PLANE_WITH_PAIRS = 10;
GameRule.FOUR_WITH_TWO = 11;
GameRule.FOUR_WITH_TWO_PAIRS = 12;
GameRule.BOMB = 13;
GameRule.KING_BOMB = 14;

GameRule.MSG_NO_SELECT = '请选择要出的牌';
GameRule.MSG_ERROR_TYPE = '您选的牌不符合游戏规则';
GameRule.MSG_NO_ROB_RESTART = '没人叫地主，重新发牌';

GameRule.DESK_STATUS_READY = 1;
GameRule.DESK_STATUS_ROB = 2;
GameRule.DESK_STATUS_PLAY = 3;

exports.default = GameRule;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(84);
module.exports = parseInt;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);
var $parseInt = __webpack_require__(85);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(2).parseInt;
var $trim = __webpack_require__(86).trim;
var ws = __webpack_require__(44);
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(1);
var defined = __webpack_require__(17);
var fails = __webpack_require__(13);
var spaces = __webpack_require__(44);
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89);
__webpack_require__(19);
__webpack_require__(21);
__webpack_require__(90);
__webpack_require__(98);
__webpack_require__(101);
__webpack_require__(103);
module.exports = __webpack_require__(4).Map;


/***/ }),
/* 89 */
/***/ (function(module, exports) {



/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(91);
var validate = __webpack_require__(48);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(93)(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP = __webpack_require__(3).f;
var create = __webpack_require__(39);
var redefineAll = __webpack_require__(45);
var ctx = __webpack_require__(10);
var anInstance = __webpack_require__(46);
var forOf = __webpack_require__(20);
var $iterDefine = __webpack_require__(24);
var step = __webpack_require__(35);
var setSpecies = __webpack_require__(92);
var DESCRIPTORS = __webpack_require__(5);
var fastKey = __webpack_require__(47).fastKey;
var validate = __webpack_require__(48);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var core = __webpack_require__(4);
var dP = __webpack_require__(3);
var DESCRIPTORS = __webpack_require__(5);
var SPECIES = __webpack_require__(0)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var $export = __webpack_require__(1);
var meta = __webpack_require__(47);
var fails = __webpack_require__(13);
var hide = __webpack_require__(6);
var redefineAll = __webpack_require__(45);
var forOf = __webpack_require__(20);
var anInstance = __webpack_require__(46);
var isObject = __webpack_require__(7);
var setToStringTag = __webpack_require__(29);
var dP = __webpack_require__(3).f;
var each = __webpack_require__(94)(0);
var DESCRIPTORS = __webpack_require__(5);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(10);
var IObject = __webpack_require__(36);
var toObject = __webpack_require__(30);
var toLength = __webpack_require__(18);
var asc = __webpack_require__(95);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(96);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7);
var isArray = __webpack_require__(97);
var SPECIES = __webpack_require__(0)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(23);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(1);

$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(99)('Map') });


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(31);
var from = __webpack_require__(100);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(20);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
__webpack_require__(102)('Map');


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(1);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
__webpack_require__(104)('Map');


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var $export = __webpack_require__(1);
var aFunction = __webpack_require__(37);
var ctx = __webpack_require__(10);
var forOf = __webpack_require__(20);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(33);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
        value: true
});

var _classCallCheck2 = __webpack_require__(8);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _global = __webpack_require__(12);

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CardUI = function CardUI(num, type, iconPos, parentCon) {
        (0, _classCallCheck3.default)(this, CardUI);

        this.cardNum = num;
        this.cardType = type;
        this.parentContainer = parentCon;

        //纸牌的最外层容器
        var instanceDiv = document.createElement('div');
        instanceDiv.style.position = 'absolute';
        instanceDiv.style.cursor = 'pointer';
        instanceDiv.style.userSelect = 'none';

        //如果不是玩家区域的牌，则显示牌背面
        instanceDiv.style.backgroundPosition = this.parentContainer === _global2.default.ownPlayerContainer ? iconPos : _global2.default.CARD_BACK_POS;

        instanceDiv.setAttribute('class', 'card');

        this.domInstance = instanceDiv;

        this.domInstance.setAttribute('type', this.cardType);
        this.domInstance.setAttribute('val', this.cardNum);
};

exports.default = CardUI;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = __webpack_require__(15);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = __webpack_require__(8);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(16);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CardData = function () {
    function CardData() {
        (0, _classCallCheck3.default)(this, CardData);
    }

    (0, _createClass3.default)(CardData, null, [{
        key: 'getNewCard',
        value: function getNewCard() {
            return CardData.data.slice(0);
        }
    }, {
        key: 'getIconPos',
        value: function getIconPos(type, val) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(CardData.data), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var dataItem = _step.value;

                    if (dataItem.type == type && dataItem.val == val) {
                        return dataItem.iconPos;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);
    return CardData;
}();

CardData.data = [{ iconPos: '-1729px -100px', type: '0', val: 17 }, { iconPos: '-1860px -100px', type: '0', val: 16 }, { iconPos: '-35px -100px', type: '1', val: 14 }, { iconPos: '-166px -100px', type: '1', val: 15 }, { iconPos: '-297px -100px', type: '1', val: 3 }, { iconPos: '-556px -100px', type: '1', val: 4 }, { iconPos: '-687px -100px', type: '1', val: 5 }, { iconPos: '-427px -100px', type: '1', val: 6 }, { iconPos: '-817px -100px', type: '1', val: 7 }, { iconPos: '-948px -100px', type: '1', val: 8 }, { iconPos: '-1077px -100px', type: '1', val: 9 }, { iconPos: '-1208px -100px', type: '1', val: 10 }, { iconPos: '-1339px -100px', type: '1', val: 11 }, { iconPos: '-1469px -100px', type: '1', val: 12 }, { iconPos: '-1599px -100px', type: '1', val: 13 }, { iconPos: '-35px -291px', type: '2', val: 14 }, { iconPos: '-166px -291px', type: '2', val: 15 }, { iconPos: '-297px -291px', type: '2', val: 3 }, { iconPos: '-427px -291px', type: '2', val: 4 }, { iconPos: '-556px -291px', type: '2', val: 5 }, { iconPos: '-687px -291px', type: '2', val: 6 }, { iconPos: '-817px -291px', type: '2', val: 7 }, { iconPos: '-948px -291px', type: '2', val: 8 }, { iconPos: '-1077px -291px', type: '2', val: 9 }, { iconPos: '-1208px -291px', type: '2', val: 10 }, { iconPos: '-1339px -291px', type: '2', val: 11 }, { iconPos: '-1469px -291px', type: '2', val: 12 }, { iconPos: '-1599px -291px', type: '2', val: 13 }, { iconPos: '-35px -481px', type: '3', val: 14 }, { iconPos: '-166px -481px', type: '3', val: 15 }, { iconPos: '-297px -481px', type: '3', val: 3 }, { iconPos: '-427px -481px', type: '3', val: 4 }, { iconPos: '-556px -481px', type: '3', val: 5 }, { iconPos: '-687px -481px', type: '3', val: 6 }, { iconPos: '-817px -481px', type: '3', val: 7 }, { iconPos: '-948px -481px', type: '3', val: 8 }, { iconPos: '-1077px -481px', type: '3', val: 9 }, { iconPos: '-1208px -481px', type: '3', val: 10 }, { iconPos: '-1339px -481px', type: '3', val: 11 }, { iconPos: '-1469px -481px', type: '3', val: 12 }, { iconPos: '-1599px -481px', type: '3', val: 13 }, { iconPos: '-35px -671px', type: '4', val: 14 }, { iconPos: '-166px -671px', type: '4', val: 15 }, { iconPos: '-297px -671px', type: '4', val: 3 }, { iconPos: '-427px -671px', type: '4', val: 4 }, { iconPos: '-556px -671px', type: '4', val: 5 }, { iconPos: '-687px -671px', type: '4', val: 6 }, { iconPos: '-817px -671px', type: '4', val: 7 }, { iconPos: '-948px -671px', type: '4', val: 8 }, { iconPos: '-1077px -671px', type: '4', val: 9 }, { iconPos: '-1208px -671px', type: '4', val: 10 }, { iconPos: '-1339px -671px', type: '4', val: 11 }, { iconPos: '-1469px -671px', type: '4', val: 12 }, { iconPos: '-1599px -671px', type: '4', val: 13 }];

exports.default = CardData;

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = __webpack_require__(8);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Player = function Player() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'robot' + Math.random() * 100;
    var uid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _classCallCheck3.default)(this, Player);

    this.name = name;
    this.uid = uid;
    this.isLord = false;
    this.nextPlayer = null;
    this.isReady = false;
    this.isLeave = false;
    this.cardList = [];
    this.isOwn = false;
    this.selectedCardList = [];
    this.isCurrentPlayer = false;
};

exports.default = Player;

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = __webpack_require__(15);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _from = __webpack_require__(33);

var _from2 = _interopRequireDefault(_from);

var _classCallCheck2 = __webpack_require__(8);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(16);

var _createClass3 = _interopRequireDefault(_createClass2);

var _global = __webpack_require__(12);

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RobBtnUI = function () {
    function RobBtnUI() {
        (0, _classCallCheck3.default)(this, RobBtnUI);
    }

    (0, _createClass3.default)(RobBtnUI, null, [{
        key: 'show',
        value: function show() {
            if (RobBtnUI.instance == null) {
                var robBtnContainer = document.createElement('div');
                robBtnContainer.style.position = 'absolute';
                robBtnContainer.style.width = '1000px';
                robBtnContainer.style.height = '40px';
                robBtnContainer.style.top = '50%';
                robBtnContainer.style.left = '50%';
                robBtnContainer.style.transform = 'translate(-50%)';
                robBtnContainer.style.display = 'flex';
                robBtnContainer.style.justifyContent = 'space-around';
                robBtnContainer.style.alignItems = 'center';

                var one_Btn = document.createElement('button');
                var two_Btn = document.createElement('button');
                var three_Btn = document.createElement('button');
                var four_Btn = document.createElement('button');

                one_Btn.innerHTML = '1分';
                two_Btn.innerHTML = '2分';
                three_Btn.innerHTML = '3分';
                four_Btn.innerHTML = '不叫';

                robBtnContainer.appendChild(one_Btn);
                robBtnContainer.appendChild(two_Btn);
                robBtnContainer.appendChild(three_Btn);
                robBtnContainer.appendChild(four_Btn);

                //按钮点击，抢地主
                var buttons = (0, _from2.default)(robBtnContainer.getElementsByTagName('button'));
                buttons.forEach(function (item) {
                    item.onclick = function () {
                        RobBtnUI.sendPoint(item.innerHTML);
                        RobBtnUI.hide();
                    };
                });

                var bd = document.getElementsByTagName('body')[0];
                bd.appendChild(robBtnContainer);
                RobBtnUI.instance = robBtnContainer;

                RobBtnUI.hide();
                RobBtnUI.addSocketListener();
            } else {
                RobBtnUI.instance.style.display = 'flex';
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (RobBtnUI.instance != null) {
                RobBtnUI.instance.style.display = 'none';
            }
        }
    }, {
        key: 'remove',
        value: function remove() {
            if (RobBtnUI.instance != null) {
                var body = document.getElementsByTagName('body')[0];
                body.removeChild(RobBtnUI.instance);
                RobBtnUI.instance = null;
            }
        }
    }, {
        key: 'addSocketListener',
        value: function addSocketListener() {
            var socket = _global2.default.socket;

            socket.on(_global2.default.SOCKETIO_ASSIGNROBLORD_OFF, function () {
                RobBtnUI.hide();
            });

            socket.on(_global2.default.SOCKETIO_ASSIGNROBLORD_ON, function (data) {
                window.console.log('socket 收到叫地主事件: ' + data);
                RobBtnUI.show();
                RobBtnUI.activateBtn(data);
            });
        }
    }, {
        key: 'sendPoint',
        value: function sendPoint(point) {
            var socket = _global2.default.socket;
            socket.emit(_global2.default.SOCKETIO_ROBLORD, point);
        }
    }, {
        key: 'activateBtn',
        value: function activateBtn(text) {
            var btns = (0, _from2.default)(RobBtnUI.instance.getElementsByTagName('button'));
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(btns), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var btn = _step.value;

                    if (text.includes(btn.innerHTML)) {
                        btn.disabled = false;
                        btn.style.backgroundColor = 'blue';
                    } else {
                        btn.disabled = true;
                        btn.style.backgroundColor = 'grey';
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            btns[btns.length - 1].disabled = false;
            btns[btns.length - 1].style.backgroundColor = 'blue';
        }
    }]);
    return RobBtnUI;
}();

RobBtnUI.instance = null;

exports.default = RobBtnUI;

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = __webpack_require__(8);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(16);

var _createClass3 = _interopRequireDefault(_createClass2);

var _global = __webpack_require__(12);

var _global2 = _interopRequireDefault(_global);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StartBtnUI = function () {
    function StartBtnUI() {
        (0, _classCallCheck3.default)(this, StartBtnUI);
    }

    (0, _createClass3.default)(StartBtnUI, null, [{
        key: 'show',
        value: function show() {
            if (StartBtnUI.instance == null) {
                var startBtnContainer = document.createElement('div');
                startBtnContainer.style.position = 'absolute';
                startBtnContainer.style.width = '1000px';
                startBtnContainer.style.height = '40px';
                startBtnContainer.style.top = '50%';
                startBtnContainer.style.left = '50%';
                startBtnContainer.style.transform = 'translate(-50%)';
                startBtnContainer.style.display = 'flex';
                startBtnContainer.style.justifyContent = 'space-around';
                startBtnContainer.style.alignItems = 'center';

                var startBtn = document.createElement('button');
                startBtn.innerHTML = '准备';

                startBtnContainer.appendChild(startBtn);
                startBtn.onclick = function () {
                    StartBtnUI.sendReadyStatus(startBtn.innerHTML);
                };

                var bd = document.getElementsByTagName('body')[0];
                bd.appendChild(startBtnContainer);
                StartBtnUI.instance = startBtnContainer;
            } else {
                StartBtnUI.instance.style.display = 'flex';
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (StartBtnUI.instance != null) {
                StartBtnUI.instance.style.display = 'none';
            }
        }
    }, {
        key: 'remove',
        value: function remove() {
            if (StartBtnUI.instance != null) {
                var body = document.getElementsByTagName('body')[0];
                body.removeChild(StartBtnUI.instance);
                StartBtnUI.instance = null;
            }
        }
    }, {
        key: 'sendReadyStatus',
        value: function sendReadyStatus(status) {
            var socket = _global2.default.socket;
            socket.emit(_global2.default.SOCKETIO_PLAYERREADY, status);
            StartBtnUI.hide();
        }
    }]);
    return StartBtnUI;
}();

StartBtnUI.instance = null;

exports.default = StartBtnUI;

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map