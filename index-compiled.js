"use strict";

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _nunjucks = _interopRequireDefault(require("nunjucks"));

var _compression = _interopRequireDefault(require("compression"));

var _fs = _interopRequireDefault(require("fs"));

var _index = _interopRequireDefault(require("./routes/index.routes"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _redis = _interopRequireDefault(require("redis"));

var _connectRedis = _interopRequireDefault(require("connect-redis"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

_dotenv["default"].config();

var port = process.env.PORT || 3000,
    redisPort = process.env.REDIS_PORT || 6379,
    redisClient = _redis["default"].createClient("redis://".concat(process.env.REDIS_USER, ":").concat(process.env.REDIS_PASS, "@").concat(process.env.REDIS_HOST, ":").concat(redisPort)),
    redisStore = (0, _connectRedis["default"])(_expressSession["default"]),
    app = (0, _express["default"])(),
    urlEncodedParser = _express["default"].urlencoded({
  extended: true
}),
    dbUrl = "mongodb+srv://".concat(process.env.DB_USER, ":").concat(process.env.DB_PASS, "@").concat(process.env.DB_HOST);

_mongoose["default"].connect(dbUrl, {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true
});

_nunjucks["default"].configure(['source/views'].concat(_toConsumableArray(getComponentPaths())), {
  autoescape: true,
  express: app
}).addGlobal('cssBundle', getCssBundleName());

app.use((0, _compression["default"])()).use(_express["default"].json()).use(urlEncodedParser).use((0, _expressSession["default"])({
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  resave: false,
  saveUninitialized: true,
  store: new redisStore({
    client: redisClient,
    ttl: 86400
  })
})).use(_express["default"]["static"]('static')).set('view engine', 'html').set('redisClient', redisClient).use('/', _index["default"]).listen(port, function () {
  return console.log("Using port: ".concat(port));
});

function getComponentPaths() {
  var componentsPath = 'source/components';

  var components = _fs["default"].readdirSync(componentsPath);

  var templatePaths = components.map(function (component) {
    return "".concat(componentsPath, "/").concat(component, "/template/");
  });
  return templatePaths;
}

function getCssBundleName() {
  var cssBundle = _fs["default"].readdirSync('static/build/css/');

  return cssBundle[0];
}
