/**
 * @provides fb.joey.debug
 */
/**
 * This is the stock JSON2 implementation from www.json.org, unmodified except
 * for this docblock.
 *
 * @provides fb.json2
 */

/*
    http://www.JSON.org/json2.js
    2009-09-29

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @prelude
 * @provides fb.prelude
 */

/**
 * Prelude.
 *
 *     Namespaces are one honking great idea -- let's do more of those!
 *                                                            -- Tim Peters
 *
 * The Prelude is what keeps us from being messy. In order to co-exist with
 * arbitary environments, we need to control our footprint. The one and only
 * rule to follow here is that we need to limit the globals we introduce. The
 * only global we should every have is ``FB``. This is exactly what the prelude
 * enables us to do.
 *
 * The main method to take away from this file is `FB.copy()`_. As the name
 * suggests it copies things. Its powerful -- but to get started you only need
 * to know that this is what you use when you are augmenting the FB object. For
 * example, this is skeleton for how ``FB.Event`` is defined::
 *
 *   FB.provide('Event', {
 *     subscribe: function() { ... },
 *     unsubscribe: function() { ... },
 *     fire: function() { ... }
 *   });
 *
 * This is similar to saying::
 *
 *   FB.Event = {
 *     subscribe: function() { ... },
 *     unsubscribe: function() { ... },
 *     fire: function() { ... }
 *   };
 *
 * Except it does some housekeeping, prevents redefinition by default and other
 * goodness.
 *
 * .. _FB.copy(): #method_FB.copy
 *
 * @class FB
 * @static
 * @access private
 */
if (!window.FB) {
  FB = {
    // use the init method to set these values correctly
    _apiKey     : null,
    _session    : null,
    _userStatus : 'unknown', // or 'notConnected' or 'connected'

    // logging is enabled by default. this is the logging shown to the
    // developer and not at all noisy.
    _logging: true,


    //
    // DYNAMIC DATA
    //
    // the various domains needed for using Connect
    _domain: {
      // api : window.location.protocol + '//api.facebook.com/',
      api : 'http://api.facebook.com/',
      cdn : (window.location.protocol == 'https:'
              ? 'https://s-static.ak.fbcdn.net/'
              : 'http://static.ak.fbcdn.net/'),
      www : window.location.protocol + '//www.facebook.com/'
    },
    _locale: null,


    /**
     * Copies things from source into target.
     *
     * @access protected
     * @param target    {Object}  the target object where things will be copied
     *                            into
     * @param source    {Object}  the source object where things will be copied
     *                            from
     * @param overwrite {Boolean} indicate if existing items should be
     *                            overwritten
     * @param tranform  {function} [Optional], transformation function for
     *        each item
     */
    copy: function(target, source, overwrite, transform) {
      for (var key in source) {
        if (overwrite || typeof target[key] === 'undefined') {
          target[key] = transform ? transform(source[key]) :  source[key];
        }
      }
      return target;
    },

    /**
     * Create a namespaced object
     * This create an fullly namespaced name.
     * TODO I dont think example is possible.
     * Examples:
     * FB.create('XFBML.ProfilePic') = function() {...}
     *   create FB.XFBML.ProfilePic and assign the value of the function.
     *   If FB.XFBML does not exist, this call
     *   would automatically create it.
     *
     * FB.create('Util');
     *   create a namespace FB.Util if it doesn't already exist;
     *
     * @access private
     * @param {string} name full qualified name ('Util.foo', etc.)
     * @param {string} value value to set. Default value is {}. [Optional]
     * @return object  The created object, or boolean if testOnly is true.
     */
    create: function(name, value) {
      var node = window.FB, // We will use 'FB' as root namespace
      nameParts = name ? name.split('.') : [],
      c = nameParts.length;
      for (var i = 0; i < c; i++) {
        var part = nameParts[i];
        var nso = node[part];
        if (!nso) {
          nso = (value && i + 1 == c) ? value : {};
          node[part] = nso;
        }
        node = nso;
      }
      return node;
    },

    /**
     * Copy stuff from one object to the specified namespace that
     * is FB.<target>.
     * If the namespace target doesn't exist, it will be created automatically.
     *
     * @access private
     * @param target    {Object|String}  the target object to copy into
     * @param source    {Object}         the source object to copy from
     * @param overwrite {Boolean}        indicate if we should overwrite
     * @return {Object} the *same* target object back
     */
    provide: function(target, source, overwrite) {
      // a string means a dot separated object that gets appended to, or created
      return FB.copy(
        typeof target == 'string' ? FB.create(target) : target,
        source,
        overwrite
      );
    },

    /**
     * Generates a weak random ID.
     *
     * @access private
     * @return {String} a random ID
     */
    guid: function() {
      return 'f' + (Math.random() * (1<<30)).toString(16).replace('.', '');
    },

    /**
     * Logs a message for the developer if logging is on.
     *
     * @access private
     * @param args {Object} the thing to log
     */
    log: function(args) {
      if (FB._logging) {
        //TODO what is window.Debug, and should it instead be relying on the
        //     event fired below?
        if (window.Debug && window.Debug.writeln) {
          window.Debug.writeln(args);
        } else if (window.console) {
          window.console.log(args);
        }
      }

      // fire an event if the event system is available
      if (FB.Event) {
        FB.Event.fire('fb.log', args);
      }
    },

    /**
     * Shortcut for document.getElementById
     * @method $
     * @param {string} DOM id
     * @return DOMElement
     * @access private
     */
    $: function(id) {
      return document.getElementById(id);
    },

    /**
     * For looping through Arrays and Objects.
     *
     *
     * @param {Object} item   an Array or an Object
     * @param {Function} fn   the callback function for iteration.
     *    The function will be pass (value, [index/key], item) paramters
     * @param {Bool} proto  indicate if properties from the prototype should
     *                      be included
     * @access private
     */
    forEach: function(item, fn, proto) {
      if (Object.prototype.toString.apply(item) === '[object Array]') {
        if (item.forEach) {
          item.forEach(fn);
        } else {
          for (var i=0, l=item.length; i<l; i++) {
            fn(item[i], i, item);
          }
        }
      } else {
        for (var key in item) {
          if (proto || item.hasOwnProperty(key)) {
            fn(item[key], key, item);
          }
        }
      }
    }
  };
}
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * Contains the public method ``FB.api`` and the internal implementation
 * ``FB.RestServer``.
 *
 * @provides fb.api
 * @requires fb.prelude
 *           fb.qs
 *           fb.flash
 *           fb.md5sum
 *           fb.json2
 */

/**
 * API calls.
 *
 * @class FB
 * @static
 * @access private
 */
FB.provide('', {
  /**
   * Once you have a session for the current user, you will want to
   * access data about that user, such as getting their name & profile
   * picture, friends lists or upcoming events they will be
   * attending. In order to do this, you will be making signed API
   * calls to Facebook using their session. Suppose we want to alert
   * the current user's name:
   *
   *     FB.api(
   *       {
   *         method: 'fql.query',
   *         query: 'SELECT name FROM profile WHERE id=' + FB.getSession().uid
   *       },
   *       function(response) {
   *         alert(response[0].name);
   *       }
   *     );
   *
   * [[wiki:API]] Calls are documented on the wiki.
   *
   * [[wiki:FQL]] is the preferred way of reading data from Facebook
   * (write/update/delete queries are done via simpler URL parameters).
   * [[wiki:Fql.multiquery]] is also very crucial for good performance, as it
   * allows efficiently collecting different types of data.
   *
   * [[wiki:FQL Tables]] are available for various types of data.
   *
   * @access public
   * @param user_params {Object} parameters for the query
   * @param cb {Function} the callback function to handle the response
   */
  api: function(user_params, cb) {
    // this is an optional dependency on FB.Auth
    // Auth.revokeAuthorization affects the session
    if (FB.Auth &&
        user_params.method.toLowerCase() == 'auth.revokeauthorization') {
      var old_cb = cb;
      cb = function(response) {
        if (response === true) {
          FB.Auth.setSession(null, 'notConnected');
        }
        old_cb && old_cb(response);
      };
    }

    // automatically JSON encode non string values
    var params = {};
    for (var key in user_params) {
      if (user_params.hasOwnProperty(key)) {
        var value = user_params[key];
        if (typeof value == 'string') {
          params[key] = value;
        } else {
          params[key] = JSON.stringify(value);
        }
      }
    }


    try {
      FB.RestServer.jsonp(params, cb);
    } catch (x) {
      if (FB.Flash.hasMinVersion()) {
        FB.RestServer.flash(params, cb);
      } else {
        throw new Error('Flash is required for this API call.');
      }
    }
  }
});

/**
 * API call implementations.
 *
 * @class FB.RestServer
 * @access private
 */
FB.provide('RestServer', {
  _callbacks: {},

  /**
   * Sign the given params and prepare them for an API call using the current
   * session if possible.
   *
   * @access private
   * @param params {Object} the parameters to sign
   * @return {Object} the *same* params object back
   */
  sign: function(params) {
    // general api call parameters
    FB.copy(params, {
      api_key : FB._apiKey,
      call_id : (new Date()).getTime(),
      format  : 'json',
      v       : '1.0'
    });

    // indicate session signing if session is available
    if (FB._session) {
      FB.copy(params, {
        session_key : FB._session.session_key,
        ss          : 1
      });
    }

    // optionally generate the signature. we do this for both the automatic and
    // explicit case.
    if (FB._session) {
      // the signature is described at:
      // http://wiki.developers.facebook.com/index.php/Verifying_The_Signature
      params.sig = FB.md5sum(
        FB.QS.encode(params, '', false) + FB._session.secret
      );
    }

    return params;
  },


  /**
   * Make a API call to restserver.php. This call will be automatically signed
   * if a session is available. The call is made using JSONP, which is
   * restricted to a GET with a maximum payload of 2k (including the signature
   * and other params).
   *
   * @access private
   * @param params {Object}   the parameters for the query
   * @param cb     {Function} the callback function to handle the response
   */
  jsonp: function(params, cb) {
    var
      g      = FB.guid(),
      script = document.createElement('script'),
      url;

    // shallow clone of params, add callback and sign
    params = FB.RestServer.sign(
      FB.copy({ callback: 'FB.RestServer._callbacks.' + g }, params));

    url = FB._domain.api + 'restserver.php?' + FB.QS.encode(params);
    if (url.length > 2000) {
      throw new Error('JSONP only support a maximum of 2000 bytes of input.');
    }

    // this is the JSONP callback invoked by the response from restserver.php
    FB.RestServer._callbacks[g] = function(response) {
      cb(response);
      delete FB.RestServer._callbacks[g];
      script.parentNode.removeChild(script);
    };

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  },

  /**
   * Make a API call to restserver.php using Flash.
   *
   * @access private
   * @param params {Object}   the parameters for the query
   * @param cb     {Function} the callback function to handle the response
   */
  flash: function(params, cb) {
    // only need to do this once
    if (!FB.RestServer.flash._init) {
      // the SWF calls this global function when a HTTP response is available
      // FIXME: remove global
      window.FB_OnXdHttpResult = function(reqId, data) {
        FB.RestServer._callbacks[reqId](FB.Flash.decode(data));
      };
      FB.RestServer.flash._init = true;
    }

    FB.Flash.onReady(function() {
      var method, url, body, reqId;

      // shallow clone of params, sign, and encode as query string
      body = FB.QS.encode(FB.RestServer.sign(FB.copy({}, params)));
      url = FB._domain.api + 'restserver.php';

      // GET or POST
      if (url.length + body.length > 2000) {
        method = 'POST';
      } else {
        method = 'GET';
        url += '?' + body;
        body = '';
      }

      // fire the request
      reqId = document.XdComm.sendXdHttpRequest(method, url, body, null);

      // callback
      FB.RestServer._callbacks[reqId] = function(response) {
        cb(JSON.parse(FB.Flash.decode(response)));
        delete FB.RestServer._callbacks[reqId];
      };
    });
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @provides fb.auth
 * @requires fb.prelude
 *           fb.qs
 *           fb.event
 *           fb.frames
 *           fb.json2
 */

/**
 * Authentication, Authorization & Sessions.
 *
 * @class FB
 * @static
 * @access private
 */
FB.provide('', {
  /**
   * Find out the current status from the server, and get a session if the user
   * is connected.
   *
   * The User's Status or the question of "who is the current user" is
   * the first thing you will typically start with. For the answer, we
   * ask facebook.com. Facebook will answer this question in one of
   * two ways:
   *
   * 1. Someone you don't know.
   * 2. Someone you know and have interacted with. Here's a session for them.
   *
   * Here's how you find out:
   *
   *     FB.getLoginStatus(function(response) {
   *       if (response.session) {
   *         // logged in and connected user, someone you know
   *       } else {
   *         // no user session available, someone you dont know
   *       }
   *     });
   *
   * The example above will result in the callback being invoked once
   * on load based on the session from www.facebook.com. For more
   * advanced use, you may with to monitor for various events.
   *
   * **Events**
   *
   *  - auth.login
   *  - auth.logout
   *  - auth.sessionChange
   *  - auth.statusChange
   *
   * The [FB.Event.subscribe][subscribe] and
   * [FB.Event.unsubscribe][unsubscribe] functions are used to subscribe to
   * these events. For example:
   *
   *     FB.Event.subscribe('auth.login', function(response) {
   *       // do something with response
   *     });
   *
   * The response object returned to all these events is the same as the
   * response from [FB.getLoginStatus][getLoginStatus], [FB.login][login] or
   * [FB.logout][logout]. This response object contains:
   *
   * status
   * : The status of the User. One of `connected`, `notConnected` or `unknown`.
   *
   * session
   * : The session object.
   *
   * perms
   * : The comma separated permissions string. This is specific to a
   *   permissions call. It is not persistent.
   *
   * [subscribe]: /docs/?u=facebook.jslib-alpha.FB.Event.subscribe
   * [unsubscribe]: /docs/?u=facebook.jslib-alpha.FB.Event.unsubscribe
   * [getLoginStatus]: /docs/?u=facebook.jslib-alpha.FB.getLoginStatus
   * [login]: /docs/?u=facebook.jslib-alpha.FB.login
   * [logout]: /docs/?u=facebook.jslib-alpha.FB.logout
   *
   * @access public
   * @param cb {Function} the callback function
   * @param force {Boolean} force reloading the login status (default false)
   */
  getLoginStatus: function(cb, force) {
    if (!FB._apiKey) {
      FB.log('FB.getLoginStatus() called before calling FB.init().');
      return;
    }

    // we either invoke the callback right away if the status has already been
    // loaded, or queue it up for when the load is done.
    if (cb) {
      if (!force && FB.Auth._loadState == 'loaded') {
        cb({ status: FB._userStatus, session: FB._session });
        return;
      } else {
        FB.Event.subscribe('FB.loginStatus', cb);
      }
    }

    // if we're already loading, and this is not a force load, we're done
    if (!force && FB.Auth._loadState == 'loading') {
      return;
    }

    FB.Auth._loadState = 'loading';

    // invoke the queued sessionLoad callbacks
    var lsCb = function(response) {
      // done
      FB.Auth._loadState = 'loaded';

      // invoke callbacks
      FB.Event.fire('FB.loginStatus', response);
      FB.Event.clear('FB.loginStatus');
    };

    // finally make the call to login status
    var
      xdHandler = FB.Auth.xdHandler,
      g = FB.guid(),
      url = FB._domain.www + 'extern/login_status.php?' + FB.QS.encode({
        api_key    : FB._apiKey,
        no_session : xdHandler(lsCb, g, 'parent', false, 'notConnected'),
        no_user    : xdHandler(lsCb, g, 'parent', false, 'unknown'),
        ok_session : xdHandler(lsCb, g, 'parent', false, 'connected'),
        session_version : 2
      });

    FB.Frames.hidden(url, g);
  },

  /**
   * Accessor for the current Session.
   *
   * @access public
   * @return {Object} the current Session if available, `null` otherwise
   */
  getSession: function() {
    return FB._session;
  },

  /**
   * Login/Authorize/Permissions.
   *
   * Once you have determined the user's status, you may need to
   * prompt the user to login. It is best to delay this action to
   * reduce user friction when they first arrive at your site. You can
   * then prompt and show them the "Connect with Facebook" button
   * bound to an event handler which does the following:
   *
   *     FB.login(function(response) {
   *       if (response.session) {
   *         // user successfully logged in
   *       } else {
   *         // user cancelled login
   *       }
   *     });
   *
   * You should **only** call this on a user event as it opens a
   * popup. Most browsers block popups, _unless_ they were initiated
   * from a user event, such as a click on a button or a link.
   *
   *
   * Depending on your application's needs, you may need additional
   * permissions from the user. A large number of calls do not require
   * any additional permissions, so you should first make sure you
   * need a permission. This is a good idea because this step
   * potentially adds friction to the user's process. Another point to
   * remember is that this call can be made even _after_ the user has
   * first connected. So you may want to delay asking for permissions
   * until as late as possible:
   *
   *     FB.login(function(response) {
   *       if (response.session) {
   *         if (response.perms) {
   *           // user is logged in and granted some permissions.
   *           // perms is a comma separated list of granted permissions
   *         } else {
   *           // user is logged in, but did not grant any permissions
   *         }
   *       } else {
   *         // user is not logged in
   *       }
   *     }, {perms:'read_stream,publish_stream,offline_access'});
   *
   * @access public
   * @param cb {Function} the callback function
   * @param options {Object} (_optional_) Options to modify login behavior.
   *
   * Name      | Type   | Description
   * --------- | ------ | -------------
   * perms     | String | comma separated list of
   *      [extended permissions][permissions] your application requires
   *
   * [permissions]: http://wiki.developers.facebook.com/index.php/Extended_permissions
   */
  login: function(cb, options) {
    options = options || {};

    if (!FB._apiKey) {
      FB.log('FB.login() called before calling FB.init().');
      return;
    }

    // if we already have a session and permissions are not being requested, we
    // just fire the callback
    if (FB._session && !options.perms) {
      FB.log('FB.login() called when user is already connected.');
      cb && cb({ status: FB._userStatus, session: FB._session });
      return;
    }

    var
      xdHandler = FB.Auth.xdHandler,
      g = FB.guid(),
      cancel = xdHandler(cb, g, 'opener', true,  FB._userStatus, FB._session),
      next = xdHandler(cb, g, 'opener', false, 'connected', FB._session),
      url = FB._domain.www + 'login.php?' + FB.QS.encode({
        api_key         : FB._apiKey,
        cancel_url      : cancel,
        channel_url     : window.location.toString(),
        display         : 'popup',
        fbconnect       : 1,
        next            : next,
        req_perms       : options.perms,
        return_session  : 1,
        session_version : 2,
        v               : '1.0'
      });

    FB.Frames.popup(url, 450, 415, g);
  },

  /**
   * Logout the user in the background.
   *
   * Just like logging in is tied to facebook.com, so is logging out.
   * The status shared between your site and Facebook, and logging out
   * affects both sites. This is a simple call:
   *
   *     FB.logout(function(response) {
   *       // user is now logged out
   *     });
   *
   * @access public
   * @param cb {Function} the callback function
   */
  logout: function(cb) {
    if (!FB._apiKey) {
      FB.log('FB.logout() called before calling FB.init().');
      return;
    }

    if (!FB._session) {
      FB.log('FB.logout() called without a session.');
      return;
    }

    var
      g   = FB.guid(),
      url = FB._domain.www + 'logout.php?' + FB.QS.encode({
        api_key     : FB._apiKey,
        next        : FB.Auth.xdHandler(cb, g, 'parent', false, 'unknown'),
        session_key : FB._session.session_key
      });

    FB.Frames.hidden(url, g);
  }
});

/**
 * Internal Authentication implementation.
 *
 * @class FB.Auth
 * @static
 * @access private
 */
FB.provide('Auth', {
  // pending callbacks for FB.getLoginStatus() calls
  _callbacks: [],

  /**
   * Set a new session value. Invokes all the registered subscribers
   * if needed.
   *
   * @access private
   * @param session {Object}  the new Session
   * @param status  {String}  the new status
   * @return       {Object}  the "response" object
   */
  setSession: function(session, status) {
    // detect special changes before changing the internal session
    var
      login         = !FB._session && session,
      logout        = FB._session && !session,
      both          = FB._session && session && FB._session.uid != session.uid,
      sessionChange = login || logout || (FB._session && session &&
                         FB._session.session_key != session.session_key),
      statusChange  = status != FB._userStatus;

    var response = {
      session : session,
      status  : status
    };

    FB._session = session;
    FB._userStatus = status;

    // If cookie support is enabled, set the cookie. Cookie support does not
    // rely on events, because we want the cookie to be set _before_ any of the
    // event handlers are fired. Note, this is a _weak_ dependency on Cookie.
    if (sessionChange && FB.Cookie && FB.Cookie.getEnabled()) {
      FB.Cookie.set(session);
    }

    // events
    if (statusChange) {
      /**
       * Fired when the status changes.
       *
       * @event auth.statusChange
       */
      FB.Event.fire('auth.statusChange', response);
    }
    if (logout || both) {
      /**
       * Fired when a logout action is performed.
       *
       * @event auth.logout
       */
      FB.Event.fire('auth.logout', response);
    }
    if (login || both) {
      /**
       * Fired when a login action is performed.
       *
       * @event auth.login
       */
      FB.Event.fire('auth.login', response);
    }
    if (sessionChange) {
      /**
       * Fired when the session changes. This includes a session being
       * refreshed, or a login or logout action.
       *
       * @event auth.sessionChange
       */
      FB.Event.fire('auth.sessionChange', response);
    }

    return response;
  },

  /**
   * This handles receiving a session from:
   *  - login_status.php
   *  - login.php
   *  - tos.php
   *
   * It also (optionally) handles the ``xxRESULTTOKENxx`` response from:
   *  - prompt_permissions.php
   *
   * And calls the given callback with::
   *
   *   {
   *     session: session or null,
   *     status: 'unknown' or 'notConnected' or 'connected',
   *     perms: comma separated string of perm names
   *   }
   *
   * @access private
   * @param cb        {Function} the callback function
   * @param frame     {String}   the frame id for the callback is tied to
   * @param target    {String}   parent or opener to indicate window relation
   * @param isDefault {Boolean}  is this the default callback for the frame
   * @param status    {String}   the connect status this handler will trigger
   * @param session   {Object}   backup session, if none is found in response
   * @return         {String}   the xd url bound to the callback
   */
  xdHandler: function(cb, frame, target, isDefault, status, session) {
    return FB.Frames.xdHandler(function(params) {
      // try to extract a session
      var response;

      // Try to parse a session out of params.session.
      // Note I moved FB.Auth.setSession out of the try
      // catch scope. Otherwise possible unrelated exception triggered
      // by setSession (app's codes can be invoked through events)
      // will be caught and silently ignored.
      //
      // TODO: Stop using try/catch in the first place!
      try {
        session = JSON.parse(params.session);
      } catch (x) {
      }

      response = FB.Auth.setSession(session || null, status);

      // incase we were granted some new permissions
      response.perms = (
        params.result != 'xxRESULTTOKENxx' && params.result || '');

      // user defined callback
      cb && cb(response);
    }, frame, target, isDefault) + '&result=xxRESULTTOKENxx';
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.component
 * @layer basic
 * @requires fb.prelude
 */

/**
 * This base loader that does housekeeping of loaded components and support
 * automatic loading of required css for a a component. It is required in
 * prelude because if any future code wants to dynamically load a component,
 * it will need to know about what has been loaded so far.
 *
 * This is invoked at the bottom of every script when it's packaged
 * via connect.php.
 *
 * See FB.Loader for more info on usage.
 *
 * @class FB.Component
 * @static
 * @private
 */
FB.provide('Component', {
  loaded: {},
  loadedCss: {},

  /**
   * This function will be invoked at end of each connect.php load
   * @static
   */
  onScriptLoaded: function(components) {
    var c = components.length;
    for(var i = 0; i < c; i++) {
      FB.Component.loaded[components[i]] = true;
    }

    // if the FB.Loader has been loaded,
    // then fire the callback handler
    if (FB.Loader._onCompLoaded) {
      FB.Loader._onCompLoaded(components);
    }
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @provides fb.content
 * @requires fb.prelude
 */

/**
 * "Content" is a very flexible term. Helpers for things like hidden
 * DOM content, iframes and popups.
 *
 * @class FB.Content
 * @static
 * @access private
 */
FB.provide('Content', {
  _root       : null,
  _hiddenRoot : null,
  _callbacks  : {},

  /**
   * Append some content.
   *
   * @access private
   * @param content {String|Node} a DOM Node or HTML string
   * @param root    {Node}        (optional) a custom root node
   * @return {Node} the node that was just appended
   */
  append: function(content, root) {
    // setup the root node, creating it if necessary
    if (!root) {
      if (!FB.Content._root) {
        FB.Content._root = root = FB.$('fb-root');
        if (!root) {
          FB.log('The "fb-root" div has not been created.');
          return;
        }
      } else {
        root = FB.Content._root;
      }
    }

    if (typeof content == 'string') {
      var div = document.createElement('div');
      root.appendChild(div).innerHTML = content;
      return div;
    } else {
      return root.appendChild(content);
    }
  },

  /**
   * Append some hidden content.
   *
   * @access private
   * @param content {String|Node} a DOM Node or HTML string
   * @return {Node} the node that was just appended
   */
  appendHidden: function(content) {
    if (!FB.Content._hiddenRoot) {
      var
        hiddenRoot = document.createElement('div'),
        style      = hiddenRoot.style;
      style.position = 'absolute';
      style.top      = '-10000px';
      style.width    = style.height = 0;
      FB.Content._hiddenRoot = FB.Content.append(hiddenRoot);
    }

    return FB.Content.append(content, FB.Content._hiddenRoot);
  },

  /**
   * Insert a new iframe. Unfortunately, its tricker than you imagine.
   *
   * NOTE: These iframes have no border, overflow hidden and no scrollbars.
   *
   * The opts can contain:
   *   root       DOMElement  required root node (must be empty)
   *   url        String      required iframe src attribute
   *   className  String      optional class attribute
   *   height     Integer     optional height in px
   *   id         String      optional id attribute
   *   name       String      optional name attribute
   *   onload     Function    optional onload handler
   *   width      Integer     optional width in px
   *
   * @access private
   * @param opts {Object} the options described above
   */
  insertIframe: function(opts) {
    //
    // Browsers evolved. Evolution is messy.
    //
    opts.id = opts.id || FB.guid();
    opts.name = opts.name || FB.guid();

    // Dear IE, screw you. Only works with the magical incantations.
    // Dear FF, screw you too. Needs src _after_ DOM insertion.
    // Dear Webkit, you're okay. Works either way.
    var
      guid = FB.guid(),

      // Since we set the src _after_ inserting the iframe node into the DOM,
      // some browsers will fire two onload events, once for the first empty
      // iframe insertion and then again when we set the src. Here some
      // browsers are Webkit browsers which seem to be trying to do the
      // "right thing". So we toggle this boolean right before we expect the
      // correct onload handler to get fired.
      srcSet = false,
      onloadDone = false;
    FB.Content._callbacks[guid] = function() {
      if (srcSet && !onloadDone) {
        onloadDone = true;
        opts.onload && opts.onload(opts.root.firstChild);
        delete FB.Content._callbacks[guid];
      }
    };

    if (document.attachEvent) {
      var html = (
        '<iframe' +
          ' id="' + opts.id + '"' +
          ' name="' + opts.name + '"' +
          (opts.className ? ' class="' + opts.className + '"' : '') +
          ' style="border:none;' +
                  (opts.width ? 'width:' + opts.width + 'px;' : '') +
                  (opts.height ? 'height:' + opts.height + 'px;' : '') +
                  '"' +
          ' src="' + opts.url + '"' +
          ' frameborder="0"' +
          ' scrolling="no"' +
          ' onload="FB.Content._callbacks.' + guid + '()"' +
        '></iframe>'
      );

      // There is an IE bug with iframe caching that we have to work around. We
      // need to load a dummy iframe to consume the initial cache stream. The
      // setTimeout actually sets the content to the HTML we created above, and
      // because its the second load, we no longer suffer from cache sickness.
      // It must be javascript:false instead of about:blank, otherwise IE6 will
      // complain in https.
      opts.root.innerHTML = '<iframe src="javascript:false"></iframe>';

      // Now we'll be setting the real src.
      srcSet = true;

      // You may wonder why this is a setTimeout. Read the IE source if you can
      // somehow get your hands on it, and tell me if you figure it out. This
      // is a continuation of the above trick which apparently does not work if
      // the innerHTML is changed right away. We need to break apart the two
      // with this setTimeout 0 which seems to fix the issue.
      window.setTimeout(function() {
        opts.root.innerHTML = html;
      }, 0);
    } else {
      // This block works for all non IE browsers. But it's specifically
      // designed for FF where we need to set the src after inserting the
      // iframe node into the DOM to prevent cache issues.
      var node = document.createElement('iframe');
      node.id = opts.id;
      node.name = opts.name;
      node.onload = FB.Content._callbacks[guid];
      node.style.border = 'none';
      node.style.overflow = 'hidden';
      if (opts.className) {
        node.className = opts.className;
      }
      if (opts.height) {
        node.style.height = opts.height + 'px';
      }
      if (opts.width) {
        node.style.width = opts.width + 'px';
      }
      opts.root.appendChild(node);

      // Now we'll be setting the real src.
      srcSet = true;

      node.src = opts.url;
    }
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @provides fb.cookie
 * @requires fb.prelude
 *           fb.qs
 *           fb.event
 */

/**
 * Cookie Support.
 *
 * @class FB.Cookie
 * @static
 * @access private
 */
FB.provide('Cookie', {
  /**
   * Holds the base_domain property to match the Cookie domain.
   *
   * @access private
   * @type String
   */
  _domain: null,

  /**
   * Indicate if Cookie support should be enabled.
   *
   * @access private
   * @type Boolean
   */
  _enabled: false,

  /**
   * Enable or disable Cookie support.
   *
   * @access private
   * @param val {Boolean} true to enable, false to disable
   */
  setEnabled: function(val) {
    FB.Cookie._enabled = val;
  },

  /**
   * Return the current status of the cookie system.
   *
   * @access private
   * @returns {Boolean} true if Cookie support is enabled
   */
  getEnabled: function() {
    return FB.Cookie._enabled;
  },

  /**
   * Try loading the session from the Cookie.
   *
   * @access private
   * @return {Object} the session object from the cookie if one is found
   */
  load: function() {
    var
      // note, we have the opening quote for the value in the regex, but do
      // not have a closing quote. this is because the \b already handles it.
      cookie = document.cookie.match('\\bfbs_' + FB._apiKey + '="([^;]*)\\b'),
      session;

    if (cookie) {
      // url encoded session stored as "sub-cookies"
      session = FB.QS.decode(cookie[1]);
      // decodes as a string, convert to a number
      session.expires = parseInt(session.expires, 10);
      // capture base_domain for use when we need to clear
      FB.Cookie._domain = session.base_domain;
    }

    return session;
  },

  /**
   * Helper function to set cookie value.
   *
   * @access private
   * @param val    {String} the string value (should already be encoded)
   * @param ts     {Number} a unix timestamp denoting expiry
   * @param domain {String} optional domain for cookie
   */
  setRaw: function(val, ts, domain) {
    document.cookie =
      'fbs_' + FB._apiKey + '="' + val + '"' +
      (val && ts == 0 ? '' : '; expires=' + new Date(ts * 1000).toGMTString()) +
      '; path=/' +
      (domain ? '; domain=.' + domain : '');

    // capture domain for use when we need to clear
    FB.Cookie._domain = domain;
  },

  /**
   * Set the cookie using the given session object.
   *
   * @access private
   * @param session {Object} the session object
   */
  set: function(session) {
    session
      ? FB.Cookie.setRaw(
          FB.QS.encode(session),
          session.expires,
          session.base_domain)
      : FB.Cookie.clear();
  },

  /**
   * Clear the cookie.
   *
   * @access private
   */
  clear: function() {
    FB.Cookie.setRaw('', 0, FB.Cookie._domain);
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * JavaScript library providing Facebook Connect integration.
 *
 * @provides fb.init
 * @requires fb.prelude
 *           fb.api
 *           fb.auth
 *           fb.cookie
 *           fb.ui
 *           fb.xd
 */

/**
 * This is the top level for all the public APIs.
 *
 * @class FB
 * @static
 * @access public
 */
FB.provide('', {
  /**
   * Initialize the library.
   *
   * The minimal you'll need is:
   *
   *      <div id="fb-root"></div>
   *      <script src="http://static.ak.fbcdn.net/connect/en_US/core.js"></script>
   *      <script>
   *        FB.init({ apiKey: 'YOUR API KEY' });
   *      </script>
   *
   * The best place to put this code is right before the closing
   * `</body>` tag.
   *
   *
   * **Options**:
   *
   * Property | Type    | Description                      | Argument     | Default
   * -------- | ------- | -------------------------------- | ------------ | -------
   * apiKey   | String  | Your application API key.        | **Required** |
   * cookie   | Boolean | `true` to enable cookie support. | *Optional*   | `false`
   * logging  | Boolean | `false` to disable logging.      | *Optional*   | `true`
   * session  | Object  | Use specified session object.    | *Optional*   | `null`
   * status   | Boolean | `true` to fetch fresh status.    | *Optional*   | `false`
   *
   * **Note**: [FB.publish][publish] and [FB.share][share] can be used without
   * registering an application or calling this method. If you are using an API
   * key, all methods **must** be called after this method.
   *
   * [publish]: /docs/?u=facebook.jslib-alpha.FB.publish
   * [share]: /docs/?u=facebook.jslib-alpha.FB.share
   *
   * @access public
   * @param options {Object} options
   */
  init: function(options) {
    if (!options || !options.apiKey) {
      FB.log('FB.init() called without an apiKey.');
      return;
    }

    // only need to list values here that do not already have a falsy default.
    // this is why cookie/session/status are not listed here.
    FB.copy(options, {
      logging: true
    });

    FB._apiKey = options.apiKey;

    // disable logging if told to do so, but only if the url doesnt have the
    // token to turn it on. this allows for easier debugging of third party
    // sites even if logging has been turned off.
    if (!options.logging &&
        window.location.toString().indexOf('fb_debug=1') < 0) {
      FB._logging = false;
    }

    // enable cookie support if told to do so
    FB.Cookie.setEnabled(options.cookie);

    // if an explicit session was not given, try to _read_ an existing cookie.
    // we dont enable writing automatically, but we do read automatically.
    options.session = options.session || FB.Cookie.load();

    // set the session
    FB.Auth.setSession(options.session,
                       options.session ? 'connected' : 'unknown');

    // load a fresh session if requested
    if (options.status) {
      FB.getLoginStatus();
    }
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @provides fb.event
 * @requires fb.prelude
 */

/**
 * General event interface provides fire, subscribe, unsubscribe methods.
 * Global events are accessed via the [[joey:FB.Event]] object. This also
 * supports events on specific objects that derive from FB.EventProvider.
 *
 * @class FB.EventProvider
 * @private
 * @static
 */
FB.provide('EventProvider', {
  /**
   * Returns the internal subscriber array that can be directly manipulated by
   * adding/removing things.
   *
   * @access private
   * @return {Object}
   */
  subscribers: function() {
    // this odd looking logic is to allow instances to lazily have a map of
    // their events. if subscribers were an object literal itself, we would
    // have issues with instances sharing the subscribers when its being used
    // in a mixin style.
    if (!this._subscribersMap) {
      this._subscribersMap = {};
    }
    return this._subscribersMap;
  },

  /**
   * Bind an event handler to a given event name.
   *
   * For example, suppose you want to get notified whenever the session
   * changes:
   *
   *     FB.Event.subscribe('auth.sessionChange', function(response) {
   *       // do something with response.session
   *     });
   *
   * @access public
   * @param name {String} name of the event
   * @param cb {Function} the handler function
   */
  subscribe: function(name, cb) {
    var subs = this.subscribers();

    if (!subs[name]) {
      subs[name] = [cb];
    } else {
      subs[name].push(cb);
    }
  },

  /**
   * Removes subscribers, inverse of [FB.Event.subscribe][subscribe].
   *
   * Removing a subscriber is basically the same as adding one. You need to
   * pass the same event name and function to unsubscribe that you passed into
   * subscribe. If we use a similar example to [FB.Event.subscribe][subscribe],
   * we get:
   *
   *     var onSessionChange = function(response) {
   *       // do something with response.session
   *     };
   *     FB.Event.subscribe('auth.sessionChange', onSessionChange);
   *
   *     // sometime later in your code you dont want to get notified anymore
   *     FB.Event.unsubscribe('auth.sessionChange', onSessionChange);
   *
   * [subscribe]: /docs/?u=facebook.jslib-alpha.FB.Event.subscribe
   *
   * @access public
   * @param name {String} name of the event
   * @param cb {Function} the handler function
   */
  unsubscribe: function(name, cb) {
    var subs = this.subscribers();

    if (subs[name]) {
      for (var i=0, l=subs[name].length; i<l; i++) {
        if (subs[name][i] == cb) {
          subs[name][i] = null;
        }
      }
    }
  },

  /**
   * Repeatedly listen for an event over time. The callback is invoked
   * immediately when monitor is called, and then every time the event
   * fires. The subscription is canceled when the callback returns true.
   *
   * @param {string} name Name of event.
   * @param {function} callback A callback function. Any additional arguments
   * to monitor() will be passed on to the callback. When the callback returns
   * true, the monitoring will cease.
   */
  monitor: function(name, callback) {
    if (!callback()) {
      var
        ctx = this,
        fn = function() {
          if (callback.apply(callback, arguments)) {
            // unsubscribe
            ctx.unsubscribe(name, fn);
          }
        };

      this.subscribe(name, fn);
    }
  },

  /**
   * Removes all subscribers for named event.
   *
   * You need to pass the same event name that was passed to FB.Event.subscribe.
   * This is useful if the event is no longer worth listening to and you
   * believe that multiple subscribers have been set up.
   *
   * @access public
   * @param name    {String}   name of the event
   */
  clear: function(name) {
    var subs = this.subscribers();

    if (subs[name]) {
      for (var i=0, l=subs[name].length; i<l; i++) {
        subs[name][i] = null;
      }
    }
  },

  /**
   * Fires a named event. The first argument is the name, the rest of the
   * arguments are passed to the subscribers.
   *
   * @access private
   * @param name {String} the event name
   */
  fire: function() {
    var
      args        = Array.prototype.slice.call(arguments),
      name        = args.shift(),
      subscribers = this.subscribers()[name],
      sub;

    // no subscribers, boo
    if (!subscribers) {
      return;
    }

    for (var i=0, l=subscribers.length; i<l; i++) {
      sub = subscribers[i];
      // this is because we null out unsubscribed rather than jiggle the array
      if (sub) {
        sub.apply(this, args);
      }
    }
  }
});

/**
 * Event handling mechanism for globally named events.
 *
 * @class FB.Event
 * @extends FB.EventProvider
 */
FB.provide('Event', FB.EventProvider);
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @provides fb.flash
 * @requires fb.prelude
 *           fb.qs
 *           fb.content
 */

/**
 * Flash Support.
 *
 * @class FB.Flash
 * @static
 * @access private
 */
FB.provide('Flash', {
  //
  // DYNAMIC DATA
  //
  _minVersions: [
    [9,  0, 159, 0 ],
    [10, 0, 22,  87]
  ],
  _swfPath: 'swf/XdComm.swf',

  /**
   * The onReady callbacks.
   *
   * @access private
   * @type Array
   */
  _callbacks: [],

  /**
   * Initialize the SWF.
   *
   * @access private
   */
  init: function() {
    // only initialize once
    if (FB.Flash._init) {
      return;
    }
    FB.Flash._init = true;

    // the SWF calls this global function to notify that its ready
    // FIXME: should allow the SWF to take a flashvar that controls the name
    // of this function. we should not have any globals other than FB.
    window.FB_OnFlashXdCommReady = function() {
      FB.Flash._ready = true;
      for (var i=0, l=FB.Flash._callbacks.length; i<l; i++) {
        FB.Flash._callbacks[i]();
      }
      FB.Flash._callbacks = [];
    };

    // create the swf
    var
      IE   = !!document.attachEvent,
      swf  = FB._domain.cdn + FB.Flash._swfPath,
      html = (
        '<object ' +
          'type="application/x-shockwave-flash" ' +
          'id="XdComm" ' +
          (IE ? 'name="XdComm" ' : '') +
          (IE ? '' : 'data="' + swf + '" ') +
          (IE
              ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '
              : ''
          ) +
          'allowscriptaccess="always">' +
          '<param name="movie" value="' + swf + '"></param>' +
          '<param name="allowscriptaccess" value="always"></param>' +
        '</object>'
      );

    FB.Content.appendHidden(html);
  },

  /**
   * Check that the minimal version of Flash we need is available.
   *
   * @access private
   * @return {Boolean} true if the minimum version requirements are matched
   */
  hasMinVersion: function() {
    if (typeof FB.Flash._hasMinVersion === 'undefined') {
      var
        versionString,
        i,
        l,
        version = [];
      try {
        versionString = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                          .GetVariable('$version');
      } catch(x) {
        if (navigator.mimeTypes.length > 0) {
          var mimeType = 'application/x-shockwave-flash';
          if (navigator.mimeTypes[mimeType].enabledPlugin) {
            var name = 'Shockwave Flash';
            versionString = (navigator.plugins[name + ' 2.0'] ||
                             navigator.plugins[name])
                            .description;
          }
        }
      }

      // take the string and come up with an array of integers:
      //   [10, 0, 22]
      if (versionString) {
        var parts = versionString
                      .replace(/\D+/g, ',')
                      .match(/^,?(.+),?$/)[1]
                      .split(',');
        for (i=0, l=parts.length; i<l; i++) {
          version.push(parseInt(parts[i], 10));
        }
      }

      // start by assuming we dont have the min version.
      FB.Flash._hasMinVersion = false;

      // look through all the allowed version definitions.
      majorVersion:
      for (i=0, l=FB.Flash._minVersions.length; i<l; i++) {
        var spec = FB.Flash._minVersions[i];

        // we only accept known major versions, and every supported major
        // version has at least one entry in _minVersions. only if the major
        // version matches, does the rest of the check make sense.
        if (spec[0] != version[0]) {
          continue;
        }

        // the rest of the version components must be equal or higher
        for (var m=1, n=spec.length, o=version.length; (m<n && m<o); m++) {
          if (version[m] < spec[m]) {
            // less means this major version is no good
            FB.Flash._hasMinVersion = false;
            continue majorVersion;
          } else {
            FB.Flash._hasMinVersion = true;
            if (version[m] > spec[m]) {
              // better than needed
              break majorVersion;
            }
          }
        }
      }
    }

    return FB.Flash._hasMinVersion;
  },

  /**
   * Register a function that needs to ensure Flash is ready.
   *
   * @access private
   * @param cb {Function} the function
   */
  onReady: function(cb) {
    FB.Flash.init();
    if (FB.Flash._ready) {
      // this forces the cb to be asynchronous to ensure no one relies on the
      // _potential_ synchronous nature.
      window.setTimeout(cb, 0);
    } else {
      FB.Flash._callbacks.push(cb);
    }
  },

  /**
   * Custom decoding to workaround bug in flash's ExternInterface
   * Code is from Dojo's library.
   *
   * FIXME should check if encodeURIComponent can be used instead.
   *
   * @param  {String} data
   * @return  String
   */
  decode: function(data) {
    // wierdly enough, Flash sometimes returns the result as an
    // 'object' that is actually an array, rather than as a String;
    // detect this by looking for a length property; for IE
    // we also make sure that we aren't dealing with a typeof string
    // since string objects have length property there
    if (data && data.length && typeof data != 'string') {
      data = data[0];
    }

    if (!data || typeof data != 'string') {
      return data;
    }

    // certain XMLish characters break Flash's wire serialization for
    // ExternalInterface; these are encoded on the
    // DojoExternalInterface side into a custom encoding, rather than
    // the standard entity encoding, because otherwise we won't be able to
    // differentiate between our own encoding and any entity characters
    // that are being used in the string itself
    data = data.replace(/\&custom_lt\;/g, '<');
    data = data.replace(/\&custom_gt\;/g, '>');
    data = data.replace(/\&custom_backslash\;/g, '\\');

    // needed for IE; \0 is the NULL character
    data = data.replace(/\\0/g, "\0");
    return data;
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @provides fb.frames
 * @requires fb.prelude
 *           fb.content
 *           fb.qs
 *           fb.xd
 *           fb.json2
 */

/**
 * Browser Frames: Popup Windows, Iframe Dialogs and Hidden Iframes.
 *
 * @class FB.Frames
 * @static
 * @access private
 */
FB.provide('Frames', {
  _monitor     : null,
  _count       : 0,
  _active      : {},
  _defaultCb   : {},
  _resultToken : '"xxRESULTTOKENxx"',

  /**
   * Builds and inserts a hidden iframe with the reference stored against the
   * given id.
   *
   * @access private
   * @param url {String} the URL for the iframe
   * @param id  {String} the id to store the node against in _active
   */
  hidden: function(url, id) {
    FB.Content.insertIframe({
      url: url,
      root: FB.Content.appendHidden(''),
      onload: function(node) {
        FB.Frames._active[id] = node;
      }
    });
  },

  /**
   * Open a popup window with the given url and dimensions and place it at the
   * center of the current window.
   *
   * @access private
   * @param url    {String}  the url for the popup
   * @param width  {Integer} the initial width for the popup
   * @param height {Integer} the initial height for the popup
   * @param id     {String}  the id to store the window against in _active
   */
  popup: function(url, width, height, id) {
    // we try to place it at the center of the current window
    var
      screenX    = typeof window.screenX      != 'undefined'
        ? window.screenX
        : window.screenLeft,
      screenY    = typeof window.screenY      != 'undefined'
        ? window.screenY
        : window.screenTop,
      outerWidth = typeof window.outerWidth   != 'undefined'
        ? window.outerWidth
        : document.body.clientWidth,
      outerHeight = typeof window.outerHeight != 'undefined'
        ? window.outerHeight
        : (document.body.clientHeight - 22),
      left     = parseInt(screenX + ((outerWidth - width) / 2), 10),
      top      = parseInt(screenY + ((outerHeight - height) / 2.5), 10),
      features = (
        'width=' + width +
        ',height=' + height +
        ',left=' + left +
        ',top=' + top
      );

    FB.Frames._active[id] = window.open(url, '_blank', features);

    // if there's a default close action, setup the monitor for it
    if (id in FB.Frames._defaultCb) {
      FB.Frames._count++;
      FB.Frames.popupMonitor();
    }
  },

  /**
   * Start and manage the window monitor interval. This allows us to invoke
   * the default callback for a window when the user closes the window
   * directly.
   *
   * @access private
   */
  popupMonitor: function() {
    // shutdown if we have nothing to monitor
    if (FB.Frames._count < 1) {
      window.clearInterval(FB.Frames._monitor);
      FB.Frames._monitor = null;
      return;
    }

    // start the monitor if its not already running
    if (!FB.Frames._monitor) {
      FB.Frames._monitor = window.setInterval(FB.Frames.popupMonitor, 100);
    }

    // check all open windows
    for (var id in FB.Frames._active) {
      // ignore prototype properties, and ones without a default callback
      if (FB.Frames._active.hasOwnProperty(id) && id in FB.Frames._defaultCb) {
        var win = FB.Frames._active[id];

        // ignore iframes
        try {
          if (win.tagName) {
            // is an iframe, we're done
            continue;
          }
        } catch (x) {
          // probably a permission error
        }

        try {
          // found a closed window
          if (win.closed) {
            FB.Frames._count--;
            FB.Frames.xdRecv({ frame: id }, FB.Frames._defaultCb[id]);
          }
        } catch(y) {
          // probably a permission error
        }
      }
    }
  },


  /**
   * A "frame handler" is a specialized XD handler that will also close the
   * frame. This can be a hidden iframe, iframe dialog or a popup window.
   *
   * @access private
   * @param cb        {Function} the callback function
   * @param frame     {String}   frame id for the callback will be used with
   * @param relation  {String}   parent or opener to indicate window relation
   * @param isDefault {Boolean}  is this the default callback for the frame
   * @return         {String}   the xd url bound to the callback
   */
  xdHandler: function(cb, frame, relation, isDefault) {
    if (isDefault) {
      FB.Frames._defaultCb[frame] = cb;
    }

    return FB.XD.handler(function(data) {
      FB.Frames.xdRecv(data, cb);
    }, relation) + '&frame=' + frame;
  },

  /**
   * Handles the parsed message, invokes the bound callback with the data
   * and removes the related window/frame.
   *
   * @access private
   * @param data {Object} the message parameters
   */
  xdRecv: function(data, cb) {
    var frame = FB.Frames._active[data.frame];

    // iframe
    try {
      if (frame.tagName) {
        // timeout of 500 prevents the safari forever waiting bug if we end
        // up using this for visible iframe dialogs, the 500 would be
        // unacceptable
        window.setTimeout(function() {
                            frame.parentNode.removeChild(frame);
                          }, 500);
      }
    } catch (x) {
      // do nothing, permission error
    }

    // popup window
    try {
      if (frame.close) {
        frame.close();
      }
    } catch (y) {
      // do nothing, permission error
    }

    // cleanup and fire
    delete FB.Frames._active[data.frame];
    delete FB.Frames._defaultCb[data.frame];
    cb(data);
  },

  /**
   * Some Facebook redirect URLs use a special ``xxRESULTTOKENxx`` to return
   * custom values. This is a convenience function to wrap a callback that
   * expects this value back.
   *
   * @access private
   * @param cb        {Function} the callback function
   * @param frame     {String}   the frame id for the callback is tied to
   * @param target    {String}   parent or opener to indicate window relation
   * @param isDefault {Boolean}  is this the default callback for the frame
   * @return         {String}   the xd url bound to the callback
   */
  xdResult: function(cb, frame, target, isDefault) {
    return (
      FB.Frames.xdHandler(function(params) {
        cb && cb(params.result &&
                 params.result != FB.Frames._resultToken &&
                 JSON.parse(params.result));
      }, frame, target, isDefault) +
      '&result=' + encodeURIComponent(FB.Frames._resultToken)
    );
  }
});
/**
 * Derived from http://pajhome.org.uk/crypt/md5/md5.html.
 * Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 * Copyright (c) 2009, Facebook
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *  * Neither the name Facebook nor the names of its contributors may be used to
 *    endorse or promote products derived from this software without specific
 *    prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *
 *
 * @provides fb.md5sum
 * @requires fb.prelude
 */

/**
 * Generate MD5 Sum for the given input string.
 *
 * @access private
 * @param input {String} the data
 * @return {String} the hex md5
 */
FB.md5sum = function(input) {
  // FLOW: input -> utf8 input -> bin input -> bin md5 -> utf8 md5 -> hex md5
  var
    hex_vocab = '0123456789abcdef',

    raw_input = '',
    raw_input_bits_len,
    bin_input,
    bin_md5,
    raw_md5 = '',
    hex_md5 = '',

    i = -1,
    x,
    y;


  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xFFFF);
  }

  // basic operations
  function cmn(q, a, b, x, s, t) {
    var num = safe_add(safe_add(a, q), safe_add(x, t));
    return safe_add((num << s) | (num >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }


  // encode string to utf-8
  while (++i < input.length) {
    /* decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* encode raw_input as utf-8 */
    if (x <= 0x7F) {
      raw_input += String.fromCharCode(x);
    } else if (x <= 0x7FF) {
      raw_input += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                       0x80 | ( x         & 0x3F));
    } else if (x <= 0xFFFF) {
      raw_input += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                       0x80 | ((x >>> 6 ) & 0x3F),
                                       0x80 | ( x         & 0x3F));
    } else if (x <= 0x1FFFFF) {
      raw_input += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                       0x80 | ((x >>> 12) & 0x3F),
                                       0x80 | ((x >>> 6 ) & 0x3F),
                                       0x80 | ( x         & 0x3F));
    }
  }


  // number of bits in the raw utf-8 string
  raw_input_bits_len = raw_input.length * 8;


  // string to little-endian array words
  bin_input = Array(raw_input.length >> 2);
  for (i = 0; i < bin_input.length; i++) {
    bin_input[i] = 0;
  }
  for (i = 0; i < raw_input_bits_len; i += 8) {
    bin_input[i>>5] |= (raw_input.charCodeAt(i / 8) & 0xFF) << (i%32);
  }


  // calculate md5 as little-endian array words
  // padding
  bin_input[raw_input_bits_len >> 5] |= 0x80 << ((raw_input_bits_len) % 32);
  bin_input[(((raw_input_bits_len + 64) >>> 9) << 4) + 14] = raw_input_bits_len;

  var
    a =  1732584193,
    b = -271733879,
    c = -1732584194,
    d =  271733878;

  for (i = 0; i < bin_input.length; i += 16) {
    var
      olda = a,
      oldb = b,
      oldc = c,
      oldd = d;

    a = ff(a, b, c, d, bin_input[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, bin_input[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, bin_input[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, bin_input[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, bin_input[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, bin_input[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, bin_input[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, bin_input[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, bin_input[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, bin_input[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, bin_input[i+10], 17, -42063);
    b = ff(b, c, d, a, bin_input[i+11], 22, -1990404162);
    a = ff(a, b, c, d, bin_input[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, bin_input[i+13], 12, -40341101);
    c = ff(c, d, a, b, bin_input[i+14], 17, -1502002290);
    b = ff(b, c, d, a, bin_input[i+15], 22,  1236535329);

    a = gg(a, b, c, d, bin_input[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, bin_input[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, bin_input[i+11], 14,  643717713);
    b = gg(b, c, d, a, bin_input[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, bin_input[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, bin_input[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, bin_input[i+15], 14, -660478335);
    b = gg(b, c, d, a, bin_input[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, bin_input[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, bin_input[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, bin_input[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, bin_input[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, bin_input[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, bin_input[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, bin_input[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, bin_input[i+12], 20, -1926607734);

    a = hh(a, b, c, d, bin_input[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, bin_input[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, bin_input[i+11], 16,  1839030562);
    b = hh(b, c, d, a, bin_input[i+14], 23, -35309556);
    a = hh(a, b, c, d, bin_input[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, bin_input[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, bin_input[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, bin_input[i+10], 23, -1094730640);
    a = hh(a, b, c, d, bin_input[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, bin_input[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, bin_input[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, bin_input[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, bin_input[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, bin_input[i+12], 11, -421815835);
    c = hh(c, d, a, b, bin_input[i+15], 16,  530742520);
    b = hh(b, c, d, a, bin_input[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, bin_input[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, bin_input[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, bin_input[i+14], 15, -1416354905);
    b = ii(b, c, d, a, bin_input[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, bin_input[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, bin_input[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, bin_input[i+10], 15, -1051523);
    b = ii(b, c, d, a, bin_input[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, bin_input[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, bin_input[i+15], 10, -30611744);
    c = ii(c, d, a, b, bin_input[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, bin_input[i+13], 21,  1309151649);
    a = ii(a, b, c, d, bin_input[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, bin_input[i+11], 10, -1120210379);
    c = ii(c, d, a, b, bin_input[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, bin_input[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  bin_md5 = [a, b, c, d];


  // little-endian array words to a string
  for (i = 0; i < bin_md5.length * 32; i += 8) {
    raw_md5 += String.fromCharCode((bin_md5[i>>5] >>> (i % 32)) & 0xFF);
  }


  // convert the raw md5 string to a hex md5 string
  for (i = 0; i < raw_md5.length; i++) {
    x = raw_md5.charCodeAt(i);
    hex_md5 += hex_vocab.charAt((x >>> 4) & 0x0F) + hex_vocab.charAt(x & 0x0F);
  }


  return hex_md5;
};
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @provides fb.qs
 * @requires fb.prelude
 */

/**
 * Query String encoding & decoding.
 *
 * @class FB.QS
 * @static
 * @access private
 */
FB.provide('QS', {
  /**
   * Encode parameters to a query string.
   *
   * @access private
   * @param   params {Object}  the parameters to encode
   * @param   sep    {String}  the separator string (defaults to '&')
   * @param   encode {Boolean} indicate if the key/value should be URI encoded
   * @return        {String}  the query string
   */
  encode: function(params, sep, encode) {
    sep    = sep === undefined ? '&' : sep;
    encode = encode === false ? function(s) { return s; } : encodeURIComponent;

    var pairs = [];
    FB.forEach(params, function(val, key) {
      if (val !== null && typeof val != 'undefined') {
        pairs.push(encode(key) + '=' + encode(val));
      }
    });
    pairs.sort();
    return pairs.join(sep);
  },

  /**
   * Decode a query string into a parameters object.
   *
   * @access private
   * @param   str {String} the query string
   * @return     {Object} the parameters to encode
   */
  decode: function(str) {
    var
      decode = decodeURIComponent,
      params = {},
      parts  = str.split('&'),
      i,
      pair;

    for (i=0; i<parts.length; i++) {
      pair = parts[i].split('=', 2);
      if (pair && pair[0]) {
        params[decode(pair[0])] = decode(pair[1]);
      }
    }

    return params;
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @provides fb.ui
 * @requires fb.prelude
 *           fb.qs
 *           fb.frames
 *           fb.json2
 */

/**
 * UI Calls.
 *
 * @class FB
 * @static
 * @access private
 */
FB.provide('', {
  /**
   * Sharing is the light weight way of distributing your content. As opposed
   * to the structured data explicitly given in the [FB.publish][publish] call,
   * with share you simply provide the URL and optionally a title:
   *
   *      FB.share(
   *        'http://github.com/facebook/connect-js',
   *        'Connect JavaScript SDK'
   *      );
   *
   * Both arguments are optional, and just calling [FB.share][share] will share
   * the current page.
   *
   * This call can be used without requiring the user to sign in.
   *
   * [publish]: /docs/?u=facebook.jslib-alpha.FB.publish
   * [share]: /docs/?u=facebook.jslib-alpha.FB.share
   *
   * @access public
   * @param u {String} the url (defaults to current URL)
   * @param title {String} a custom title
   */
  share: function(u, title) {
    var
      url = FB._domain.www + 'sharer.php?' + FB.QS.encode({
        title : title,
        u     : u || window.location.toString()
      });

    FB.Frames.popup(url, 575, 380);
  },

  /**
   * Publish a post to the stream.
   *
   * This is the main, fully featured distribution mechanism for you
   * to publish into the user's stream. It can be used, with or
   * without an API key. With an API key you can control the
   * Application Icon and get attribution. You must also do this if
   * you wish to use the callback to get notified of the `post_id`
   * and the `message` the user typed in the published post, or find
   * out if the user did not publish (clicked on the skipped button).
   *
   * Publishing is a powerful feature that allows you to submit rich
   * media and provide a integrated experience with control over your
   * stream post. You can guide the user by choosing the prompt,
   * and/or a default message which they may customize. In addition,
   * you may provide image, video, audio or flash based attachments
   * with along with their metadata. You also get the ability to
   * provide action links which show next to the "Like" and "Comment"
   * actions. All this together provides you full control over your
   * stream post. In addition, if you may also specify a target for
   * the story, such as another user or a page.
   *
   * A post may contain the following properties:
   *
   * Property            | Type   | Description
   * ------------------- | ------ | --------------------------------------
   * message             | String | This allows prepopulating the message.
   * attachment          | Object | An [[wiki:Attachment (Streams)]] object.
   * action_links        | Array  | An array of [[wiki:Action Links]].
   * actor_id            | String | A actor profile/page id.
   * target_id           | String | A target profile id.
   * user_message_prompt | String | Custom prompt message.
   *
   * The post and all the parameters are optional, so use what is best
   * for your specific case.
   *
   * Example:
   *
   *     var post = {
   *       message: 'getting educated about Facebook Connect',
   *       attachment: {
   *         name: 'Facebook Connect JavaScript SDK',
   *         description: (
   *           'A JavaScript library that allows you to harness ' +
   *           'the power of Facebook, bringing the user\'s identity, ' +
   *           'social graph and distribution power to your site.'
   *         ),
   *         href: 'http://github.com/facebook/connect-js'
   *       },
   *       action_links: [
   *         {
   *           text: 'SDK Console',
   *           href: 'http://developers.facebook.com/connect/console.php'
   *         },
   *         {
   *           text: 'GitHub Repo',
   *           href: 'http://github.com/facebook/connect-js'
   *         },
   *       ],
   *       user_message_prompt: 'Share your thoughts about Facebook Connect'
   *     };
   *
   *     FB.publish(
   *       post,
   *       function(published_post) {
   *         if (published_post) {
   *           alert(
   *             'The post was successfully published. ' +
   *             'Post ID: ' + published_post.post_id +
   *             '. Message: ' + published_post.message
   *           );
   *         } else {
   *           alert('The post was not published.');
   *         }
   *       }
   *     );
   *
   * @access public
   * @param post {Object} the post object
   * @param cb {Function} called with the result of the action
   */
  publish: function(post, cb) {
    // YUCK
    if (cb) {
      var old_cb = cb;
      cb = function(result) {
        if (result) {
          if (result.postId) {
            result = {
              message: result.data.user_message,
              post_id: result.postId
            };
          } else {
            result = null;
          }
        }
        old_cb(result);
      };
    }

    post = post || {};
    var
      g   = FB._apiKey && FB.guid(),
      url = FB._domain.www + 'connect/prompt_feed.php?' + FB.QS.encode({
        action_links        : JSON.stringify(post.action_links || {}),
        actor_id            : post.actor_id,
        api_key             : FB._apiKey,
        attachment          : JSON.stringify(post.attachment || {}),
        callback            : g && FB.Frames.xdResult(cb, g, 'opener', true),
        message             : post.message,
        preview             : 1,
        session_key         : FB._session && FB._session.session_key,
        target_id           : post.target_id,
        user_message_prompt : post.user_message_prompt
      });

    FB.Frames.popup(url, 550, 242, g);
  },

  /**
   * Prompt the user to add the given id as a friend.
   *
   * @access public
   * @param id {String} the id of the target user
   * @param cb {Function} called with the result of the action
   */
  addFriend: function(id, cb) {
    var
      g   = FB.guid(),
      url = FB._domain.www + 'addfriend.php?' + FB.QS.encode({
        api_key     : FB._apiKey,
        display     : 'dialog',
        id          : id,
        next        : FB.Frames.xdResult(cb, g, 'opener', true),
        session_key : FB._session.session_key
      });

    FB.Frames.popup(url, 565, 240, g);
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * @provides fb.xd
 * @requires fb.prelude
 *           fb.qs
 *           fb.flash
 */

/**
 * The cross domain communication layer.
 *
 * @class FB.XD
 * @static
 * @access private
 */
FB.provide('XD', {
  _origin    : null,
  _transport : null,
  _callbacks : {},
  _forever   : {},

  /**
   * Initialize the XD layer. Native postMessage or Flash is required.
   *
   * @access private
   */
  init: function() {
    // only do init once, if this is set, we're already done
    if (FB.XD._origin) {
      return;
    }

    // We currently disable postMessage in IE8 because it does not work with
    // window.opener. We can probably be smarter about it.
    if (window.addEventListener && window.postMessage) {
      // The origin here is used for postMessage security. It needs to be based
      // on the URL of the current window. It is required and validated by
      // Facebook as part of the xd_proxy.php.
      FB.XD._origin = (window.location.protocol + '//' +
                       window.location.host + '/' + FB.guid());
      FB.XD.PostMessage.init();
      FB.XD._transport = 'postmessage';
    } else if (FB.Flash.hasMinVersion()) {
      // The origin here is used for Flash XD security. It needs to be based on
      // document.domain rather than the URL of the current window. It is
      // required and validated by Facebook as part of the xd_proxy.php.
      FB.XD._origin = (window.location.protocol + '//' + document.domain +
                       '/' + FB.guid());
      FB.XD.Flash.init();
      FB.XD._transport = 'flash';
    } else {
      FB.XD._transport = 'fragment';
    }
  },

  /**
   * Builds a url attached to a callback for xd messages.
   *
   * This is one half of the XD layer. Given a callback function, we generate
   * a xd URL which will invoke the function. This allows us to generate
   * redirect urls (used for next/cancel and so on) which will invoke our
   * callback functions.
   *
   * @access private
   * @param cb       {Function} the callback function
   * @param relation {String}   parent or opener to indicate window relation
   * @param forever  {Boolean}  indicate this handler needs to live forever
   * @return        {String}   the xd url bound to the callback
   */
  handler: function(cb, relation, forever) {
    FB.XD.init();

    // the ?=& tricks login.php into appending at the end instead
    // of before the fragment as a query string
    // FIXME
    var
      xdProxy = FB._domain.cdn + 'connect/xd_proxy.php#?=&',
      id = FB.guid();

    // in fragment mode, the url is the current page and a fragment with a
    // magic token
    if (FB.XD._transport == 'fragment') {
      xdProxy = window.location.toString();
      var poundIndex = xdProxy.indexOf('#');
      if (poundIndex > 0) {
        xdProxy = xdProxy.substr(0, poundIndex);
      }
      // fb_xd_bust changes the url to prevent firefox from refusing to load
      // because it thinks its smarter than the developer and believes it to be
      // a recusive load. the rest are explanined in the note above.
      xdProxy += '?&fb_xd_bust#?=&' + FB.XD.Fragment._magic;
    }

    if (forever) {
      FB.XD._forever[id] = true;
    }

    FB.XD._callbacks[id] = cb;
    return xdProxy + FB.QS.encode({
      cb        : id,
      origin    : FB.XD._origin,
      relation  : relation || 'opener',
      transport : FB.XD._transport
    });
  },

  /**
   * Handles the raw or parsed message and invokes the bound callback with
   * the data and removes the related window/frame.
   *
   * @access private
   * @param data {String|Object} the message fragment string or parameters
   */
  recv: function(data) {
    if (typeof data == 'string') {
      data = FB.QS.decode(data);
    }

    var cb = FB.XD._callbacks[data.cb];
    if (!FB.XD._forever[data.cb]) {
      delete FB.XD._callbacks[data.cb];
    }
    cb && cb(data);
  },

  /**
   * Provides Native ``window.postMessage`` based XD support.
   *
   * @class FB.XD.PostMessage
   * @static
   * @for FB.XD
   * @access private
   */
  PostMessage: {
    /**
     * Initialize the native PostMessage system.
     *
     * @access private
     */
    init: function() {
      var H = FB.XD.PostMessage.onMessage;
      window.addEventListener
        ? window.addEventListener('message', H, false)
        : window.attachEvent('onmessage', H);
    },

    /**
     * Handles a message event.
     *
     * @access private
     * @param event {Event} the event object
     */
    onMessage: function(event) {
      FB.XD.recv(event.data);
    }
  },

  /**
   * Provides Flash Local Connection based XD support.
   *
   * @class FB.XD.Flash
   * @static
   * @for FB.XD
   * @access private
   */
  Flash: {
    /**
     * Initialize the Flash Local Connection.
     *
     * @access private
     */
    init: function() {
      FB.Flash.onReady(function() {
        document.XdComm.postMessage_init('FB.XD.Flash.onMessage',
                                         FB.XD._origin);
      });
    },

    /**
     * Handles a message received by the Flash Local Connection.
     *
     * @access private
     * @param message {String} the URI encoded string sent by the SWF
     */
    onMessage: function(message) {
      FB.XD.recv(decodeURIComponent(message));
    }
  },

  /**
   * Provides XD support via a fragment by reusing the current page.
   *
   * @class FB.XD.Fragment
   * @static
   * @for FB.XD
   * @access private
   */
  Fragment: {
    _magic: 'fb_xd_fragment;',

    /**
     * Check if the fragment looks like a message, and dispatch if it does.
     */
    checkAndDispatch: function() {
      var
        loc = window.location.toString(),
        fragment = loc.substr(loc.indexOf('#') + 1),
        magicIndex = fragment.indexOf(FB.XD.Fragment._magic);

      if (magicIndex > 0) {
        // make these no-op to help with performance
        //
        // this works independent of the module being present or not, or being
        // loaded before or after
        FB.init = FB.getLoginStatus = FB.api = function() {};

        // display none helps prevent loading of some stuff
        document.body.style.display = 'none';

        fragment = fragment.substr(magicIndex + FB.XD.Fragment._magic.length);
        var params = FB.QS.decode(fragment);
        // NOTE: only supporting opener, parent or top here. if needed, the
        // resolveRelation function from xd_proxy can be used to provide more
        // complete support.
        window[params.relation].FB.XD.recv(fragment);
      }
    }
  }
});

// NOTE: self executing code.
//
// if the page is being used for fragment based XD messaging, we need to
// dispatch on load without needing any API calls. it only does stuff if the
// magic token is found in the fragment.
FB.XD.Fragment.checkAndDispatch();
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.loader
 * @layer basic
 * @requires fb.component fb.array fb.dom fb.prelude
 */

/**
 * Dynamically load components by inserting a <script> tag. Dynamic
 * loading can be good if it will be occasionally used on a page,
 * and you don't know until runtime. However, it can be bad because
 * it tends to break packaging and caching mechanisms. Be careful
 * when choosing to dynamically load a component, and if a component
 * is dynamically loaded in common usage, then prefer to just load
 * directly.
 *
 * @class FB.Loader
 * @static
 * @private
 */
FB.provide('Loader', {
  /**
   * Use this to request dynamic loading of components in Facebook Client
   * JavaScript library.
   *
   * @param comp {String} a component
   * @param callback {Function} callback function to execute on completion
   */
  use: function(comp, callback) {
    var request = { comp: comp, cb: callback };

    // Check if request is already completed
    if (FB.Loader._check(comp)) {
      callback();
      return;
    }

    FB.Loader._reqs.push(request);
    FB.Loader._comps[comp] = true;

    // We use a timer trick to queue up multiple components requests
    // so we just need to send out a single script HTTP request
    if (!FB.Loader._timer) {
      FB.Loader._timer = setTimeout(function() {
        FB.Loader._timer = 0;
        FB.Dom.addScript(FB.Loader._resourceUrl(
                           FB.Array.keys(FB.Loader._comps),
                           FB.Array.keys(FB.Component.loaded)));
      }, 0);
    }
  },

  /**
   * Construct a URL that will load the requested components.
   *
   * @param {Array} included  list of strings specifying requirements
   * @param {Array} excluded  list of strings for components that
   *                          should be excluded (because already loaded)
   * @private
   */
 _resourceUrl: function(included, excluded) {
    return FB._domain.cdn +
     'dynamic_loader/' + // TODO: doesn't exist yet
     '?comps=' + included.join(',') +
     '&exclude=' + excluded.join(',');
  },

  _onCompLoaded: function() {
    var completed = [];
    FB.forEach(FB.Loader._reqs, function(req, i) {
      if (req && FB.Loader._check(req.comp)){
        completed.push([i, req.cb]);
      }
    });

    // First delete them from request query before calling
    // callback functions to prevent re-entrant calls
    FB.forEach(completed, function(item) {
      delete FB.Loader._reqs[item[0]];
    });


    // Now call the callbacks
    FB.forEach(completed, function(item) {
      item[1]();
    });
  },

  /**
   * Check if a comp if fullfilled
   * @return true if it is done
   */
  _check: function(comp) {
    return FB.Component.loaded[comp];
  },

  /*
   * Global state variables
   */
  _reqs : [],
  _comps: {}
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.array
 * @layer basic
 * @requires fb.prelude
 */

/**
 * Array related helper methods.
 *
 * @class FB.Array
 * @private
 * @static
 */
FB.provide('Array', {
  /**
   * Get index of item inside an array. Return's -1 if element is not found.
   *
   * @param arr {Array} Array to look through.
   * @param item {Object} Item to locate.
   * @return {Number} Index of item.
   */
  indexOf: function (arr, item) {
    if (arr.indexOf) {
      return arr.indexOf(item);
    }
    var length = arr.length;
    if (length) {
      for (var index = 0; index < length; index++) {
        if (arr[index] === item) {
          return index;
        }
      }
    }
    return -1;
  },

  /**
   * Merge items from source into target, but only if they dont exist. Returns
   * the target array back.
   *
   * @param target {Array} Target array.
   * @param source {Array} Source array.
   * @return {Array} Merged array.
   */
  merge: function(target, source) {
    for (var i=0; i < source.length; i++) {
      if (FB.Array.indexOf(target, (source[i])) < 0) {
        target.push(source[i]);
      }
    }
    return target;
  },

  /**
   * Create an new array from the given array and a filter function.
   *
   * @param arr {Array} Source array.
   * @param fn {Function} Filter callback function.
   * @return {Array} Filtered array.
   */
  filter: function(arr, fn) {
    var b = [];
    for (var i=0; i < arr.length; i++) {
      if (fn(arr[i])) {
        b.push(arr[i]);
      }
    }
    return b;
  },

  /**
   * Create an array from the keys in an object.
   *
   * Example: keys({'x': 2, 'y': 3'}) returns ['x', 'y']
   *
   * @param obj {Object} Source object.
   * @param proto {Boolean} Specify true to include inherited properties.
   * @return {Array} The array of keys.
   */
  keys: function(obj, proto) {
    var arr = [];
    for (var key in obj) {
      if (proto || obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  },

  /**
   * Create an array by performing transformation on the items in a source
   * array.
   *
   * @param arr {Array} Source array.
   * @param transform {Function} Transformation function.
   * @return {Array} The transformed array.
   */
  map: function(arr, transform) {
    var ret = [];
    for (var i=0; i < arr.length; i++) {
      ret.push(transform(arr[i]));
    }
    return ret;
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.string
 * @layer basic
 * @requires fb.prelude
 *
 */

/**
 * Utility function related to Strings.
 *
 * @class FB.String
 * @static
 * @private
 */
FB.provide('String', {
  /**
   * Strip leading and trailing whitespace.
   *
   * @param s {String} the string to trim
   * @returns {String} the trimmed string
   */
  trim: function(s) {
    return s.replace(/^\s*|\s*$/g, '');
  },

  /**
   * Format a string.
   *
   * Example:
   *     FB.String.format('{0}.facebook.com/{1}', 'www', 'login.php')
   * Returns:
   *     'www.facebook.com/login.php'
   *
   * Example:
   *     FB.String.format('foo {0}, {1}, {0}', 'x', 'y')
   * Returns:
   *     'foo x, y, x'
   *
   * @static
   * @param format {String} the format specifier
   * @param arguments {...} placeholder arguments
   * @returns {String} the formatted string
   */
  format: function(format) {
    if (!FB.String.format._formatRE) {
      FB.String.format._formatRE = /(\{[^\}^\{]+\})/g;
    }

    var values = arguments;

    return format.replace(
      FB.String.format._formatRE,
      function(str, m) {
        var
          index = parseInt(m.substr(1), 10),
          value = values[index + 1];
        if (value === null || value === undefined) {
          return '';
        }
        return value.toString();
      }
    );
  },

  /**
   * Escape an string so that it can be embedded inside another string
   * as quoted string.
   *
   * @param value {String} string to quote
   * @return {String} an quoted string
   */
  quote: function(value) {
    var
      quotes = /["\\\x00-\x1f\x7f-\x9f]/g,
      subst = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
      };

    return quotes.test(value) ?
      '"' + value.replace(quotes, function (a) {
        var c = subst[a];
        if (c) {
          return c;
        }
        c = a.charCodeAt();
        return '\\u00' + Math.floor(c/16).toString(16) + (c % 16).toString(16);
      }) + '"' :
      '"' + value + '"';
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.type
 * @layer basic
 * @requires fb.prelude
 */

/**
 * Provide Class/Type support.
 *
 * @class FB
 * @static
 */
FB.provide('', {
  /**
   * Bind a function to a given context and arguments.
   *
   * @static
   * @access private
   * @param fn {Function} the function to bind
   * @param context {Object} object used as context for function execution
   * @param {...} arguments additional arguments to be bound to the function
   * @returns {Function} the bound function
   */
  bind: function() {
    var
      args    = Array.prototype.slice.call(arguments),
      fn      = args.shift(),
      context = args.shift();
    return function() {
      return fn.apply(
        context,
        args.concat(Array.prototype.slice.call(arguments))
      );
    };
  },

  /**
   * Create a new class.
   *
   * Note: I have to use 'Class' instead of 'class' because 'class' is
   * a reserved (but unused) keyword.
   *
   * @access private
   * @param name {string} class name
   * @param constructor {function} class constructor
   * @param proto {object} instance methods for class
   */
  Class: function(name, constructor, proto) {
    if (FB.CLASSES[name]) {
      return FB.CLASSES[name];
    }

    var newClass = constructor ||  function() {};

    newClass.prototype = proto;
    newClass.prototype.bind = function(fn) {
      return FB.bind(fn, this);
    };

    newClass.prototype.constructor = newClass;
    FB.create(name, newClass);
    FB.CLASSES[name] = newClass;
    return newClass;
  },

  /**
   * Create a subclass
   *
   * Note: To call base class constructor, use this._base(...).
   * If you override a method 'foo' but still want to call
   * the base class's method 'foo', use this._callBase('foo', ...)
   *
   * @access private
   * @param {string} name class name
   * @param {string} baseName,
   * @param {function} constructor class constructor
   * @param {object} proto instance methods for class
   */
  subclass: function(name, baseName, constructor, proto) {
    if (FB.CLASSES[name]) {
      return FB.CLASSES[name];
    }
    var base = FB.create(baseName);
    FB.copy(proto, base.prototype);
    proto._base = base;
    proto._callBase = function(method) {
      var args = Array.prototype.slice.call(arguments, 1);
      return base.prototype[method].apply(this, args);
    };

    return FB.Class(
      name,
      constructor ? constructor : function() {
        if (base.apply) {
          base.apply(this, arguments);
        }
      },
      proto
    );
  },

  CLASSES: {}
});

/**
 * @class FB.Type
 * @static
 * @private
 */
FB.provide('Type', {
  isType: function(obj, type) {
    while (obj) {
      if (obj.constructor === type || obj === type) {
        return true;
      } else {
        obj = obj._base;
      }
    }
    return false;
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.dom
 * @layer basic
 * @requires fb.prelude fb.string fb.array
 */

/**
 * This provides helper methods related to DOM.
 *
 * @class FB.Dom
 * @static
 * @private
 */
FB.provide('Dom', {
  /**
   * Check if the element contains a class name.
   *
   * @param dom {DOMElement} the element
   * @param className {String} the class name
   * @return {Boolean}
   */
  containsCss: function(dom, className) {
    var cssClassWithSpace = ' ' + dom.className + ' ';
    return cssClassWithSpace.indexOf(' ' + className + ' ') >= 0;
  },

  /**
   * Add a class to a element.
   *
   * @param dom {DOMElement} the element
   * @param className {String} the class name
   */
  addCss: function(dom, className) {
    if (!FB.Dom.containsCss(dom, className)) {
      dom.className = dom.className + ' ' + className;
    }
  },

  /**
   * Remove a class from the element.
   *
   * @param dom {DOMElement} the element
   * @param className {String} the class name
   */
  removeCss: function(dom, className) {
    if (FB.Dom.containsCss(dom, className)) {
      dom.className = dom.className.replace(className, '');
      FB.Dom.removeCss(dom, className); // in case of repetition
    }
  },

  /**
   * Dynamically add a script tag.
   *
   * @param src {String} the url for the script
   */
  addScript: function(src) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;
    return document.getElementsByTagName('HEAD')[0].appendChild(script);
  },

  /**
   * Add CSS rules using a <style> tag.
   *
   * @param styles {String} the styles
   * @param id {String} an identifier for this set of styles
   */
  addCssRules: function(styles, id) {
    //TODO idea, use the md5 of the styles as the id
    if (!FB.Dom._cssRules) {
      FB.Dom._cssRules = {};
    }

    // Check if this style sheet is already applied
    if (id in FB.Dom._cssRules) {
      return;
    }

    FB.Dom._cssRules[id] = true;

    var style;
    if (FB.Dom.getBrowserType() != 'ie') {
      style = document.createElement('style');
      style.type = "text/css";
      style.innerHTML = styles;
      document.getElementsByTagName('HEAD')[0].appendChild(style);
    } else {
      var
        re = /([\w|#|\.|\\][^{]*){(.*?)}/mg,
        a;
      style = document.createStyleSheet();
      while (a = re.exec(styles)) {
        var rules = FB.Array.map(a[1].split(','), FB.String.trim);
        for (var i=0; i < rules.length; i++) {
          style.addRule(rules[i], a[2]);
        }
      }
    }
  },

  /**
   * Get browser type.
   *
   * @return string 'ie' | 'mozilla' |'safari' | 'other'
   */
  getBrowserType: function() {
    if (!FB.Dom._browserType) {
      var
        userAgent = window.navigator.userAgent.toLowerCase(),
        // list of known browser. NOTE: the order is important
        keys = ['msie', 'firefox', 'gecko',   'safari'],
        names = ['ie',  'mozilla', 'mozilla', 'safari'];
      for (var i = 0; i < keys.length; i++) {
        if (userAgent.indexOf(keys[i]) >= 0) {
          FB.Dom._browserType = names[i];
          break;
        }
      }
    }
    return FB.Dom._browserType;
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.obj
 * @requires fb.type fb.json2 fb.event
 */

/**
 * Base object type that support events.
 *
 * @class FB.Obj
 * @private
 */
FB.Class('Obj', null,
  FB.copy({
    /**
     * Set property on an object and fire property changed event if changed.
     *
     * @param {String} Property name. A event with the same name
     *                 will be fire when the property is changed.
     * @param {Object} new value of the property
     * @private
     */
     setProperty: function(propertyName, newValue) {
       // Check if property actually changed
       if (JSON.stringify(newValue) != JSON.stringify(this[propertyName])) {
         this[propertyName] = newValue;
         this.fire(propertyName, newValue);
       }
     }
  }, FB.EventProvider)
);
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.waitable
 * @layer data
 * @requires fb.prelude fb.type fb.string fb.array fb.event fb.obj
 */

/**
 * A container for asynchronous data that may not be available immediately.
 * This is base type for results returned from FB.Data.query()
 * method.
 * @class FB.Waitable
 */
FB.subclass('Waitable', 'Obj',
  /**
   * Construct a Waitable object.
   *
   * @constructor
   */
  function() {},
  {
  /**
   * Set value property of the data object. This will
   * cause "value" event to be fire on the object. Any callback functions
   * that are waiting for the data through wait() methods will be invoked
   * if the value was previously not set.
   *
   * @private
   * @param {Object} value new value for the Waitable
   */
  set: function(value) {
    this.setProperty('value', value);
  },


  /**
   * Fire the error event.
   *
   * @param ex {Exception} the exception object
   */
  error: function(ex) {
    this.fire("error", ex);
  },

  /**
   * Register a callback for an asynchronous value, which will be invoked when
   * the value is ready.
   *
   * Example
   * -------
   *
   * In this
   *      val v = get_a_waitable();
   *      v.wait(function (value) {
   *        // handle the value now
   *      },
   *      function(error) {
   *        // handle the errro
   *      });
   *      // later, whoever generated the waitable will call .set() and
   *      // invoke the callback
   *
   * @param {Function} callback A callback function that will be invoked
   * when this.value is set. The value property will be passed to the
   * callback function as a parameter
   * @param {Function} errorHandler [optional] A callback function that
   * will be invoked if there is an error in getting the value. The errorHandler
   * takes an optional Error object.
   */
  wait: function(callback, errorHandler) {
    // register error handler first incase the monitor call causes an exception
    if (errorHandler) {
      this.subscribe('error', errorHandler);
    }

    this.monitor('value', this.bind(function() {
      if (this.value !== undefined) {
        callback(this.value);
        return true;
      }
    }));
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.data.query
 * @layer data
 * @requires fb.waitable
 */

/**
 * Object that represents the results of an asynchronous FQL query, typically
 * constructed by a call [[joey:FB.Data.query]]().
 *
 * These objects can be used in one of two ways:
 *
 * * Call [wait][[joey:FB.Waitable.wait]]() to handle the value when it's ready:
 *
 *         var query = FB.Data.query(
 *           'select name from page where username = 'barackobama');
 *         query.wait(function(result) {
 *           document.getElementById('page').innerHTML = result[0].name
 *         });
 *
 * * Pass it as an argument to a function that takes a Waitable. For example,
 *   in this case you can construct the second query without waiting for the
 *   results from the first, and it will combine them into one request:
 *
 *         var query = FB.Data.query(
 *           'select username from page where page_id = 6815841748');
 *         var dependentQuery = FB.Data.query(
 *           'select name from page where username in ' +
 *           '(select username from {0})', query);
 *
 *         // now wait for the results from the dependent query
 *         dependentQuery.wait(function(data) {
 *           document.getElementById('page').innerHTML = result[0].name
 *         });
 *
 * * Wait for multiple waitables at once with [[joey:FB.Data.waitOn]].
 *
 * Check out the [tests][tests] for more usage examples.
 * [tests]: http://github.com/facebook/connect-js/blob/master/tests/js/data.js
 *
 * @class FB.Data.Query
 * @access public
 * @extends FB.Waitable
 */
FB.subclass('Data.Query', 'Waitable',
  function() {
    if (!FB.Data.Query._c) {
      FB.Data.Query._c = 1;
    }
    this.name = 'v_' + FB.Data.Query._c++;
  },
  {
  /**
   * Use the array of arguments using the FB.String.format syntax to build a
   * query, parse it and populate this Query instance.
   *
   * @params args
   */
  parse: function(args) {
    var
      fql = FB.String.format.apply(null, args),
      re = (/^select (.*?) from (\w+)\s+where (.*)$/i).exec(fql); // Parse it
    this.fields = this._toFields(re[1]);
    this.table = re[2];
    this.where = this._parseWhere(re[3]);

    for (var i=1; i < args.length; i++) {
      if (FB.Type.isType(args[i], FB.Data.Query)) {
        // Indicate this query can not be merged because
        // others depend on it.
        args[i].hasDependency = true;
      }
    }

    return this;
  },

  /**
   * Renders the query in FQL format.
   *
   * @return {String} FQL statement for this query
   */
  toFql: function() {
    var s = 'select ' + this.fields.join(',') + ' from ' +
            this.table + ' where ';
    switch (this.where.type) {
      case 'unknown':
        s += this.where.value;
        break;
      case 'index':
        s += this.where.key + '=' + this._encode(this.where.value);
        break;
      case 'in':
        if (this.where.value.length == 1) {
          s += this.where.key + '=' +  this._encode(this.where.value[0]);
        } else {
          s += this.where.key + ' in (' +
            FB.Array.map(this.where.value, this._encode).join(',') + ')';
        }
        break;
    }
    return s;
  },

  /**
   * Encode a given value for use in a query string.
   *
   * @param value {Object} the value to encode
   * @returns {String} the encoded value
   */
  _encode: function(value) {
    return typeof(value) == 'string' ? FB.String.quote(value) : value;
  },

  /**
   * Return the name for this query.
   *
   * TODO should this be renamed?
   *
   * @returns {String} the name
   */
  toString: function() {
    return '#' + this.name;
  },

  /**
   * Return an Array of field names extracted from a given string. The string
   * here is a comma separated list of fields from a FQL query.
   *
   * Example:
   *     query._toFields('abc, def,  ghi ,klm')
   * Returns:
   *     ['abc', 'def', 'ghi', 'klm']
   *
   * @param s {String} the field selection string
   * @returns {Array} the fields
   */
  _toFields: function(s) {
    return FB.Array.map(s.split(','), FB.String.trim);
  },

  /**
   * Parse the where clause from a FQL query.
   *
   * @param s {String} the where clause
   * @returns {Object} parsed where clause
   */
  _parseWhere: function(s) {
    // First check if the where is of pattern
    // key = XYZ
    var
      re = (/^\s*(\w+)\s*=\s*(.*)\s*$/i).exec(s),
      result,
      value,
      type = 'unknown';
    if (re) {
      // Now check if XYZ is either an number or string.
      value = re[2];
      // The RegEx expression for checking quoted string
      // is from http://blog.stevenlevithan.com/archives/match-quoted-string
      if (/^(["'])(?:\\?.)*?\1$/.test(value)) {
        // Use eval to unquote the string
        // convert
        value = eval(value);
        type = 'index';
      } else if (/^\d+\.?\d*$/.test(value)) {
        type = 'index';
      }
    }

    if (type == 'index') {
      // a simple <key>=<value> clause
      result = { type: 'index', key: re[1], value: value };
    } else {
      // Not a simple <key>=<value> clause
      result = { type: 'unknown', value: s };
    }
    return result;
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.data
 * @layer data
 * @requires fb.prelude fb.type fb.array fb.string fb.api fb.obj fb.data.query
 */


/**
 * Data access class for accessing Facebook data efficiently.
 *
 * FB.Data is a data layer that offers the following advantages over
 * direct use of FB.Api:
 *
 * 1. Reduce number of individual HTTP requests through the following
 *    optimizations:
 *
 *   a. Automatically combine individual data requests into a single
 *      multi-query request.
 *
 *   b. Automatic query optimization.
 *
 *   c. Enable caching of data through browser local cache (not implemented yet)
 *
 * 2. Reduce complexity of asynchronous API programming, especially multiple
 *     asynchronous request, though FB.Waitable and FB.waitOn.
 *
 * @class FB.Data
 * @access public
 * @static
 */
FB.provide('Data', {
  /**
   * Performs a parameterized FQL query and returns a [[joey:FB.Data.Query]]
   * object which can be waited on for the asynchronously fetched data.
   *
   * Examples
   * --------
   *
   * Make a simple FQL call and handle the results.
   *
   *      var query = FB.Data.query('select name, uid from user where uid={0}',
   *                                user_id);
   *      query.wait(function(rows) {
   *        document.getElementById('name').innerHTML =
   *          'Your name is ' + rows[0].name;
   *      });
   *
   * Display the names and events of 10 random friends. This can't be done
   * using a simple FQL query because you need more than one field from more
   * than one table, so we use FB.Data.query to help construct the call to
   * [[api:fql.multiquery]].
   *
   *      // First, get ten of the logged-in user's friends and the events they
   *      // are attending. In this query, the argument is just an int value
   *      // (the logged-in user id). Note, we are not firing the query yet.
   *      var query = FB.Data.query(
   *            "select uid, eid from event_member "
   *          + "where uid in "
   *          + "(select uid2 from friend where uid1 = {0}"
   *          + " order by rand() limit 10)",
   *          user_id);
   *
   *      // Now, construct two dependent queries - one each to get the
   *      // names of the friends and the events referenced
   *      var friends = FB.Data.query(
   *            "select uid, name from user where uid in "
   *          + "(select uid from {0})", query);
   *      var events = FB.Data.query(
   *            "select eid, name from event where eid in "
   *          + " (select eid from {0})", query);
   *
   *      // Now, register a callback which will execute once all three
   *      // queries return with data
   *      FB.Data.waitOn([query, friends, events], function() {
   *        // build a map of eid, uid to name
   *        var eventNames = friendNames = {};
   *        FB.forEach(events.value, function(row) {
   *          eventNames[row.eid] = row.name;
   *        });
   *        FB.forEach(friends.value, function(row) {
   *          friendNames[row.uid] = row.name;
   *        });
   *
   *        // now display all the results
   *        var html = '';
   *        FB.forEach(query.value, function(row) {
   *          html += '<p>'
   *            + friendNames[row.uid]
   *            + ' is attending '
   *            + eventNames[row.eid]
   *            + '</p>';
   *        });
   *        document.getElementById('display').innerHTML = html;
   *      });
   *
   * @param {String} template FQL query string template. It can contains
   * optional formatted parameters in the format of '{<argument-index>}'.
   * @param {Object} data optional 0-n arguments of data. The arguments can be
   * either real data (String or Integer) or an [[joey:FB.Data.Query]] object
   * from a previous [[joey:FB.Data.query]]().
   * @return {FB.Data.Query}
   * An async query object that contains query result.
   */
  query: function(template, data) {
    var query = (new FB.Data.Query()).parse(arguments);
    FB.Data.queue.push(query);
    FB.Data._waitToProcess();
    return query;
  },

  /**
   * Wait until the results of all queries are ready. See also
   * [[joey:FB.Data.query]] for more examples of usage.
   *
   * Examples
   * --------
   *
   * Wait for several queries to be ready, then perform some action:
   *
   *      var queryTemplate = 'select name from profile where id={0}';
   *      var u1 = FB.Data.query(queryTemplate, 4);
   *      var u2 = FB.Data.query(queryTemplate, 1160);
   *      FB.Data.waitOn([u1, u2], function(args) {
   *        log('u1 value = '+ args[0].value);
   *        log('u2 value = '+ args[1].value);
   *      });
   *
   * Same as above, except we take advantage of JavaScript closures to
   * avoid using args[0], args[1], etc:
   *
   *      var queryTemplate = 'select name from profile where id={0}';
   *      var u1 = FB.Data.query(queryTemplate, 4);
   *      var u2 = FB.Data.query(queryTemplate, 1160);
   *      FB.Data.waitOn([u1, u2], function(args) {
   *        log('u1 value = '+ u1.value);
   *        log('u2 value = '+ u2.value);
   *      });
   *
   * Create a new Waitable that computes its value based on other Waitables:
   *
   *      var friends = FB.Data.query('select uid2 from friend where uid1={0}',
   *                                  FB.getSession().uid);
   *      // ...
   *      // Create a Waitable that is the count of friends
   *      var count = FB.Data.waitOn([friends], 'args[0].length');
   *      displayFriendsCount(count);
   *      // ...
   *      function displayFriendsCount(count) {
   *        count.wait(function(result) {
   *          log('friends count = ' + result);
   *        });
   *      }
   *
   * You can mix Waitables and data in the list of dependencies
   * as well.
   *
   *      var queryTemplate = 'select name from profile where id={0}';
   *      var u1 = FB.Data.query(queryTemplate, 4);
   *      var u2 = FB.Data.query(queryTemplate, 1160);
   *
   *      // FB.getSession().uid is just an Integer
   *      FB.Data.waitOn([u1, u2, FB.getSession().uid], function(args) {
   *          log('u1 = '+ args[0]);
   *          log('u2 = '+ args[1]);
   *          log('uid = '+ args[2]);
   *       });
   *
   * @param dependencies {Array} an array of dependencies to wait on. Each item
   * could be a Waitable object or actual value.
   * @param callback {Function} A function callback that will be invoked
   * when all the data are ready. An array of ready data will be
   * passed to the callback. If a string is passed, it will
   * be evaluted as a JavaScript string.
   * @return {FB.Waitable} A Waitable object that will be set with the return
   * value of callback function.
   */
  waitOn: function(dependencies, callback) {
    var
      result = new FB.Waitable(),
      c = dependencies.length;

    // For developer convenience, we allow the callback
    // to be a string of javascript expression
    if (typeof(callback) == 'string') {
      var s = callback;
      callback = function(args) {
        return eval(s);
      };
    }

    FB.forEach(dependencies, function(item) {
      item.monitor('value', function() {
        var done = false;
        if (FB.Data._getValue(item) !== undefined) {
          c--;
          done = true;
        }
        if (c === 0) {
          var value = callback(FB.Array.map(dependencies, FB.Data._getValue));
          result.set(value !== undefined ? value : true);
        }
        return done;
      });
    });
    return result;
  },

  /**
   * Helper method to get value from Waitable or return self.
   *
   * @param item {FB.Waitable|Object} potential Waitable object
   * @returns {Object} the value
   */
  _getValue: function(item) {
    return FB.Type.isType(item, FB.Waitable) ? item.value : item;
  },

  /**
   * Alternate method from query, this method is more specific but more
   * efficient. We use it internally.
   *
   * @access private
   * @param fields {Array} the array of fields to select
   * @param table {String} the table name
   * @param name {String} the key name
   * @param value {Object} the key value
   * @returns {FB.Data.Query} the query object
   */
  _selectByIndex: function(fields, table, name, value) {
    var query = new FB.Data.Query();
    query.fields = fields;
    query.table = table;
    query.where = { type: 'index', key: name, value: value };
    FB.Data.queue.push(query);
    FB.Data._waitToProcess();
    return query;
  },

  /**
   * Set up a short timer to ensure that we process all requests at once. If
   * the timer is already set then ignore.
   */
  _waitToProcess: function() {
    if (FB.Data.timer < 0) {
      FB.Data.timer = setTimeout(FB.Data._process, 10);
    }
  },

  /**
   * Process the current queue.
   */
  _process: function() {
    FB.Data.timer = -1;

    var
      mqueries = {},
      q = FB.Data.queue;
    FB.Data.queue = [];

    for (var i=0; i < q.length; i++) {
      var item = q[i];
      if (item.where.type == 'index' && !item.hasDependency) {
        FB.Data._mergeIndexQuery(item, mqueries);
      } else {
        mqueries[item.name] = item;
      }
    }

    // Now make a single multi-query API call
    var params = { method: 'fql.multiquery', queries: {} };
    FB.copy(params.queries, mqueries, true, function(query) {
      return query.toFql();
    });

    params.queries = JSON.stringify(params.queries);

    FB.api(params, function(result) {
      if (result.error_msg) {
        FB.forEach(mqueries, function(q) {
          q.error(Error(result.error_msg));
        });
      } else {
        FB.forEach(result, function(o) {
          mqueries[o.name].set(o.fql_result_set);
        });
      }
    });
  },

  /**
   * Check if y can be merged into x
   * @private
   */
  _mergeIndexQuery: function(item, mqueries) {
    var key = item.where.key,
    value = item.where.value;

    var name = 'index_' +  item.table + '_' + key;
    var master = mqueries[name];
    if (!master) {
      master = mqueries[name] = new FB.Data.Query();
      master.fields = [key];
      master.table = item.table;
      master.where = {type: 'in', key: key, value: []};
    }

    // Merge fields
    FB.Array.merge(master.fields, item.fields);
    FB.Array.merge(master.where.value, [value]);

    // Link data from master to item
    master.wait(function(r) {
      item.set(FB.Array.filter(r, function(x) {
        return x[key] == value;
      }));
    });
  },

  timer: -1,
  queue: []
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.element
 * @layer xfbml
 * @requires fb.type fb.event
 */

/**
 * Base class for all XFBML elements. To create your own XFBML element, make a
 * class that derives from this, and then call [[joey:FB.XFBML.registerTag]].
 *
 * @class FB.XFBML.Element
 */
FB.Class('XFBML.Element',
  /*
   * @constructor
   */
  function(dom) {
    this.dom = dom;
  },

  FB.copy({
  /**
   * Get the value of an attribute associated with this tag.
   *
   * Note, the transform function is never executed over the default value. It
   * is only used to transform user set attribute values.
   *
   * @param name {String} Name of the attribute.
   * @param defaultValue {Object} Default value if attribute isn't set.
   * @param transform {Function} Optional function to transform found value.
   * @return {Object} final value
   */
  getAttribute: function(name, defaultValue, transform) {
    var value = this.dom.getAttribute(name);
    return value ? (transform ? transform(value) : value) : defaultValue;
  },

  /**
   * Helper function to extract boolean attribute value.
   *
   * @param name {String} Name of the attribute.
   * @param defaultValue {Object} Default value if attribute isn't set.
   */
  _getBoolAttribute: function(name, defaultValue) {
    return this.getAttribute(name, defaultValue, function(s) {
      s = s.toLowerCase();
      return s == 'true' || s == '1' || s == 'yes';
    });
  },

  /**
   * Get an integer value for size in pixels.
   *
   * @param name {String} Name of the attribute.
   * @param defaultValue {Object} Default value if attribute isn't set.
   */
  _getPxAttribute: function(name, defaultValue) {
    return this.getAttribute(name, defaultValue, function(s) {
      var size = parseInt(s.replace('px', ''), 10);
      if (isNaN(size)) {
        return defaultValue;
      } else {
        return size;
      }
    });
  },

  /**
   * Check if this node is still valid and in the document.
   *
   * @returns {Boolean} true if element is valid
   */
  isValid: function() {
    for (var dom = this.dom; dom; dom = dom.parentNode) {
      if (dom == document.body) {
        return true;
      }
    }
  },

  /**
   * Clear this element and remove all contained elements.
   */
  clear: function() {
    this.dom.innerHTML = '';
  }
}, FB.EventProvider));
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml
 * @layer xfbml
 * @requires fb.prelude fb.loader
 */

/**
 * Methods for the rendering of [[wiki:XFBML]] tags.
 *
 * To render the tags, simple use them anywhere in your page,
 * and then call:
 *
 *      FB.XFBML.parse();
 *
 * @class FB.XFBML
 * @static
 */
FB.provide('XFBML', {
  /**
   * The time allowed for all tags to finish rendering.
   *
   * @type Number
   */
  _renderTimeout: 30000,

  /**
   * Dynamically set XFBML markup on a given DOM element. Use this
   * method if you want to set XFBML after the page has already loaded
   * (for example, in response to an Ajax request or API call).
   *
   * Example:
   * --------
   * Set the innerHTML of a dom element with id "container"
   * to some markup (fb:name + regular HTML) and render it
   *
   *      FB.XFBML.set(FB.$('container'),
   *          '<fb:name uid="4"></fb:name><div>Hello</div>');
   *
   * @param {DOMElement} dom  DOM element
   * @param {String} markup XFBML markup. It may contain reguarl
   *         HTML markup as well.
   */
  set: function(dom, markup, cb) {
    dom.innerHTML = markup;
    FB.XFBML.parse(dom, cb);
  },

  /**
   * Parse and render XFBML markup in the document.
   *
   * Examples
   * --------
   *
   * By default, this is all you need to make XFBML work:
   *
   *       FB.XFBML.parse();
   *
   * Alternately, you may want to only evaluate a portion of
   * the document. In that case, you can pass in the elment.
   *
   *       FB.XFBML.parse(document.getElementById('foo'));
   *
   * @access public
   * @param dom {DOMElement} (optional) root DOM node, defaults to body
   * @param cb {Function} (optional) invoked when elements are rendered
   */
  parse: function(dom, cb) {
    dom = dom || document.body;

    // We register this function on each tag's "render" event. This allows us
    // to invoke the callback when we're done rendering all the found elements.
    //
    // We start with count=1 rather than 0, and finally call onTagDone() after
    // we've kicked off all the tag processing. This ensures that we do not hit
    // count=0 before we're actually done queuing up all the tags.
    var
      count = 1,
      onTagDone = function() {
        count--;
        if (count === 0) {
          // Invoke the user specified callback for this specific parse() run.
          cb && cb();

          // Also fire a global event. A global event is fired for each
          // invocation to FB.XFBML.parse().
          FB.Event.fire('xfbml.render');
        }
      };

    // First, find all tags that are present
    FB.forEach(FB.XFBML._tagInfos, function(tagInfo) {
      // default the xmlns if needed
      if (!tagInfo.xmlns) {
        tagInfo.xmlns = 'fb';
      }

      var xfbmlDoms = FB.XFBML._getDomElements(
        dom,
        tagInfo.xmlns,
        tagInfo.localName
      );
      for (var i=0; i < xfbmlDoms.length; i++) {
        count++;
        FB.XFBML._processElement(xfbmlDoms[i], tagInfo, onTagDone);
      }
    });

    // Setup a timer to ensure all tags render within a given timeout
    var timeout = window.setTimeout(function() {
      if (count != 0) {
        FB.log(
          count + ' XFBML tags failed to render in ' +
          FB.XFBML._renderTimeout + 'ms'
        );
      }
    }, FB.XFBML._renderTimeout);
    // Call once to handle count=1 as described above.
    onTagDone();
  },

  /**
   * Register a custom XFBML tag. If you create an custom XFBML tag, you can
   * use this method to register it so the it can be treated like
   * any build-in XFBML tags.
   *
   * Example
   * -------
   *
   * Register fb:name tag that is implemented by class FB.XFBML.Name
   *       tagInfo = {xmlns: 'fb',
   *                  localName: 'name',
   *                  className: 'FB.XFBML.Name'},
   *       FB.XFBML.registerTag(tagInfo);
   *
   * @param {Object} tagInfo
   * an object containiner the following keys:
   * - xmlns
   * - localName
   * - className
   */
  registerTag: function(tagInfo) {
    FB.XFBML._tagInfos.push(tagInfo);
  },


  //////////////// Private methods ////////////////////////////////////////////

  /**
   * Process an XFBML element.
   *
   * @access private
   * @param dom {DOMElement} the dom node
   * @param tagInfo {Object} the tag information
   * @param cb {Function} the function to bind to the "render" event for the tag
   */
  _processElement: function(dom, tagInfo, cb) {
    // Check if element for the dom already exists
    var element = dom._element;
    if (element) {
      element.process();
    } else {
      var processor = function() {
        var fn = eval(tagInfo.className);
        element = dom._element = new fn(dom);
        element.subscribe('render', cb);
        element.process();
      };

      if (FB.CLASSES[tagInfo.className.substr(3)]) {
        processor();
      } else {
        // Load on-demand if necessary. Component name is lower case className.
        var component = tagInfo.className.toLowerCase();
        FB.Loader.use(component, processor);
      }
    }
  },

  /**
   * Get all the DOM elements present under a given node with a given tag name.
   *
   * @access private
   * @param dom {DOMElement} the root DOM node
   * @param xmlns {String} the XML namespace
   * @param localName {String} the unqualified tag name
   * @return {DOMElementCollection}
   */
  _getDomElements: function(dom, xmlns, localName) {
    // Different browsers behave slightly differently in handling tags
    // with custom namespace.
    var fullName = xmlns + ':' + localName;

    switch (FB.Dom.getBrowserType()) {
    case 'mozilla':
      // Use document.body.namespaceURI as first parameter per
      // suggestion by Firefox developers.
      // See https://bugzilla.mozilla.org/show_bug.cgi?id=531662
      return dom.getElementsByTagNameNS(document.body.namespaceURI, fullName);
      break;
    case 'ie':
      var docNamespaces = document.namespaces;
      if (docNamespaces && docNamespaces[xmlns]) {
        return dom.getElementsByTagName(localName);
      } else {
        // It seems that developer tends to forget to declare the fb namespace
        // in the HTML tag (xmlns:fb="http://www.facebook.com/2008/fbml") IE
        // has a stricter implementation for custom tags. If namespace is
        // missing, custom DOM dom does not appears to be fully functional. For
        // example, setting innerHTML on it will fail.
        //
        // If a namespace is not declared, we can still find the element using
        // GetElementssByTagName with namespace appended.
        return dom.getElementsByTagName(fullName);
      }
      break;
    default:
      return dom.getElementsByTagName(fullName);
      break;
    }
  },

  /**
   * Register the default set of base tags. Each entry must have a localName
   * and a className property, and can optionally have a xmlns property which
   * if missing defaults to 'fb'.
   *
   * NOTE: Keep the list alpha sorted.
   */
  _tagInfos: [
    { localName: 'add-to-wishlist', className: 'FB.XFBML.AddToWishList' },
    { localName: 'comments',        className: 'FB.XFBML.Comments' },
    { localName: 'fan',             className: 'FB.XFBML.Fan' },
    { localName: 'like',            className: 'FB.XFBML.Like' },
    { localName: 'live-stream',     className: 'FB.XFBML.LiveStream' },
    { localName: 'login-button',    className: 'FB.XFBML.LoginButton' },
    { localName: 'name',            className: 'FB.XFBML.Name' },
    { localName: 'profile-pic',     className: 'FB.XFBML.ProfilePic' },
    { localName: 'serverfbml',      className: 'FB.XFBML.ServerFbml' },
    { localName: 'share-button',    className: 'FB.XFBML.ShareButton' }
  ]
});

/*
 * For IE, we will try to detect if document.namespaces contains 'fb' already
 * and add it if it does not exist.
 */
if (document.namespaces && !document.namespaces.item['fb']) {
   document.namespaces.add('fb');
}
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.helper
 * @layer xfbml
 * @requires fb.prelude
 */

/**
 * Helper class for XFBML
 * @class FB.Helper
 * @static
 * @private
 */
FB.provide('Helper', {
  /**
   * Check if an id is an user id, instead of a page id
   *
   * [NOTE:] This code is based on is_user_id function in our server code.
   * If that function changes, we'd have to update this one as well.
   *
   * @param {uid} id
   * @returns {Boolean} true if the given id is a user id
   */
  isUser: function(id) {
    return id < 2200000000 || (
              id >= 100000000000000 &&  // 100T is first 64-bit UID
              id <= 100099999989999); // 100T + 3,333,333*30,000 - 1)
  },

  /**
   * Return the current user's UID if available.
   *
   * @returns {String|Number} returns the current user's UID or null
   */
  getLoggedInUser: function() {
    return FB._session ? FB._session.uid : null;
  },

  /**
   * Uppercase the first character of the String.
   *
   * @param s {String} the string
   * @return {String} the string with an uppercase first character
   */
  upperCaseFirstChar: function(s) {
    if (s.length > 0) {
      return s.substr(0, 1).toUpperCase() + s.substr(1);
    }
    else {
      return s;
    }
  },

  /**
   * Link to the explicit href or profile.php.
   *
   * @param userInfo {FB.UserInfo} User info object.
   * @param html {String} Markup for the anchor tag.
   * @param href {String} Custom href.
   * @returns {String} the anchor tag markup
   */
  getProfileLink: function(userInfo, html, href) {
    href = href || (userInfo ? FB._domain.www + 'profile.php?id=' +
                    userInfo.uid : null);
    if (href) {
      html = '<a class="FB_Link" href="' + href + '">' + html + '</a>';
    }
    return html;
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.iframewidget
 * @layer xfbml
 * @requires fb.type fb.event fb.xfbml.element fb.iframe-widget-css
 */

/**
 * Base implementation for iframe based XFBML Widgets.
 *
 * @class FB.XFBML.IframeWidget
 * @extends FB.XFBML.Element
 * @private
 */
FB.subclass('XFBML.IframeWidget', 'XFBML.Element', null, {
  /**
   * Indicate if the loading animation should be shown while the iframe is
   * loading.
   */
  _showLoader: true,

  /**
   * Indicate if we should notify the iframe when the auth.statusChange event
   * is fired.
   */
  _notifyOnAuthChange: false,

  /**
   * Indicates if the widget should be reprocessed on auth.statusChange events.
   * This is the default for XFBML Elements, but is usually undesirable for
   * Iframe Widgets. Widgets that need to re-render on status change should
   * ideally rely on the _notifyOnAuthChange ability.
   */
  _allowReProcess: false,

  /**
   * Indicates when the widget will be made visible.
   *
   *   load: when the iframe's page onload event is fired
   *   resize: when the first resize message is received
   */
  _visibleAfter: 'load',

  /////////////////////////////////////////////////////////////////////////////
  // Methods the implementation MUST override
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Implemented by the inheriting class to return the URL for the iframe.
   *
   * @return {String} the iframe URL
   */
  getIframeUrl: function() {
    throw new Error('Inheriting class needs to implement getIframeUrl().');
  },

  /////////////////////////////////////////////////////////////////////////////
  // Methods the implementation CAN override
  /////////////////////////////////////////////////////////////////////////////

  /**
   * This method is invoked before any processing is done to do any initial
   * setup and do any necessary validation on the attributes. A return value of
   * false will indicate that validation was unsuccessful and processing will
   * be halted. If you are going to return false and halt processing, you
   * should ensure you use FB.log() to output a short informative message
   * before doing so.
   *
   * @return {Boolean} true to continue processing, false to halt it
   */
  setupAndValidate: function() {
    return true;
  },

  /**
   * Implemented by the inheriting class to return the initial size for the
   * iframe. If the inheriting class does not implement this, we default to
   * null which implies no element level style. This is useful if you are
   * defining the size based on the className.
   *
   * @return {Object} object with a width and height as Numbers (pixels assumed)
   */
  getSize: function() {},

  /**
   * Implemented by the inheriting class if it needs to override the name
   * attribute of the iframe node. Returning null will auto generate the name.
   *
   * @return {String} the name of the iframe
   */
  getIframeName: function() {},

  /////////////////////////////////////////////////////////////////////////////
  // Public methods the implementation CAN use
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Get a channel url for use with this widget.
   *
   * @return {String} the channel URL
   */
  getChannelUrl: function() {
    if (!this._channelUrl) {
      // parent.parent => the message will be going from cdn => fb => app (with
      // cdn being the deepest frame, and app being the top frame)
      var self = this;
      this._channelUrl = FB.XD.handler(function(message) {
        self.fire('xd.' + message.type, message);
      }, 'parent.parent', true);
    }
    return this._channelUrl;
  },

  /**
   * Returns the iframe node (if it has already been created).
   *
   * @return {DOMElemnent} the iframe DOM element
   */
  getIframeNode: function() {
    // not caching to allow for the node to change over time without needing
    // house-keeping for the cached reference.
    return this.dom.getElementsByTagName('iframe')[0];
  },

  /////////////////////////////////////////////////////////////////////////////
  // Private methods the implementation MUST NOT use or override
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Inheriting classes should not touch the DOM directly, and are only allowed
   * to override the methods defined at the top.
   */
  process: function() {
    // guard agains reprocessing if needed
    if (!this._allowReProcess && this._done) {
      return;
    }
    this._done = true;

    if (!this.setupAndValidate()) {
      return;
    }

    // do internal setup
    this._oneTimeSetup();

    // show the loader if needed
    if (this._showLoader) {
      this._addLoader();
    }

    // it's always hidden by default
    FB.Dom.addCss(this.dom, 'FB_HideIframes');

    // the initial size
    var size = this.getSize() || {};

    // we will append "js_sdk=joey" to the query parameters if it looks like a
    // URL with query params
    var url = this.getIframeUrl();
    if (url.indexOf('http') === 0 && url.indexOf('?') > -1) {
      url += '&js_sdk=joey';
    }

    FB.Content.insertIframe({
      url    : url,
      root   : this.dom.appendChild(document.createElement('span')),
      name   : this.getIframeName(),
      height : size.height,
      width  : size.width,
      onload : FB.bind(this.fire, this, 'iframe.onload')
    });
  },

  /**
   * Internal one time setup logic.
   */
  _oneTimeSetup: function() {
    if (this._oneTimeSetupDone) {
      return;
    }
    this._oneTimeSetupDone = true;

    // the XD messages we want to handle. it is safe to subscribe to these even
    // if they will not get used.
    this.subscribe('xd.resize', FB.bind(this._handleResizeMsg, this));

    // weak dependency on FB.Auth
    if (FB.getLoginStatus) {
      this.subscribe('xd.refreshLoginStatus', FB.getLoginStatus);
    }

    // setup forwarding of auth.statusChange events
    if (this._notifyOnAuthChange) {
      this._setupAuthNotify();
    }

    // if we need to make it visible on iframe load
    if (this._visibleAfter == 'load') {
      this.subscribe('iframe.onload', FB.bind(this._makeVisible, this));
    }
  },

  /**
   * Make the iframe visible and remove the loader.
   */
  _makeVisible: function() {
    this._removeLoader();
    FB.Dom.removeCss(this.dom, 'FB_HideIframes');
    this.fire('render');
  },

  /**
   * Forward status change events to the iframe.
   */
  _setupAuthNotify: function() {
    FB.Event.subscribe('auth.statusChange', FB.bind(function(response) {
      if (!this.isValid()) {
        return;
      }
      //TODO (naitik) send doesnt exist
      this.send({ type: 'statusChange', status: response.status });
    }, this));
  },

  /**
   * Invoked by the iframe when it wants to be resized.
   */
  _handleResizeMsg: function(message) {
    if (!this.isValid()) {
      return;
    }
    var iframe = this.getIframeNode();
    iframe.style.height = message.height + 'px';
    if (message.width) {
      iframe.style.width = message.width + 'px';
    }
    iframe.style.border = 'none';
    this._makeVisible();
  },

  /**
   * Add the loader.
   */
  _addLoader: function() {
    if (!this._loaderDiv) {
      FB.Dom.addCss(this.dom, 'FB_IframeLoader');
      this._loaderDiv = document.createElement('div');
      this._loaderDiv.className = 'FB_Loader';
      this.dom.appendChild(this._loaderDiv);
    }
  },

  /**
   * Remove the loader.
   */
  _removeLoader: function() {
    if (this._loaderDiv) {
      FB.Dom.removeCss(this.dom, 'FB_IframeLoader');
      this.dom.removeChild(this._loaderDiv);
      this._loaderDiv = null;
    }
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.edgewidget
 * @layer xfbml
 * @requires fb.type fb.xfbml.iframewidget
 */

/**
 * Base implementation for Edge Widgets.
 *
 * @class FB.XFBML.EdgeWidget
 * @extends FB.XFBML.IframeWidget
 * @private
 */
FB.subclass('XFBML.EdgeWidget', 'XFBML.IframeWidget', null, {
  /////////////////////////////////////////////////////////////////////////////
  // Methods the implementation MUST override.
  /////////////////////////////////////////////////////////////////////////////

  /**
   * The edge type.
   *
   * @return {String} the edge type
   */
  getEdgeType: function() {
    throw new Error('The inheriting class must specify the edge type.');
  },

  /////////////////////////////////////////////////////////////////////////////
  // Internal stuff.
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Make the iframe visible only when it has finished loading.
   */
  _visibleAfter: 'load',

  /**
   * Do initial attribute processing.
   */
  setupAndValidate : function() {
    this._attr = {
      bgcolor      : this.getAttribute('bgcolor', 'white'),
      debug        : this._getBoolAttribute('debug'),
      edge_type    : this.getEdgeType(),
      external_url : this.getAttribute('permalink', window.location.href),
      node_type    : this.getAttribute('node_type', 'page'),
      page_url     : window.location.href
    };

    return true;
  },

  /**
   * Get the initial size.
   *
   * @return {Object} the size
   */
  getSize: function() {
    // might allow this to be overridden in the future
    return { width: 580, height: 100 };
  },

  /**
   * Get the URL for the iframe.
   *
   * @return {String} the iframe URL
   */
  getIframeUrl : function() {
    return (
      FB._domain.www +
      'connect/connect_to_node.php?' +
      FB.QS.encode(this._attr)
    );
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.addtowishlist
 * @layer xfbml
 * @requires fb.type fb.xfbml.edgewidget
 */

/**
 * Implementation for fb:add-to-wishlist tag.
 *
 * @class FB.XFBML.AddToWishList
 * @extends FB.XFBML.EdgeWidget
 * @private
 */
FB.subclass('XFBML.AddToWishList', 'XFBML.EdgeWidget', null, {
  /**
   * Returns the name that should be given to the iFrame being fetched and
   * rendered on behalf of this <fb:add-to-wishlist> button.
   *
   * @return {String} the name that should be given to the button's
   *         iFrame rendering.
   */
  getIframeName : function() {
    return 'fbAddToWishListIFrame_' + FB.XFBML.AddToWishList._iframeIdCount++;
  },

  /**
   * Returns the type of edge managed by the AddToWish button.
   *
   * @return string the string 'wish'
   */
  getEdgeType : function() {
    return 'wish';
  }
});

/**
 * Defines the collection of class-level directives needed to help control of
 * <fb:add-to-wishlist> buttons.
 */
FB.provide('XFBML.AddToWishList', {
  _iframeIdCount : 0
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.comments
 * @layer xfbml
 * @requires fb.type fb.xfbml.iframewidget fb.auth
 */

/**
 * Implementation for fb:comments tag.
 *
 * @class FB.XFBML.Comments
 * @extends FB.XFBML.IframeWidget
 * @private
 */
FB.subclass('XFBML.Comments', 'XFBML.IframeWidget', null, {
  /**
   * Make the iframe visible only when we get the initial resize message.
   */
  _visibleAfter: 'resize',

  /**
   * Notify the iframe on auth.statusChange events.
   */
  _notifyOnAuthChange: true,

  /**
   * Do initial attribute processing.
   */
  setupAndValidate: function() {
    this.subscribe('xd.addComment', FB.bind(this._handleCommentMsg, this));

    // query parameters to the comments iframe
    var attr = {
      api_key     : FB._apiKey,
      channel_url : this.getChannelUrl(),
      css         : this.getAttribute('css'),
      notify      : this.getAttribute('notify'),
      numposts    : this.getAttribute('numposts', 10),
      quiet       : this.getAttribute('quiet'),
      reverse     : this.getAttribute('reverse'),
      simple      : this.getAttribute('simple'),
      title       : this.getAttribute('title', document.title),
      url         : this.getAttribute('url', document.URL),
      width       : this._getPxAttribute('width', 550),
      xid         : this.getAttribute('xid')
    };

    // default xid to current URL
    if (!attr.xid) {
      // We always want the URL minus the hash "#" also note the encoding here
      // and down below when the url is built. This is intentional, so the
      // string received by the server is url-encoded and thus valid.
      var index = document.URL.indexOf('#');
      if (index > 0) {
        attr.xid = encodeURIComponent(document.URL.substring(0, index));
      }
      else {
        attr.xid = encodeURIComponent(document.URL);
      }
    }
    this._attr = attr;
    return true;
  },

  /**
   * Get the initial size.
   *
   * @return {Object} the size
   */
  getSize: function() {
    return { width: this._attr.width, height: 200 };
  },

  /**
   * Get the URL for the iframe.
   *
   * @return {String} the iframe URL
   */
  getIframeUrl: function() {
    return FB._domain.www + 'comments.php?' + FB.QS.encode(this._attr);
  },

  /**
   * Invoked by the iframe when a comment is added. Note, this feature needs to
   * be enabled by specifying the notify=true attribute on the tag. This is in
   * order to improve performance by only requiring this overhead when a
   * developer explicitly said they want it.
   *
   * @param message {Object} the message received via XD
   */
  _handleCommentMsg: function(message) {
    //TODO (naitik) what should we be giving the developers here? is there a
    //              comment_id they can get?
    if (!this.isValid()) {
      return;
    }
    FB.Event.fire('comments.add', {
      post: message.post,
      user: message.user,
      widget: this
    });
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.fan
 * @layer xfbml
 * @requires fb.type fb.xfbml.iframewidget
 */

/**
 * Implementation for fb:fan tag.
 *
 * @class FB.XFBML.Fan
 * @extends FB.XFBML.IframeWidget
 * @private
 */
FB.subclass('XFBML.Fan', 'XFBML.IframeWidget', null, {
  _visibleAfter: 'load',

  /**
   * Do initial attribute processing.
   */
  setupAndValidate: function() {
    this._attr = {
      api_key     : FB._apiKey,
      connections : this.getAttribute('connections', '10'),
      css         : this.getAttribute('css'),
      height      : this.getAttribute('height'),
      id          : this.getAttribute('profile_id'),
      logobar     : this._getBoolAttribute('logobar'),
      name        : this.getAttribute('name'),
      stream      : this._getBoolAttribute('stream', true),
      width       : this._getPxAttribute('width', 300)
    };

    // "id" or "name" is required
    if (!this._attr.id && !this._attr.name) {
      FB.Log('<fb:fan> requires one of the "id" or "name" attributes.');
      return false;
    }

    var height = this._attr.height;
    if (!height) {
      if ((!this._attr.connections || this._attr.connections === '0') &&
          !this._attr.stream) {
        height = 65;
      } else if (!this._attr.connections || this._attr.connections === '0') {
        height = 375;
      } else if (!this._attr.stream) {
        height = 250;
      } else {
        height = 550;
      }
    }
    // add space for logobar
    if (this._attr.logobar) {
      height += 25;
    }

    this._attr.height = height;
    return true;
  },

  /**
   * Get the initial size.
   *
   * @return {Object} the size
   */
  getSize: function() {
    return { width: this._attr.width, height: this._attr.height };
  },

  /**
   * Get the URL for the iframe.
   *
   * @return {String} the iframe URL
   */
  getIframeUrl: function() {
    return FB._domain.www + 'connect/connect.php?' + FB.QS.encode(this._attr);
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.like
 * @layer xfbml
 * @requires fb.type fb.xfbml.edgewidget
 */

/**
 * Implementation for fb:like tag.
 *
 * @class FB.XFBML.Like
 * @extends FB.XFBML.EdgeWidget
 * @private
 */
FB.subclass('XFBML.Like', 'XFBML.EdgeWidget', null, {
  /**
   * Returns the name that should be given to the iFrame being fetched and
   * rendered on behalf of this <fb:add-to-wishlist> button.
   *
   * @return {String} the name that should be given to the button's
   *         iFrame rendering.
   */
  getIframeName : function() {
    return 'fbLikeIFrame_' + FB.XFBML.Like._iframeIdCount++;
  },

  /**
   * Returns the type of edge managed by the Like button.
   *
   * @return string the string 'like'
   */
  getEdgeType : function() {
    return 'like';
  }
});

/**
 * Defines the collection of class-level directives needed to help control of
 * <fb:like> buttons.
 */
FB.provide('XFBML.Like', {
  _iframeIdCount : 0
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.livestream
 * @layer xfbml
 * @requires fb.type fb.xfbml.iframewidget
 */

/**
 * Implementation for fb:live-stream tag.
 *
 * @class FB.XFBML.LiveStream
 * @extends FB.XFBML.IframeWidget
 * @private
 */
FB.subclass('XFBML.LiveStream', 'XFBML.IframeWidget', null, {
  _visibleAfter: 'load',

  /**
   * Do initial attribute processing.
   */
  setupAndValidate: function() {
    this._attr = {
      api_key        : FB._apiKey,
      height         : this._getPxAttribute('height', 500),
      hideFriendsTab : this.getAttribute('hide_friends_tab'),
      redesigned     : this._getBoolAttribute('redesigned_stream'),
      width          : this._getPxAttribute('width', 400),
      xid            : this.getAttribute('xid', 'default')
    };

    return true;
  },

  /**
   * Get the initial size.
   *
   * @return {Object} the size
   */
  getSize: function() {
    return { width: this._attr.width, height: this._attr.height };
  },

  /**
   * Get the URL for the iframe.
   *
   * @return {String} the iframe URL
   */
  getIframeUrl: function() {
    //TODO (naitik) should joey deprecate the redesigned attribute and default
    //              to the new one?
    var path = this._attr.redesigned ? 'live_feed.php' : 'livefeed.php';
    return FB._domain.www + 'widgets/' + path + '?' + FB.QS.encode(this._attr);
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.loginbutton
 * @layer xfbml
 * @requires fb.type fb.xfbml.element fb.auth
 */

/**
 * Implementation for fb:login-button tag.
 * Note this implementation does not suppport the following features
 * in Connect V1:
 *   1. i18n support
 *   2. logout button
 *   3. 'onlogin' and 'onlogout' attributes
 *   3. Validation of allowed values on attributes
 *
 * @class FB.XFBML.LoginButton
 * @extends  FB.XFBML.Element
 * @private
 */
FB.subclass('XFBML.LoginButton', 'XFBML.Element', null, {
  /**
   * Processes this tag.
   */
  process: function() {
    var
      size = this.getAttribute('size', 'medium'),
      background = this.getAttribute('background', 'light'),
      length = this.getAttribute('length', 'short'),
      src = FB.XFBML.LoginButton._rsrc[background + '_' + size + '_' + length];

    this.dom.innerHTML = (
      '<a onclick="FB.login();" class="fbconnect_login_button">' +
      '<img src="' + src + '" alt="Connect with Facebook"/></a>'
    );
    this.fire('render');
  }
});

FB.provide('XFBML.LoginButton', {
  /**
   * Images for the login button.
   */
  _rsrc: {
    dark_small_short   : FB._domain.cdn + 'rsrc.php/zF1W2/hash/a969rwcd.gif',
    dark_medium_short  : FB._domain.cdn + 'rsrc.php/zEF9L/hash/156b4b3s.gif',
    dark_medium_long   : FB._domain.cdn + 'rsrc.php/zBIU2/hash/85b5jlja.gif',
    dark_large_short   : FB._domain.cdn + 'rsrc.php/z1UX3/hash/a22m3ibb.gif',
    dark_large_long    : FB._domain.cdn + 'rsrc.php/z7SXD/hash/8mzymam2.gif',
    light_small_short  : FB._domain.cdn + 'rsrc.php/zDGBW/hash/8t35mjql.gif',
    light_medium_short : FB._domain.cdn + 'rsrc.php/z38X1/hash/6ad3z8m6.gif',
    light_medium_long  : FB._domain.cdn + 'rsrc.php/zB6N8/hash/4li2k73z.gif',
    light_large_short  : FB._domain.cdn + 'rsrc.php/zA114/hash/7e3mp7ee.gif',
    light_large_long   : FB._domain.cdn + 'rsrc.php/z4Z4Q/hash/8rc0izvz.gif',
    white_small_short  : FB._domain.cdn + 'rsrc.php/z900E/hash/di0gkqrt.gif',
    white_medium_short : FB._domain.cdn + 'rsrc.php/z10GM/hash/cdozw38w.gif',
    white_medium_long  : FB._domain.cdn + 'rsrc.php/zBT3E/hash/338d3m67.gif',
    white_large_short  : FB._domain.cdn + 'rsrc.php/zCOUP/hash/8yzn0wu3.gif',
    white_large_long   : FB._domain.cdn + 'rsrc.php/zC6AR/hash/5pwowlag.gif'
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.name
 * @layer xfbml
 * @requires fb.type fb.xfbml  fb.dom fb.xfbml.element fb.data fb.helper
 */

/**
 * @class FB.XFBML.Name
 * @extends  FB.XFBML.Element
 * @private
 */
FB.subclass('XFBML.Name', 'XFBML.Element', null, {
  /**
   * Processes this tag.
   */
  process: function() {
    FB.copy(this, {
      _uid           : this.getAttribute('uid'),
      _firstnameonly : this._getBoolAttribute('firstnameonly'),
      _lastnameonly  : this._getBoolAttribute('lastnameonly'),
      _possessive    : this._getBoolAttribute('possessive'),
      _reflexive     : this._getBoolAttribute('reflexive'),
      _objective     : this._getBoolAttribute('objective'),
      _linked        : this._getBoolAttribute('linked', true),
      _subjectId     : this.getAttribute('subjectid')
    });

    if (!this._uid) {
      FB.log('"uid" is a required attribute for <fb:name>');
      this.fire('render');
      return;
    }

    var fields = [];
    if (this._firstnameonly) {
      fields.push('first_name');
    } else if (this._lastnameonly) {
      fields.push('last_name');
    } else {
      fields.push('name');
    }

    if (this._subjectId) {
      fields.push('sex');

      if (this._subjectId == FB.Helper.getLoggedInUser()) {
        this._reflexive = true;
      }
    }

    var data;
    // Wait for status to be known
    FB.Event.monitor('auth.statusChange', this.bind(function() {
      // Is Element still in DOM tree?
      if (!this.isValid()) {
        this.fire('render');
        return true; // Stop processing
      }

      if (FB._userStatus) {
        if (this._uid == 'loggedinuser') {
          this._uid = FB.Helper.getLoggedInUser();
        }

        if (FB.Helper.isUser(this._uid)) {
          data = FB.Data._selectByIndex(fields, 'user', 'uid', this._uid);
        } else {
          data = FB.Data._selectByIndex(['name', 'id'], 'profile', 'id',
                                        this._uid);
        }
        data.wait(this.bind(function(data) {
          if (this._uid) {
            if (this._subjectId == this._uid) {
              this._renderPronoun(data[0]);
            } else {
              this._renderOther(data[0]);
            }
          }
          this.fire('render');
        }));
      }
      return false;
    }));
  },

  /**
   * Given this name, figure out the proper (English) pronoun for it.
   */
  _renderPronoun: function(userInfo) {
    var
      word = '',
      objective = this._objective;
    if (this._subjectId) {
      objective = true;
      if (this._subjectId === this._uid) {
        this._reflexive = true;
      }
    }
    if (this._uid == FB.Connect.get_loggedInUser() &&
        this._getBoolAttribute('useyou', true)) {
      if (this._possessive) {
        if (this._reflexive) {
          word = 'your own';
        } else {
          word = 'your';
        }
      } else {
        if (this._reflexive) {
          word = 'yourself';
        } else {
          word = 'you';
        }
      }
    }
    else {
      switch (userInfo.sex) {
        case 'male':
          if (this._possessive) {
            word = (this._reflexive) ? 'his own' : 'his';
          } else {
            if (this._reflexive) {
              word = 'himself';
            } else if (objective) {
              word = 'him';
            } else {
              word = 'he';
            }
          }
          break;
        case 'female':
          if (this._possessive) {
            word = (this._reflexive) ? 'her own' : 'her';
          } else {
            if (this._reflexive) {
              word = 'herself';
            } else if (objective) {
              word = 'her';
            } else {
              word = 'she';
            }
          }
          break;
        default:
          if (this._getBoolAttribute('usethey', true)) {
            if (this._possessive) {
              if (this._reflexive) {
                word = 'their own';
              } else {
                word = 'their';
              }
            } else {
              if (this._reflexive) {
                word = 'themselves';
              } else if (objective) {
                word = 'them';
              } else {
                word = 'they';
              }
            }
          }
          else {
            if (this._possessive) {
              if (this._reflexive) {
                word = 'his/her own';
              } else {
                word = 'his/her';
              }
            } else {
              if (this._reflexive) {
                word = 'himself/herself';
              } else if (objective) {
                word = 'him/her';
              } else {
                word = 'he/she';
              }
            }
          }
          break;
      }
    }
    if (this._getBoolAttribute('capitalize', false)) {
      word = FB.Helper.upperCaseFirstChar(word);
    }
    this.dom.innerHTML = word;
  },

  /**
   * Handle rendering of the element, using the
   * metadata that came with it.
   */
  _renderOther: function(userInfo) {
    if (!userInfo) {
      return;
    }
    var
      name = '',
      html = '';
    if (this._uid == FB.Helper.getLoggedInUser() &&
        this._getBoolAttribute('useyou', true)) {
      if (this._reflexive) {
        if (this._possessive) {
          name = 'your own';
        } else {
          name = 'yourself';
        }
      } else {
        //  The possessive works really nicely this way!
        if (this._possessive) {
          name = 'your';
        } else {
          name = 'you';
        }
      }
    }
    else {
      //  FQLCantSee structures will show as null.
      if (null === userInfo.first_name) {
        userInfo.first_name = '';
      }
      if (null === userInfo.last_name) {
        userInfo.last_name = '';
      }
      if (this._firstnameonly) {
        name = userInfo.first_name;
      } else if (this._lastnameonly) {
        name = userInfo.last_name;
      }

      if (!name) {
        name = userInfo.name;
      }

      if (name !== '' && this._possessive) {
        name += '\'s';
      }
    }

    if (!name) {
      name = this.getAttribute('ifcantsee', 'Facebook User');
    }
    if (name) {
      if (this._getBoolAttribute('capitalize', false)) {
        name = FB.Helper.upperCaseFirstChar(name);
      }
      if (this._linked) {
        html = FB.Helper.getProfileLink(userInfo, name,
          this.getAttribute('href', null));
      } else {
        html = name;
      }
    }
    this.dom.innerHTML = html;
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.profilepic
 * @layer xfbml
 * @requires fb.type fb.xfbml fb.string fb.dom fb.xfbml.element fb.data
 *           fb.helper
 */

/**
 * @class FB.XFBML.ProfilePic
 * @extends  FB.XFBML.Element
 * @private
 */
FB.subclass('XFBML.ProfilePic', 'XFBML.Element', null, {
  /**
   * Processes this tag.
   */
  process: function() {
    var
      size = this.getAttribute('size', 'thumb'),
      picFieldName = FB.XFBML.ProfilePic._sizeToPicFieldMap[size],
      width = this._getPxAttribute('width'),
      height = this._getPxAttribute('height'),
      style = this.dom.style,
      uid = this.getAttribute('uid');

    // Check if we need to add facebook logo image
    if (this._getBoolAttribute('facebook-logo')) {
      picFieldName += '_with_logo';
    }

    if (width) {
      width = width + 'px';
      style.width = width;
    }
    if (height) {
      height = height + 'px';
      style.height = height;
    }

    var renderFn = this.bind(function(result) {
      var
        userInfo = result ? result[0] : null,
        imageSrc = userInfo ? userInfo[picFieldName] : null;

      if (!imageSrc) {
        // Create default
        imageSrc = FB._domain.cdn + 'pics/' +
          FB.XFBML.ProfilePic._defPicMap[picFieldName];
      }
      // Copy width, height style, and class name of fb:profile-pic down to the
      // image element we create
      var
        styleValue = (
          (width ? 'width:' + width + ';' : '') +
          (height ? 'height:' + width + ';' : '')
        ),
        html = FB.String.format(
          '<img src="{0}" alt="{1}" title="{1}" style="{2}" class="{3}" />',
          imageSrc,
          userInfo ? userInfo.name : '',
          styleValue,
          this.dom.className
        );

      if (this._getBoolAttribute('linked', true)) {
        html = FB.Helper.getProfileLink(
          userInfo,
          html,
          this.getAttribute('href', null)
        );
      }
      this.dom.innerHTML = html;
      FB.Dom.addCss(this.dom, 'fb_profile_pic_rendered');
      this.fire('render');
    });

    // Wait for status to be known
    FB.Event.monitor('auth.statusChange', this.bind(function() {
      //Is Element still in DOM tree
      if (!this.isValid()) {
        this.fire('render');
        return true; // Stop processing
      }

      if (this.getAttribute('uid', null) == 'loggedinuser') {
        uid = FB.Helper.getLoggedInUser();
      }

      // Is status known?
      if (FB._userStatus && uid) {
        // Get data
        // Use profile if uid is a user, but a page
        FB.Data._selectByIndex(
          ['name', picFieldName],
          FB.Helper.isUser(uid) ? 'user' : 'profile',
          FB.Helper.isUser(uid) ? 'uid' : 'id',
          uid
        ).wait(renderFn);
      } else {
        // Render default
        renderFn();
      }
    }));
  }
});

FB.provide('XFBML.ProfilePic', {
  /**
   * Maps field type to placeholder/silhouette image.
   */
  _defPicMap: {
    pic                  : 's_silhouette.jpg',
    pic_big              : 'd_silhouette.gif',
    pic_big_with_logo    : 'd_silhouette_logo.gif',
    pic_small            : 't_silhouette.jpg',
    pic_small_with_logo  : 't_silhouette_logo.gif',
    pic_square           : 'q_silhouette.gif',
    pic_square_with_logo : 'q_silhouette_logo.gif',
    pic_with_logo        : 's_silhouette_logo.gif'
  },

  /**
   * Maps user specified attribute for size to a field type.
   */
  _sizeToPicFieldMap: {
    n      : 'pic_big',
    normal : 'pic_big',
    q      : 'pic_square',
    s      : 'pic',
    small  : 'pic',
    square : 'pic_square',
    t      : 'pic_small',
    thumb  : 'pic_small'
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.serverfbml
 * @layer xfbml
 * @requires fb.type fb.xfbml.iframewidget fb.auth
 */

/**
 * Implementation for fb:serverfbml tag.
 *
 * @class FB.XFBML.ServerFbml
 * @extends FB.XFBML.IframeWidget
 * @private
 */
FB.subclass('XFBML.ServerFbml', 'XFBML.IframeWidget', null, {
  /**
   * Make the iframe visible only when we get the initial resize message.
   */
  _visibleAfter: 'resize',

  /**
   * Do initial attribute processing.
   */
  setupAndValidate: function() {
    // query parameters to the comments iframe
    this._attr = {
      api_key     : FB._apiKey,
      channel_url : this.getChannelUrl(),
      fbml        : this.getAttribute('fbml'),
      height      : this._getPxAttribute('iframeHeight', 1),
      width       : this._getPxAttribute('iframeWidth', 1)
    };

    // fbml may also be specified as a child script tag
    if (!this._attr.fbml) {
      var child = this.dom.getElementsByTagName('script')[0];
      if (child && child.type === 'text/fbml') {
        this._attr.fbml = child.innerHTML;
      }
    }

    // if still no fbml, error
    if (!this._attr.fbml) {
      FB.log('<fb:serverfbml> requires the "fbml" attribute.');
      return false;
    }

    // we use a GET request if the URL is less than 2k, otherwise we need to do
    // a <form> POST. we prefer a GET because it prevents the "POST resend"
    // warning browsers show on page refresh.
    var url = FB._domain.www + 'render_fbml.php?' + FB.QS.encode(this._attr);
    if (url.length > 2000) {
      // we will POST the form once the empty about:blank iframe is done loading
      this._url = 'about:blank';
      this.subscribe('iframe.onload', FB.bind(this._postRequest, this));
    } else {
      this._url = url;
    }
    return true;
  },

  /**
   * Get the initial size.
   *
   * @return {Object} the size
   */
  getSize: function() {
    return { width: this._attr.width, height: this._attr.height };
  },

  /**
   * Get the URL for the iframe.
   *
   * @return {String} the iframe URL
   */
  getIframeUrl: function() {
    return this._url;
  },

  /**
   * Will do the POST request to the iframe.
   */
  _postRequest: function() {
    var form = document.createElement('form');
    form.action = FB._domain.www + 'render_fbml.php';
    form.target = this.getIframeNode().name;
    form.method = 'POST';
    FB.Content.appendHidden(form);

    FB.forEach(this._attr, function(val, key) {
      var input = document.createElement('input');
      input.name = key;
      input.value = val;
      form.appendChild(input);
    });

    form.submit();
    form.parentNode.removeChild(form);
  }
});
/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @provides fb.xfbml.sharebutton
 * @layer xfbml
 * @requires fb.type fb.xfbml  fb.string fb.dom fb.xfbml.element fb.ui
 *  fb.data fb.helper fb.share-button-css
 */

/**
 * Implementation for fb:share-button tag.
 * @class FB.XFBML.ShareButton
 * @extends  FB.XFBML.Element
 * @private
 */
FB.subclass('XFBML.ShareButton', 'XFBML.Element', null, {
  /**
   * Processes this tag.
   */
  process: function() {
    this._href = this.getAttribute('href', window.location.href);

    //TODO: When we turn sharepro on, replace icon_link with button_count
    this._type = this.getAttribute('type', 'icon_link');

    this._renderButton(true);
  },

  /**
   * Render's the button.
   *
   * @access private
   * @param skipRenderEvent {Boolean} indicate if firing of the render event
   * should be skipped. This is useful because the _renderButton() function may
   * recursively call itself to do the final render, which is when we want to
   * fire the render event.
   */
  _renderButton: function(skipRenderEvent) {
    if (!this.isValid()) {
      this.fire('render');
      return;
    }
    var
      contentStr = '',
      extra = '',
      classStr = '',
      share = 'Share',
      wrapperClass = '';

    switch (this._type) {
    case 'icon':
    case 'icon_link':
      classStr = 'FBConnectButton_Simple';
      contentStr = (
        '<span class="FBConnectButton_Text_Simple">' +
          (this._type == 'icon_link' ? share : '&nbsp;') +
        '</span>'
      );
      skipRenderEvent = false;
      break;
    case 'link':
      contentStr = 'Share on Facebook';
      skipRenderEvent = false;
      break;
    case 'button_count':
      contentStr = '<span class="FBConnectButton_Text">' + share +  '</span>';
      extra = (
        '<span class="fb_share_count_nub_right">&nbsp;</span>' +
        '<span class="fb_share_count fb_share_count_right">'+
          this._getCounterMarkup() +
        '</span>'
      );
      classStr = 'FBConnectButton FBConnectButton_Small';
      break;
    default:
      // box count
      contentStr = '<span class="fb_share_count_nub_top">&nbsp;</span>';
      extra = (
        '<span class="fb_share_count fb_share_count_top">' +
          this._getCounterMarkup() +
        '</span>' +
        '<span class="FBConnectButton_Text">' + share +  '</span>'
      );
      classStr = 'FBConnectButton FBConnectButton_Small';
      wrapperClass = 'fb_share_count_wrapper';
    }
    this.dom.innerHTML = FB.String.format(
      '<span class="{0}"><a href="{1}" class="{2}" ' +
      'onclick=\'FB.share("{1}");return false;\'' +
      'target="_blank">{3}</a>{4}</span>',
      wrapperClass,
      this._href,
      classStr,
      contentStr,
      extra
    );

    if (!skipRenderEvent) {
      this.fire('render');
    }
  },

  _getCounterMarkup: function() {
    if (!this._count) {
      this._count = FB.Data._selectByIndex(
        ['share_count'],
        'link_stat',
        'url',
        this._href
      );
    }

    if (this._count.value !== undefined) {
      if (this._count.value.length > 0) {
        var c = this._count.value[0].share_count;
        if (c > 3) {
          var prettyCount = c >= 10000000 ? Math.round(c/1000000) + 'M' :
                            (c >= 10000 ? Math.round(c/1000) + 'K' : c);
          return (
            '<span class="fb_share_count_inner">' +
              prettyCount +
            '</span>'
          );
        }
      }
    } else {
      this._count.wait(this.bind(this._renderButton, false));
    }

    return '';
  }
});
