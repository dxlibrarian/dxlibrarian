'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var MACHINE_ID = Math.floor(Math.random() * 0xffffff);
var index = Math.floor(Math.random() * 0xffffff);
var pid =
  (typeof process === 'undefined' || typeof process.pid !== 'number'
    ? Math.floor(Math.random() * 100000)
    : process.pid) % 0xffff;

function next() {
  return (index = (index + 1) % 0xffffff);
}

function hex(length, n) {
  var h = n.toString(16);
  return h.length === length ? h : '00000000'.substring(h.length, length) + h;
}

function createDocumentId() {
  var time = Math.floor(Date.now() / 1000) % 0xffffffff;
  return hex(8, time) + hex(6, MACHINE_ID) + hex(4, pid) + hex(6, next());
}

var validateRegExp = /^[0-9A-F]{24}$/i;
var EntityId = function EntityId(entityName, documentId) {
  if (entityName == null || entityName.constructor !== String) {
    throw new Error('Argument "entityName" must be a string');
  }

  if (documentId == null || documentId.constructor !== String) {
    throw new Error('Argument "documentId" must be a string"');
  }

  if (!validateRegExp.test(documentId)) {
    throw new Error('Incorrect argument "documentId" = ' + JSON.stringify(documentId) + '. RegExp = ' + validateRegExp);
  }

  this.entityName = entityName;
  this.documentId = documentId;
};
var entityId = function entityId(entityName, documentId) {
  if (documentId === void 0) {
    documentId = createDocumentId();
  }

  return new EntityId(entityName, documentId);
};

var PRIVATE = '@@REVENTEXT';

var Projection =
  /*#__PURE__*/
  (function() {
    function Projection() {
      Object.defineProperty(this, PRIVATE, {
        value: Object.create(null)
      });
      this[PRIVATE].eventHandlers = {};
      this[PRIVATE].indexes = [];
    }

    var _proto = Projection.prototype;

    _proto.name = function name(_name) {
      if (this[PRIVATE].name != null) {
        throw new Error('Name already exists');
      }

      this[PRIVATE].name = _name;
      return this;
    };

    _proto.index = function index(keyAndIndexTypeSpecification, options) {
      this[PRIVATE].indexes.push(
        options != null ? [keyAndIndexTypeSpecification, options] : [keyAndIndexTypeSpecification]
      );
      return this;
    };

    _proto.on = function on(eventType, eventHandler) {
      if (this[PRIVATE].eventHandlers[eventType] != null) {
        throw new Error('Event handler "' + eventType + '" already exists');
      }

      this[PRIVATE].eventHandlers[eventType] = eventHandler;
      return this;
    };

    return Projection;
  })();
var projection = {
  name: function name(_name2) {
    var instance = new Projection();
    return instance.name(_name2);
  },
  index: function index(keyAndIndexTypeSpecification, options) {
    var instance = new Projection();
    return instance.index(keyAndIndexTypeSpecification, options);
  },
  on: function on(eventType, eventHandler) {
    var instance = new Projection();
    return instance.on(eventType, eventHandler);
  }
};

var Client =
  /*#__PURE__*/
  (function() {
    function Client() {
      var self = this;
      Object.defineProperty(self, PRIVATE, {
        value: Object.create(null)
      });
      self[PRIVATE].projections = [];

      this.reducer = function(state) {
        if (state === void 0) {
          state = {};
        }

        return state;
      };

      this.middleware = function(store) {
        return function(next) {
          return function(action) {
            return next(action);
          };
        };
      };
    }

    var _proto = Client.prototype;

    _proto.publish = function publish(implementation) {
      var self = this;
      self[PRIVATE].publish = implementation;
      return this;
    };

    _proto.read = function read(implementation) {
      var self = this;
      self[PRIVATE].read = implementation;
      return this;
    };

    _proto.projections = function projections(_projections) {
      var _self$PRIVATE$project;

      var self = this;

      (_self$PRIVATE$project = self[PRIVATE].projections).push.apply(_self$PRIVATE$project, _projections);

      return this;
    };

    return Client;
  })();

var client = {
  publish: function publish(implementation) {
    var instance = new Client();
    return instance.publish(implementation);
  },
  read: function read(implementation) {
    var instance = new Client();
    return instance.read(implementation);
  },
  projections: function projections(_projections2) {
    var instance = new Client();
    return instance.projections(_projections2);
  }
};

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

var _extends_1 = createCommonjsModule(function(module) {
  function _extends() {
    module.exports = _extends =
      Object.assign ||
      function(target) {
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
  module.exports = _extends;
});

function wrap(value) {
  if (value instanceof EntityId) {
    return {
      t: 'e',
      v: [value.entityName, value.documentId]
    };
  }

  if (Array.isArray(value)) {
    return recursiveWrap(value);
  } else if (value === Object(value)) {
    return {
      t: 'o',
      v: recursiveWrap(value)
    };
  } else {
    return recursiveWrap(value);
  }
}

function recursiveWrap(source) {
  if (Array.isArray(source)) {
    return source.map(function(value) {
      return wrap(value);
    });
  } else if (source === Object(source)) {
    var copyValue = {};

    for (var _key in source) {
      if (!source.hasOwnProperty(_key)) {
        continue;
      }

      copyValue[_key] = wrap(source[_key]);
    }

    return copyValue;
  } else {
    return source;
  }
}

var serialize = function serialize(events) {
  var eventCount = events.length;
  var result = [];

  for (var eventIndex = 0; eventIndex < eventCount; eventIndex++) {
    var event = events[eventIndex];
    result.push(
      _extends_1({}, event, {
        payload: recursiveWrap(event.payload)
      })
    );
  }

  return JSON.stringify(result);
};

function unwrap(value) {
  if (Array.isArray(value)) {
    return recursiveUnwrap(value);
  } else if (value === Object(value)) {
    if (value.t === 'e') {
      return entityId(value.v[0], value.v[1]);
    } else if (value.t === 'o') {
      return recursiveUnwrap(value.v);
    } else {
      throw new Error('Incorrect value ' + JSON.stringify(value));
    }
  } else {
    return recursiveUnwrap(value);
  }
}

function recursiveUnwrap(source) {
  if (Array.isArray(source)) {
    return source.map(function(value) {
      return unwrap(value);
    });
  } else if (source === Object(source)) {
    var copyValue = {};

    for (var _key in source) {
      if (!source.hasOwnProperty(_key)) {
        continue;
      }

      copyValue[_key] = unwrap(source[_key]);
    }

    return copyValue;
  } else {
    return source;
  }
}

function deserialize(eventsAsString) {
  var events = JSON.parse(eventsAsString);
  var eventCount = events.length;

  for (var eventIndex = 0; eventIndex < eventCount; eventIndex++) {
    var event = events[eventIndex];

    if (event.hasOwnProperty('payload')) {
      event.payload = recursiveUnwrap(event.payload);
    }
  }

  return events;
}

exports.EntityId = EntityId;
exports.Projection = Projection;
exports.client = client;
exports.deserialize = deserialize;
exports.entityId = entityId;
exports.projection = projection;
exports.serialize = serialize;
//# sourceMappingURL=client.js.map
