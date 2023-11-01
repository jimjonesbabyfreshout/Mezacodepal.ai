"use strict";function _typeof(o){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach(function(r){_defineProperty(e,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}return e}function _defineProperty(obj,key,value){key=_toPropertyKey(key);if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function _toPropertyKey(arg){var key=_toPrimitive(arg,"string");return _typeof(key)==="symbol"?key:String(key)}function _toPrimitive(input,hint){if(_typeof(input)!=="object"||input===null)return input;var prim=input[Symbol.toPrimitive];if(prim!==undefined){var res=prim.call(input,hint||"default");if(_typeof(res)!=="object")return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return(hint==="string"?String:Number)(input)}function _slicedToArray(arr,i){return _arrayWithHoles(arr)||_iterableToArrayLimit(arr,i)||_unsupportedIterableToArray(arr,i)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _iterableToArrayLimit(r,l){var t=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(null!=t){var e,n,i,u,a=[],f=!0,o=!1;try{if(i=(t=t.call(r)).next,0===l){if(Object(t)!==t)return;f=!1}else for(;!(f=(e=i.call(t)).done)&&(a.push(e.value),a.length!==l);f=!0);}catch(r){o=!0,n=r}finally{try{if(!f&&null!=t.return&&(u=t.return(),Object(u)!==u))return}finally{if(o)throw n}}return a}}function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}if(!Array.prototype.includes){Array.prototype.includes=function(search,start){"use strict";if(search instanceof RegExp){throw TypeError("first argument must not be a RegExp")}if(start===undefined){start=0}return this.indexOf(search,start)!==-1}}if(!Array.from){Array.from=function arrayFrom(data){return Array.prototype.slice.call(data)}}// forEach function to use for NodeList for IE compat
function forEach(list,cb){for(var i=0;i<list.length;i++){cb(list[i],i)}}function find(list,cb){for(var i=0;i<list.length;i++){if(cb(list[i])){return list[i]}}return null}function createQueryParamGetter(){var queryParams;if(!window.URLSearchParams){queryParams=location.search.replace(/^\?/,"").split("&").reduce(function(params,currString){var _currString$replace$s=currString.replace("=",":::").split(":::"),_currString$replace$s2=_slicedToArray(_currString$replace$s,2),key=_currString$replace$s2[0],value=_currString$replace$s2[1];var newParam=_defineProperty({},key,value);return _objectSpread(_objectSpread({},params),newParam)},{})}else{queryParams=new URLSearchParams(location.search)}return function getQueryParam(param){if(!window.URLSearchParams){return queryParams[param]||null}else{return queryParams.get(param)}}}var getQueryParam=createQueryParamGetter();// Object.values polyfill for IE
// Modified from https://github.com/tc39/proposal-object-values-entries/blob/master/polyfill.js
if(!Object.values){var reduce=Function.bind.call(Function.call,Array.prototype.reduce);var isEnumerable=Function.bind.call(Function.call,Object.prototype.propertyIsEnumerable);var concat=Function.bind.call(Function.call,Array.prototype.concat);var keys=function keys(target){return Object.getOwnPropertyNames(target)};Object.values=function values(O){return reduce(keys(O),function(v,k){return concat(v,typeof k==="string"&&isEnumerable(O,k)?[O[k]]:[])},[])}}
