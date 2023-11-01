/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 4552:
/*!****************************************************************************!*\
  !*** ./node_modules/@getkoala/edge-api-client/dist/edge-api-client.esm.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CountMinSketch": () => (/* reexport safe */ _getkoala_js_bloom__WEBPACK_IMPORTED_MODULE_1__.CountMinSketch),
/* harmony export */   "JsBloom": () => (/* reexport safe */ _getkoala_js_bloom__WEBPACK_IMPORTED_MODULE_1__.JsBloom),
/* harmony export */   "anonymize": () => (/* binding */ anonymize$1),
/* harmony export */   "build": () => (/* binding */ build)
/* harmony export */ });
/* harmony import */ var flattie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flattie */ 4240);
/* harmony import */ var _getkoala_js_bloom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @getkoala/js-bloom */ 3975);




const removeIndexes = key => {
  const replaced = key.replace(/\.(\d+)/g, '.[]');
  return replaced;
};

function isEvent(e) {
  if (typeof e !== 'object') {
    return false;
  }

  if (e != null && e.hasOwnProperty('event')) {
    return true;
  }

  return false;
}

function isPageView(e) {
  if (typeof e !== 'object') {
    return false;
  }

  if (e != null && e.hasOwnProperty('page')) {
    if (e.page['path']) {
      return true;
    }
  }

  return false;
}

function increment(profile, key, by) {
  if (by === void 0) {
    by = 1;
  }

  profile.counts.add(key.toLowerCase(), by);
}

function setCount(profile, key, to) {
  profile.counts.setCount(key.toLowerCase(), to);
}

function add(profile, key) {
  profile.bloom.add(key.toLowerCase());
}

function indexPair(profile, key, value) {
  const cleanKey = removeIndexes(key);

  if (typeof value === 'number') {
    // overrides the counts in the Count Min Sketch,
    // as opposed to incrementing the count.
    // This is what allows us to query traits that are numbers
    setCount(profile, cleanKey + ":" + value, value);
    setCount(profile, cleanKey, value);
  } else {
    add(profile, cleanKey + ":" + value);
    add(profile, cleanKey);
  }

  return profile;
}

function index(profile, element) {
  if (Array.isArray(element)) {
    element.forEach(e => {
      index(profile, e);
    });
    return;
  }

  if (isEvent(element)) {
    var _element$properties;

    increment(profile, "events." + element.event);
    const props = Object.entries((0,flattie__WEBPACK_IMPORTED_MODULE_0__.flattie)((_element$properties = element.properties) != null ? _element$properties : {}));
    props.forEach(_ref => {
      let [key, value] = _ref;
      indexPair(profile, key, value);
    });
    return;
  }

  if (isPageView(element)) {
    increment(profile, "page_views." + element.page.path);
    return;
  }

  if (typeof element === 'object') {
    const flat = Object.entries((0,flattie__WEBPACK_IMPORTED_MODULE_0__.flattie)(element));
    flat.forEach(_ref2 => {
      let [key, value] = _ref2;
      indexPair(profile, key, value);
    });
    return;
  }

  return;
}

function anonymize(raw) {
  var _raw$events, _raw$pageViews, _raw$traits;

  const counts = new _getkoala_js_bloom__WEBPACK_IMPORTED_MODULE_1__.CountMinSketch();
  const bloom = new _getkoala_js_bloom__WEBPACK_IMPORTED_MODULE_1__.JsBloom({
    size: 10000
  });
  const profile = {
    counts,
    bloom
  };
  (_raw$events = raw.events) == null ? void 0 : _raw$events.forEach(e => {
    index(profile, e);
  });
  (_raw$pageViews = raw.pageViews) == null ? void 0 : _raw$pageViews.map(view => {
    index(profile, view);
  });
  index(profile, (_raw$traits = raw.traits) != null ? _raw$traits : {});
  index(profile, {
    account_score: raw.accountScore
  });
  index(profile, {
    company: raw.firmographics
  });
  index(profile, {
    person: raw.person
  });
  return profile;
}

function stringMatcher(traits, key) {
  return {
    is: target => traits.is(key, target),
    exists: () => traits.has(key),
    includesItem: function () {
      for (var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++) {
        targets[_key] = arguments[_key];
      }

      return traits.includes(key, targets);
    },
    includesAnyOf: function () {
      for (var _len2 = arguments.length, targets = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        targets[_key2] = arguments[_key2];
      }

      return traits.includesAnyOf(key, targets);
    },
    not: {
      is: target => !traits.is(key, target),
      includesItem: function () {
        for (var _len3 = arguments.length, targets = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          targets[_key3] = arguments[_key3];
        }

        return !traits.includes(key, targets);
      },
      includesAnyOf: function () {
        for (var _len4 = arguments.length, targets = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          targets[_key4] = arguments[_key4];
        }

        return !traits.includesAnyOf(key, targets);
      }
    }
  };
}
function numberMatcher(traits, key) {
  return {
    exists: () => traits.has(key),
    is: target => traits.is(key, target),
    greaterThan: target => traits.greaterThan(key, target),
    greaterThanOrEqual: target => traits.greaterThanOrEqual(key, target),
    lessThan: target => traits.lessThan(key, target),
    lessThanOrEqual: target => traits.lessThanOrEqual(key, target),
    not: {
      is: target => !traits.is(key, target),
      greaterThan: target => !traits.greaterThan(key, target),
      greaterThanOrEqual: target => !traits.greaterThanOrEqual(key, target),
      lessThan: target => !traits.lessThan(key, target),
      lessThanOrEqual: target => !traits.lessThanOrEqual(key, target)
    }
  };
}
function has(profile, trait) {
  const t = trait.toLowerCase();
  return !!(profile.bloom.test(t) || profile.counts.count(t));
}
function greaterThan(profile, trait, value) {
  return profile.counts.count(trait.toLowerCase()) > value;
}
function greaterThanOrEqual(profile, trait, value) {
  return profile.counts.count(trait.toLowerCase()) >= value;
}
function lessThan(profile, trait, value) {
  return profile.counts.count(trait.toLowerCase()) < value;
}
function lessThanOrEqual(profile, trait, value) {
  return profile.counts.count(trait.toLowerCase()) <= value;
}
function is(profile, trait, value) {
  if (value === undefined) {
    return has(profile, trait);
  }

  if (typeof value === 'object') {
    return matchesObject(profile, trait, value);
  }

  if (typeof value === 'number') {
    return profile.counts.count(trait.toLowerCase()) === value;
  }

  return profile.bloom.test((trait + ":" + value).toLowerCase());
}
function matchesObject(profile, trait, value) {
  const flat = (0,flattie__WEBPACK_IMPORTED_MODULE_0__.flattie)(value);
  const allKeys = Object.keys(flat);
  return allKeys.every(key => is(profile, trait + "." + key, value[key]));
}
function includes(profile, trait, value) {
  return is(profile, trait, value) || is(profile, trait + ".[]", value);
}
function includesAnyOf(profile, trait, values) {
  return values.some(value => includes(profile, trait, value));
}
function includesAllOf(profile, trait, values) {
  return values.every(value => includes(profile, trait, value));
}
class Traits {
  constructor(profile) {
    this.profile = void 0;
    this.profile = profile;
    this.profile = profile;
  }

  has(trait) {
    return has(this.profile, trait);
  }

  greaterThan(trait, value) {
    return greaterThan(this.profile, trait, value);
  }

  greaterThanOrEqual(trait, value) {
    return greaterThanOrEqual(this.profile, trait, value);
  }

  lessThan(trait, value) {
    return lessThan(this.profile, trait, value);
  }

  lessThanOrEqual(trait, value) {
    return lessThanOrEqual(this.profile, trait, value);
  }

  is(trait, value) {
    return is(this.profile, trait, value);
  }

  matchesObject(trait, value) {
    return matchesObject(this.profile, trait, value);
  }

  includes(trait, value) {
    return includes(this.profile, trait, value);
  }

  includesAnyOf(trait, values) {
    return includesAnyOf(this.profile, trait, values);
  }

  includesAllOf(trait, values) {
    return includesAllOf(this.profile, trait, values);
  }

  get not() {
    return {
      has: trait => !this.has(trait),
      greaterThan: (trait, value) => !this.greaterThan(trait, value),
      greaterThanOrEqual: (trait, value) => !this.greaterThanOrEqual(trait, value),
      lessThan: (trait, value) => !this.lessThan(trait, value),
      lessThanOrEqual: (trait, value) => !this.lessThanOrEqual(trait, value),
      is: (trait, value) => !this.is(trait, value),
      matchesObject: (trait, value) => !this.matchesObject(trait, value),
      includes: (trait, value) => !this.includes(trait, value),
      includesAnyOf: (trait, values) => !this.includesAnyOf(trait, values),
      includesAllOf: (trait, values) => !this.includesAllOf(trait, values)
    };
  }

}

function stringMatcher$1(traits, key) {
  return {
    exists: () => traits.has(key),
    is: target => traits.is(key, target),
    includesItem: function () {
      for (var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++) {
        targets[_key] = arguments[_key];
      }

      return traits.includes(key, targets);
    },
    includesAnyOf: function () {
      for (var _len2 = arguments.length, targets = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        targets[_key2] = arguments[_key2];
      }

      return traits.includesAnyOf(key, targets);
    }
  };
}

function arrayMatcher(traits, key) {
  return {
    includesItem: target => traits.includes(key, target),
    includesAnyOf: function () {
      for (var _len3 = arguments.length, targets = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        targets[_key3] = arguments[_key3];
      }

      return traits.includesAnyOf(key, targets);
    },
    includesAllOf: function () {
      for (var _len4 = arguments.length, targets = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        targets[_key4] = arguments[_key4];
      }

      return traits.includesAllOf(key, targets);
    }
  };
}

function numberMatcher$1(traits, key) {
  return {
    exists: () => traits.has(key),
    is: target => traits.is(key, target),
    greaterThan: target => traits.greaterThan(key, target),
    greaterThanOrEqual: target => traits.greaterThanOrEqual(key, target),
    lessThan: target => traits.lessThan(key, target),
    lessThanOrEqual: target => traits.lessThanOrEqual(key, target)
  };
}

class Company {
  constructor(profile) {
    this.traits = void 0;
    this.traits = new Traits(profile);
  }

  get name() {
    return stringMatcher$1(this.traits, 'company.name');
  }

  get domain() {
    return stringMatcher$1(this.traits, 'company.domain');
  }

  get sector() {
    return stringMatcher$1(this.traits, 'company.category.sector');
  }

  get type() {
    return stringMatcher$1(this.traits, 'company.type');
  }

  get industryGroup() {
    return stringMatcher$1(this.traits, 'company.category.industryGroup');
  }

  get industry() {
    return stringMatcher$1(this.traits, 'company.category.industry');
  }

  get subIndustry() {
    return stringMatcher$1(this.traits, 'company.category.subIndustry');
  }

  get foundedYear() {
    return numberMatcher$1(this.traits, 'company.foundedYear');
  }

  get timezone() {
    return stringMatcher$1(this.traits, 'company.timezone');
  }

  get city() {
    return stringMatcher$1(this.traits, 'company.geo.city');
  }

  get state() {
    return stringMatcher$1(this.traits, 'company.geo.state');
  }

  get stateCode() {
    return stringMatcher$1(this.traits, 'company.geo.stateCode');
  }

  get country() {
    return stringMatcher$1(this.traits, 'company.geo.country');
  }

  get countryCode() {
    return stringMatcher$1(this.traits, 'company.geo.countryCode');
  }

  get employeeCount() {
    return numberMatcher$1(this.traits, 'company.metrics.employees');
  }

  get employeesRange() {
    return stringMatcher$1(this.traits, 'company.metrics.employeesRange');
  }

  get marketCap() {
    return numberMatcher$1(this.traits, 'company.metrics.marketCap');
  }

  get amountRaised() {
    return numberMatcher$1(this.traits, 'company.metrics.raised');
  }

  get annualRevenue() {
    return numberMatcher$1(this.traits, 'company.metrics.annualRevenue');
  }

  get estimatedAnnualRevenue() {
    return stringMatcher$1(this.traits, 'company.metrics.estimatedAnnualRevenue');
  }

  get tech() {
    return arrayMatcher(this.traits, 'company.tech');
  }

  get techCategories() {
    return arrayMatcher(this.traits, 'company.techCategories');
  }

  get tags() {
    return arrayMatcher(this.traits, 'company.tags');
  }

  isB2B() {
    return this.tags.includesItem('B2B');
  }

  isB2C() {
    return this.tags.includesItem('B2C');
  }

  isEnterprise() {
    return this.tags.includesItem('Enterprise');
  }

  isEcommerce() {
    return this.tags.includesItem('E-commerce');
  }

  isSaas() {
    return this.tags.includesItem('SAAS');
  }

}

function performed(profile, event, times) {
  if (times === void 0) {
    times = 1;
  }

  return performedAtLeast(profile, times, event);
}
function performedAnyOf(profile) {
  for (var _len = arguments.length, events = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    events[_key - 1] = arguments[_key];
  }

  return events.some(event => performed(profile, event));
}
function performedAtLeast(profile, times, event) {
  return profile.counts.count(("events." + event).toLowerCase()) >= times;
}
class Events {
  constructor(profile) {
    this.profile = void 0;
    this.profile = profile;
  }

  performed(event, times) {
    if (times === void 0) {
      times = 1;
    }

    return performed(this.profile, event, times);
  }

  performedAnyOf() {
    for (var _len2 = arguments.length, events = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      events[_key2] = arguments[_key2];
    }

    return performedAnyOf(this.profile, ...events);
  }

  performedAtLeast(times, event) {
    return performedAtLeast(this.profile, times, event);
  }

  get not() {
    var _this = this;

    return {
      performed: function (event, times) {
        if (times === void 0) {
          times = 1;
        }

        return !_this.performed(event, times);
      },
      performedAnyOf: function () {
        return !_this.performedAnyOf(...arguments);
      },
      performedAtLeast: (times, event) => {
        return !this.performedAtLeast(times, event);
      }
    };
  }

}

function inSegment() {
  for (var _len = arguments.length, predicates = new Array(_len), _key = 0; _key < _len; _key++) {
    predicates[_key] = arguments[_key];
  }

  return predicates.every(Boolean);
}
async function when(condition, action, timeout) {
  return new Promise(async (resolve, _reject) => {
    if (await condition()) {
      action == null ? void 0 : action();
      resolve();
      return;
    }

    const check = () => setTimeout(async () => {
      if (await condition()) {
        action == null ? void 0 : action();
        resolve();
      } else {
        check();
      }
    }, timeout);

    check();
  });
}

// TODO:
// - add UTM matchers
// - add query params matchers
// - add referrer matchers
// - add traffic source matchers
// - add user agent matchers
// - turn this into a full browser API
function seen(profile, path, times) {
  if (times === void 0) {
    times = 1;
  }

  return profile.counts.count(("page_views." + path).toLowerCase()) >= times;
}
const viewed = seen;
function viewing(_profile, path) {
  return window.location.pathname.toLowerCase() === path.toLowerCase();
}
class Page {
  constructor(profile) {
    this.profile = void 0;
    this.profile = profile;
    this.profile = profile;
  }

  seen(path, times) {
    if (times === void 0) {
      times = 1;
    }

    return seen(this.profile, path, times);
  }

  viewed(path) {
    return viewed(this.profile, path);
  }

  viewing(path) {
    return viewing(this.profile, path);
  }

  get not() {
    var _this = this;

    return {
      seen: function (path, times) {
        if (times === void 0) {
          times = 1;
        }

        return !_this.seen(path, times);
      },
      viewed: path => {
        return !this.viewed(path);
      },
      viewing: path => {
        return !this.viewing(path);
      }
    };
  }

}

class Person {
  constructor(profile) {
    this.traits = void 0;
    this.traits = new Traits(profile);
  }

  get timezone() {
    return stringMatcher(this.traits, 'person.timezone');
  }

  get city() {
    return stringMatcher(this.traits, 'person.geo.city');
  }

  get state() {
    return stringMatcher(this.traits, 'person.geo.state');
  }

  get stateCode() {
    return stringMatcher(this.traits, 'person.geo.stateCode');
  }

  get country() {
    return stringMatcher(this.traits, 'person.geo.country');
  }

  get countryCode() {
    return stringMatcher(this.traits, 'person.geo.countryCode');
  }

  get company() {
    return stringMatcher(this.traits, 'person.employment.name');
  }

  get title() {
    return stringMatcher(this.traits, 'person.employment.title');
  }

  get role() {
    return stringMatcher(this.traits, 'person.employment.role');
  }

  get subRole() {
    return stringMatcher(this.traits, 'person.employment.subRole');
  }

  get seniority() {
    return stringMatcher(this.traits, 'person.employment.seniority');
  }

}

class Scores {
  constructor(profile, prefix) {
    this.traits = void 0;
    this.prefix = '';
    this.traits = new Traits(profile);
    this.prefix = prefix;
  }

  get fitGrade() {
    return numberMatcher(this.traits, this.prefix + ".fit_grade");
  }

  get fitGradeLetter() {
    return stringMatcher(this.traits, this.prefix + ".fit_grade_letter");
  }

}

function index$1(profile, indexable) {
  index(profile, indexable);
}

function build(data) {
  const bloom = new _getkoala_js_bloom__WEBPACK_IMPORTED_MODULE_1__.JsBloom(data.b);
  const counts = new _getkoala_js_bloom__WEBPACK_IMPORTED_MODULE_1__.CountMinSketch(data.c);
  const profile = {
    counts,
    bloom
  };
  return {
    traits: new Traits(profile),
    events: new Events(profile),
    page: new Page(profile),
    company: new Company(profile),
    person: new Person(profile),
    scores: {
      account: new Scores(profile, 'account_score')
    },
    inSegment,
    when,
    raw: profile,
    index: indexable => index$1(profile, indexable)
  };
} // Useful for testing

function anonymize$1(raw) {
  return anonymize(raw);
}


//# sourceMappingURL=edge-api-client.esm.js.map


/***/ }),

/***/ 3975:
/*!**************************************************************!*\
  !*** ./node_modules/@getkoala/js-bloom/dist/js-bloom.esm.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CountMinSketch": () => (/* binding */ CountMinSketch),
/* harmony export */   "JsBloom": () => (/* binding */ JsBloom)
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var ELEMENT_WIDTH = 32;
var BA = /*#__PURE__*/function () {
  function BA(size, field) {
    this.size = void 0;
    this.field = void 0;
    this.size = size;
    this.field = field;
    this.size = size;
    this.field = field || [];
    var arrayLength = Math.floor((size - 1) / ELEMENT_WIDTH + 1);

    if (!field) {
      for (var i = 0, end = arrayLength - 1, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
        this.field[i] = 0;
      }
    }
  }

  var _proto = BA.prototype;

  _proto.add = function add(position) {
    return this.set(position, 1);
  };

  _proto.remove = function remove(position) {
    return this.set(position, 0);
  };

  _proto.set = function set(position, value) {
    if (position >= this.size) {
      throw new Error('BitArray index out of bounds');
    }

    var aPos = arrayPosition(position);
    var bChange = bitChange(position);

    if (value === 1) {
      this.field[aPos] = abs(this.field[aPos] | bChange);
    } else if ((this.field[aPos] & bChange) !== 0) {
      this.field[aPos] = abs(this.field[aPos] ^ bChange);
    }

    return true;
  };

  _proto.get = function get(position) {
    if (position >= this.size) {
      throw new Error('BitArray index out of bounds');
    }

    var aPos = arrayPosition(position);
    var bChange = bitChange(position);

    if (abs(this.field[aPos] & bChange) > 0) {
      return 1;
    } else {
      return 0;
    }
  };

  return BA;
}();

function arrayPosition(position) {
  return Math.floor(position / ELEMENT_WIDTH);
}

function bitChange(position) {
  return abs(1 << position % ELEMENT_WIDTH);
}

function abs(val) {
  if (val < 0) {
    val += 4294967295;
  }

  return val;
}

function crcTable() {
  var c;
  var crcTable = [];

  for (var n = 0; n < 256; n++) {
    c = n;

    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
    }

    crcTable[n] = c;
  }

  return crcTable;
}

var CRC32_TABLE = /*#__PURE__*/crcTable();
var crc32 = function crc32(string) {
  var bytes = bytesFor(string);
  var crc = 0;
  var n = 0;
  crc = crc ^ -1;
  var i = 0;
  var iTop = bytes.length;

  while (i < iTop) {
    n = (crc ^ bytes[i]) & 0xff;
    crc = crc >>> 8 ^ CRC32_TABLE[n];
    i++;
  }

  crc = crc ^ -1;

  if (crc < 0) {
    crc += 4294967296;
  }

  return crc;
};

var bytesFor = function bytesFor(string) {
  var bytes = [];
  var i = 0;

  while (i < string.length) {
    bytes.push(string.charCodeAt(i));
    ++i;
  }

  return bytes;
};

var JsBloom = /*#__PURE__*/function () {
  function JsBloom(options) {
    if (options === void 0) {
      options = {};
    }

    this.options = void 0;
    this.bits = void 0;
    this.options = options;
    this.options = _extends({
      size: 100,
      hashes: 4,
      seed: new Date().getTime() / 1000,
      bits: null
    }, options);
    this.bits = new BA(this.options['size'], this.options['bits']);
  }

  var _proto = JsBloom.prototype;

  _proto.add = function add() {
    for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
      keys[_key] = arguments[_key];
    }

    for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
      var key = _keys[_i];

      for (var _i2 = 0, _Array$from = Array.from(this.indexesFor(key)); _i2 < _Array$from.length; _i2++) {
        var index = _Array$from[_i2];
        this.bits.add(index);
      }
    }
  };

  _proto.test = function test() {
    for (var _len2 = arguments.length, keys = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      keys[_key2] = arguments[_key2];
    }

    for (var _i3 = 0, _keys2 = keys; _i3 < _keys2.length; _i3++) {
      var key = _keys2[_i3];

      for (var _iterator = _createForOfIteratorHelperLoose(this.indexesFor(key)), _step; !(_step = _iterator()).done;) {
        var index = _step.value;

        if (this.bits.get(index) === 0) {
          return false;
        }
      }
    }

    return true;
  };

  _proto.toHash = function toHash() {
    return {
      size: this.options['size'],
      hashes: this.options['hashes'],
      seed: this.options['seed'],
      bits: this.bits.field
    };
  };

  _proto.toJson = function toJson() {
    return JSON.stringify(this.toHash());
  };

  _proto.indexesFor = function indexesFor(key) {
    var indexes = [];

    for (var index = 0, end = this.options['hashes'] - 1, asc = 0 <= end; asc ? index <= end : index >= end; asc ? index++ : index--) {
      indexes.push(crc32(key + ":" + (index + this.options['seed'])) % this.options['size']);
    }

    return indexes;
  };

  return JsBloom;
}();

var MAX_FIXNUM = Number.MAX_SAFE_INTEGER - 1;

function createData(k, m) {
  var data = new Array(k);

  for (var i = 0; i < k; i++) {
    data[i] = new Uint32Array(m);
  }

  return data;
}

function convertData(data) {
  return data.map(function (k) {
    return Uint32Array.from(k);
  });
}

function toArray(data) {
  return data.map(function (k) {
    return Array.from(k);
  });
}

function seeds(k) {
  var seeds = new Array(k);

  for (var i = 0; i < k; i++) {
    seeds[i] = Math.random() * (MAX_FIXNUM + 1);
  }

  return seeds;
}

var DEFAULTS = {
  size: 100,
  hashes: 4
};
var CountMinSketch = /*#__PURE__*/function () {
  function CountMinSketch(options) {
    if (options === void 0) {
      options = {};
    }

    this.options = void 0;
    this.k = void 0;
    this.m = void 0;
    this.data = void 0;
    this.seeds = void 0;
    this.options = Object.assign({}, DEFAULTS, options);
    this.k = this.options.hashes;
    this.m = this.options.size;
    this.data = this.options.data ? convertData(this.options.data) : createData(this.k, this.m);
    this.seeds = this.options.seeds || seeds(this.k);
  }

  var _proto = CountMinSketch.prototype;

  _proto.count = function count(item) {
    return this.add(item, 0);
  };

  _proto.add = function add(item, n) {
    var _this = this;

    if (n === void 0) {
      n = 1;
    }

    var minCount = Infinity;
    this.seeds.forEach(function (seed, i) {
      var hash = crc32(item + ":" + (seed + i));
      var j = hash % _this.m;
      var cnt = _this.data[i][j] += n;

      if (cnt < minCount) {
        minCount = cnt;
      }
    });
    return minCount;
  };

  _proto.setCount = function setCount(item, n) {
    this.add(item, n - this.count(item));
  };

  _proto.toHash = function toHash() {
    return Object.assign({}, this.options, {
      data: toArray(this.data),
      seeds: this.seeds
    });
  };

  _proto.toJSON = function toJSON() {
    return JSON.stringify(this.toHash());
  };

  return CountMinSketch;
}();


//# sourceMappingURL=js-bloom.esm.js.map


/***/ }),

/***/ 6936:
/*!***********************************************************************************!*\
  !*** ./node_modules/@rails/actioncable/app/assets/javascripts/actioncable.esm.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Connection": () => (/* binding */ Connection),
/* harmony export */   "ConnectionMonitor": () => (/* binding */ ConnectionMonitor),
/* harmony export */   "Consumer": () => (/* binding */ Consumer),
/* harmony export */   "INTERNAL": () => (/* binding */ INTERNAL),
/* harmony export */   "Subscription": () => (/* binding */ Subscription),
/* harmony export */   "SubscriptionGuarantor": () => (/* binding */ SubscriptionGuarantor),
/* harmony export */   "Subscriptions": () => (/* binding */ Subscriptions),
/* harmony export */   "adapters": () => (/* binding */ adapters),
/* harmony export */   "createConsumer": () => (/* binding */ createConsumer),
/* harmony export */   "createWebSocketURL": () => (/* binding */ createWebSocketURL),
/* harmony export */   "getConfig": () => (/* binding */ getConfig),
/* harmony export */   "logger": () => (/* binding */ logger)
/* harmony export */ });
var adapters = {
  logger: self.console,
  WebSocket: self.WebSocket
};

var logger = {
  log(...messages) {
    if (this.enabled) {
      messages.push(Date.now());
      adapters.logger.log("[ActionCable]", ...messages);
    }
  }
};

const now = () => (new Date).getTime();

const secondsSince = time => (now() - time) / 1e3;

class ConnectionMonitor {
  constructor(connection) {
    this.visibilityDidChange = this.visibilityDidChange.bind(this);
    this.connection = connection;
    this.reconnectAttempts = 0;
  }
  start() {
    if (!this.isRunning()) {
      this.startedAt = now();
      delete this.stoppedAt;
      this.startPolling();
      addEventListener("visibilitychange", this.visibilityDidChange);
      logger.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
    }
  }
  stop() {
    if (this.isRunning()) {
      this.stoppedAt = now();
      this.stopPolling();
      removeEventListener("visibilitychange", this.visibilityDidChange);
      logger.log("ConnectionMonitor stopped");
    }
  }
  isRunning() {
    return this.startedAt && !this.stoppedAt;
  }
  recordPing() {
    this.pingedAt = now();
  }
  recordConnect() {
    this.reconnectAttempts = 0;
    this.recordPing();
    delete this.disconnectedAt;
    logger.log("ConnectionMonitor recorded connect");
  }
  recordDisconnect() {
    this.disconnectedAt = now();
    logger.log("ConnectionMonitor recorded disconnect");
  }
  startPolling() {
    this.stopPolling();
    this.poll();
  }
  stopPolling() {
    clearTimeout(this.pollTimeout);
  }
  poll() {
    this.pollTimeout = setTimeout((() => {
      this.reconnectIfStale();
      this.poll();
    }), this.getPollInterval());
  }
  getPollInterval() {
    const {staleThreshold: staleThreshold, reconnectionBackoffRate: reconnectionBackoffRate} = this.constructor;
    const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
    const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
    const jitter = jitterMax * Math.random();
    return staleThreshold * 1e3 * backoff * (1 + jitter);
  }
  reconnectIfStale() {
    if (this.connectionIsStale()) {
      logger.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
      this.reconnectAttempts++;
      if (this.disconnectedRecently()) {
        logger.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
      } else {
        logger.log("ConnectionMonitor reopening");
        this.connection.reopen();
      }
    }
  }
  get refreshedAt() {
    return this.pingedAt ? this.pingedAt : this.startedAt;
  }
  connectionIsStale() {
    return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
  }
  disconnectedRecently() {
    return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
  }
  visibilityDidChange() {
    if (document.visibilityState === "visible") {
      setTimeout((() => {
        if (this.connectionIsStale() || !this.connection.isOpen()) {
          logger.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
          this.connection.reopen();
        }
      }), 200);
    }
  }
}

ConnectionMonitor.staleThreshold = 6;

ConnectionMonitor.reconnectionBackoffRate = .15;

var INTERNAL = {
  message_types: {
    welcome: "welcome",
    disconnect: "disconnect",
    ping: "ping",
    confirmation: "confirm_subscription",
    rejection: "reject_subscription"
  },
  disconnect_reasons: {
    unauthorized: "unauthorized",
    invalid_request: "invalid_request",
    server_restart: "server_restart"
  },
  default_mount_path: "/cable",
  protocols: [ "actioncable-v1-json", "actioncable-unsupported" ]
};

const {message_types: message_types, protocols: protocols} = INTERNAL;

const supportedProtocols = protocols.slice(0, protocols.length - 1);

const indexOf = [].indexOf;

class Connection {
  constructor(consumer) {
    this.open = this.open.bind(this);
    this.consumer = consumer;
    this.subscriptions = this.consumer.subscriptions;
    this.monitor = new ConnectionMonitor(this);
    this.disconnected = true;
  }
  send(data) {
    if (this.isOpen()) {
      this.webSocket.send(JSON.stringify(data));
      return true;
    } else {
      return false;
    }
  }
  open() {
    if (this.isActive()) {
      logger.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
      return false;
    } else {
      logger.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${protocols}`);
      if (this.webSocket) {
        this.uninstallEventHandlers();
      }
      this.webSocket = new adapters.WebSocket(this.consumer.url, protocols);
      this.installEventHandlers();
      this.monitor.start();
      return true;
    }
  }
  close({allowReconnect: allowReconnect} = {
    allowReconnect: true
  }) {
    if (!allowReconnect) {
      this.monitor.stop();
    }
    if (this.isOpen()) {
      return this.webSocket.close();
    }
  }
  reopen() {
    logger.log(`Reopening WebSocket, current state is ${this.getState()}`);
    if (this.isActive()) {
      try {
        return this.close();
      } catch (error) {
        logger.log("Failed to reopen WebSocket", error);
      } finally {
        logger.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
        setTimeout(this.open, this.constructor.reopenDelay);
      }
    } else {
      return this.open();
    }
  }
  getProtocol() {
    if (this.webSocket) {
      return this.webSocket.protocol;
    }
  }
  isOpen() {
    return this.isState("open");
  }
  isActive() {
    return this.isState("open", "connecting");
  }
  isProtocolSupported() {
    return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
  }
  isState(...states) {
    return indexOf.call(states, this.getState()) >= 0;
  }
  getState() {
    if (this.webSocket) {
      for (let state in adapters.WebSocket) {
        if (adapters.WebSocket[state] === this.webSocket.readyState) {
          return state.toLowerCase();
        }
      }
    }
    return null;
  }
  installEventHandlers() {
    for (let eventName in this.events) {
      const handler = this.events[eventName].bind(this);
      this.webSocket[`on${eventName}`] = handler;
    }
  }
  uninstallEventHandlers() {
    for (let eventName in this.events) {
      this.webSocket[`on${eventName}`] = function() {};
    }
  }
}

Connection.reopenDelay = 500;

Connection.prototype.events = {
  message(event) {
    if (!this.isProtocolSupported()) {
      return;
    }
    const {identifier: identifier, message: message, reason: reason, reconnect: reconnect, type: type} = JSON.parse(event.data);
    switch (type) {
     case message_types.welcome:
      this.monitor.recordConnect();
      return this.subscriptions.reload();

     case message_types.disconnect:
      logger.log(`Disconnecting. Reason: ${reason}`);
      return this.close({
        allowReconnect: reconnect
      });

     case message_types.ping:
      return this.monitor.recordPing();

     case message_types.confirmation:
      this.subscriptions.confirmSubscription(identifier);
      return this.subscriptions.notify(identifier, "connected");

     case message_types.rejection:
      return this.subscriptions.reject(identifier);

     default:
      return this.subscriptions.notify(identifier, "received", message);
    }
  },
  open() {
    logger.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
    this.disconnected = false;
    if (!this.isProtocolSupported()) {
      logger.log("Protocol is unsupported. Stopping monitor and disconnecting.");
      return this.close({
        allowReconnect: false
      });
    }
  },
  close(event) {
    logger.log("WebSocket onclose event");
    if (this.disconnected) {
      return;
    }
    this.disconnected = true;
    this.monitor.recordDisconnect();
    return this.subscriptions.notifyAll("disconnected", {
      willAttemptReconnect: this.monitor.isRunning()
    });
  },
  error() {
    logger.log("WebSocket onerror event");
  }
};

const extend = function(object, properties) {
  if (properties != null) {
    for (let key in properties) {
      const value = properties[key];
      object[key] = value;
    }
  }
  return object;
};

class Subscription {
  constructor(consumer, params = {}, mixin) {
    this.consumer = consumer;
    this.identifier = JSON.stringify(params);
    extend(this, mixin);
  }
  perform(action, data = {}) {
    data.action = action;
    return this.send(data);
  }
  send(data) {
    return this.consumer.send({
      command: "message",
      identifier: this.identifier,
      data: JSON.stringify(data)
    });
  }
  unsubscribe() {
    return this.consumer.subscriptions.remove(this);
  }
}

class SubscriptionGuarantor {
  constructor(subscriptions) {
    this.subscriptions = subscriptions;
    this.pendingSubscriptions = [];
  }
  guarantee(subscription) {
    if (this.pendingSubscriptions.indexOf(subscription) == -1) {
      logger.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
      this.pendingSubscriptions.push(subscription);
    } else {
      logger.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
    }
    this.startGuaranteeing();
  }
  forget(subscription) {
    logger.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
    this.pendingSubscriptions = this.pendingSubscriptions.filter((s => s !== subscription));
  }
  startGuaranteeing() {
    this.stopGuaranteeing();
    this.retrySubscribing();
  }
  stopGuaranteeing() {
    clearTimeout(this.retryTimeout);
  }
  retrySubscribing() {
    this.retryTimeout = setTimeout((() => {
      if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
        this.pendingSubscriptions.map((subscription => {
          logger.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
          this.subscriptions.subscribe(subscription);
        }));
      }
    }), 500);
  }
}

class Subscriptions {
  constructor(consumer) {
    this.consumer = consumer;
    this.guarantor = new SubscriptionGuarantor(this);
    this.subscriptions = [];
  }
  create(channelName, mixin) {
    const channel = channelName;
    const params = typeof channel === "object" ? channel : {
      channel: channel
    };
    const subscription = new Subscription(this.consumer, params, mixin);
    return this.add(subscription);
  }
  add(subscription) {
    this.subscriptions.push(subscription);
    this.consumer.ensureActiveConnection();
    this.notify(subscription, "initialized");
    this.subscribe(subscription);
    return subscription;
  }
  remove(subscription) {
    this.forget(subscription);
    if (!this.findAll(subscription.identifier).length) {
      this.sendCommand(subscription, "unsubscribe");
    }
    return subscription;
  }
  reject(identifier) {
    return this.findAll(identifier).map((subscription => {
      this.forget(subscription);
      this.notify(subscription, "rejected");
      return subscription;
    }));
  }
  forget(subscription) {
    this.guarantor.forget(subscription);
    this.subscriptions = this.subscriptions.filter((s => s !== subscription));
    return subscription;
  }
  findAll(identifier) {
    return this.subscriptions.filter((s => s.identifier === identifier));
  }
  reload() {
    return this.subscriptions.map((subscription => this.subscribe(subscription)));
  }
  notifyAll(callbackName, ...args) {
    return this.subscriptions.map((subscription => this.notify(subscription, callbackName, ...args)));
  }
  notify(subscription, callbackName, ...args) {
    let subscriptions;
    if (typeof subscription === "string") {
      subscriptions = this.findAll(subscription);
    } else {
      subscriptions = [ subscription ];
    }
    return subscriptions.map((subscription => typeof subscription[callbackName] === "function" ? subscription[callbackName](...args) : undefined));
  }
  subscribe(subscription) {
    if (this.sendCommand(subscription, "subscribe")) {
      this.guarantor.guarantee(subscription);
    }
  }
  confirmSubscription(identifier) {
    logger.log(`Subscription confirmed ${identifier}`);
    this.findAll(identifier).map((subscription => this.guarantor.forget(subscription)));
  }
  sendCommand(subscription, command) {
    const {identifier: identifier} = subscription;
    return this.consumer.send({
      command: command,
      identifier: identifier
    });
  }
}

class Consumer {
  constructor(url) {
    this._url = url;
    this.subscriptions = new Subscriptions(this);
    this.connection = new Connection(this);
  }
  get url() {
    return createWebSocketURL(this._url);
  }
  send(data) {
    return this.connection.send(data);
  }
  connect() {
    return this.connection.open();
  }
  disconnect() {
    return this.connection.close({
      allowReconnect: false
    });
  }
  ensureActiveConnection() {
    if (!this.connection.isActive()) {
      return this.connection.open();
    }
  }
}

function createWebSocketURL(url) {
  if (typeof url === "function") {
    url = url();
  }
  if (url && !/^wss?:/i.test(url)) {
    const a = document.createElement("a");
    a.href = url;
    a.href = a.href;
    a.protocol = a.protocol.replace("http", "ws");
    return a.href;
  } else {
    return url;
  }
}

function createConsumer(url = getConfig("url") || INTERNAL.default_mount_path) {
  return new Consumer(url);
}

function getConfig(name) {
  const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
  if (element) {
    return element.getAttribute("content");
  }
}




/***/ }),

/***/ 4165:
/*!************************************!*\
  !*** ./src/analytics/collector.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnalyticsCollector": () => (/* binding */ AnalyticsCollector)
/* harmony export */ });
/* harmony import */ var _getkoala_edge_api_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @getkoala/edge-api-client */ 4552);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/throttle */ 3493);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_wrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/wrap */ 359);
/* harmony import */ var lodash_wrap__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_wrap__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _api_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api/bootstrap */ 3098);
/* harmony import */ var _api_collect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api/collect */ 1457);
/* harmony import */ var _browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../browser */ 66);
/* harmony import */ var _channels__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../channels */ 8595);
/* harmony import */ var _channels_profile_channel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../channels/profile-channel */ 423);
/* harmony import */ var _generated_version__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../generated/version */ 6748);
/* harmony import */ var _lib_dom_ready__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../lib/dom-ready */ 2998);
/* harmony import */ var _lib_is_same_page__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../lib/is-same-page */ 6163);
/* harmony import */ var _ui_lib_utm__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../ui/lib/utm */ 4221);
/* harmony import */ var _event_context__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./event-context */ 9581);
/* harmony import */ var _event_emitter__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./event-emitter */ 2697);
/* harmony import */ var _event_queue__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./event-queue */ 1359);
/* harmony import */ var _forms__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./forms */ 7155);
/* harmony import */ var _metrics_queue__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./metrics-queue */ 6452);
/* harmony import */ var _page_page_tracker__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./page/page-tracker */ 3290);
/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./session */ 3648);
/* harmony import */ var _top_domain__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./top-domain */ 8165);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./user */ 8187);






















let domain = window.location.hostname;
try {
  domain = (0,_top_domain__WEBPACK_IMPORTED_MODULE_19__.topDomain)(new URL(window.location.href)) || window.location.hostname;
} catch (_) {
}
const interactionEvents = ["scroll", "mousemove", "click", "touchstart", "keypress"];
class AnalyticsCollector extends _event_emitter__WEBPACK_IMPORTED_MODULE_13__.Emitter {
  constructor(options) {
    var _a, _b;
    super();
    this.version = _generated_version__WEBPACK_IMPORTED_MODULE_8__.version;
    this.initialized = false;
    this.subscription = null;
    this.collectForms = () => {
      const allowedOrigins = [domain, "hsforms.com", "salesforce.com", "pardot.com"];
      (0,_forms__WEBPACK_IMPORTED_MODULE_15__.collectFormSubmissions)(async (details) => {
        var _a, _b;
        let allowedOrigin = !details.action;
        if (details.action) {
          const formUrl = new URL(details.action);
          allowedOrigin = allowedOrigins.some((o) => formUrl.hostname.endsWith(o));
        }
        if (allowedOrigin) {
          if (Object.keys(details.formData).length > 0) {
            this.stats.increment("sdk.form.submitted", details);
          }
          const traits = { ...details.traits };
          if (this.email) {
            delete traits.email;
          }
          if (Object.keys(traits).length > 0) {
            this.identify(traits, { source: "form" });
          }
          try {
            const settings = (_b = (_a = this.bootstrapData) == null ? void 0 : _a.widget_settings) != null ? _b : {};
            const currentPage = new URL(window.location.href);
            const samePage = (0,_lib_is_same_page__WEBPACK_IMPORTED_MODULE_10__.isSamePage)(currentPage, settings.cta_href);
            const fromKoala = (0,_ui_lib_utm__WEBPACK_IMPORTED_MODULE_11__.hasUtm)(currentPage, "koala_track", "1") || (0,_ui_lib_utm__WEBPACK_IMPORTED_MODULE_11__.hasUtm)(currentPage, "utm_source", "koala") || (0,_ui_lib_utm__WEBPACK_IMPORTED_MODULE_11__.hasUtm)(currentPage, "utm_medium", "koala");
            if (settings.enabled && samePage && fromKoala) {
              const properties = {
                type: "form",
                details
              };
              this.track("Koala Demo Booked", properties);
              this.stats.increment("sdk.demo.booked", properties);
            }
          } catch (error) {
          }
        }
        this.flush();
      });
    };
    this.touchLastActivityAt = lodash_throttle__WEBPACK_IMPORTED_MODULE_1___default()(() => {
      if (document.visibilityState === "visible") {
        this.lastActivityAt = new Date().toISOString();
        this.updatePresence();
      }
    }, 1e3);
    this.updatePresence = lodash_throttle__WEBPACK_IMPORTED_MODULE_1___default()(() => {
      var _a;
      (_a = this.subscription) == null ? void 0 : _a.updatePresence(this.lastActivityAt);
    }, 3e4);
    this.options = options;
    const project = this.options.project;
    const existing = this.deserialize();
    this.referrer = (_a = existing.r) != null ? _a : document.referrer;
    this.user = new _user__WEBPACK_IMPORTED_MODULE_20__.UserStore({
      cookies: (_b = this.options.sdk_settings) == null ? void 0 : _b.cookie_defaults
    });
    this.qualification = existing.q;
    const anonymousProfile = this.options.a || existing.a || {};
    this.edge = (0,_getkoala_edge_api_client__WEBPACK_IMPORTED_MODULE_0__.build)(anonymousProfile);
    this.stats = new _metrics_queue__WEBPACK_IMPORTED_MODULE_16__.MetricsQueue({ flushInterval: 1e3 }, project, this.options);
    this.eventQueue = new _event_queue__WEBPACK_IMPORTED_MODULE_14__.EventQueue({ flushInterval: 1e3 }, project, this.options);
    this.pageTracker = new _page_page_tracker__WEBPACK_IMPORTED_MODULE_17__.PageTracker(this.options);
    this.pageTracker.on("page", (pages) => {
      if (!(pages == null ? void 0 : pages.length))
        return;
      const latest = pages[pages.length - 1];
      this.edge.index(latest);
      const hasId = () => this.initialized && Boolean(this.user.id());
      const collect = () => {
        const profileId = this.user.id();
        (0,_api_collect__WEBPACK_IMPORTED_MODULE_4__.collectPages)(project, profileId, pages);
      };
      if (!hasId()) {
        this.when(hasId).then(collect);
      } else {
        collect();
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.flush();
      }
    });
    window.addEventListener("focus", this.touchLastActivityAt);
    interactionEvents.forEach((event) => {
      window.addEventListener(event, this.touchLastActivityAt, { capture: true, passive: true });
    });
    this.detectSegment();
    this.detectRudder();
    this.once("initialized", (settings) => {
      this.initialized = true;
      this.bootstrapData = settings;
      this.stats.increment("sdk.loaded", {
        page: window.location.pathname
      });
      if (settings.sdk_settings.form_collection !== "off") {
        this.collectForms();
      }
    });
  }
  async ready(fn) {
    return (0,_lib_dom_ready__WEBPACK_IMPORTED_MODULE_9__.domReady)(async () => {
      if (this.initialized || this.qualification) {
        if (fn) {
          await fn();
        }
        return Promise.resolve(void 0);
      }
      return new Promise((resolve) => {
        this.once("initialized", async () => {
          if (fn) {
            await fn();
          }
          resolve(void 0);
        });
      });
    });
  }
  cookieDefaults() {
    var _a, _b;
    return (_b = (_a = this.options.sdk_settings) == null ? void 0 : _a.cookie_defaults) != null ? _b : {};
  }
  flush() {
    this.serialize();
    this.eventQueue.flush();
    this.stats.flush();
  }
  open() {
    this.emit("open");
  }
  close() {
    this.emit("close");
  }
  show() {
    this.emit("request-show");
  }
  hide() {
    this.emit("hide");
  }
  async mountWidget(settings = {}) {
    if (!this.bootstrapData) {
      return;
    }
    return (0,_browser__WEBPACK_IMPORTED_MODULE_5__.mountWidget)(this, {
      ...this.bootstrapData,
      widget_settings: {
        ...this.bootstrapData.widget_settings,
        enabled: true,
        ...settings
      },
      project: this.options.project
    });
  }
  get session() {
    return _session__WEBPACK_IMPORTED_MODULE_18__.session.fetch(this.options.sdk_settings);
  }
  get email() {
    return this.user.email();
  }
  detectSegment() {
    let attempts = 0;
    this.when(
      () => {
        attempts++;
        return typeof window.analytics !== "undefined" || attempts >= 10;
      },
      () => {
        if (!window.analytics) {
          return;
        }
        window.analytics.ready(() => {
          const ajs = window.analytics;
          const userTraits = ajs.user().traits();
          this.identify(userTraits, { source: "segment" });
          ajs.on("invoke", () => {
            const userTraits2 = ajs.user().traits();
            this.identify(userTraits2, { source: "segment" });
          });
          ajs.on("track", (event, properties) => {
            var _a;
            if (((_a = this.bootstrapData) == null ? void 0 : _a.sdk_settings.segment_auto_track) !== "off") {
              this.track(event, properties);
            }
          });
          ajs.on("identify", (_id, traits) => {
            this.identify(traits, { source: "segment" });
          });
        });
      },
      100
    );
  }
  detectRudder() {
    let attempts = 0;
    this.when(
      () => {
        attempts++;
        return typeof window.rudderanalytics !== "undefined" || attempts >= 10;
      },
      () => {
        if (!window.rudderanalytics) {
          return;
        }
        window.rudderanalytics.ready(() => {
          var _a;
          const rudder = window.rudderanalytics;
          const userTraits = rudder.getUserTraits();
          let groupTraits = {};
          if ("getGroupTraits" in rudder) {
            groupTraits = (_a = rudder.getGroupTraits()) != null ? _a : {};
          }
          if (Object.keys(userTraits).length > 0) {
            let traits = userTraits;
            if (Object.keys(groupTraits).length > 0) {
              traits = {
                ...traits,
                $account: groupTraits
              };
            }
            this.identify(traits, { source: "rudderstack" });
          }
          rudder.track = lodash_wrap__WEBPACK_IMPORTED_MODULE_2___default()(rudder.track, (og, ...args) => {
            const name = args[0];
            const props = args[1];
            if (typeof name === "string") {
              this.track(name, props != null ? props : {}).catch((err) => {
                console.warn("KOALA", err);
              });
            }
            return og(...args);
          });
          rudder.identify = lodash_wrap__WEBPACK_IMPORTED_MODULE_2___default()(rudder.identify, (og, ...args) => {
            var _a2;
            const id = args[0];
            const traits = (_a2 = args[1]) != null ? _a2 : {};
            if (typeof id === "string" && typeof traits === "object" && Object.keys(traits).length > 0) {
              this.identify(traits, { source: "rudderstack" }).catch((err) => {
                console.warn("KOALA", err);
              });
            }
            return og(...args);
          });
        });
      },
      1e3
    );
  }
  async track(event, properties = {}) {
    this.eventQueue.track(event, properties);
    this.edge.index({ event, properties });
    this.emit("track", event, properties);
  }
  async identify(...args) {
    var _a;
    let traits = {};
    let options = {};
    if (typeof args[0] === "string") {
      traits = { ...args[1] || {}, email: args[0] };
      options = args[2] || {};
    } else {
      traits = args[0];
      options = args[1] || {};
    }
    if (!traits || Object.keys(traits).length === 0) {
      return;
    }
    const incomingTraits = this.user.netNewTraits(traits);
    if (traits.email) {
      incomingTraits.email = traits.email;
    }
    if (Object.keys(incomingTraits).length === 0) {
      return;
    }
    this.user.upsertTraits(incomingTraits);
    this.edge.index(incomingTraits);
    const event = {
      context: {
        ...(0,_event_context__WEBPACK_IMPORTED_MODULE_12__.getContext)("identify", this.options),
        source: (_a = options == null ? void 0 : options.source) != null ? _a : "identify"
      },
      type: "identify",
      traits: incomingTraits,
      sent_at: new Date().toISOString()
    };
    (0,_api_collect__WEBPACK_IMPORTED_MODULE_4__.collectIdentify)(this.options.project, this.profile, event);
    this.emit("identify", this.user.id(), traits);
  }
  subscribe() {
    var _a, _b;
    if (((_b = (_a = this.bootstrapData) == null ? void 0 : _a.sdk_settings) == null ? void 0 : _b.websocket_connection) === "off") {
      return;
    }
    this.when(() => Boolean(this.user.id())).then(() => {
      const profileId = this.user.id();
      const project = this.options.project;
      this.unsubscribe();
      const client = (0,_channels__WEBPACK_IMPORTED_MODULE_6__.consumer)(profileId, project);
      this.subscription = (0,_channels_profile_channel__WEBPACK_IMPORTED_MODULE_7__.createProfileSubscription)(client, this, (data) => {
        if (data.action === "score") {
          this.updateQualification(data.data);
        }
        if (data.action === "anonymous_profile") {
          this.buildAnonymousProfile(data.data);
        }
      });
    }).catch((error) => {
      console.warn("[KOALA]", "Error subscribing to profile.", error);
    });
  }
  unsubscribe() {
    var _a;
    (_a = this.subscription) == null ? void 0 : _a.unsubscribe();
    this.subscription = null;
  }
  buildAnonymousProfile(anonymousProfile) {
    this.edge = (0,_getkoala_edge_api_client__WEBPACK_IMPORTED_MODULE_0__.build)(anonymousProfile || {});
    this.emit("profile-update");
  }
  updateQualification(result) {
    const { profile_id, qualification, a } = result;
    this.qualification = qualification;
    this.emit("qualification", result);
    this.emit("change");
    if (a) {
      this.buildAnonymousProfile(a);
    }
    if (profile_id !== this.user.id()) {
      this.user.setId(profile_id);
      this.emit("profile-id-update", profile_id);
    }
  }
  async qualify(email) {
    try {
      email = email == null ? void 0 : email.trim();
      if (email) {
        this.user.upsertTraits({ email });
        this.edge.index({ email });
      }
      const result = await (0,_api_collect__WEBPACK_IMPORTED_MODULE_4__.qualify)(this.options.project, this.profile);
      this.updateQualification(result);
      return result;
    } catch (error) {
      this.stats.increment("sdk.error", {
        method: "qualify",
        message: error == null ? void 0 : error.message
      });
      throw error;
    }
  }
  serialize() {
    const raw = {
      r: this.referrer,
      q: this.qualification,
      a: {
        b: this.edge.raw.bloom.toHash(),
        c: this.edge.raw.counts.toHash()
      }
    };
    window.localStorage.setItem("ka", JSON.stringify(raw));
  }
  deserialize() {
    var _a;
    const serialized = (_a = window.localStorage.getItem("ka")) != null ? _a : "{}";
    return JSON.parse(serialized);
  }
  get profile() {
    return {
      page_views: this.pageTracker.allPages(),
      user: this.user.userInfo(),
      referrer: this.referrer,
      events: this.eventQueue.events,
      email: this.user.traits().email,
      traits: this.user.traits(),
      qualification: this.qualification
    };
  }
  async reset() {
    this.eventQueue.send(true);
    this.eventQueue.reset();
    this.stats.send(true);
    this.stats.reset();
    this.pageTracker.reset();
    this.unsubscribe();
    this.user.reset();
    window.localStorage.removeItem("ka");
    window.localStorage.removeItem("kl:traits");
    this.qualification = void 0;
    this.lastActivityAt = void 0;
    const settings = await (0,_api_bootstrap__WEBPACK_IMPORTED_MODULE_3__.bootstrap)(this.options.project);
    this.user.setId(settings.profile_id);
    this.options.profile_id = settings.profile_id;
    this.edge = (0,_getkoala_edge_api_client__WEBPACK_IMPORTED_MODULE_0__.build)({});
    this.bootstrapData = settings;
    _session__WEBPACK_IMPORTED_MODULE_18__.session.clear();
    this.subscribe();
  }
  /** Backwards compatibility **/
  get e() {
    return this.edge.events;
  }
  get p() {
    return this.edge.traits;
  }
  get page() {
    return this.edge.page;
  }
  get when() {
    return this.edge.when;
  }
}


/***/ }),

/***/ 388:
/*!**********************************!*\
  !*** ./src/analytics/cookies.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "allowedCookieDomain": () => (/* binding */ allowedCookieDomain),
/* harmony export */   "getCookie": () => (/* binding */ getCookie),
/* harmony export */   "removeCookie": () => (/* binding */ removeCookie),
/* harmony export */   "setCookie": () => (/* binding */ setCookie)
/* harmony export */ });
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ 1955);
/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./session */ 3648);



function setCookie(key, value, options) {
  var _a;
  const hostname = (0,_session__WEBPACK_IMPORTED_MODULE_1__.hostName)((_a = options == null ? void 0 : options.domain) != null ? _a : "");
  js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].set(key, value, {
    ...options,
    domain: hostname
  });
  return value;
}
function getCookie(key) {
  return js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].get(key);
}
function removeCookie(key, options) {
  const value = js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].get(key);
  js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].remove(key, options);
  return value;
}
function allowedCookieDomain(detectedTopLevelDomain, explicitCookieDomain) {
  if (detectedTopLevelDomain === explicitCookieDomain) {
    return true;
  }
  if (window.location.hostname === explicitCookieDomain) {
    return true;
  }
  const clean = (0,_session__WEBPACK_IMPORTED_MODULE_1__.hostName)(explicitCookieDomain != null ? explicitCookieDomain : "");
  if (!detectedTopLevelDomain && !clean) {
    return true;
  }
  if ((detectedTopLevelDomain != null ? detectedTopLevelDomain : "").includes(clean != null ? clean : "")) {
    return true;
  }
  return false;
}


/***/ }),

/***/ 9581:
/*!****************************************!*\
  !*** ./src/analytics/event-context.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getContext": () => (/* binding */ getContext)
/* harmony export */ });
/* harmony import */ var _page_page_info__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page/page-info */ 3213);
/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./session */ 3648);



function deviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}
function safeDefaults() {
  try {
    return (0,_page_page_info__WEBPACK_IMPORTED_MODULE_0__.pageDefaults)();
  } catch (e) {
    return void 0;
  }
}
function getContext(type, collectorOptions) {
  var _a, _b, _c, _d, _e, _f;
  const page = type === "page" ? void 0 : safeDefaults();
  const collector = window.ko;
  const ctx = {
    page,
    userAgent: window.navigator.userAgent,
    platform: {
      name: window.navigator.platform,
      deviceType: deviceType()
    },
    playbooks: {
      id: (_a = collector == null ? void 0 : collector.activePlaybook) == null ? void 0 : _a.id,
      matchingPlaybooks: (_b = collector == null ? void 0 : collector.matchingPlaybooks) == null ? void 0 : _b.map((p) => p.id)
    },
    user: (_c = collector == null ? void 0 : collector.user) == null ? void 0 : _c.userInfo(),
    library: {
      name: "koala",
      version: collector == null ? void 0 : collector.version
    },
    session: _session__WEBPACK_IMPORTED_MODULE_1__.session.fetch({
      cookie_defaults: (_f = (_d = collector == null ? void 0 : collector.cookieDefaults) == null ? void 0 : _d.call(collector)) != null ? _f : (_e = collectorOptions == null ? void 0 : collectorOptions.sdk_settings) == null ? void 0 : _e.cookie_defaults
    }),
    locale: navigator.language,
    referrer: document.referrer,
    campaign: page == null ? void 0 : page.utm
  };
  return ctx;
}


/***/ }),

/***/ 2697:
/*!****************************************!*\
  !*** ./src/analytics/event-emitter.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Emitter": () => (/* binding */ Emitter)
/* harmony export */ });

class Emitter {
  constructor() {
    this.callbacks = {};
  }
  on(event, callback) {
    var _a;
    this.callbacks[event] = [...(_a = this.callbacks[event]) != null ? _a : [], callback];
    return this;
  }
  once(event, fn) {
    const on = (...args) => {
      this.off(event, on);
      fn.apply(this, args);
    };
    this.on(event, on);
    return this;
  }
  off(event, callback) {
    var _a;
    const fns = (_a = this.callbacks[event]) != null ? _a : [];
    const without = fns.filter((fn) => fn !== callback);
    this.callbacks[event] = without;
    return this;
  }
  emit(event, ...args) {
    var _a;
    const callbacks = (_a = this.callbacks[event]) != null ? _a : [];
    callbacks.forEach((callback) => {
      callback.apply(this, args);
    });
    return this;
  }
  removeListeners() {
    this.callbacks = {};
  }
}


/***/ }),

/***/ 1359:
/*!**************************************!*\
  !*** ./src/analytics/event-queue.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventQueue": () => (/* binding */ EventQueue)
/* harmony export */ });
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! nanoid */ 3416);
/* harmony import */ var _api_collect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/collect */ 1457);
/* harmony import */ var _event_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-context */ 9581);
/* harmony import */ var _queue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./queue */ 9630);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user */ 8187);






class EventQueue extends _queue__WEBPACK_IMPORTED_MODULE_2__.Queue {
  constructor(options = {}, projectSlug, collectorOptions) {
    super(options);
    this.events = [];
    this.projectSlug = projectSlug;
    this.collectorOptions = collectorOptions;
  }
  track(event, properties = {}) {
    const e = {
      context: (0,_event_context__WEBPACK_IMPORTED_MODULE_1__.getContext)("event", this.collectorOptions),
      message_id: (0,nanoid__WEBPACK_IMPORTED_MODULE_4__.nanoid)(),
      type: "track",
      event,
      properties,
      sent_at: new Date().toISOString()
    };
    this.events.push(e);
    this.add(e);
  }
  // Override the default onSend method to send the events to the server
  onSend(events = []) {
    const profile_id = (0,_user__WEBPACK_IMPORTED_MODULE_3__.getUserId)();
    const project = this.projectSlug;
    if (!project || !profile_id) {
      return false;
    }
    return _api_collect__WEBPACK_IMPORTED_MODULE_0__.collectEvents(project, profile_id, events);
  }
}


/***/ }),

/***/ 7155:
/*!********************************!*\
  !*** ./src/analytics/forms.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "collectFormSubmissions": () => (/* binding */ collectFormSubmissions)
/* harmony export */ });
/* harmony import */ var form_request_submit_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! form-request-submit-polyfill */ 9865);
/* harmony import */ var form_request_submit_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(form_request_submit_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_camelCase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/camelCase */ 8929);
/* harmony import */ var lodash_camelCase__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_camelCase__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_lowerCase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/lowerCase */ 5021);
/* harmony import */ var lodash_lowerCase__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_lowerCase__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_snakeCase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/snakeCase */ 1865);
/* harmony import */ var lodash_snakeCase__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_snakeCase__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lib_dom_ready__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/dom-ready */ 2998);
/* harmony import */ var _page_page_info__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./page/page-info */ 3213);







let removePrevious;
const sensitiveNames = ["ccn", "cvv", "password", "pin", "secret", "token", "creditCard"].flatMap((name) => [
  name.toLowerCase(),
  lodash_snakeCase__WEBPACK_IMPORTED_MODULE_3___default()(name),
  lodash_lowerCase__WEBPACK_IMPORTED_MODULE_2___default()(name)
]);
const traitNames = [
  "email",
  "name",
  "employees",
  "employeeCount",
  "phone",
  "firstName",
  "lastName",
  "fullName",
  "title",
  "username",
  "website",
  "domain",
  "company"
].flatMap((name) => [name, lodash_snakeCase__WEBPACK_IMPORTED_MODULE_3___default()(name), lodash_lowerCase__WEBPACK_IMPORTED_MODULE_2___default()(name)]);
function findAncestor(element, callback) {
  let current = element;
  while (current) {
    if (callback(current)) {
      break;
    }
    current = current.parentElement;
    if (!current || current.tagName === "FORM") {
      break;
    }
  }
  return current;
}
function extractText(element) {
  var _a, _b;
  return ((_a = element == null ? void 0 : element.innerText) == null ? void 0 : _a.trim()) || ((_b = element == null ? void 0 : element.textContent) == null ? void 0 : _b.trim());
}
function getNearestLabel(element, others) {
  let label;
  if (element.labels && element.labels.length) {
    const [el, ..._others] = Array.from(element.labels);
    label = extractText(el);
  }
  if (!label) {
    const siblingLabels = [element.previousElementSibling, element.nextElementSibling].filter(
      (e) => (e == null ? void 0 : e.tagName) === "LABEL" && extractText(e)
    );
    if (siblingLabels.length) {
      label = extractText(siblingLabels[0]);
    }
  }
  if (!label) {
    const ancestor = findAncestor(element, (e) => {
      const hasLabel = e.querySelectorAll("label").length > 0;
      const noOtherInputs = others.every((other) => other === element || !e.contains(other));
      return hasLabel && noOtherInputs;
    });
    if (ancestor) {
      label = extractText(ancestor.querySelector("label"));
    }
  }
  return lodash_camelCase__WEBPACK_IMPORTED_MODULE_1___default()(label);
}
function generateId(element, index) {
  const tag = element.tagName.toLowerCase();
  const type = element.type;
  const id = element.id ? `#${element.id}` : "";
  const className = element.className ? `.${element.className}` : "";
  return `${tag}_${index}_${[type, id, className].filter(Boolean).join("_")}`;
}
function getFormElementData(form) {
  const data = {};
  const elements = Array.from(form.elements);
  for (const element of elements) {
    if (!element.value) {
      continue;
    }
    if (!["INPUT", "SELECT", "TEXTAREA"].includes(element.tagName)) {
      continue;
    }
    if (["checkbox", "radio"].includes(element.type) && !element.checked) {
      continue;
    }
    if (element.type === "password") {
      continue;
    }
    if (element.name && sensitiveNames.some((s) => element.name.toLowerCase().includes(s))) {
      continue;
    }
    if (element.id && sensitiveNames.some((s) => element.id.toLowerCase().includes(s))) {
      continue;
    }
    const label = getNearestLabel(element, elements);
    if (label && sensitiveNames.some((s) => label.toLowerCase().includes(s))) {
      continue;
    }
    const id = element.id || generateId(element, elements.indexOf(element));
    const keys = [element.name, label, id].filter(Boolean);
    for (const key of keys) {
      if (!data[key]) {
        data[key] = {
          id,
          label,
          name: element.name,
          type: element.type,
          tagName: element.tagName,
          value: element.value
        };
        break;
      }
    }
  }
  return data;
}
function extractFormData(fields) {
  const formData = {};
  for (const [key, data] of Object.entries(fields)) {
    formData[key] = data.value;
  }
  return formData;
}
function validEmail(value) {
  const input = document.createElement("input");
  input.type = "email";
  input.required = true;
  input.value = String(value);
  return input.checkValidity();
}
function emailKeys(fields) {
  return Object.entries(fields).filter(([_key, data]) => {
    var _a, _b, _c, _d, _e, _f;
    if (data.type === "email" || ((_b = (_a = data.name) == null ? void 0 : _a.toLowerCase()) == null ? void 0 : _b.includes("email")) || ((_d = (_c = data.label) == null ? void 0 : _c.toLowerCase()) == null ? void 0 : _d.includes("email")) || ((_f = (_e = data.id) == null ? void 0 : _e.toLowerCase()) == null ? void 0 : _f.includes("email"))) {
      return validEmail(data.value);
    }
    return false;
  }).map(([key]) => key);
}
function extractTraits(fields) {
  const traits = {};
  const emails = emailKeys(fields);
  const hasOneEmail = emails.length === 1;
  for (const [key, data] of Object.entries(fields)) {
    if (hasOneEmail && emails[0] === key) {
      traits.email = data.value;
      continue;
    }
    const names = [data.name, data.label, data.id].filter(Boolean).map((n) => {
      return lodash_camelCase__WEBPACK_IMPORTED_MODULE_1___default()(lodash_lowerCase__WEBPACK_IMPORTED_MODULE_2___default()(n).replace(/^(your|work|business|job)(\s+)/i, ""));
    });
    const name = names.find((n) => traitNames.includes(n) && !traits[n]);
    if (name && name !== "email" && data.value) {
      traits[name] = data.value;
    }
  }
  if (!traits.email) {
    for (const name of Object.keys(traits)) {
      if (name.toLowerCase().includes("name")) {
        delete traits[name];
      }
    }
  }
  return traits;
}
function collectFormSubmissions(callback) {
  if (removePrevious) {
    removePrevious();
  }
  const handleSubmit = async (form) => {
    var _a, _b;
    const isFormElement = form instanceof HTMLFormElement;
    const tagName = form.tagName;
    const validForm = isFormElement || tagName === "FORM";
    const isOff = form.getAttribute("data-koala-collect") === "off";
    if (isOff) {
      return;
    }
    if (!validForm) {
      return;
    }
    const page = (0,_page_page_info__WEBPACK_IMPORTED_MODULE_5__.pageDefaults)();
    const fields = getFormElementData(form);
    const formData = extractFormData(fields);
    const traits = extractTraits(fields);
    const selector = (_b = (_a = form.getAttribute("data-koala-selector")) != null ? _a : form.getAttribute("id")) != null ? _b : form.className;
    try {
      await callback({
        context: {
          page,
          selector
        },
        // If a <form> element contains an element named `name` then that element overrides the form.name property, so that you can't access it.
        // so use `getAttribute` instead. :|
        name: form.getAttribute("name") || form.id,
        method: form.method,
        action: form.action,
        formData,
        traits
      });
    } catch (e) {
    }
  };
  const onSubmit = async (event) => {
    try {
      const form = event.target;
      if (typeof form.requestSubmit === "function") {
        event.preventDefault();
        event.stopPropagation();
        await handleSubmit(form);
        const submitter = form.querySelector("button[type=submit]");
        const doc = event.currentTarget;
        setTimeout(() => {
          if (submitter) {
            form.requestSubmit(submitter);
          } else {
            form.requestSubmit();
          }
          doc == null ? void 0 : doc.addEventListener("submit", onSubmit, { capture: true, once: true });
        }, 0);
      } else {
        await handleSubmit(form);
        const doc = event.currentTarget;
        doc == null ? void 0 : doc.addEventListener("submit", onSubmit, { capture: true, once: true });
      }
    } catch (e) {
    }
  };
  document.addEventListener("submit", onSubmit, { capture: true, once: true });
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    const doc = iframe.contentDocument;
    if (!doc) {
      return;
    }
    (0,_lib_dom_ready__WEBPACK_IMPORTED_MODULE_4__.domReady)(() => {
      doc.addEventListener("submit", onSubmit, { capture: true, once: true });
    }, doc);
  });
  const ogSubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = async function() {
    try {
      await handleSubmit(this);
    } catch (e) {
    }
    ogSubmit.call(this);
  };
  removePrevious = () => {
    document.removeEventListener("submit", onSubmit, { capture: true });
    iframes.forEach((iframe) => {
      const doc = iframe.contentDocument;
      if (!doc) {
        return;
      }
      (0,_lib_dom_ready__WEBPACK_IMPORTED_MODULE_4__.domReady)(() => {
        doc.removeEventListener("submit", onSubmit, { capture: true });
      }, doc);
    });
    HTMLFormElement.prototype.submit = ogSubmit;
  };
}


/***/ }),

/***/ 6452:
/*!****************************************!*\
  !*** ./src/analytics/metrics-queue.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MetricsQueue": () => (/* binding */ MetricsQueue)
/* harmony export */ });
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! nanoid */ 3416);
/* harmony import */ var _api_metrics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/metrics */ 9248);
/* harmony import */ var _event_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-context */ 9581);
/* harmony import */ var _queue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./queue */ 9630);
/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user */ 8187);






class MetricsQueue extends _queue__WEBPACK_IMPORTED_MODULE_2__.Queue {
  constructor(options = {}, projectSlug, collectorOptions) {
    super(options);
    this.projectSlug = projectSlug;
    this.collectorOptions = collectorOptions;
  }
  increment(name, properties) {
    this.add({
      context: (0,_event_context__WEBPACK_IMPORTED_MODULE_1__.getContext)("metric", this.collectorOptions),
      id: (0,nanoid__WEBPACK_IMPORTED_MODULE_4__.nanoid)(),
      name,
      properties,
      sent_at: new Date()
    });
  }
  // Override the default onSend method to send the metrics to the server
  onSend(metrics = []) {
    const profile_id = (0,_user__WEBPACK_IMPORTED_MODULE_3__.getUserId)();
    const project = this.projectSlug;
    if (!project || !profile_id) {
      return false;
    }
    return _api_metrics__WEBPACK_IMPORTED_MODULE_0__.metrics({
      project,
      profile_id,
      metrics
    });
  }
}


/***/ }),

/***/ 3213:
/*!*****************************************!*\
  !*** ./src/analytics/page/page-info.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pageDefaults": () => (/* binding */ pageDefaults)
/* harmony export */ });

function utm(query) {
  if (query.startsWith("?")) {
    query = query.substring(1);
  }
  query = query.replace(/\?/g, "&");
  return query.split("&").reduce((acc, str) => {
    const [k, v = ""] = str.split("=");
    if (k.includes("utm_") && k.length > 4) {
      let utmParam = k.substring(4);
      if (utmParam === "campaign") {
        utmParam = "name";
      }
      acc[utmParam] = decodeURIComponent(v.replace(/\+/g, " "));
    }
    return acc;
  }, {});
}
function pageDefaults() {
  return {
    path: window.location.pathname,
    referrer: document.referrer,
    title: document.title,
    url: window.location.href,
    host: window.location.host,
    utm: utm(window.location.search)
  };
}


/***/ }),

/***/ 3290:
/*!********************************************!*\
  !*** ./src/analytics/page/page-tracker.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PageTracker": () => (/* binding */ PageTracker)
/* harmony export */ });
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/throttle */ 3493);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! nanoid */ 3416);
/* harmony import */ var _lib_from_bfcache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/from-bfcache */ 340);
/* harmony import */ var _lib_is_same_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/is-same-page */ 6163);
/* harmony import */ var _event_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../event-context */ 9581);
/* harmony import */ var _event_emitter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../event-emitter */ 2697);
/* harmony import */ var _session__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../session */ 3648);
/* harmony import */ var _time_focus_timer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../time/focus-timer */ 2167);
/* harmony import */ var _page_info__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page-info */ 3213);










const MAX_PAGE_TIME = 60 * 60 * 1e3;
function wrapNavigation(tracker) {
  const pushState = history.pushState;
  history.pushState = (...args) => {
    pushState.apply(history, args);
    tracker.emit("page_tracker.push");
  };
  const replaceState = history.replaceState;
  history.replaceState = (...args) => {
    replaceState.apply(history, args);
    tracker.emit("page_tracker.replace", ...args);
  };
  window.addEventListener("popstate", () => {
    tracker.emit("page_tracker.pop");
  });
}
function makePage() {
  const page = {
    context: (0,_event_context__WEBPACK_IMPORTED_MODULE_3__.getContext)("page"),
    message_id: (0,nanoid__WEBPACK_IMPORTED_MODULE_8__.nanoid)(),
    page: (0,_page_info__WEBPACK_IMPORTED_MODULE_7__.pageDefaults)(),
    visit_start: new Date(),
    focus_intervals: []
  };
  return page;
}
class PageTracker extends _event_emitter__WEBPACK_IMPORTED_MODULE_4__.Emitter {
  constructor(options) {
    super();
    this.pages = [];
    this.collecting = false;
    this.collectedSomeFocus = false;
    this.allPages = () => {
      return this.pages;
    };
    this.onReplaceState = (_stateObj, _unused, url) => {
      var _a, _b;
      const current = (_b = (_a = this.currentPage) == null ? void 0 : _a.page) == null ? void 0 : _b.url;
      const different = url && !(0,_lib_is_same_page__WEBPACK_IMPORTED_MODULE_2__.isSamePage)(url, current);
      if (!current || different) {
        this.collect();
      }
    };
    this.onVisibilityChange = () => {
      var _a, _b, _c, _d, _e;
      if (document.visibilityState === "visible") {
        const sesh = _session__WEBPACK_IMPORTED_MODULE_5__.session.fetch(this.options.sdk_settings);
        const pageSessionId = (_c = (_b = (_a = this.currentPage) == null ? void 0 : _a.context) == null ? void 0 : _b.session) == null ? void 0 : _c.id;
        const now = new Date().getTime();
        const start = (_e = (_d = this.currentPage) == null ? void 0 : _d.visit_start) == null ? void 0 : _e.getTime();
        if (pageSessionId !== sesh.id) {
          this.collect();
        } else if (!start || Math.abs(now - start) >= MAX_PAGE_TIME) {
          this.collect();
        }
      }
    };
    this.collect = () => {
      this.collecting = true;
      const prevPage = this.endCurrentPage({ emit: false });
      const newPage = makePage();
      this.pages.push(newPage);
      this.collectedSomeFocus = false;
      const pages = [prevPage, newPage].filter(Boolean);
      this.emit("page", pages);
      this.collecting = false;
    };
    this.endCurrentPage = (options) => {
      const current = this.currentPage;
      if (!current) {
        return;
      }
      window.clearTimeout(this.collectFocusTimeout);
      this.collectFocusTimeout = void 0;
      this.focusTimer.restart();
      if (!current.visit_end) {
        current.visit_end = new Date();
        if ((options == null ? void 0 : options.emit) !== false) {
          this.emit("page", [current]);
        }
        return current;
      }
    };
    this.onPageHide = () => {
      this.collecting = true;
      this.endCurrentPage();
      this.collecting = false;
    };
    this.recordFocusTime = (time) => {
      const current = this.currentPage;
      time = Math.round(time || 0);
      if (current && time) {
        current.focus_intervals.push(time);
        this.emit("new_focus_time");
        if (this.collecting || this.collectFocusTimeout) {
          return;
        }
        const total = current.focus_intervals.reduce((acc, next) => acc + next, 0);
        const firstFt = !this.collectedSomeFocus && total >= 1e3;
        const thirdFt = current.focus_intervals.length % 3 == 0;
        const largeFt = time >= 1e4;
        if (firstFt || thirdFt || largeFt) {
          this.collectFocusTimeout = window.setTimeout(() => {
            this.collectFocusTimeout = void 0;
            this.collectedSomeFocus = true;
            this.emit("page", [current]);
          }, 2e3);
        }
      }
    };
    this.options = options;
    this.focusTimer = new _time_focus_timer__WEBPACK_IMPORTED_MODULE_6__.FocusTimer();
    this.focusTimer.on("focus_time.end", this.recordFocusTime);
    wrapNavigation(this);
    this.on("page_tracker.push", this.collect);
    this.on("page_tracker.replace", this.onReplaceState);
    this.on("page_tracker.pop", this.collect);
    this.onVisibilityChange = lodash_throttle__WEBPACK_IMPORTED_MODULE_0___default()(this.onVisibilityChange.bind(this), 100, { leading: true, trailing: false });
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    window.addEventListener("focus", this.onVisibilityChange);
    window.addEventListener("pageshow", (e) => {
      if ((0,_lib_from_bfcache__WEBPACK_IMPORTED_MODULE_1__.fromBfCache)(e)) {
        this.pages = [];
        this.collect();
      }
    });
    window.addEventListener("pagehide", this.onPageHide, { capture: true });
    setTimeout(() => {
      this.collect();
    }, 0);
  }
  get currentPage() {
    return this.pages[this.pages.length - 1];
  }
  get currentFocusTime() {
    var _a, _b;
    return this.focusTimer.currentFocusTime + ((_b = (_a = this.currentPage) == null ? void 0 : _a.focus_intervals.reduce((acc, curr) => acc + curr, 0)) != null ? _b : 0);
  }
  get currentIdleTime() {
    var _a;
    return (_a = this.focusTimer.idleTime) != null ? _a : 0;
  }
  get sessionFocusTime() {
    return this.focusTimer.currentFocusTime + this.pages.reduce((acc, curr) => acc + curr.focus_intervals.reduce((acc2, curr2) => acc2 + curr2, 0), 0);
  }
  get scheduled() {
    return !!this.collectFocusTimeout;
  }
  reset() {
    this.pages = [];
    this.focusTimer.clear();
  }
}


/***/ }),

/***/ 9630:
/*!********************************!*\
  !*** ./src/analytics/queue.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Queue": () => (/* binding */ Queue)
/* harmony export */ });
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/throttle */ 3493);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_is_promise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/is-promise */ 9449);
/* harmony import */ var _event_emitter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event-emitter */ 2697);




class Queue extends _event_emitter__WEBPACK_IMPORTED_MODULE_2__.Emitter {
  constructor(options = {}) {
    var _a;
    super();
    this.flushed = [];
    this.queue = /* @__PURE__ */ new Set();
    this.flushing = false;
    if (options.onSend) {
      this.onSend = options.onSend;
    }
    this.scheduleSend = lodash_throttle__WEBPACK_IMPORTED_MODULE_0___default()(this.send, (_a = options.flushInterval) != null ? _a : 1e4, {
      leading: false,
      trailing: true
    });
  }
  add(item) {
    this.queue.add(item);
    this.scheduleSend();
  }
  flush() {
    this.scheduleSend.flush();
  }
  get all() {
    return this.flushed.concat(Array.from(this.queue));
  }
  reset() {
    this.queue.clear();
    this.flushed.length = 0;
  }
  // Placeholder method to be overridden by subclasses or via configuration options
  onSend(_items) {
    return true;
  }
  /**
   * Simplistic promise queue
   * Attempt to deliver all items in the queue, and then clear it.
   * If `this.onSend` returns false, the queue will not be cleared.
   * If `this.onSend` throws, the queue will not be cleared.
   * If we are already flushing, we'll delay the attempt by scheduling another flush.
   */
  send(force = false) {
    if (this.flushing && !force) {
      setTimeout(() => this.scheduleSend(), 0);
      return;
    }
    try {
      this.flushing = true;
      if (this.queue.size) {
        const items = Array.from(this.queue);
        const shouldSend = this.onSend(items);
        const finalize = (send) => {
          if (send !== false) {
            this.flushed.push(...items);
            this.queue.clear();
            this.emit("processed", items);
          }
        };
        if ((0,_lib_is_promise__WEBPACK_IMPORTED_MODULE_1__.isPromise)(shouldSend)) {
          shouldSend.then(finalize).finally(() => {
            this.flushing = false;
          });
        } else {
          finalize(shouldSend);
        }
      }
    } finally {
      this.flushing = false;
    }
  }
}


/***/ }),

/***/ 3648:
/*!**********************************!*\
  !*** ./src/analytics/session.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hostName": () => (/* binding */ hostName),
/* harmony export */   "session": () => (/* binding */ session)
/* harmony export */ });
/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cookies */ 388);
/* harmony import */ var _top_domain__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./top-domain */ 8165);



let domain = void 0;
try {
  domain = (0,_top_domain__WEBPACK_IMPORTED_MODULE_1__.topDomain)(new URL(window.location.href));
} catch (_) {
  domain = void 0;
}
function hostName(domain2) {
  try {
    const withProtocol = domain2.startsWith("http") ? domain2 : `https://${domain2}`;
    const url = new URL(withProtocol);
    return url.hostname;
  } catch (_) {
    return domain2;
  }
}
const MIN_TTL = 20 * 60 * 1e3;
const MAX_TTL = 4 * 60 * 60 * 1e3;
const cookieDefaults = {
  expires: 1,
  // 1 day
  domain,
  path: "/",
  sameSite: "lax"
};
function sessionId() {
  var _a, _b, _c;
  const sesh = (_c = (_b = (_a = window.localStorage.getItem("ko_sid")) != null ? _a : (0,_cookies__WEBPACK_IMPORTED_MODULE_0__.getCookie)("ko_sid")) != null ? _b : window.localStorage.getItem("kl:sid")) != null ? _c : (0,_cookies__WEBPACK_IMPORTED_MODULE_0__.getCookie)("kl:sid");
  return sesh ? JSON.parse(sesh) : void 0;
}
function setSession(session2, options) {
  var _a;
  const value = JSON.stringify(session2);
  if ((0,_cookies__WEBPACK_IMPORTED_MODULE_0__.allowedCookieDomain)(domain, (_a = options == null ? void 0 : options.cookie_defaults) == null ? void 0 : _a.domain)) {
    (0,_cookies__WEBPACK_IMPORTED_MODULE_0__.setCookie)("ko_sid", value, { ...cookieDefaults, ...options == null ? void 0 : options.cookie_defaults });
  } else {
    (0,_cookies__WEBPACK_IMPORTED_MODULE_0__.removeCookie)("ko_sid");
  }
  window.localStorage.setItem("ko_sid", value);
  return session2;
}
function start(options) {
  const now = new Date().getTime();
  const session2 = {
    id: now.toString(),
    lastTouched: now
  };
  return setSession(session2, options);
}
function maxLength(sessionId2) {
  const now = new Date().getTime();
  const sessionStart = parseInt(sessionId2, 10);
  return now - sessionStart > MAX_TTL;
}
function valid(session2) {
  const now = new Date().getTime();
  const delta = now - session2.lastTouched;
  return delta < MIN_TTL;
}
function touch(sesh, options) {
  const session2 = {
    id: sesh.id,
    lastTouched: new Date().getTime()
  };
  return setSession(session2, options);
}
function fetch(options) {
  const existing = sessionId();
  if (existing && valid(existing) && !maxLength(existing.id)) {
    return touch(existing, options);
  }
  return start(options);
}
function init(options) {
  return fetch(options);
}
function reset(options) {
  return start(options);
}
function clear() {
  (0,_cookies__WEBPACK_IMPORTED_MODULE_0__.removeCookie)("ko_sid");
  window.localStorage.removeItem("ko_sid");
}
const session = { init, fetch, reset, sessionId, clear };


/***/ }),

/***/ 2167:
/*!*******************************************!*\
  !*** ./src/analytics/time/focus-timer.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FocusTimer": () => (/* binding */ FocusTimer)
/* harmony export */ });
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/throttle */ 3493);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_from_bfcache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/from-bfcache */ 340);
/* harmony import */ var _lib_in_viewport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/in-viewport */ 6213);
/* harmony import */ var _event_emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../event-emitter */ 2697);





class FocusTimer extends _event_emitter__WEBPACK_IMPORTED_MODULE_3__.Emitter {
  constructor(idleInterval = 15e3, checkIdleIntervalMs = 1e3) {
    super();
    this.isFocused = false;
    this.checkIdleIntervalMs = 1e3;
    this.restart = () => {
      if (this.isFocused) {
        this.endFocus();
      }
      if (!document.hidden) {
        this.startFocus();
      }
    };
    this.destroy = () => {
      this.unregisterListeners();
    };
    this.registerListeners = () => {
      document.addEventListener("visibilitychange", this.onVisibilityChangeWrapper);
      window.addEventListener("blur", this.onBlur);
      window.addEventListener("focus", this.onFocus);
      window.addEventListener("scroll", this.pulse, { capture: true, passive: true });
      document.addEventListener("mousedown", this.pulse, { passive: true });
      document.addEventListener("mousemove", this.pulse, { passive: true });
      document.addEventListener("touchstart", this.pulse, { passive: true });
      document.addEventListener("touchmove", this.pulse, { passive: true });
      document.addEventListener("keydown", this.pulse, { passive: true });
      document.addEventListener("keyup", this.pulse, { passive: true });
      document.addEventListener("click", this.pulse, { passive: true });
      document.addEventListener("contextmenu", this.pulse, { passive: true });
      document.addEventListener("play", this.pulse, { capture: true, passive: true });
      window.addEventListener("pageshow", this.onBfCacheRestore);
      this.checkMedia();
      this.checkIdleTime();
    };
    this.unregisterListeners = () => {
      window.clearTimeout(this.idleIntervalCheck);
      window.clearTimeout(this.idleMediaTimer);
      window.removeEventListener("blur", this.onBlur);
      window.removeEventListener("focus", this.onFocus);
      window.removeEventListener("scroll", this.pulse, { capture: true });
      document.removeEventListener("visibilitychange", this.onVisibilityChangeWrapper);
      document.removeEventListener("mousedown", this.pulse);
      document.removeEventListener("mousemove", this.pulse);
      document.removeEventListener("touchstart", this.pulse);
      document.removeEventListener("touchmove", this.pulse);
      document.removeEventListener("keydown", this.pulse);
      document.removeEventListener("keyup", this.pulse);
      document.removeEventListener("click", this.pulse);
      document.removeEventListener("contextmenu", this.pulse);
      document.removeEventListener("play", this.pulse, { capture: true });
      window.removeEventListener("pageshow", this.onBfCacheRestore);
    };
    this.onBfCacheRestore = (e) => {
      if ((0,_lib_from_bfcache__WEBPACK_IMPORTED_MODULE_1__.fromBfCache)(e) && document.visibilityState === "visible") {
        this.startFocus();
        this.checkMedia();
        this.checkIdleTime();
      }
    };
    this.startFocus = () => {
      const now = performance.now();
      this.isFocused = true;
      this.focusStart = now;
      this.lastFocusStart = now;
      this.emit("focus_time.start", this.focusStart);
    };
    this.endFocus = () => {
      this.pulse.cancel();
      this.emit("focus_time.end", this.currentFocusTime);
      this.isFocused = false;
    };
    this.onVisibilityChangeWrapper = () => this.onVisibilityChange(document.visibilityState);
    this.checkIdleTime = () => {
      window.clearTimeout(this.idleIntervalCheck);
      this.pulse.flush();
      if (this.idleTime >= this.idleInterval) {
        this.endFocus();
      }
      this.idleIntervalCheck = window.setTimeout(() => this.checkIdleTime(), this.checkIdleIntervalMs);
    };
    /**
     * This function is only exposed for testing, do not use it.
     */
    this.onBlur = () => {
      if (this.isFocused) {
        this.endFocus();
      }
    };
    this.onFocus = () => {
      if (!this.isFocused) {
        this.startFocus();
      }
    };
    /**
     * This function is only exposed for testing, do not use it.
     */
    this.onVisibilityChange = (visibilityState) => {
      if (visibilityState === "visible") {
        this.onFocus();
      } else if (visibilityState === "hidden") {
        this.onBlur();
      }
    };
    /**
     * This function is only exposed for testing, do not use it.
     */
    this.pulse = lodash_throttle__WEBPACK_IMPORTED_MODULE_0___default()(
      () => {
        if (!this.isFocused) {
          this.startFocus();
        } else {
          this.lastFocusStart = performance.now();
        }
      },
      500,
      {
        leading: true,
        trailing: true
      }
    );
    this.checkMedia = () => {
      window.clearTimeout(this.idleMediaTimer);
      const players = document.querySelectorAll("video");
      const playing = Array.from(players).filter((player) => {
        if (player.paused) {
          return false;
        }
        if (player.loop) {
          return false;
        }
        if (player.muted && !player.controls) {
          return false;
        }
        if (player.readyState < 2) {
          return false;
        }
        return (0,_lib_in_viewport__WEBPACK_IMPORTED_MODULE_2__.inViewport)(player);
      });
      if (playing.length > 0 && document.visibilityState === "visible") {
        this.pulse();
      }
      this.idleMediaTimer = window.setTimeout(() => this.checkMedia(), this.checkIdleIntervalMs);
    };
    this.isFocused = false;
    this.idleInterval = idleInterval != null ? idleInterval : 15e3;
    this.checkIdleIntervalMs = checkIdleIntervalMs != null ? checkIdleIntervalMs : 1e3;
    if (document.visibilityState === "visible") {
      this.startFocus();
    }
    this.registerListeners();
  }
  get idleTime() {
    if (this.isFocused && typeof this.lastFocusStart === "number") {
      return performance.now() - this.lastFocusStart;
    } else {
      return 0;
    }
  }
  get currentFocusTime() {
    if (this.isFocused && typeof this.focusStart === "number") {
      return performance.now() - this.focusStart;
    } else {
      return 0;
    }
  }
  clear() {
    this.restart();
  }
}


/***/ }),

/***/ 8165:
/*!*************************************!*\
  !*** ./src/analytics/top-domain.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "levels": () => (/* binding */ levels),
/* harmony export */   "topDomain": () => (/* binding */ topDomain)
/* harmony export */ });
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ 1955);


function levels(url) {
  url = typeof url === "string" ? new URL(url) : url;
  const host = url.hostname;
  const parts = host.split(".");
  const last = parts[parts.length - 1];
  const levels2 = [];
  if (parts.length === 4 && last === String(parseInt(last, 10))) {
    return levels2;
  }
  if (parts.length <= 1) {
    return levels2;
  }
  for (let i = parts.length - 2; i >= 0; --i) {
    levels2.push(parts.slice(i).join("."));
  }
  return levels2;
}
function topDomain(url) {
  const lvls = levels(url);
  for (let i = 0; i < lvls.length; ++i) {
    const name = "__tld__";
    const domain = lvls[i];
    const opts = { domain: "." + domain };
    js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].set(name, "1", opts);
    if (js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].get(name)) {
      js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].remove(name, opts);
      return domain;
    }
  }
}


/***/ }),

/***/ 8187:
/*!*******************************!*\
  !*** ./src/analytics/user.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UserStore": () => (/* binding */ UserStore),
/* harmony export */   "getUserId": () => (/* binding */ getUserId),
/* harmony export */   "user": () => (/* binding */ user)
/* harmony export */ });
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ 1955);
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/isEqual */ 8446);
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_isEqual__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cookies */ 388);
/* harmony import */ var _top_domain__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./top-domain */ 8165);





let domain = void 0;
try {
  domain = (0,_top_domain__WEBPACK_IMPORTED_MODULE_3__.topDomain)(new URL(window.location.href));
} catch (_) {
  domain = void 0;
}
class UserStore {
  constructor(options) {
    this.cookieDefaults = {
      expires: 365,
      // one year
      domain,
      path: "/",
      sameSite: "lax"
    };
    this.cookieDefaults = {
      ...this.cookieDefaults,
      ...options == null ? void 0 : options.cookies
    };
  }
  id() {
    var _a, _b, _c, _d;
    return (_d = (_c = (_b = (_a = window.localStorage.getItem("ko_id")) != null ? _a : (0,_cookies__WEBPACK_IMPORTED_MODULE_2__.getCookie)("ko_id")) != null ? _b : window.localStorage.getItem("kl:id")) != null ? _c : (0,_cookies__WEBPACK_IMPORTED_MODULE_2__.getCookie)("kl:id")) != null ? _d : void 0;
  }
  setId(id) {
    if ((0,_cookies__WEBPACK_IMPORTED_MODULE_2__.allowedCookieDomain)(domain, this.cookieDefaults.domain)) {
      (0,_cookies__WEBPACK_IMPORTED_MODULE_2__.setCookie)("ko_id", id, this.cookieDefaults);
    } else {
      (0,_cookies__WEBPACK_IMPORTED_MODULE_2__.removeCookie)("ko_id");
    }
    return window.localStorage.setItem("ko_id", id);
  }
  email() {
    return this.traits().email;
  }
  traits() {
    var _a;
    return JSON.parse((_a = window.localStorage.getItem("kl:traits")) != null ? _a : "{}");
  }
  upsertTraits(toUpsert) {
    const existing = this.traits();
    const newTraits = {
      ...existing,
      ...toUpsert
    };
    window.localStorage.setItem("kl:traits", JSON.stringify(newTraits));
    return newTraits;
  }
  netNewTraits(toDiff) {
    const existingTraits = this.traits();
    const incomingTraits = { ...toDiff };
    Object.keys(incomingTraits).forEach((key) => {
      if (lodash_isEqual__WEBPACK_IMPORTED_MODULE_1___default()(existingTraits[key], incomingTraits[key])) {
        delete incomingTraits[key];
      }
    });
    return incomingTraits;
  }
  userInfo() {
    return {
      id: this.id(),
      traits: this.traits()
    };
  }
  reset() {
    window.localStorage.removeItem("ko_id");
    window.localStorage.removeItem("kl:traits");
    (0,_cookies__WEBPACK_IMPORTED_MODULE_2__.removeCookie)("ko_id");
  }
}
function getUserId() {
  var _a;
  return (_a = window.localStorage.getItem("ko_id")) != null ? _a : js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].get("ko_id");
}
const user = (options) => {
  var _a;
  return new UserStore({
    cookies: (_a = options.sdk_settings) == null ? void 0 : _a.cookie_defaults
  });
};


/***/ }),

/***/ 3098:
/*!******************************!*\
  !*** ./src/api/bootstrap.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootstrap": () => (/* binding */ bootstrap)
/* harmony export */ });
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetch */ 7940);


async function bootstrap(slug, profileId) {
  let url = `/web/projects/${slug}`;
  if (profileId) {
    url += `?profile_id=${profileId}`;
  }
  return (0,_fetch__WEBPACK_IMPORTED_MODULE_0__.fetchJson)(url);
}


/***/ }),

/***/ 1457:
/*!****************************!*\
  !*** ./src/api/collect.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "collectEvents": () => (/* binding */ collectEvents),
/* harmony export */   "collectIdentify": () => (/* binding */ collectIdentify),
/* harmony export */   "collectPages": () => (/* binding */ collectPages),
/* harmony export */   "qualify": () => (/* binding */ qualify)
/* harmony export */ });
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetch */ 7940);


async function postJson(path, body) {
  return (0,_fetch__WEBPACK_IMPORTED_MODULE_0__.post)(path, body).then((res) => {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const contentType = res.headers.get("content-type");
    if (contentType == null ? void 0 : contentType.includes("application/json")) {
      return res.json();
    }
    return res.text();
  });
}
async function qualify(project, profile) {
  if (!profile.user.id) {
    throw new Error("missing profile id");
  }
  const result = await postJson(`/web/projects/${project}/profiles`, {
    profile_id: profile.user.id,
    email: profile.email,
    traits: profile.traits
  });
  return {
    ...result,
    qualification: result.q
  };
}
function collectIdentify(project, profile, identify) {
  return (0,_fetch__WEBPACK_IMPORTED_MODULE_0__.sendBeacon)(`/web/projects/${project}/batch`, {
    profile_id: profile.user.id,
    email: profile.email,
    traits: profile.traits,
    identifies: [identify]
  });
}
function collectEvents(project, profile_id, events = []) {
  if (events.length === 0) {
    return;
  }
  return (0,_fetch__WEBPACK_IMPORTED_MODULE_0__.sendBeacon)(`/web/projects/${project}/batch`, {
    profile_id,
    events
  });
}
function collectPages(project, profile_id, page_views = []) {
  if (page_views.length === 0)
    return;
  return (0,_fetch__WEBPACK_IMPORTED_MODULE_0__.sendBeacon)(`/web/projects/${project}/batch`, {
    profile_id,
    page_views
  });
}


/***/ }),

/***/ 7940:
/*!**************************!*\
  !*** ./src/api/fetch.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BASE_URL": () => (/* binding */ BASE_URL),
/* harmony export */   "BASE_WSS_URL": () => (/* binding */ BASE_WSS_URL),
/* harmony export */   "fetchJson": () => (/* binding */ fetchJson),
/* harmony export */   "post": () => (/* binding */ post),
/* harmony export */   "sendBeacon": () => (/* binding */ sendBeacon)
/* harmony export */ });

const HOST = "https://api.getkoala.com";
function getBaseUrl(property = "host") {
  if (typeof globalThis !== "undefined" && globalThis.koalaSettings) {
    return globalThis.koalaSettings[property] || globalThis.koalaSettings.host || HOST;
  }
  return HOST;
}
const BASE_URL = getBaseUrl("host");
const BASE_WSS_URL = getBaseUrl("wssHost");
function post(path, body) {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    keepalive: true,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
function fetchJson(path) {
  return fetch(`${BASE_URL}${path}`).then((res) => {
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  });
}
const send = navigator.sendBeacon && navigator.sendBeacon.bind(navigator);
function maybeBeacon(path, body) {
  if (send) {
    try {
      return send(`${BASE_URL}${path}`, body);
    } catch (_ignored) {
    }
  }
  return false;
}
function sendBeacon(path, data) {
  const body = JSON.stringify(data);
  return maybeBeacon(path, body) || post(path, body).then(() => true).catch(() => false);
}


/***/ }),

/***/ 9248:
/*!****************************!*\
  !*** ./src/api/metrics.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "metrics": () => (/* binding */ metrics)
/* harmony export */ });
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fetch */ 7940);


function metrics({ project, ...params }) {
  return (0,_fetch__WEBPACK_IMPORTED_MODULE_0__.sendBeacon)(`/web/projects/${project}/metrics`, params);
}


/***/ }),

/***/ 66:
/*!************************!*\
  !*** ./src/browser.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "load": () => (/* binding */ load),
/* harmony export */   "mountWidget": () => (/* binding */ mountWidget)
/* harmony export */ });
/* harmony import */ var _analytics_collector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./analytics/collector */ 4165);
/* harmony import */ var _analytics_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./analytics/user */ 8187);
/* harmony import */ var _api_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api/bootstrap */ 3098);
/* harmony import */ var _playbooks_init_playbooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./playbooks/init-playbooks */ 7945);
/* harmony import */ var _ui_lib_validate_configuration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui/lib/validate-configuration */ 5579);






function flushBuffered(ko) {
  const buffer = Array.isArray(window.ko) && window.ko[0] ? [...window.ko] : [];
  for (const [operation, ...args] of buffer) {
    if (typeof ko[operation] === "function") {
      setTimeout(async () => {
        try {
          await ko[operation].call(ko, ...args);
        } catch (err) {
          console.warn(err);
        }
      }, 0);
    }
  }
}
function mountWidget(ko, settings) {
  const widgetEnabled = settings.widget_settings.enabled;
  if (!widgetEnabled || !(0,_ui_lib_validate_configuration__WEBPACK_IMPORTED_MODULE_4__.isValidConfiguration)(settings)) {
    return;
  }
  if (settings.widget_settings.mode !== "demo") {
    return;
  }
  const promise = Promise.all(/*! import() | demos */[__webpack_require__.e("vendor"), __webpack_require__.e("demos")]).then(__webpack_require__.bind(__webpack_require__, /*! ./ui/main-demos */ 5595));
  promise.then(async (mod) => {
    var _a;
    ko.widget = await ((_a = mod.mountApp) == null ? void 0 : _a.call(mod, "koala-widget", {
      projectSlug: settings.project,
      settings,
      collector: ko
    }));
    return ko.widget;
  }).catch((error) => {
    console.warn("[KOALA]", "Failed to mount widget", error);
    ko.stats.increment("sdk.error", {
      method: "mountApp",
      message: "Failed to mount widget",
      error: error == null ? void 0 : error.message
    });
  });
}
async function fetchSettings(project, profileId) {
  try {
    const settings = await (0,_api_bootstrap__WEBPACK_IMPORTED_MODULE_2__.bootstrap)(project, profileId);
    (0,_analytics_user__WEBPACK_IMPORTED_MODULE_1__.user)(settings).setId(settings.profile_id);
    return { ...settings, project };
  } catch (error) {
    console.warn("[KOALA]", "Failed to load project settings", error);
    throw error;
  }
}
async function load(options) {
  var _a;
  if (window.ko && !Array.isArray(window.ko)) {
    console.warn("[KOALA]", "The Koala SDK is already loaded. Calling `load` again will have no effect.");
    return window.ko;
  }
  const userAgent = (_a = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : _a.toLowerCase();
  const bots = [
    "googlebot",
    "adsbot",
    "headlesschrome",
    "lighthouse",
    "speedindex",
    "vercelbot",
    "hubspot",
    "yandex",
    "ahrefsbot",
    "ev-crawl",
    "sightbulb",
    "slackbot",
    "yahoo",
    "bingbot",
    "applebot",
    "discordbot",
    "baidu",
    "screaming",
    "pingdom"
  ];
  if ((navigator == null ? void 0 : navigator.webdriver) || bots.some((bot) => userAgent == null ? void 0 : userAgent.includes(bot))) {
    return window.ko;
  }
  const settings = await fetchSettings(options.project, (0,_analytics_user__WEBPACK_IMPORTED_MODULE_1__.getUserId)());
  const ko = new _analytics_collector__WEBPACK_IMPORTED_MODULE_0__.AnalyticsCollector({ ...options, ...settings });
  flushBuffered(ko);
  ko.emit("initialized", settings);
  ko.subscribe();
  if ((settings.playbooks || []).length > 0) {
    (0,_playbooks_init_playbooks__WEBPACK_IMPORTED_MODULE_3__.initPlaybooks)(ko, settings);
  }
  window.ko = ko;
  return ko;
}
if (typeof exports !== "undefined" && typeof window !== "undefined" && typeof window["KoalaSDK"] === "undefined") {
  window.KoalaSDK = {
    load,
    mountWidget
  };
}


/***/ }),

/***/ 8595:
/*!*******************************!*\
  !*** ./src/channels/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "consumer": () => (/* binding */ consumer)
/* harmony export */ });
/* harmony import */ var _rails_actioncable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @rails/actioncable */ 6936);
/* harmony import */ var _api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/fetch */ 7940);
/* harmony import */ var _lib_from_bfcache__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/from-bfcache */ 340);




let client;
let project;
let profile;
_rails_actioncable__WEBPACK_IMPORTED_MODULE_0__.ConnectionMonitor.staleThreshold = 8;
_rails_actioncable__WEBPACK_IMPORTED_MODULE_0__.ConnectionMonitor.reconnectionBackoffRate = 0.2;
const consumer = (profileId, projectSlug) => {
  if (project !== projectSlug || profile !== profileId) {
    client == null ? void 0 : client.disconnect();
    client = void 0;
  }
  if (!client) {
    const url = `${_api_fetch__WEBPACK_IMPORTED_MODULE_1__.BASE_WSS_URL.replace("https", "wss")}/cable?profile_id=${profileId}&project_slug=${projectSlug}`;
    client = (0,_rails_actioncable__WEBPACK_IMPORTED_MODULE_0__.createConsumer)(url);
    project = projectSlug;
    profile = profileId;
  }
  return client;
};
window.addEventListener(
  "pagehide",
  () => {
    var _a, _b;
    if (client) {
      client.disconnect();
      (_b = (_a = client.connection) == null ? void 0 : _a.webSocket) == null ? void 0 : _b.close();
    }
  },
  { capture: true }
);
window.addEventListener(
  "pageshow",
  (e) => {
    if (client && (0,_lib_from_bfcache__WEBPACK_IMPORTED_MODULE_2__.fromBfCache)(e)) {
      client.connection.reopen();
    }
  },
  { capture: true }
);


/***/ }),

/***/ 423:
/*!*****************************************!*\
  !*** ./src/channels/profile-channel.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createProfileSubscription": () => (/* binding */ createProfileSubscription)
/* harmony export */ });

function createProfileSubscription(client, instance, onReceived) {
  return client.subscriptions.create(
    { channel: "ProfileChannel", sid: instance.session.id },
    {
      isConnected: false,
      initialized() {
        this.updatePresence = this.updatePresence.bind(this);
      },
      connected() {
        this.isConnected = true;
      },
      disconnected() {
        this.isConnected = false;
      },
      rejected() {
        this.isConnected = false;
      },
      updatePresence(lastActivityAt) {
        if (!this.isConnected || !lastActivityAt)
          return;
        this.perform("presence", {
          sid: instance.session.id,
          last_activity_at: lastActivityAt,
          visible: document.visibilityState === "visible"
        });
      },
      received: onReceived
    }
  );
}


/***/ }),

/***/ 6748:
/*!**********************************!*\
  !*** ./src/generated/version.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });

const version = "1.6.4";


/***/ }),

/***/ 2998:
/*!******************************!*\
  !*** ./src/lib/dom-ready.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "domReady": () => (/* binding */ domReady)
/* harmony export */ });

function domReady(fn, doc) {
  return new Promise((resolve) => {
    const resolver = async () => {
      if (fn) {
        await fn();
      }
      resolve();
    };
    const leDoc = doc != null ? doc : document;
    if (leDoc.readyState === "complete" || leDoc.readyState === "interactive") {
      setTimeout(resolver, 0);
    } else {
      leDoc.addEventListener("DOMContentLoaded", resolver);
    }
  });
}


/***/ }),

/***/ 340:
/*!*********************************!*\
  !*** ./src/lib/from-bfcache.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromBfCache": () => (/* binding */ fromBfCache)
/* harmony export */ });

function fromBfCache(event) {
  var _a, _b;
  const entries = ((_a = performance == null ? void 0 : performance.getEntriesByType) == null ? void 0 : _a.call(performance, "navigation")) || [];
  return event.type === "pageshow" && (event.persisted || ((_b = entries[0]) == null ? void 0 : _b.type) === "back_forward");
}


/***/ }),

/***/ 6213:
/*!********************************!*\
  !*** ./src/lib/in-viewport.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inViewport": () => (/* binding */ inViewport)
/* harmony export */ });

function inViewport(element) {
  const { top, left, right, bottom } = element.getBoundingClientRect();
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  if (top >= -height && left >= -width && right <= (window.innerWidth || document.documentElement.clientWidth) + width && bottom <= (window.innerHeight || document.documentElement.clientHeight) + height) {
    return true;
  } else {
    return false;
  }
}


/***/ }),

/***/ 9449:
/*!*******************************!*\
  !*** ./src/lib/is-promise.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPromise": () => (/* binding */ isPromise)
/* harmony export */ });

function isPromise(p) {
  if (p !== null && typeof p === "object" && typeof p.then === "function" && typeof p.catch === "function") {
    return true;
  }
  return false;
}


/***/ }),

/***/ 6163:
/*!*********************************!*\
  !*** ./src/lib/is-same-page.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isSamePage": () => (/* binding */ isSamePage)
/* harmony export */ });

function isSamePage(actual, expected) {
  try {
    actual = new URL(actual, window.location.origin);
    expected = new URL(expected || window.location.href, window.location.origin);
    return actual.hostname === expected.hostname && actual.pathname === expected.pathname;
  } catch (_error) {
    return false;
  }
}


/***/ }),

/***/ 7945:
/*!*****************************************!*\
  !*** ./src/playbooks/init-playbooks.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initPlaybooks": () => (/* binding */ initPlaybooks)
/* harmony export */ });

function initPlaybooks(ko, settings) {
  if (ko && !ko.playbooks) {
    ko.playbooks = settings.playbooks;
  }
  const playbooks = getEnabledPlaybooks(settings);
  if (playbooks.length === 0) {
    return;
  }
  __webpack_require__.e(/*! import() | playbooks */ "playbooks").then(__webpack_require__.bind(__webpack_require__, /*! ./koala-playbooks */ 7377)).then(async (mod) => {
    mod.watchEvents(ko, { ...settings, playbooks });
  }).catch((error) => {
    console.warn("[KOALA]", "Failed to load playbooks", error);
    ko.stats.increment("sdk.error", {
      method: "initPlaybooks",
      message: "Failed to load playbooks",
      error: error == null ? void 0 : error.message
    });
  });
}
function playbookParams() {
  var _a;
  if (!((_a = window == null ? void 0 : window.location) == null ? void 0 : _a.search)) {
    return { playbook: void 0 };
  }
  const searchParams = new URLSearchParams(window.location.search);
  const playbook = searchParams.get("_kop");
  return {
    playbook
  };
}
function getEnabledPlaybooks(settings) {
  const params = playbookParams();
  const playbooks = (settings.playbooks || []).map((p) => {
    if (p.slug === params.playbook) {
      return {
        ...p,
        enabled: true
      };
    }
    return p;
  });
  return playbooks.filter((p) => p.enabled);
}


/***/ }),

/***/ 4221:
/*!***************************!*\
  !*** ./src/ui/lib/utm.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addUtmParams": () => (/* binding */ addUtmParams),
/* harmony export */   "hasUtm": () => (/* binding */ hasUtm)
/* harmony export */ });

function addUtmParams(href, utmParams = {}) {
  var _a, _b;
  const url = new URL(href);
  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", (_a = utmParams.source) != null ? _a : "koala");
  }
  if (!url.searchParams.has("utm_medium")) {
    url.searchParams.set("utm_medium", (_b = utmParams.medium) != null ? _b : "widget");
  }
  url.searchParams.set("koala_track", "1");
  return url.toString();
}
function hasUtm(href, param, value = "") {
  const url = new URL(href);
  return url.searchParams.get(param) === value;
}


/***/ }),

/***/ 5579:
/*!**********************************************!*\
  !*** ./src/ui/lib/validate-configuration.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isValidConfiguration": () => (/* binding */ isValidConfiguration)
/* harmony export */ });

function isValidUrl(url) {
  if (typeof url !== "string") {
    return false;
  }
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch (e) {
    return false;
  }
}
function isValidConfiguration(settings) {
  var _a;
  const enabledChannels = ((_a = settings.channel_settings) != null ? _a : []).filter((c) => {
    var _a2, _b;
    if (c.channel === "resources" && !((_a2 = settings.resources) == null ? void 0 : _a2.length)) {
      return false;
    }
    if (c.channel === "calendar" && !((_b = settings.calendars) == null ? void 0 : _b.length)) {
      return false;
    }
    return c.enabled;
  }).map((c) => c.channel);
  if (settings.widget_settings.mode === "demo") {
    return isValidUrl(settings.widget_settings.cta_href) || enabledChannels.includes("calendar");
  }
  return false;
}


/***/ }),

/***/ 9865:
/*!***********************************************************************************!*\
  !*** ./node_modules/form-request-submit-polyfill/form-request-submit-polyfill.js ***!
  \***********************************************************************************/
/***/ (() => {

(function(prototype) {
  if (typeof prototype.requestSubmit == "function") return

  prototype.requestSubmit = function(submitter) {
    if (submitter) {
      validateSubmitter(submitter, this)
      submitter.click()
    } else {
      submitter = document.createElement("input")
      submitter.type = "submit"
      submitter.hidden = true
      this.appendChild(submitter)
      submitter.click()
      this.removeChild(submitter)
    }
  }

  function validateSubmitter(submitter, form) {
    submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'")
    submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button")
    submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError")
  }

  function raise(errorConstructor, message, name) {
    throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name)
  }
})(HTMLFormElement.prototype);


/***/ }),

/***/ 8552:
/*!******************************************!*\
  !*** ./node_modules/lodash/_DataView.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ 852),
    root = __webpack_require__(/*! ./_root */ 5639);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ 1989:
/*!**************************************!*\
  !*** ./node_modules/lodash/_Hash.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(/*! ./_hashClear */ 1789),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ 401),
    hashGet = __webpack_require__(/*! ./_hashGet */ 7667),
    hashHas = __webpack_require__(/*! ./_hashHas */ 1327),
    hashSet = __webpack_require__(/*! ./_hashSet */ 1866);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ 6425:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_LazyWrapper.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ 3118),
    baseLodash = __webpack_require__(/*! ./_baseLodash */ 9435);

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}

// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

module.exports = LazyWrapper;


/***/ }),

/***/ 8407:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_ListCache.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ 7040),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ 4125),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ 2117),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ 7518),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ 4705);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ 7548:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_LodashWrapper.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ 3118),
    baseLodash = __webpack_require__(/*! ./_baseLodash */ 9435);

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

module.exports = LodashWrapper;


/***/ }),

/***/ 7071:
/*!*************************************!*\
  !*** ./node_modules/lodash/_Map.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ 852),
    root = __webpack_require__(/*! ./_root */ 5639);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 3369:
/*!******************************************!*\
  !*** ./node_modules/lodash/_MapCache.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ 4785),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ 1285),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ 6000),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ 9916),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ 5265);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ 3818:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_Promise.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ 852),
    root = __webpack_require__(/*! ./_root */ 5639);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ 8525:
/*!*************************************!*\
  !*** ./node_modules/lodash/_Set.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ 852),
    root = __webpack_require__(/*! ./_root */ 5639);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ 8668:
/*!******************************************!*\
  !*** ./node_modules/lodash/_SetCache.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(/*! ./_MapCache */ 3369),
    setCacheAdd = __webpack_require__(/*! ./_setCacheAdd */ 619),
    setCacheHas = __webpack_require__(/*! ./_setCacheHas */ 2385);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),

/***/ 6384:
/*!***************************************!*\
  !*** ./node_modules/lodash/_Stack.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ 8407),
    stackClear = __webpack_require__(/*! ./_stackClear */ 7465),
    stackDelete = __webpack_require__(/*! ./_stackDelete */ 3779),
    stackGet = __webpack_require__(/*! ./_stackGet */ 7599),
    stackHas = __webpack_require__(/*! ./_stackHas */ 4758),
    stackSet = __webpack_require__(/*! ./_stackSet */ 4309);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ 2705:
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ 5639);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 1149:
/*!********************************************!*\
  !*** ./node_modules/lodash/_Uint8Array.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ 5639);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ 577:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_WeakMap.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ 852),
    root = __webpack_require__(/*! ./_root */ 5639);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ 6874:
/*!***************************************!*\
  !*** ./node_modules/lodash/_apply.js ***!
  \***************************************/
/***/ ((module) => {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),

/***/ 7412:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayEach.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),

/***/ 4963:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayFilter.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ 7443:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayIncludes.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ 2118);

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ }),

/***/ 4636:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayLikeKeys.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ 2545),
    isArguments = __webpack_require__(/*! ./isArguments */ 5694),
    isArray = __webpack_require__(/*! ./isArray */ 1469),
    isBuffer = __webpack_require__(/*! ./isBuffer */ 4144),
    isIndex = __webpack_require__(/*! ./_isIndex */ 5776),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ 6719);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ 9932:
/*!******************************************!*\
  !*** ./node_modules/lodash/_arrayMap.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ 2488:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayPush.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ 2663:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_arrayReduce.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),

/***/ 2908:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arraySome.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),

/***/ 4286:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_asciiToArray.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

module.exports = asciiToArray;


/***/ }),

/***/ 9029:
/*!********************************************!*\
  !*** ./node_modules/lodash/_asciiWords.js ***!
  \********************************************/
/***/ ((module) => {

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

module.exports = asciiWords;


/***/ }),

/***/ 8470:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_assocIndexOf.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(/*! ./eq */ 7813);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ 3118:
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseCreate.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ 3218);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ 1848:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_baseFindIndex.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),

/***/ 8866:
/*!************************************************!*\
  !*** ./node_modules/lodash/_baseGetAllKeys.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ 2488),
    isArray = __webpack_require__(/*! ./isArray */ 1469);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ 4239:
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ 2705),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ 9607),
    objectToString = __webpack_require__(/*! ./_objectToString */ 2333);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 2118:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIndexOf.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ 1848),
    baseIsNaN = __webpack_require__(/*! ./_baseIsNaN */ 2722),
    strictIndexOf = __webpack_require__(/*! ./_strictIndexOf */ 2351);

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ }),

/***/ 9454:
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 4239),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 7005);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ 939:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIsEqual.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsEqualDeep = __webpack_require__(/*! ./_baseIsEqualDeep */ 2492),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 7005);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),

/***/ 2492:
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsEqualDeep.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(/*! ./_Stack */ 6384),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ 7114),
    equalByTag = __webpack_require__(/*! ./_equalByTag */ 8351),
    equalObjects = __webpack_require__(/*! ./_equalObjects */ 6096),
    getTag = __webpack_require__(/*! ./_getTag */ 4160),
    isArray = __webpack_require__(/*! ./isArray */ 1469),
    isBuffer = __webpack_require__(/*! ./isBuffer */ 4144),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ 6719);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),

/***/ 2722:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsNaN.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ }),

/***/ 8458:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ 3560),
    isMasked = __webpack_require__(/*! ./_isMasked */ 5346),
    isObject = __webpack_require__(/*! ./isObject */ 3218),
    toSource = __webpack_require__(/*! ./_toSource */ 346);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ 8749:
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIsTypedArray.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 4239),
    isLength = __webpack_require__(/*! ./isLength */ 1780),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 7005);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ 280:
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseKeys.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(/*! ./_isPrototype */ 5726),
    nativeKeys = __webpack_require__(/*! ./_nativeKeys */ 6916);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ 9435:
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseLodash.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

module.exports = baseLodash;


/***/ }),

/***/ 8674:
/*!************************************************!*\
  !*** ./node_modules/lodash/_basePropertyOf.js ***!
  \************************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

module.exports = basePropertyOf;


/***/ }),

/***/ 5976:
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseRest.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var identity = __webpack_require__(/*! ./identity */ 6557),
    overRest = __webpack_require__(/*! ./_overRest */ 5357),
    setToString = __webpack_require__(/*! ./_setToString */ 61);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),

/***/ 8045:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseSetData.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var identity = __webpack_require__(/*! ./identity */ 6557),
    metaMap = __webpack_require__(/*! ./_metaMap */ 9250);

/**
 * The base implementation of `setData` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var baseSetData = !metaMap ? identity : function(func, data) {
  metaMap.set(func, data);
  return func;
};

module.exports = baseSetData;


/***/ }),

/***/ 6560:
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseSetToString.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var constant = __webpack_require__(/*! ./constant */ 5703),
    defineProperty = __webpack_require__(/*! ./_defineProperty */ 8777),
    identity = __webpack_require__(/*! ./identity */ 6557);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),

/***/ 4259:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseSlice.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),

/***/ 2545:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseTimes.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ 531:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseToString.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ 2705),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ 9932),
    isArray = __webpack_require__(/*! ./isArray */ 1469),
    isSymbol = __webpack_require__(/*! ./isSymbol */ 3448);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ 7561:
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseTrim.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trimmedEndIndex = __webpack_require__(/*! ./_trimmedEndIndex */ 7990);

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ }),

/***/ 1717:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseUnary.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ 4757:
/*!******************************************!*\
  !*** ./node_modules/lodash/_cacheHas.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),

/***/ 4290:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_castFunction.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var identity = __webpack_require__(/*! ./identity */ 6557);

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;


/***/ }),

/***/ 180:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_castSlice.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ 4259);

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

module.exports = castSlice;


/***/ }),

/***/ 2157:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_composeArgs.js ***!
  \*********************************************/
/***/ ((module) => {

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

module.exports = composeArgs;


/***/ }),

/***/ 4054:
/*!**************************************************!*\
  !*** ./node_modules/lodash/_composeArgsRight.js ***!
  \**************************************************/
/***/ ((module) => {

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}

module.exports = composeArgsRight;


/***/ }),

/***/ 278:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_copyArray.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ 4429:
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ 5639);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ 7991:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_countHolders.js ***!
  \**********************************************/
/***/ ((module) => {

/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */
function countHolders(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}

module.exports = countHolders;


/***/ }),

/***/ 2402:
/*!********************************************!*\
  !*** ./node_modules/lodash/_createBind.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createCtor = __webpack_require__(/*! ./_createCtor */ 1774),
    root = __webpack_require__(/*! ./_root */ 5639);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

module.exports = createBind;


/***/ }),

/***/ 8805:
/*!*************************************************!*\
  !*** ./node_modules/lodash/_createCaseFirst.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castSlice = __webpack_require__(/*! ./_castSlice */ 180),
    hasUnicode = __webpack_require__(/*! ./_hasUnicode */ 2689),
    stringToArray = __webpack_require__(/*! ./_stringToArray */ 3140),
    toString = __webpack_require__(/*! ./toString */ 9833);

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

module.exports = createCaseFirst;


/***/ }),

/***/ 5393:
/*!**************************************************!*\
  !*** ./node_modules/lodash/_createCompounder.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayReduce = __webpack_require__(/*! ./_arrayReduce */ 2663),
    deburr = __webpack_require__(/*! ./deburr */ 3816),
    words = __webpack_require__(/*! ./words */ 8748);

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]";

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

module.exports = createCompounder;


/***/ }),

/***/ 1774:
/*!********************************************!*\
  !*** ./node_modules/lodash/_createCtor.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ 3118),
    isObject = __webpack_require__(/*! ./isObject */ 3218);

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtor(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors. See
    // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

module.exports = createCtor;


/***/ }),

/***/ 6347:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_createCurry.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var apply = __webpack_require__(/*! ./_apply */ 6874),
    createCtor = __webpack_require__(/*! ./_createCtor */ 1774),
    createHybrid = __webpack_require__(/*! ./_createHybrid */ 6935),
    createRecurry = __webpack_require__(/*! ./_createRecurry */ 4487),
    getHolder = __webpack_require__(/*! ./_getHolder */ 893),
    replaceHolders = __webpack_require__(/*! ./_replaceHolders */ 6460),
    root = __webpack_require__(/*! ./_root */ 5639);

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}

module.exports = createCurry;


/***/ }),

/***/ 6935:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_createHybrid.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var composeArgs = __webpack_require__(/*! ./_composeArgs */ 2157),
    composeArgsRight = __webpack_require__(/*! ./_composeArgsRight */ 4054),
    countHolders = __webpack_require__(/*! ./_countHolders */ 7991),
    createCtor = __webpack_require__(/*! ./_createCtor */ 1774),
    createRecurry = __webpack_require__(/*! ./_createRecurry */ 4487),
    getHolder = __webpack_require__(/*! ./_getHolder */ 893),
    reorder = __webpack_require__(/*! ./_reorder */ 451),
    replaceHolders = __webpack_require__(/*! ./_replaceHolders */ 6460),
    root = __webpack_require__(/*! ./_root */ 5639);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_ARY_FLAG = 128,
    WRAP_FLIP_FLAG = 512;

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG,
      isBind = bitmask & WRAP_BIND_FLAG,
      isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
      isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
      isFlip = bitmask & WRAP_FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper),
          holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtor(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

module.exports = createHybrid;


/***/ }),

/***/ 4375:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_createPartial.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var apply = __webpack_require__(/*! ./_apply */ 6874),
    createCtor = __webpack_require__(/*! ./_createCtor */ 1774),
    root = __webpack_require__(/*! ./_root */ 5639);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

module.exports = createPartial;


/***/ }),

/***/ 4487:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_createRecurry.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isLaziable = __webpack_require__(/*! ./_isLaziable */ 6528),
    setData = __webpack_require__(/*! ./_setData */ 258),
    setWrapToString = __webpack_require__(/*! ./_setWrapToString */ 9255);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_BOUND_FLAG = 4,
    WRAP_CURRY_FLAG = 8,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64;

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder value.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

  if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
    bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
  }
  var newData = [
    func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
    newHoldersRight, argPos, ary, arity
  ];

  var result = wrapFunc.apply(undefined, newData);
  if (isLaziable(func)) {
    setData(result, newData);
  }
  result.placeholder = placeholder;
  return setWrapToString(result, func, bitmask);
}

module.exports = createRecurry;


/***/ }),

/***/ 7727:
/*!********************************************!*\
  !*** ./node_modules/lodash/_createWrap.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseSetData = __webpack_require__(/*! ./_baseSetData */ 8045),
    createBind = __webpack_require__(/*! ./_createBind */ 2402),
    createCurry = __webpack_require__(/*! ./_createCurry */ 6347),
    createHybrid = __webpack_require__(/*! ./_createHybrid */ 6935),
    createPartial = __webpack_require__(/*! ./_createPartial */ 4375),
    getData = __webpack_require__(/*! ./_getData */ 6833),
    mergeData = __webpack_require__(/*! ./_mergeData */ 3833),
    setData = __webpack_require__(/*! ./_setData */ 258),
    setWrapToString = __webpack_require__(/*! ./_setWrapToString */ 9255),
    toInteger = __webpack_require__(/*! ./toInteger */ 554);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags.
 *    1 - `_.bind`
 *    2 - `_.bindKey`
 *    4 - `_.curry` or `_.curryRight` of a bound function
 *    8 - `_.curry`
 *   16 - `_.curryRight`
 *   32 - `_.partial`
 *   64 - `_.partialRight`
 *  128 - `_.rearg`
 *  256 - `_.ary`
 *  512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var data = isBindKey ? undefined : getData(func);

  var newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  if (data) {
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === undefined
    ? (isBindKey ? 0 : func.length)
    : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
    bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == WRAP_BIND_FLAG) {
    var result = createBind(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid.apply(undefined, newData);
  }
  var setter = data ? baseSetData : setData;
  return setWrapToString(setter(result, newData), func, bitmask);
}

module.exports = createWrap;


/***/ }),

/***/ 9389:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_deburrLetter.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var basePropertyOf = __webpack_require__(/*! ./_basePropertyOf */ 8674);

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 's'
};

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = basePropertyOf(deburredLetters);

module.exports = deburrLetter;


/***/ }),

/***/ 8777:
/*!************************************************!*\
  !*** ./node_modules/lodash/_defineProperty.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ 852);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ 7114:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_equalArrays.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var SetCache = __webpack_require__(/*! ./_SetCache */ 8668),
    arraySome = __webpack_require__(/*! ./_arraySome */ 2908),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ 4757);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),

/***/ 8351:
/*!********************************************!*\
  !*** ./node_modules/lodash/_equalByTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ 2705),
    Uint8Array = __webpack_require__(/*! ./_Uint8Array */ 1149),
    eq = __webpack_require__(/*! ./eq */ 7813),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ 7114),
    mapToArray = __webpack_require__(/*! ./_mapToArray */ 8776),
    setToArray = __webpack_require__(/*! ./_setToArray */ 1814);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),

/***/ 6096:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_equalObjects.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getAllKeys = __webpack_require__(/*! ./_getAllKeys */ 8234);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),

/***/ 1957:
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ 8234:
/*!********************************************!*\
  !*** ./node_modules/lodash/_getAllKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ 8866),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ 9551),
    keys = __webpack_require__(/*! ./keys */ 3674);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ 6833:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_getData.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var metaMap = __webpack_require__(/*! ./_metaMap */ 9250),
    noop = __webpack_require__(/*! ./noop */ 308);

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

module.exports = getData;


/***/ }),

/***/ 7658:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_getFuncName.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var realNames = __webpack_require__(/*! ./_realNames */ 2060);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
function getFuncName(func) {
  var result = (func.name + ''),
      array = realNames[result],
      length = hasOwnProperty.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}

module.exports = getFuncName;


/***/ }),

/***/ 893:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getHolder.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */
function getHolder(func) {
  var object = func;
  return object.placeholder;
}

module.exports = getHolder;


/***/ }),

/***/ 5050:
/*!********************************************!*\
  !*** ./node_modules/lodash/_getMapData.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ 7019);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ 852:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ 8458),
    getValue = __webpack_require__(/*! ./_getValue */ 7801);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ 9607:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ 2705);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ 9551:
/*!********************************************!*\
  !*** ./node_modules/lodash/_getSymbols.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ 4963),
    stubArray = __webpack_require__(/*! ./stubArray */ 479);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ 4160:
/*!****************************************!*\
  !*** ./node_modules/lodash/_getTag.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(/*! ./_DataView */ 8552),
    Map = __webpack_require__(/*! ./_Map */ 7071),
    Promise = __webpack_require__(/*! ./_Promise */ 3818),
    Set = __webpack_require__(/*! ./_Set */ 8525),
    WeakMap = __webpack_require__(/*! ./_WeakMap */ 577),
    baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 4239),
    toSource = __webpack_require__(/*! ./_toSource */ 346);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ 7801:
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ 8775:
/*!************************************************!*\
  !*** ./node_modules/lodash/_getWrapDetails.js ***!
  \************************************************/
/***/ ((module) => {

/** Used to match wrap detail comments. */
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;

/**
 * Extracts wrapper details from the `source` body comment.
 *
 * @private
 * @param {string} source The source to inspect.
 * @returns {Array} Returns the wrapper details.
 */
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}

module.exports = getWrapDetails;


/***/ }),

/***/ 2689:
/*!********************************************!*\
  !*** ./node_modules/lodash/_hasUnicode.js ***!
  \********************************************/
/***/ ((module) => {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;


/***/ }),

/***/ 3157:
/*!************************************************!*\
  !*** ./node_modules/lodash/_hasUnicodeWord.js ***!
  \************************************************/
/***/ ((module) => {

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

module.exports = hasUnicodeWord;


/***/ }),

/***/ 1789:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_hashClear.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ 4536);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ 401:
/*!********************************************!*\
  !*** ./node_modules/lodash/_hashDelete.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ 7667:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashGet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ 4536);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ 1327:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashHas.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ 4536);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ 1866:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashSet.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ 4536);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ 3112:
/*!***************************************************!*\
  !*** ./node_modules/lodash/_insertWrapDetails.js ***!
  \***************************************************/
/***/ ((module) => {

/** Used to match wrap detail comments. */
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;

/**
 * Inserts wrapper `details` in a comment at the top of the `source` body.
 *
 * @private
 * @param {string} source The source to modify.
 * @returns {Array} details The details to insert.
 * @returns {string} Returns the modified source.
 */
function insertWrapDetails(source, details) {
  var length = details.length;
  if (!length) {
    return source;
  }
  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
}

module.exports = insertWrapDetails;


/***/ }),

/***/ 5776:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_isIndex.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ 7019:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_isKeyable.js ***!
  \*******************************************/
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ 6528:
/*!********************************************!*\
  !*** ./node_modules/lodash/_isLaziable.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var LazyWrapper = __webpack_require__(/*! ./_LazyWrapper */ 6425),
    getData = __webpack_require__(/*! ./_getData */ 6833),
    getFuncName = __webpack_require__(/*! ./_getFuncName */ 7658),
    lodash = __webpack_require__(/*! ./wrapperLodash */ 8111);

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}

module.exports = isLaziable;


/***/ }),

/***/ 5346:
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ 4429);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ 5726:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_isPrototype.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ 7040:
/*!************************************************!*\
  !*** ./node_modules/lodash/_listCacheClear.js ***!
  \************************************************/
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ 4125:
/*!*************************************************!*\
  !*** ./node_modules/lodash/_listCacheDelete.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ 8470);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ 2117:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheGet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ 8470);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ 7518:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheHas.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ 8470);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ 4705:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheSet.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ 8470);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ 4785:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_mapCacheClear.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(/*! ./_Hash */ 1989),
    ListCache = __webpack_require__(/*! ./_ListCache */ 8407),
    Map = __webpack_require__(/*! ./_Map */ 7071);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ 1285:
/*!************************************************!*\
  !*** ./node_modules/lodash/_mapCacheDelete.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ 5050);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ 6000:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheGet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ 5050);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ 9916:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheHas.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ 5050);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ 5265:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheSet.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(/*! ./_getMapData */ 5050);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ 8776:
/*!********************************************!*\
  !*** ./node_modules/lodash/_mapToArray.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),

/***/ 3833:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_mergeData.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var composeArgs = __webpack_require__(/*! ./_composeArgs */ 2157),
    composeArgsRight = __webpack_require__(/*! ./_composeArgsRight */ 4054),
    replaceHolders = __webpack_require__(/*! ./_replaceHolders */ 6460);

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_BOUND_FLAG = 4,
    WRAP_CURRY_FLAG = 8,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Merges the function metadata of `source` into `data`.
 *
 * Merging metadata reduces the number of wrappers used to invoke a function.
 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
 * may be applied regardless of execution order. Methods like `_.ary` and
 * `_.rearg` modify function arguments, making the order in which they are
 * executed important, preventing the merging of metadata. However, we make
 * an exception for a safe combined case where curried functions have `_.ary`
 * and or `_.rearg` applied.
 *
 * @private
 * @param {Array} data The destination metadata.
 * @param {Array} source The source metadata.
 * @returns {Array} Returns `data`.
 */
function mergeData(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

  var isCombo =
    ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
    ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
    ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

  // Exit early if metadata can't be merged.
  if (!(isCommon || isCombo)) {
    return data;
  }
  // Use source `thisArg` if available.
  if (srcBitmask & WRAP_BIND_FLAG) {
    data[2] = source[2];
    // Set when currying a bound function.
    newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
  }
  // Compose partial arguments.
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
  }
  // Compose partial right arguments.
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
  }
  // Use source `argPos` if available.
  value = source[7];
  if (value) {
    data[7] = value;
  }
  // Use source `ary` if it's smaller.
  if (srcBitmask & WRAP_ARY_FLAG) {
    data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
  }
  // Use source `arity` if one is not provided.
  if (data[9] == null) {
    data[9] = source[9];
  }
  // Use source `func` and merge bitmasks.
  data[0] = source[0];
  data[1] = newBitmask;

  return data;
}

module.exports = mergeData;


/***/ }),

/***/ 9250:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_metaMap.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var WeakMap = __webpack_require__(/*! ./_WeakMap */ 577);

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;


/***/ }),

/***/ 4536:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeCreate.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(/*! ./_getNative */ 852);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ 6916:
/*!********************************************!*\
  !*** ./node_modules/lodash/_nativeKeys.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(/*! ./_overArg */ 5569);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ 1167:
/*!******************************************!*\
  !*** ./node_modules/lodash/_nodeUtil.js ***!
  \******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ 1957);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ 2333:
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 5569:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_overArg.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ 5357:
/*!******************************************!*\
  !*** ./node_modules/lodash/_overRest.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var apply = __webpack_require__(/*! ./_apply */ 6874);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),

/***/ 2060:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_realNames.js ***!
  \*******************************************/
/***/ ((module) => {

/** Used to lookup unminified function names. */
var realNames = {};

module.exports = realNames;


/***/ }),

/***/ 451:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_reorder.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyArray = __webpack_require__(/*! ./_copyArray */ 278),
    isIndex = __webpack_require__(/*! ./_isIndex */ 5776);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

module.exports = reorder;


/***/ }),

/***/ 6460:
/*!************************************************!*\
  !*** ./node_modules/lodash/_replaceHolders.js ***!
  \************************************************/
/***/ ((module) => {

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}

module.exports = replaceHolders;


/***/ }),

/***/ 5639:
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ 1957);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 619:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheAdd.js ***!
  \*********************************************/
/***/ ((module) => {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),

/***/ 2385:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheHas.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),

/***/ 258:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_setData.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseSetData = __webpack_require__(/*! ./_baseSetData */ 8045),
    shortOut = __webpack_require__(/*! ./_shortOut */ 1275);

/**
 * Sets metadata for `func`.
 *
 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
 * period of time, it will trip its breaker and transition to an identity
 * function to avoid garbage collection pauses in V8. See
 * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
 * for more details.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var setData = shortOut(baseSetData);

module.exports = setData;


/***/ }),

/***/ 1814:
/*!********************************************!*\
  !*** ./node_modules/lodash/_setToArray.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),

/***/ 61:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setToString.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseSetToString = __webpack_require__(/*! ./_baseSetToString */ 6560),
    shortOut = __webpack_require__(/*! ./_shortOut */ 1275);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),

/***/ 9255:
/*!*************************************************!*\
  !*** ./node_modules/lodash/_setWrapToString.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getWrapDetails = __webpack_require__(/*! ./_getWrapDetails */ 8775),
    insertWrapDetails = __webpack_require__(/*! ./_insertWrapDetails */ 3112),
    setToString = __webpack_require__(/*! ./_setToString */ 61),
    updateWrapDetails = __webpack_require__(/*! ./_updateWrapDetails */ 7241);

/**
 * Sets the `toString` method of `wrapper` to mimic the source of `reference`
 * with wrapper details in a comment at the top of the source body.
 *
 * @private
 * @param {Function} wrapper The function to modify.
 * @param {Function} reference The reference function.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Function} Returns `wrapper`.
 */
function setWrapToString(wrapper, reference, bitmask) {
  var source = (reference + '');
  return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
}

module.exports = setWrapToString;


/***/ }),

/***/ 1275:
/*!******************************************!*\
  !*** ./node_modules/lodash/_shortOut.js ***!
  \******************************************/
/***/ ((module) => {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),

/***/ 7465:
/*!********************************************!*\
  !*** ./node_modules/lodash/_stackClear.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ 8407);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ 3779:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_stackDelete.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ 7599:
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackGet.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ 4758:
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackHas.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ 4309:
/*!******************************************!*\
  !*** ./node_modules/lodash/_stackSet.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(/*! ./_ListCache */ 8407),
    Map = __webpack_require__(/*! ./_Map */ 7071),
    MapCache = __webpack_require__(/*! ./_MapCache */ 3369);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ 2351:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_strictIndexOf.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),

/***/ 3140:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_stringToArray.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var asciiToArray = __webpack_require__(/*! ./_asciiToArray */ 4286),
    hasUnicode = __webpack_require__(/*! ./_hasUnicode */ 2689),
    unicodeToArray = __webpack_require__(/*! ./_unicodeToArray */ 676);

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

module.exports = stringToArray;


/***/ }),

/***/ 346:
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ 7990:
/*!*************************************************!*\
  !*** ./node_modules/lodash/_trimmedEndIndex.js ***!
  \*************************************************/
/***/ ((module) => {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ }),

/***/ 676:
/*!************************************************!*\
  !*** ./node_modules/lodash/_unicodeToArray.js ***!
  \************************************************/
/***/ ((module) => {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

module.exports = unicodeToArray;


/***/ }),

/***/ 2757:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_unicodeWords.js ***!
  \**********************************************/
/***/ ((module) => {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
  rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
  rsUpper + '+' + rsOptContrUpper,
  rsOrdUpper,
  rsOrdLower,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

module.exports = unicodeWords;


/***/ }),

/***/ 7241:
/*!***************************************************!*\
  !*** ./node_modules/lodash/_updateWrapDetails.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayEach = __webpack_require__(/*! ./_arrayEach */ 7412),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ 7443);

/** Used to compose bitmasks for function metadata. */
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256,
    WRAP_FLIP_FLAG = 512;

/** Used to associate wrap methods with their bit flags. */
var wrapFlags = [
  ['ary', WRAP_ARY_FLAG],
  ['bind', WRAP_BIND_FLAG],
  ['bindKey', WRAP_BIND_KEY_FLAG],
  ['curry', WRAP_CURRY_FLAG],
  ['curryRight', WRAP_CURRY_RIGHT_FLAG],
  ['flip', WRAP_FLIP_FLAG],
  ['partial', WRAP_PARTIAL_FLAG],
  ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
  ['rearg', WRAP_REARG_FLAG]
];

/**
 * Updates wrapper `details` based on `bitmask` flags.
 *
 * @private
 * @returns {Array} details The details to modify.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Array} Returns `details`.
 */
function updateWrapDetails(details, bitmask) {
  arrayEach(wrapFlags, function(pair) {
    var value = '_.' + pair[0];
    if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}

module.exports = updateWrapDetails;


/***/ }),

/***/ 1913:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_wrapperClone.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var LazyWrapper = __webpack_require__(/*! ./_LazyWrapper */ 6425),
    LodashWrapper = __webpack_require__(/*! ./_LodashWrapper */ 7548),
    copyArray = __webpack_require__(/*! ./_copyArray */ 278);

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__  = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

module.exports = wrapperClone;


/***/ }),

/***/ 8929:
/*!******************************************!*\
  !*** ./node_modules/lodash/camelCase.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var capitalize = __webpack_require__(/*! ./capitalize */ 8403),
    createCompounder = __webpack_require__(/*! ./_createCompounder */ 5393);

/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */
var camelCase = createCompounder(function(result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});

module.exports = camelCase;


/***/ }),

/***/ 8403:
/*!*******************************************!*\
  !*** ./node_modules/lodash/capitalize.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toString = __webpack_require__(/*! ./toString */ 9833),
    upperFirst = __webpack_require__(/*! ./upperFirst */ 1700);

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}

module.exports = capitalize;


/***/ }),

/***/ 5703:
/*!*****************************************!*\
  !*** ./node_modules/lodash/constant.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),

/***/ 3279:
/*!*****************************************!*\
  !*** ./node_modules/lodash/debounce.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ 3218),
    now = __webpack_require__(/*! ./now */ 7771),
    toNumber = __webpack_require__(/*! ./toNumber */ 4841);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),

/***/ 3816:
/*!***************************************!*\
  !*** ./node_modules/lodash/deburr.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var deburrLetter = __webpack_require__(/*! ./_deburrLetter */ 9389),
    toString = __webpack_require__(/*! ./toString */ 9833);

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;

/** Used to compose unicode capture groups. */
var rsCombo = '[' + rsComboRange + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

module.exports = deburr;


/***/ }),

/***/ 7813:
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ 6557:
/*!*****************************************!*\
  !*** ./node_modules/lodash/identity.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),

/***/ 5694:
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ 9454),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 7005);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ 1469:
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ 8612:
/*!********************************************!*\
  !*** ./node_modules/lodash/isArrayLike.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(/*! ./isFunction */ 3560),
    isLength = __webpack_require__(/*! ./isLength */ 1780);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ 4144:
/*!*****************************************!*\
  !*** ./node_modules/lodash/isBuffer.js ***!
  \*****************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ 5639),
    stubFalse = __webpack_require__(/*! ./stubFalse */ 5062);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ 8446:
/*!****************************************!*\
  !*** ./node_modules/lodash/isEqual.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ 939);

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;


/***/ }),

/***/ 3560:
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 4239),
    isObject = __webpack_require__(/*! ./isObject */ 3218);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ 1780:
/*!*****************************************!*\
  !*** ./node_modules/lodash/isLength.js ***!
  \*****************************************/
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ 3218:
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ 7005:
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 3448:
/*!*****************************************!*\
  !*** ./node_modules/lodash/isSymbol.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 4239),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 7005);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ 6719:
/*!*********************************************!*\
  !*** ./node_modules/lodash/isTypedArray.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ 8749),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ 1717),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ 1167);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ 3674:
/*!*************************************!*\
  !*** ./node_modules/lodash/keys.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ 4636),
    baseKeys = __webpack_require__(/*! ./_baseKeys */ 280),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ 8612);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ 5021:
/*!******************************************!*\
  !*** ./node_modules/lodash/lowerCase.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createCompounder = __webpack_require__(/*! ./_createCompounder */ 5393);

/**
 * Converts `string`, as space separated words, to lower case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the lower cased string.
 * @example
 *
 * _.lowerCase('--Foo-Bar--');
 * // => 'foo bar'
 *
 * _.lowerCase('fooBar');
 * // => 'foo bar'
 *
 * _.lowerCase('__FOO_BAR__');
 * // => 'foo bar'
 */
var lowerCase = createCompounder(function(result, word, index) {
  return result + (index ? ' ' : '') + word.toLowerCase();
});

module.exports = lowerCase;


/***/ }),

/***/ 308:
/*!*************************************!*\
  !*** ./node_modules/lodash/noop.js ***!
  \*************************************/
/***/ ((module) => {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),

/***/ 7771:
/*!************************************!*\
  !*** ./node_modules/lodash/now.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ 5639);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),

/***/ 3131:
/*!****************************************!*\
  !*** ./node_modules/lodash/partial.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseRest = __webpack_require__(/*! ./_baseRest */ 5976),
    createWrap = __webpack_require__(/*! ./_createWrap */ 7727),
    getHolder = __webpack_require__(/*! ./_getHolder */ 893),
    replaceHolders = __webpack_require__(/*! ./_replaceHolders */ 6460);

/** Used to compose bitmasks for function metadata. */
var WRAP_PARTIAL_FLAG = 32;

/**
 * Creates a function that invokes `func` with `partials` prepended to the
 * arguments it receives. This method is like `_.bind` except it does **not**
 * alter the `this` binding.
 *
 * The `_.partial.placeholder` value, which defaults to `_` in monolithic
 * builds, may be used as a placeholder for partially applied arguments.
 *
 * **Note:** This method doesn't set the "length" property of partially
 * applied functions.
 *
 * @static
 * @memberOf _
 * @since 0.2.0
 * @category Function
 * @param {Function} func The function to partially apply arguments to.
 * @param {...*} [partials] The arguments to be partially applied.
 * @returns {Function} Returns the new partially applied function.
 * @example
 *
 * function greet(greeting, name) {
 *   return greeting + ' ' + name;
 * }
 *
 * var sayHelloTo = _.partial(greet, 'hello');
 * sayHelloTo('fred');
 * // => 'hello fred'
 *
 * // Partially applied with placeholders.
 * var greetFred = _.partial(greet, _, 'fred');
 * greetFred('hi');
 * // => 'hi fred'
 */
var partial = baseRest(function(func, partials) {
  var holders = replaceHolders(partials, getHolder(partial));
  return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
});

// Assign default placeholders.
partial.placeholder = {};

module.exports = partial;


/***/ }),

/***/ 1865:
/*!******************************************!*\
  !*** ./node_modules/lodash/snakeCase.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createCompounder = __webpack_require__(/*! ./_createCompounder */ 5393);

/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @example
 *
 * _.snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * _.snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * _.snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */
var snakeCase = createCompounder(function(result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});

module.exports = snakeCase;


/***/ }),

/***/ 479:
/*!******************************************!*\
  !*** ./node_modules/lodash/stubArray.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ 5062:
/*!******************************************!*\
  !*** ./node_modules/lodash/stubFalse.js ***!
  \******************************************/
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ 3493:
/*!*****************************************!*\
  !*** ./node_modules/lodash/throttle.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debounce = __webpack_require__(/*! ./debounce */ 3279),
    isObject = __webpack_require__(/*! ./isObject */ 3218);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;


/***/ }),

/***/ 8601:
/*!*****************************************!*\
  !*** ./node_modules/lodash/toFinite.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toNumber = __webpack_require__(/*! ./toNumber */ 4841);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),

/***/ 554:
/*!******************************************!*\
  !*** ./node_modules/lodash/toInteger.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toFinite = __webpack_require__(/*! ./toFinite */ 8601);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),

/***/ 4841:
/*!*****************************************!*\
  !*** ./node_modules/lodash/toNumber.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTrim = __webpack_require__(/*! ./_baseTrim */ 7561),
    isObject = __webpack_require__(/*! ./isObject */ 3218),
    isSymbol = __webpack_require__(/*! ./isSymbol */ 3448);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ 9833:
/*!*****************************************!*\
  !*** ./node_modules/lodash/toString.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseToString = __webpack_require__(/*! ./_baseToString */ 531);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ 1700:
/*!*******************************************!*\
  !*** ./node_modules/lodash/upperFirst.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var createCaseFirst = __webpack_require__(/*! ./_createCaseFirst */ 8805);

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

module.exports = upperFirst;


/***/ }),

/***/ 8748:
/*!**************************************!*\
  !*** ./node_modules/lodash/words.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var asciiWords = __webpack_require__(/*! ./_asciiWords */ 9029),
    hasUnicodeWord = __webpack_require__(/*! ./_hasUnicodeWord */ 3157),
    toString = __webpack_require__(/*! ./toString */ 9833),
    unicodeWords = __webpack_require__(/*! ./_unicodeWords */ 2757);

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

module.exports = words;


/***/ }),

/***/ 359:
/*!*************************************!*\
  !*** ./node_modules/lodash/wrap.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castFunction = __webpack_require__(/*! ./_castFunction */ 4290),
    partial = __webpack_require__(/*! ./partial */ 3131);

/**
 * Creates a function that provides `value` to `wrapper` as its first
 * argument. Any additional arguments provided to the function are appended
 * to those provided to the `wrapper`. The wrapper is invoked with the `this`
 * binding of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {*} value The value to wrap.
 * @param {Function} [wrapper=identity] The wrapper function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var p = _.wrap(_.escape, function(func, text) {
 *   return '<p>' + func(text) + '</p>';
 * });
 *
 * p('fred, barney, & pebbles');
 * // => '<p>fred, barney, &amp; pebbles</p>'
 */
function wrap(value, wrapper) {
  return partial(castFunction(wrapper), value);
}

module.exports = wrap;


/***/ }),

/***/ 8111:
/*!**********************************************!*\
  !*** ./node_modules/lodash/wrapperLodash.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var LazyWrapper = __webpack_require__(/*! ./_LazyWrapper */ 6425),
    LodashWrapper = __webpack_require__(/*! ./_LodashWrapper */ 7548),
    baseLodash = __webpack_require__(/*! ./_baseLodash */ 9435),
    isArray = __webpack_require__(/*! ./isArray */ 1469),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 7005),
    wrapperClone = __webpack_require__(/*! ./_wrapperClone */ 1913);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array and iteratees accept only
 * one argument. The heuristic for whether a section qualifies for shortcut
 * fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

module.exports = lodash;


/***/ }),

/***/ 4240:
/*!*********************************************!*\
  !*** ./node_modules/flattie/dist/index.mjs ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "flattie": () => (/* binding */ flattie)
/* harmony export */ });
function iter(output, nullish, sep, val, key) {
	var k, pfx = key ? (key + sep) : key;

	if (val == null) {
		if (nullish) output[key] = val;
	} else if (typeof val != 'object') {
		output[key] = val;
	} else if (Array.isArray(val)) {
		for (k=0; k < val.length; k++) {
			iter(output, nullish, sep, val[k], pfx + k);
		}
	} else {
		for (k in val) {
			iter(output, nullish, sep, val[k], pfx + k);
		}
	}
}

function flattie(input, glue, toNull) {
	var output = {};
	if (typeof input == 'object') {
		iter(output, !!toNull, glue || '.', input, '');
	}
	return output;
}


/***/ }),

/***/ 1955:
/*!***************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.mjs ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*! js-cookie v3.0.1 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (api);


/***/ }),

/***/ 3416:
/*!**********************************************!*\
  !*** ./node_modules/nanoid/index.browser.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customAlphabet": () => (/* binding */ customAlphabet),
/* harmony export */   "customRandom": () => (/* binding */ customRandom),
/* harmony export */   "nanoid": () => (/* binding */ nanoid),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "urlAlphabet": () => (/* reexport safe */ _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__.urlAlphabet)
/* harmony export */ });
/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url-alphabet/index.js */ 499);

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')



/***/ }),

/***/ 499:
/*!***************************************************!*\
  !*** ./node_modules/nanoid/url-alphabet/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "urlAlphabet": () => (/* binding */ urlAlphabet)
/* harmony export */ });
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "sdk." + chunkId + "." + {"vendor":"313b26d007d7af12","demos":"4d4a4b4a48fbafa6","playbooks":"c3503a8dcfd0a12f"}[chunkId] + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "@getkoala/browser:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"sdk": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_getkoala_browser"] = self["webpackChunk_getkoala_browser"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************!*\
  !*** ./src/browser-install.ts ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "load": () => (/* reexport safe */ _browser__WEBPACK_IMPORTED_MODULE_0__.load)
/* harmony export */ });
/* harmony import */ var _browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./browser */ 66);



function getProject() {
  var _a, _b, _c;
  let project = (_a = document.currentScript) == null ? void 0 : _a.getAttribute("data-project");
  if (!project) {
    const [_file, id] = ((_c = (_b = document.currentScript) == null ? void 0 : _b.getAttribute("src")) != null ? _c : "").split("/").reverse();
    project = id;
  }
  return project;
}
async function loadSDK() {
  const project = getProject();
  if (!project) {
    console.error("Koala SDK: Missing required project attribute.");
    return;
  }
  try {
    window.ko = await _browser__WEBPACK_IMPORTED_MODULE_0__.load({ project });
  } catch (error) {
    console.error("[KOALA]", "Failed to load the Koala SDK.", error);
  }
}
loadSDK();

})();

window.KoalaSDK = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=sdk.js.map