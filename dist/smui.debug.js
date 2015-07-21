(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["smui"] = factory();
	else
		root["smui"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var ns = __webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(9);
	__webpack_require__(11);
	__webpack_require__(12);
	
	module.exports = ns;

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * smui.js v0.0.1
	 * (c) 2015 Mingli Guo
	 * Released under the MIT License.
	 * @namespace smui
	 * @type {Object}
	 * @property {Object}  Event      给widget提供事件行为。也可以给其他对象提供事件行为
	 * @property {Object}  Tools      smui工具对象
	 * @property {Object}  Base       widget基类。不能直接使用
	 */
	var ns = {},
	    /*
	     **缓存组件。
	     */
	    cache = (function() {
	        var data = {};
	
	        return {
	            add: function(obj, name, val) {
	                var rkey = obj.data(this.generateKey(name));
	                data[rkey] = val;
	            },
	            get: function(obj, name) {
	                var rkey = obj.data(this.generateKey(name));
	                return data[rkey];
	            },
	            remove: function(obj, name) {
	                var rkey = obj.data(this.generateKey(name));
	                delete data[rkey];
	            },
	            generateKey: function(name) {
	                return name + 'Key';
	            }
	        }
	    })(),
	
	    format,
	    newId;
	
	
	
	/**
	 * 给widget提供事件行为。也可以给其他对象提供事件行为
	 * @module smui.Event
	 * @alias smui.Event
	 * @type {Object}
	 */
	ns.Event = {
	    /**
	     * 绑定事件。
	     * @method on
	     * @static
	     * @param  {String}   name     事件名
	     * @param  {Function} callback 事件处理器
	     * @param  {Object}   context  事件处理器的上下文。
	     * @return {self} 返回自身，方便链式
	     */
	    on: function(name, callback, context) {
	        var events;
	        if (!callback || typeof callback !== 'function') {
	            return this;
	        }
	        this._events = this._events || {};
	        events = name in this._events ? this._events[name] : this._events[name] = [];
	        if (name in this._events) {
	            events = this._events[name];
	        } else {
	            this._events[name] = [];
	            events = this._events[name];
	        }
	        events.push({
	            "fn": callback,
	            "context": context || this
	        });
	        return this;
	    },
	    /**
	     * 解除事件绑定
	     * @method off
	     * @static
	     *
	     * @param  {String}   name     事件名
	     * @param  {Function} callback 事件处理器
	     * @param  {Object}   context  事件处理器的上下文。
	     * @return {self} 返回自身，方便链式
	     * @chainable
	     */
	    off: function(name, callback, context) {
	        var events;
	        if (!name || !(name in this._events)) {
	            return this;
	        }
	
	        if (!callback || typeof callback !== 'function') {
	            return this;
	        }
	
	        if (events = this._events[name]) {
	            if (context = context || this) {
	                this._events[name] = events.filter(function(v) {
	                    return v.callback !== callback || context !== v.context;
	                });
	            }
	        }
	
	        return this;
	    },
	    _trigger: function(name) {
	        var args, events, i = -1,
	            l, ev;
	        if ($.isEmptyObject(this._events)) {
	            return this;
	        }
	        args = [].slice.call(arguments, 1);
	        events = this._events[name];
	        if (events) {
	            l = events.length;
	            while (++i < l) {
	                (ev = events[i]).fn.apply(ev.context, args);
	            }
	        }
	        return this;
	    },
	    /**
	     * 触发事件
	     * @method trigger
	     * @static
	     * @param  {String}   name     事件名
	     * @param  {*} * 任意参数
	     * @return {self} 返回自身，方便链式
	     * @chainable
	     */
	    trigger: function() {
	        return this._trigger.apply(this, [].slice.call(arguments, 0));
	    }
	}
	
	/**
	 * smui工具对象
	 * @module smui.Tools
	 * @alias smui.Tools
	 * @type {Object}
	 */
	ns.Tools = {
	    /**
	     * 用于生成唯一ID
	     * @method newId
	     * @static
	     * @return {String} 36位的ID 格式：XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	     */
	    newId: function() {
	        function S4() {
	            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	        }
	        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
	
	    },
	    /**
	     * 格式化字符串
	     * @method format
	     * @static
	     * @param {String} str 格式化字符串
	     * @param {String}  *  任意字符
	     * @return {String} 格式化后的字符串
	     * @example
	     * smui.Tools.format('My name is {0}','Li Lei')
	     */
	    format: function() {
	        if (arguments.length == 0) return this;
	        var args = [].slice.call(arguments, 1),
	            str = arguments[0];
	        for (var i = 0; i < args.length; i++) {
	            var re = new RegExp('\\{' + i + '\\}', 'gm');
	            str = str.replace(re, args[i]);
	        }
	        return str;
	    }
	
	};
	
	
	/**
	 * 根据组件名获取组件实例
	 * @throws 若smui不存在指定的组件，则会抛出异常
	 * @memberOf smui
	 * @method getWidgetInstance
	 * @param  {String} name 组件名
	 * @param  {String} selector DOM选择器
	 * @param  {Object} options  组件参数
	 * @return {Object} 组织的实现对像
	 * @example
	 * var tab = smui.getWidgetInstance('tab','.smui-tab');
	 */
	ns.getWidgetInstance = function(name, selector, options) {
	        if (this.isExistWidget(name)) {
	            return new ns[name]($(selector), options || {});
	        } else {
	            throw new Error('There is no ' + name + 'Widget');
	        }
	    },
	
	    /**
	     * 判定某个组件是否存在
	     * @memberOf smui
	     * @method isExistWidget
	     * @param  {String}  name 组件名
	     * @return {Boolean}      smui存在组件则返回true
	     */
	    ns.isExistWidget = function(name) {
	        return name in ns;
	    },
	    /**
	     * 判定DOM上是否有指定的组件
	     * @memberOf smui
	     * @method isExistWidgetInDom
	     * @param  {String}  name 组件名
	     * @param  {Object}  ele  DOM对像
	     * @return {Boolean}      DOM存在组件则返回true
	     */
	    ns.isExistWidgetInDom = function(name, ele) {
	        var key = cache.generateKey(name);
	
	        return !!cache.get($(ele), key);
	    }
	
	
	format = ns.Tools.format;
	newId = ns.Tools.newId;
	
	
	/**
	 *
	 * 创建组件
	 * @inner
	 * @param name String 组件的名字
	 * @param proto Object 组件的上的方法和属性
	 */
	function _createWidget(name, proto) {
	    if (!$.isPlainObject(proto)) {
	        throw new Error('proto不是通过 "{}" 或者 "new Object" 创建的');
	    }
	
	    function _class(el, options) {
	        var $el = $(el),
	            key = cache.generateKey(name);
	
	        if ($el.length == 0) {
	            throw new Error(format('The {0} element does not exist', $el.selector));
	        }
	
	        this.$el = $el;
	
	        this.version = '0.0.1';
	
	        this.$el.data(key, $el.data(key) || newId());
	
	        cache.add($el, name, this);
	
	        this.name = name;
	
	        this.options = {};
	
	        //组件被覆写的方法
	        this.overrides = {};
	
	        //组件命名空间
	        this.eventNS = format('.{0}.widget.smui', name);
	
	        this.__init(proto, options);
	
	        this.pluginPlaceholder();
	
	        this._trigger('widgetReady');
	    }
	
	    $.extend(_class.prototype, ns.Base, {
	        __init: function(proto, options) {
	            var attr, fnList = _class.plugin,
	                _options = {},
	                fn;
	            //合并组件本身的options
	            $.extend(true, this.options, proto.options || {}, options || {});
	            _class.attachPrototype.call(this, proto);
	            //合并当前组件的插件的options并初始化插件
	            for (var _name in fnList) {
	                fn = fnList[_name];
	                if (fn) {
	                    $.extend(true, this.options, fn.options || {}, options || {});
	                    $.isFunction(fn._init) && fn._init.call(this);
	                    _class.attachPrototype.call(this, fn, fn.name);
	                }
	
	            }
	            //初始华组件
	            proto && $.isFunction(proto._init) && proto._init.call(this);
	
	
	        },
	        /*插件始化*/
	        pluginPlaceholder: function() {
	            var args = [].slice.call(arguments, 0);
	            this.trigger('initPlugin', args);
	        },
	        /*获取组件中的插件*/
	        getPlugin: function(name) {
	            return typeof name == 'undefined' ? _class.plugin : _class.plugin[name];
	        },
	        /*获取组件中被覆写的方法*/
	        getOverrideFn: function(name) {
	            return typeof name === 'string' ? this.overrides[name] : null;
	        },
	        vendors: function(prop) {
	
	            var styles, vendors, results;
	
	            styles = window.getComputedStyle(this.$el.get(0), null);
	
	            vendors = ['-webkit-', ''];
	
	            results = [];
	
	            for (var i = 0, len = vendors.length, _prop; i < len; i++) {
	                _prop = vendors[i] + prop;
	                if (_prop in styles) {
	                    results.push(_prop);
	                }
	            }
	
	            return results;
	        }
	
	    });
	
	
	    _class.plugin = {};
	    /*
	     ** 为组件附件方法
	     */
	    _class.attachPrototype = function(proto) {
	        var attr, prototype = _class.prototype,
	            overrides = this.overrides,
	            _proto;
	        for (attr in proto) {
	            if (attr != 'options' && attr != '_init') {
	                _proto = proto[attr];
	                if (attr in prototype && !(attr in overrides)) {
	                    overrides[attr] = $.isFunction(_proto) ? $.proxy(_proto, this) : _proto;
	                }
	                prototype[attr] = _proto;
	            }
	        }
	    };
	    /*
	     ** 为组件添加插件
	     */
	    _class.createPlugin = function(name, proto) {
	        var plugins = _class.plugin,
	            attr;
	        if (name && !(name in plugins)) {
	            plugins[name] = proto;
	        } else {
	            throw new Error(format('插件{0}已经存在或者插件的名字不能为空', name));
	        }
	    };
	
	    return _class;
	
	}
	
	
	ns = $.extend(ns, {
	    /**
	     * 定义组件
	     * @memberOf smui
	     * @method widget
	     * @param  {String}  name 组件名
	     * @param  {Object}  proto 组件的Method
	     *
	     */
	    widget: function(name, proto) {
	        if (!name) return;
	        ns[name] = this.createWidget(name, proto);
	        bridge(name, ns);
	    },
	    createWidget: _createWidget
	});
	/*
	 * widget基类。不能直接使用
	 * @module smui.Base
	 * @alias smui.Base
	 * @type {Object}
	 */
	ns.Base = $.extend({}, ns.Event, {
	    trigger: function(name) {
	        var args = [].slice.call(arguments, 0),
	            _args = [];
	        if (this._events && name in this._events) {
	
	            _args.push(name);
	
	            this._trigger.apply(this, _args.concat(args[1]));
	        }
	        if (this.$el) {
	            this.$el.trigger.apply(this.$el, args);
	        }
	    },
	    destroy: function() {
	        this._destroy && typeof this._destroy === 'function' && this._destroy();
	        cache.remove(this.$el);
	        this.$el.off(this.eventNS);
	        this._events = [];
	    },
	    setOption: function() {
	        var args = [].slice.call(arguments, 0),
	            arg;
	        if (args.length == 0) {
	            return;
	        }
	        arg = arg[0];
	        if ($.isPlainObject(arg)) {
	            $.extend(this.options, arg);
	        } else if (typeof arg === 'string') {
	            if (args.length >= 2) {
	                this.options[arg] = args[1];
	            }
	        } else {
	            return;
	        }
	    }
	});
	
	/*
	 **挂载组件到$.fn
	 */
	function bridge(name, ns) {
	    var key = name.toLowerCase(),
	        old = $.fn[name];
	
	    $.fn[name] = function(opts) {
	        var args = [].slice.call(arguments, 1),
	            method = typeof opts === 'string' && opts || typeof opts === 'undefined' && 'this',
	            obj,
	            ret,
	            _this;
	
	
	        if (this.length > 0) {
	            _this = this.eq(0)
	        } else {
	            return this;
	        }
	
	        obj = cache.get(_this, name) || new ns[name](_this, $.isPlainObject(opts) ? opts : undefined);
	        if (method === 'this') {
	            ret = obj;
	
	        } else if (method) {
	            if (method in obj) {
	                if (typeof obj[method] !== 'function') {
	                    ret = obj[method];
	                } else {
	                    ret = obj[method].apply(obj, args);
	                }
	
	            } else {
	                throw new Error(name + '组件没有此方法或属性：' + method);
	            }
	            if (ret !== undefined && ret !== obj) {
	                return ret;
	            }
	            ret = undefined;
	        } else {
	
	        }
	        return ret !== undefined ? ret : _this;
	
	    };
	    //解决冲突
	    $.fn[name].noConflict = function() {
	        $.fn[name] = old;
	        return this;
	    }
	}
	    
	
	module.exports = ns;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author @author Guo Mingli(mingli.guo@shenma-inc.com)
	 * @date 2015-1-20
	 * @version 0.0.1
	 * @file DOM元素的过渡属性
	 * @class  smui.transition
	 * @see  {@link http://www.w3cplus.com/content/css3-transition}
	 * @import  zepto.js smui.js
	 */
	
	
	
	var ns = __webpack_require__(1);
	    ns.widget('transition', {
	        /**
	         * 设置组件初始化参数
	         * @type {Object}
	         * @memberOf smui.transform
	         * @instance
	         * @property {speed }  speed     参考CSS3 transition-duration
	         * @property {String}  property  参考CSS3 transition-property， 无素添加前缀
	         
	         * @property {String}  easing    参考CSS3 transition-timing-function
	         
	         * @property {Number}  delay     参考CSS3 transition-delay
	         
	         */
	        options: {
	            speed: 2000, //Number  过渡的时间（速度）
	
	            property: '', //String  要过渡的属性        
	
	            easing: 'ease', //String  缓动函数
	
	            delay: 100 //Number  淡隐淡出的延迟时间
	        },
	
	        /*
	         ** @description 初始化组件
	         */
	        _init: function() {
	            var $el = this.$el,
	
	                opts = this.options;
	
	            $el.css(this.setValue(opts.property, opts.speed, opts.easing, opts.delay));
	
	        },
	        setValue: function(prop, speed, easing, delay) {
	            !$.isUndefined(prop) && this.setProperty(prop);
	            !$.isUndefined(speed) && this.setDuration(speed);
	            !$.isUndefined(easing) && this.setEasing(easing);
	            !$.isUndefined(delay) && this.setDelay(delay);
	        },
	        /**
	         * 设置transition-property
	         * @param {String} prop css属性，参考transition-property
	         * @instance
	         * @memberOf smui.transition
	         */
	        setProperty: function(prop) {
	            var transitionProperty, valProperty;
	
	            transitionProperty = this.vendors('transition-property');
	
	            valProperty = this.vendors(prop);
	
	
	            this._setValue(transitionProperty, valProperty);
	
	
	        },
	        /**
	         * 设置transition-duration
	         * @param {Number} duration css属性，参考transition-duration
	         * @instance
	         * @memberOf smui.transition
	         */
	        setDuration: function(duration) {
	            var property;
	
	            property = this.vendors('transition-duration');
	
	            this._setValue(property, duration / 1000 + 's');
	        },
	        /**
	         * 设置transition-timing-function
	         * @param {String} easing css属性，参考transition-timing-function
	         * @instance
	         * @memberOf smui.transition
	         */
	        setEasing: function(easing) {
	            var property;
	
	            property = this.vendors('transition-timing-function');
	
	            this._setValue(property, easing || 'ease');
	        },
	        /**
	         * 设置transition-delay
	         * @param {String} delay css属性，参考transition-delay {@link }
	         * @instance
	         * @memberOf smui.transition
	         */
	        setDelay: function(delay) {
	            var property;
	
	            property = this.vendors('transition-delay');
	
	            this._setValue(property, delay / 1000 + 's');
	        },
	        _setValue: function(property, val) {
	            var result, isArray, i, len, $el;
	
	            i = 0;
	
	            len = property.length;
	
	            result = {};
	
	            $el = this.$el;
	
	            isArray = $.isArray(val);
	
	
	            for (; i < len; i++) {
	                result[property[i]] = isArray ? val[i] : val;
	            }
	
	            $el.css(result);
	
	        }
	
	
	
	    });

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file DOM元素的变形CSS
	 * @author Guo Mingli(mingli.guo@shenma-inc.com)
	 * @date 2015-1-20
	 * @version 0.0.1
	 * @class smui.transform 
	 * @see  {@link http://www.w3cplus.com/css3/css3-3d-transform.html}
	
	 * @import  zepto.js smui.js 
	 */ 
	
	var ns = __webpack_require__(1);
	
	 ns.widget('transform', {      
	        /**
	         * 设置组件初始化参数
	         * @type {Object}
	         * @memberOf smui.transform
	         * @instance
	         * @property {Boolean}  is3d   是否是3D版的属性，默认true        
	         */
	        options:{
	            is3d : true
	        },     
	
	        /*
	        ** @description 初始化组件        
	        */        
	        _init : function() {
	           
	            this.support3D = this.options.is3d;   
	
	            this.prop = this.vendors('transform');                    
	        },
	
	        _setValue: function(str){
	
	            var result, i, len, $el, property;
	
	            i        = 0;
	
	            property = this.prop;
	
	            len      = property.length;
	            
	            result   = {};
	            
	            $el      = this.$el;          
	
	
	            for (; i < len; i++) {
	
	                result[property[i]] = str;
	
	            }
	
	            $el.css(result);
	        },
	        /**
	         * 平移
	         * @param  {Number} x  用来指定元素X轴方向平移距离
	         * @param  {Number} y  用来指定元素Y轴方向平移距离
	         * @param  {Number} z  用来指定元素Z轴方向平移距离
	         * @instance
	         * @memberOf smui.transform
	         */
	        translate: function(x,y,z) {      
	
	            this._build('translate',x,y,z,'px',0);
	           
	        },
	        /**
	         * 缩放
	         * @param  {Number} x  横向缩放比例
	         * @param  {Number} y  纵向缩放比例
	         * @param  {Number} z  Z轴缩放比例
	         * @instance
	         * @memberOf smui.transform
	         */
	        scale: function(x,y,z) {
	          
	
	            this._build('scale',x,y,z,'',1);
	        },
	         /**
	         * 倾斜是二维变形，不能在三维空间变形。元素可能会在X轴和Y轴倾斜，然后转化为三维，但它们不能在Z轴倾斜。
	         * @param  {Number} x  用来指定元素X轴方向倾斜的角度。
	         * @param  {Number} y  用来指定元素Y轴方向倾斜的角度。         
	         * @instance
	         * @memberOf smui.transform
	         */
	        skew:function(x,y){
	            this._build('skew',x,y,undefined,'deg',0,false);
	        },
	        /**
	         * 旋转,旋转的量被定义为指定的角度；如果值为正值，元素围绕Y轴顺时针旋转；反之，如果值为负值，元素围绕Y轴逆时针旋转
	         * @param  {Number} x  元素围绕X轴旋转
	         * @param  {Number} y  元素围绕Y轴旋转
	         * @param  {Number} z  元素围绕Z轴旋转     
	         * @instance
	         * @memberOf smui.transform 
	         */
	        rotate: function(x,y,z){
	      
	
	            this._build('rotate',x,y,z,'deg',0);
	        },
	
	        _build:function(prop,x,y,z,unit,init,is3D){
	             var str,format;
	
	             is3D = $.isUndefined(is3D) ? this.support3D :is3D;
	
	            if (is3D) {
	
	                format = prop + '3d({0},{1},{2})';
	            } else {
	
	                format = prop + '({0},{1})';
	            }
	            
	           
	            if (typeof x === 'undefined') {
	                x = init;
	            }
	            if (typeof y === 'undefined') {
	                y = init;
	            }
	            if (typeof z === 'undefined') {
	                z = init;
	            }
	
	            str = ns.Tools.format(format, x+unit, y+unit, z+unit);
	
	            this._setValue(str);
	        }
	
	
	
	    });


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 用于实现组件与浏览器前进后退相关联,主要利用hashChange来实现
	 * @author Guo Mingli(mingli.guo@shenma-inc.com)
	 * @date 2015-01-20
	 * @class smui.history
	 * @version 0.0.1
	 * @import smui.js
	 */
	
	
	var ns = smui = __webpack_require__(1);
	ns.widget('history', {
	
	    options: {
	        renderTo: 'li'
	    },
	
	    _init: function() {
	
	        var $els, me, eventNS;
	
	        me = this;
	
	        eventNS = this.eventNS;
	
	        $els = this.$els = this.$el.find(this.options.renderTo);
	
	        this.eleHasHash();
	
	        $(window).on('hashchange', function(e) {
	
	            me.hashChange();
	
	        }).on('hash', function(e, h) {
	
	            if (h) {
	
	                $els.each(function(i, v) {
	
	                    var _hash = me.getHash($(this));
	
	                    if (_hash.indexOf('#') != 0) {
	
	                        _hash = '#' + _hash;
	
	                    }
	
	                    if (_hash == h) {
	
	                        $(this).trigger("history", [i, h]);
	                    }
	
	                });
	            } else {
	
	                $els.eq(0).trigger("history", [0, me.getHash($els.eq(0))]);
	
	            }
	            me.hash = h;
	
	        })
	
	        $els.off(eventNS).on('click' + eventNS, function(e) {
	            location.hash = me.getHash($(this));
	        });
	
	
	        this.hashChange();
	
	    },
	    /*
	     ** @description 检测是用户是否有data-hash,没有则用newId生成唯一hash
	     */
	    eleHasHash: function() {
	        var $els, me;
	
	        $els = this.$els;
	
	        me = this;
	
	        $els.each(function(i, v) {
	            var hash, $v;
	
	            $v = $(v);
	
	            hash = me.getHash($v);
	
	            if (!hash) {
	
	                $v.data('hash', ns.Tools.newId());
	
	            }
	
	        });
	
	    },
	
	    hashChange: function() {
	        var h = location.hash;
	
	        if (this.hash != h) {
	
	            //解决hashChange解发，但有些处理逻辑没有加载的问题，                
	            setTimeout(function() {
	                $(window).trigger('hash', h);
	            }, 16);
	
	        }
	    },
	
	    getHash: function($el) {
	        var _h = $el.data('hash') || $el.data('href');
	
	        return $.type(_h) === 'number' ? _h + '' : _h;
	    },
	    _destroy: function() {
	        $(window).off('hashchange').off('hash');
	    }
	
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 图片的懒加载
	 * @author Guo Mingli(mingli.guo@shenma-inc.com)
	 * @date 2015-01-20
	 * @class smui.lazyImage 
	 * @version 0.0.1
	 *
	 * @example
	*       <div class="smui-lazy-img"  >
	            <img data-lazy-img data-src="http://s2.zimgs.cn/ims?kt=url&amp;at=ori&amp;tv=0_0&amp;sign=yx:H04ZQvxARNg7plzPP0uv6kEXsgo=&amp;key=aHR0cDovL2E0LmF0dC5odWRvbmcuY29tLzA3Lzg4LzAxMzAwNTQyNTcwMzkwMTQwNzc1ODgwMDY4NTEzX3MuanBn&amp;x.jpg">
	            <span class="loading" data-img-loading> <i>正在加载</i>
	            </span>
	        </div>
	
	        $('body').lazyImage();
	
	 */
	
	
	var ns = __webpack_require__(1);
	
	__webpack_require__(6);
	
	ns.widget('lazyImage', {
	    /**
	     * 设置组件初始化参数
	     * @type {Object}
	     * @memberOf smui.lazyImage
	     * @instance
	     * @property {Object}  effect     图片懒加载时的效果，目前暂时只有fade一种。
	     * @property {Object}  loading    图片loading的淡隐淡出参数
	     * @property {Boolean}   isScrollLoad 页面滚动时是否懒加载图片
	     */
	    options: {
	        effect: {
	            name: 'fade',
	
	            param: {
	
	                speed: 500, //Number  淡隐淡出的时间（速度）
	
	                opacity: [0, 1], //Array   淡隐淡出的透明度     
	
	                easing: 'ease', //String  缓动函数
	
	                delay: 100 //Number  淡隐淡出的延迟时间
	            }
	
	        },
	
	        loading: {
	            speed: 100, //Number  淡隐淡出的时间（速度）
	
	            opacity: [1, 0], //Array   淡隐淡出的透明度     
	
	            easing: 'ease', //String  缓动函数
	
	            delay: 0 //Number  淡隐淡出的延迟时间
	
	        },
	
	        isScrollLoad: false
	    },
	    /*
	     ** @description 初始化组件
	     */
	    _init: function() {
	
	        var me, $el, opts;
	
	        me = this;
	
	        $el = this.$el;
	
	        opts = this.options;
	
	        opts.isScrollLoad && $(window).off(eventNS).on('scroll' + eventNS, function(e) {
	            me.lazy();
	        });
	
	        me.lazy();
	    },
	
	    lazy: function($images) {
	
	        var me, $imgs, opts, src;
	
	        me = this;
	
	        opts = this.options;
	
	        $imgs = ($images && $images.length > 0) ? $images : this.$el.find('[data-lazy-img]');
	
	        $imgs.each(function(i, v) {
	            var $this, img, src;
	
	            $this = $(v);
	
	            $this.hide();
	
	            img = new Image();
	
	            img.onerror = function() {
	
	                me.trigger('img-error', [v, src]);
	
	                $this.hide();
	            };
	
	            img.onload = function() {
	
	                $this.attr('src', src);
	
	                me[opts.effect.name]($this);
	
	                me.trigger('img-load', [v, src]);
	            };
	
	            src = $this.data('src');
	
	            if (src === '') {
	
	                $this.hide();
	
	            } else {
	
	                img.src = src;
	
	            }
	
	
	
	        });
	
	    },
	    fade: function($obj) {
	
	        var opts, $loading;
	
	        if (ns.isExistWidgetInDom('fadeInOut', $obj)) {
	            return;
	        }
	
	        opts = this.options;
	
	        $obj.fadeInOut(opts.effect.param);
	
	        $obj.fadeInOut('show');
	
	        $loading = $obj.parent().find('[data-img-loading]');
	
	        $loading.fadeInOut(opts.loading);
	
	        $loading.fadeInOut('show');
	
	    },
	
	    _destroy: function() {
	
	        $(window).off(eventNS);
	
	    }
	
	
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 淡隐淡出效果
	 * @author Guo Mingli(mingli.guo@shenma-inc.com)
	 * @date 2015-01-20
	 * @class smui.fadeInOut
	 * @version 0.0.1
	 * @import  zepto.js smui.js smui.transition.js
	 */
	
	var ns = __webpack_require__(1);
	
	__webpack_require__(2);
	
	ns.widget('fadeInOut', {
	    /**
	     * 设置组件初始化参数
	     * @type {Object}
	     * @memberOf smui.fadeInOut
	     * @instance
	     * @property {String}  easing     缓动函数
	     * @property {Number}  speed      淡隐淡出的时间（速度）
	     * @property {Array}   opacity     淡隐淡出的透明度  [start,end]
	     * @property {Number}  delay     淡隐淡出的延迟时间
	     */
	    options: {
	        speed: 2000, //Number  淡隐淡出的时间（速度）
	
	        opacity: [0, 1], //Array   淡隐淡出的透明度     
	
	        easing: 'ease', //String  缓动函数
	
	        delay: 100 //Number  淡隐淡出的延迟时间
	
	
	    },
	    /*
	     ** @description 初始化组件
	     */
	    _init: function() {
	        var $el = this.$el,
	
	            me = this,
	
	            css = {};
	
	        opts = this.options;
	
	        $el.transition({
	
	            speed: opts.speed, //Number  过渡的时间（速度）
	
	            property: 'opacity', //String  要过渡的属性        
	
	            easing: opts.easing, //String  缓动函数
	
	            delay: opts.delay //Number  淡隐淡出的延迟时间
	
	        });
	
	        // css            = ns.tools.transition('opacity', opts.speed, opts.easing, opts.delay);
	
	        css['opacity'] = opts.opacity[0];
	
	        $el.css(css);
	
	        $el.off(this.eventNS).on('webkitTransitionEnd' + this.eventNS, function(e) {
	
	            var flag = $el.css('opacity') == opts.opacity[0];
	
	
	            /**
	             * 效果完成后触发
	             * @instance
	             * @memberOf smui.fadeInOut
	             * @event fadeCompleted
	             */
	            me.trigger('fadeCompleted', flag);
	
	        });
	    },
	    /**
	     * 淡入或淡出，由options.opacity确定
	     * @public
	     * @instance
	     * @memberOf smui.fadeInOut
	     * @fires fadeCompleted
	     */
	    show: function() {
	
	        var opts = this.options,
	
	            me = this;
	
	        //此处使用setTimeout用于解决不能淡入的效果，
	        //使用css3 transition改变透明度和display配合，会忽然transition的动画效果，所以此处使用定时器达到一个延迟动画的作用。            
	        setTimeout(function() {
	
	            me.$el.css({
	                'opacity': opts.opacity[1]
	
	            })
	
	        }, 16);
	
	        this.state = true;
	
	        this.$el.show();
	    },
	    /**
	     * 淡入或淡出，由options.opacity确定
	     * @public
	     * @instance
	     * @memberOf smui.fadeInOut
	     * @fires fadeCompleted
	     */
	    hide: function() {
	        var opts = this.options,
	
	            me = this;
	
	        me.$el.css({
	
	            'opacity': opts.opacity[0]
	
	        });
	
	        this.state = false;
	    },
	    /**
	     * 淡入或淡出，由options.opacity确定
	     * @public
	     * @instance
	     * @memberOf smui.fadeInOut
	     * @fires fadeCompleted
	     */
	    toggle: function() {
	
	        this.state ? this.hide() : this.show();
	    },
	    /**
	     * 释放内存
	     * @alias destroy
	     * @instance
	     * @memberOf smui.fadeInOut
	     */
	    _destroy: function() {
	
	        var $el = this.$el;
	
	        $el.transition('destroy');
	
	    }
	
	
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 遮罩效果
	 * @author Guo Mingli(mingli.guo@shenma-inc.com)
	 * @date 2015-1-20
	 * @version 0.0.1
	 * @class  smui.layerMask
	 * @import smui.js smui.fadeInOut.js
	 */
	
	
	
	var ns = __webpack_require__(1);
	
	ns.widget('layerMask', {
	    /**
	     * 设置组件初始化参数
	     * @type {Object}
	     * @memberOf smui.layerMask
	     * @instance
	     * @property {Object}   css              设置遮罩层的参数
	     * @property {Boolean}  supportFadeInOut 遮罩层是否支技淡隐淡出（依赖smui.fadeInOut.js）
	     * @property {Object}   fadeInOut        设置淡隐淡出的参数
	     */
	    options: {
	
	        supportFadeInOut: true, // Boolean 遮罩层是否支技淡隐淡出（依赖smui.fadeInOut.js）
	
	        fadeInOut: {
	
	            speed: 2000, // Number  遮罩层淡隐淡出的速度
	
	            easing: 'ease', // String  遮罩层淡隐淡出的缓动函数
	
	            opacity: [0, 0.7], // Array   遮罩层的透明度  
	
	            delay: 0 // Number  效果延迟时间
	        },
	        css: { // 遮罩层由代码生成，故其样式通过参数传入
	
	            "z-index": 9,
	
	            'position': 'fixed',
	
	            'top': 0,
	
	            'left': 0,
	
	            'bottom': 0,
	
	            'right': 0,
	
	            'display': 'none',
	
	            'opacity': 1,
	
	            'background': "#000000"
	        }
	
	    },
	    _init: function() {
	        var _css,
	
	            me = this,
	
	            eventNS = this.eventNS,
	
	            opts = this.options,
	
	            $el = this.$el,
	
	            fadeInOut = opts.fadeInOut;
	
	        this._createMask();
	
	        if (ns.isExistWidget('fadeInOut')) {
	
	            if (opts.supportFadeInOut) {
	
	                this.mask.fadeInOut(fadeInOut)
	
	                .on('fadeCompleted', function(e, isInit) {
	
	                    if (isInit) {
	
	                        me.mask.hide();
	
	                        me.trigger('maskClose', me.mask);
	
	                    }
	                });
	
	                $el.fadeInOut({
	
	                    opacity: [0, 1],
	
	                    speed: fadeInOut.speed,
	
	                    delay: fadeInOut.delay,
	
	                    easing: fadeInOut.easing
	
	
	                }).on('fadeCompleted', function(e, isInit) {
	                    if (isInit) {
	                        $el.hide();
	                    }
	                });
	            }
	        } else {
	            throw new Error('fadeInOut组件不存在');
	        }
	
	        this.mask.on('click' + eventNS, function(e) {
	            me.trigger('maskClick', e);
	        });
	    },
	    _createMask: function() {
	
	        var opts = this.options;
	
	        this.mask = $('<div/>').attr("id", ns.Tools.newId()).appendTo('body');
	
	        this.mask.css(opts.css);
	    },
	    /**
	     * 显示遮罩层同时会把应用遮罩层的DOM显示出来
	     * @public
	     * @instance
	     * @memberOf smui.layerMask
	     * @fires fadeCompleted
	     */
	    show: function() {
	
	        var opts = this.options,
	
	            $el = this.$el,
	
	            maskCss = opts.css,
	
	            me = this;
	
	        /**
	         * 遮罩层显示前触发
	         * @instance
	         * @memberOf smui.layerMask
	         * @event maskBeforeLoad
	         * @event maskLoad
	         */
	        me.trigger('maskBeforeLoad');
	
	        this.state = true;
	
	        $el.css('z-index', maskCss['z-index'] + 1);
	
	        if (opts.supportFadeInOut) {
	
	            this.mask.fadeInOut('show');
	
	            $el.fadeInOut('show');
	
	        } else {
	
	            this.mask.show();
	
	            this.$el && this.$el.show();
	        }
	
	
	        /**
	         * 遮罩层显示后触发
	         * @instance
	         * @memberOf smui.layerMask
	         * @event maskLoad
	         */
	        this.trigger('maskLoad', $el);
	    },
	    /**
	     * 隐藏遮罩层同时会把应用遮罩层的DOM隐藏
	     * @public
	     * @instance
	     * @memberOf smui.layerMask
	     * @fires maskClose
	     */
	    hide: function() {
	        var me = this,
	
	            opts = this.options,
	
	            maskCss = opts.css,
	
	            initOpacity = maskCss.opacity[0],
	
	            $el = this.$el;
	
	        this.state = false;
	
	        if (opts.supportFadeInOut) {
	
	            $el.fadeInOut('hide');
	
	            this.mask.fadeInOut('hide');
	
	        } else {
	
	            this.mask.hide();
	
	            $el.hide();
	
	        }
	
	        /**
	         * 遮罩层关闭后触发
	         * @instance
	         * @memberOf smui.layerMask
	         * @event maskClose
	         */
	        me.trigger('maskClose', this.mask);
	
	    },
	    /**
	     * 显示或隐藏遮罩层
	     * @public
	     * @instance
	     * @memberOf smui.layerMask
	     *
	     */
	    toggle: function() {
	
	        this.state ? this.hide() : this.show();
	    },
	    /**
	     * 释放内存
	     * @alias destroy
	     * @instance
	     * @memberOf smui.layerMask
	     */
	    _destroy: function() {
	
	        this.mask.off(this.eventNS);
	
	        $el.fadeInOut('destroy');
	
	    }
	
	})
	__webpack_require__(6);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 实现DOM元素的滑动
	 * @author Guo Mingli(mingli.guo@shenma-inc.com)
	 * @date 2015-1-20
	 * @class smui.slider
	 * @version 0.0.1
	 * @import smui.js smui.transition.js smui.transform.js
	 */
	
	var ns = __webpack_require__(1),
	
	    tools = ns.Tools;
	
	__webpack_require__(3);
	
	__webpack_require__(2);
	
	
	
	ns.widget('slider', {
	    /**
	     * 设置组件初始化参数
	     * @type {Object}
	     * @memberOf smui.slider
	     * @instance
	     * @property {String}   direction        方向, 默认水平。horizontal:水平方向，vertical:垂直方向
	     * @property {Boolean}  tackCursor       是否跟随光标/手指移动
	     * @property {Object}   transition       动画设置{speed:500,easing:'ease',delay:0}
	     * @property {Number}   moveDistance     slider移动的距离,默认为父节点的宽高
	     * @property {Boolean}  supportSwipe     是否支持swipe事件
	     * @property {Number}   slope            用于计算slider的有效区域，取值0-1,不推荐修改
	     * @property {Object}   swipe            swipe事件的触发临界值{timeout:500,distance:30}
	     */
	    options: {
	
	        direction: 'horizontal',
	
	        tackCursor: true,
	
	        transition: {
	
	            speed: 500,
	
	            easing: 'ease',
	
	            delay: 0
	        },
	
	        swipe: {
	
	            timeout: 500,
	
	            distance: 30
	
	        },
	
	        moveDistance: null,
	
	        supportSwipe: true,
	
	        slope: 0.5
	    },
	    _init: function() {
	
	        var me, opts, $el, eventNS, transitio, point, start, sTime, slope;
	
	        me = this;
	
	        opts = this.options;
	
	        transition = opts.transition;
	
	        $el = this.$el;
	
	        slope = opts.slope;
	
	        //事件的命名空间
	        eventNS = this.eventNS;
	
	        //记录touch时的坐标，用于计算swipe的有效区域
	        point = {};
	
	        //记录现在的位置
	        this.position = 0;
	
	
	        this._pos = 0;
	
	        this.isHorizontal = opts.direction === 'horizontal';
	
	
	        this.moveDistance = opts.moveDistance || (this.isHorizontal ? $el.parent().width() : $el.parent().height())
	
	        //触屏时记录的点
	        if (this.isHorizontal) {
	
	            this.prop = 'clientX';
	
	        } else {
	
	            this.prop = 'clientY';
	
	        }
	
	        $el.transition({
	            speed: transition.speed, //Number  过渡的时间（速度）
	
	            property: 'transform', //String  要过渡的属性        
	
	            easing: transition.easing, //String  缓动函数
	
	            delay: transition.delay //Number  淡隐淡出的延迟时间
	        });
	
	        $el.transform({
	            is3d: true
	        })
	
	
	
	        $el.off(eventNS).on('touchstart' + eventNS, function(e) {
	
	            var touches;
	
	
	
	            touches = e.touches[0];
	
	            point = {
	                x: touches['clientX'],
	                y: touches['clientY']
	            };
	
	            sTime = Date.now();
	
	            start = touches[me.prop];
	
	
	            /**
	             * 元素触发touchstart事件是触发,这里用于组件利用t-start做扩展
	             * @instance
	             * @memberOf smui.slider
	             * @event t-start
	             */
	            me.trigger('t-start', [e, me.position]);
	
	        }).on('touchmove' + eventNS, function(e) {
	
	            var current, _point, k, touches;
	
	            touches = e.touches[0];
	
	            _point = {
	                x: touches['clientX'],
	                y: touches['clientY']
	            };
	
	            //计算直线的斜率(确定当前用户的滑动是否在有效的区域内)
	            k = (_point.y - point.y) / (_point.x - point.x);
	
	            current = touches[me.prop];
	
	            //水平方向的跟随
	            if (me.isHorizontal && k >= -slope && k <= slope) {
	                e.preventDefault()
	                me._tackCursor(start, current);
	            }
	
	            //垂直方向的跟随
	            if (!me.isHorizontal && (k > slope || k < -slope)) {
	                e.preventDefault()
	                me._tackCursor(start, current);
	            }
	
	            /**
	             * 元素触发touchmove事件是触发,这里用于组件利用t-move做扩展
	             * @instance
	             * @memberOf smui.slider
	             * @event t-move
	             */
	            me.trigger('t-move', [e, me.position, current - start > 0]);
	
	
	
	        }).on('touchend' + eventNS, function(e) {
	
	            var current, offset, swipeDistanceThreshold, isSwipe;
	
	            if (!me.isMove) return;
	
	            isSwipe = opts.supportSwipe && Date.now() - sTime < opts.swipe.timeout;;
	
	            me.isMove = false;
	
	            current = e.changedTouches[0][me.prop];
	
	            offset = current - start;
	
	            swipeDistanceThreshold = opts.swipe.distance;
	
	            if (isSwipe) {
	                //swiperight || swipedown
	                if (offset > swipeDistanceThreshold) {
	
	                    me.goRightOrDown(me.moveDistance);
	
	
	
	                    /**
	                     * swipe事件
	                     * @instance
	                     * @memberOf smui.slider
	                     * @event swipe
	                     * @example
	                     * $('slider').on('swipe',function(e,oe,pos,dir){
	                     *     //dir 是方向 1:right或down -1:up或left
	                     * })
	                     */
	                    me.trigger('swipe', [e, me.position, 1]);
	
	
	
	                } else if (offset <= swipeDistanceThreshold * (-1)) {
	
	                    me.goLeftOrUp(me.moveDistance);
	                    /**
	                     * left | up
	                     */
	                    me.trigger('swipeLeft', [e, me.position, -1]);
	
	                    console.log('up')
	
	                } else {
	                    resetPostion();
	                }
	            } else {
	                resetPostion();
	            }
	
	            function resetPostion() {
	                    if (!opts.tackCursor) return;
	                    me.position = me._pos;
	                    me._revisePosition();
	                }
	                /**
	                 * 元素触发touchend事件是触发,这里用于组件利用t-end做扩展
	                 * @instance
	                 * @memberOf smui.slider
	                 * @event t-end
	                 */
	            me.trigger('t-end', [e, me.position, current - start > 0]);
	        });
	
	    },
	    /**
	     * 向右或向下移动指定的距离
	     * @param  {Number} offset 移动的距离
	     * @public
	     * @instance
	     * @memberOf smui.slider
	     *
	     */
	    goRightOrDown: function(offset) {
	        this.position = this.position + offset;
	        this._revisePosition();
	    },
	    /**
	     * 向左或向上移动指定的距离
	     * @param  {Number} offset 移动的距离
	     * @public
	     * @instance
	     * @memberOf smui.slider
	     *
	     */
	    goLeftOrUp: function(offset) {
	        this.position = this.position - offset;
	        this._revisePosition();
	    },
	    /**
	     * 获取slider是否是水平方向移动
	     * @public
	     * @instance
	     * @memberOf smui.slider
	     *
	     */
	    isHorizontal: function() {
	        return this.isHorizontal;
	    },
	
	    /*
	     * 释放鼠标/touch时，对位置做出修正。
	     * @private
	     *
	     */
	    _revisePosition: function(pos, speed) {
	
	        var _pos, wh, $el;
	
	        _pos = $.isUndefined(pos) ? this.position : pos;
	
	
	        if (_pos > 0) {
	
	            this._moveTo(0, speed);
	            /**
	             * 在两端拉动完成触发
	             * @instance
	             * @memberOf smui.slider
	             * @event pulled
	             * @example
	             * $('.test').on('pulled',function(e,flag){
	             *     //flag = 1 是在顶部 或 左侧
	             *     //flag = 1 是在底部 或 右侧
	             * })
	             */
	            this.trigger('pulled', 1);
	
	        } else if (_pos < -(wh = this._outRange())) {
	
	
	            wh < 0 ? this._moveTo(0, speed) : this._moveTo(wh * (-1), speed);
	
	            this.trigger('pulled', -1);
	
	        } else {
	            this._moveTo(_pos, speed);
	        }
	
	        /*  function outRange(){
	
	              var $el,$parent;
	
	              $el     = this.$el;
	              
	              $parent = $el.parent();
	
	              return this.isHorizontal ? $el.width() - $parent.width() : $el.height() - $parent.height(); 
	          }
	          console.log(this.position);*/
	    },
	    /**
	     * 用计算最大的移动位置
	     * @private
	     *
	     */
	    _outRange: function() {
	        var $el, $parent, wh;
	
	        $el = this.$el;
	
	        $parent = $el.parent();
	
	        if (this.isHorizontal) {
	            wh = $el.width() - $parent.width();
	
	        } else {
	            wh = $el.height() - $parent.height();
	        }
	
	
	        return wh;
	    },
	
	    _moveTo: function(pos, speed) {
	
	        this.position = pos;
	
	
	        if (typeof speed != 'undefined' && typeof speed === 'number') {
	            /*this.$el.css({
	                '-webkit-transition-duration': speed / 1000 + 's',
	                'transition-duration': speed / 1000 + 's'
	            })*/
	            this.$el.transition('setDuration', speed / 1000);
	        } else {
	            this.transition();
	        }
	        this.translate(pos);
	
	        this.position = pos;
	    },
	    /**
	     * 移动到指定的位置
	     * @param  {Number} pos 移动到的位置
	     * @param  {Number} speed 移动的速度
	     * @public
	     * @instance
	     * @memberOf smui.slider
	     *
	     */
	    moveTo: function(pos, speed) {
	        this._revisePosition(pos, speed);
	    },
	
	    moveToElement: function(element, speed, center) {
	        var $ele, $el, offset, pos, _offset, $parent, reviseValue;
	
	        $ele = $(element);
	
	        $el = this.$el;
	
	        offset = $ele.position();
	
	        pos = this.position - (this.isHorizontal ? offset.left : offset.top);
	
	
	        if (center) {
	
	            $parent = $el.parent();
	
	            if (this.isHorizontal) {
	
	                reviseValue = ($parent.width() - $ele.width()) / 2;
	
	            } else {
	                reviseValue = ($parent.height() - $ele.height()) / 2;
	            }
	
	            pos = pos + reviseValue;
	            console.log(pos);
	
	        }
	
	
	        this.moveTo(pos, speed);
	    },
	
	    _tackCursor: function(start, current) {
	
	        if (this.options.tackCursor) {
	
	            this._pos = this.position + current - start
	
	            this.transition(0);
	
	            this.translate(this._pos);
	
	            if (this._pos > 0) {
	                /**
	                 * 在两端拉动过程中触发
	                 * @instance
	                 * @memberOf smui.slider
	                 * @event pulling
	                 * @example
	                 * $('.test').on('pulling',function(e,flag){
	                 *     //flag = 1 是在顶部 或 左侧
	                 *     //flag = 1 是在底部 或 右侧
	                 * })
	                 */
	                this.trigger('pulling', 1);
	            } else if (this._pos < -(this._outRange())) {
	                this.trigger('pulling', -1);
	            }
	        }
	
	        this.isMove = true;
	
	    },
	    /*
	     ** @description 为DOM添加过渡动画属性
	     */
	    transition: function(speed, easing, delay) {
	        var $el, transition, _tran, style;
	        $el = this.$el;
	        transition = this.options.transition;
	        speed = typeof speed == 'undefined' ? transition.speed : speed;
	        easing = typeof easing != 'string' ? transition.easing : easing;
	        delay = typeof delay == 'undefined' ? transition.delay : delay;
	
	
	        $el.transition('setValue', 'transform', speed, easing, delay);
	    },
	    /*
	     ** @description 为DOM添加平移属性
	     */
	    translate: function(offset) {
	        var $el;
	
	        $el = this.$el;
	
	        this.isHorizontal ? $el.transform('translate', offset, 0, 0) : $el.transform('translate', 0, offset);
	        //css = this.isHorizontal ? tools.translate(offset) : tools.translate(0, offset);
	
	        //this.$el.css(css);
	    },
	    /**
	     * 释放内存
	     * @alias destroy
	     * @instance
	     * @memberOf smui.slider
	     */
	    _destroy: function() {
	
	        var $el = this.$el;
	
	        $el.transform('destroy');
	
	        $el.transition('destroy');
	
	    }
	
	
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 弹出框
	 * @author Guo Mingli(mingli.guo@shenma-inc.com)
	 * @date 2015-1-20
	 * @version 0.0.1
	 * @class smui.dialog
	 * @import  zepto.js smui.js smui.layermadk.js
	 */
	
	
	
	var ns = __webpack_require__(1);
	
	__webpack_require__(7);
	
	ns.widget('dialog', {
	    /**
	     * 设置组件初始化参数
	     * @memberOf smui.dialog
	     * @instance
	     * @type {Object}
	     * @property {Boolean}  autoHide    是否自动消失 ,若为true时，默认2000ms自动
	     * @property {Boolean}  modal       是否是模态,可以设置为{} 参数请参照smui.layermask
	     */
	    options: {
	
	        autoHide: false,
	
	        modal: false
	
	    },
	
	    /*
	     ** @description 初始化组件
	     */
	    _init: function() {
	        var $el, opts, eventNS, me;
	
	        me = this;
	
	        $el = this.$el
	
	        opts = this.options;
	
	        eventNS = this.eventNS;
	
	        modal = opts.modal;
	
	        autoHide = opts.autoHide;
	
	        this.isModal = !!modal;
	
	        this.isAutoHide = !!autoHide;
	
	        this.autoHide = $.type(autoHide) === 'number' ? autoHide : 2000;
	
	
	        if (this.isAutoHide) {
	            this.autoHide = autoHide
	        }
	
	        if (this.isModal) {
	            $el.layerMask($.isPlainObject(modal) ? modal : {});
	        }
	
	        $el.off(eventNS).on('click' + eventNS, '[data-confirm]', function() {
	
	            me._hide();
	            /**
	             * 点击确定时触发
	             * @instance
	             * @memberOf smui.dialog
	             * @event confirm
	             */
	            me.trigger('confirm');
	
	
	
	        }).on('click' + eventNS, '[data-cancel]', function() {
	
	            me._hide();
	            /**
	             * 点击取消时触发
	             * @instance
	             * @memberOf smui.dialog
	             * @event cancel
	             */
	            me.trigger('cancel');
	
	        }).on('click' + eventNS, '[data-close]', function() {
	
	            me.close();
	
	
	
	        })
	
	
	    },
	    /**
	     * 打开对话框，触发open事件
	     * @public
	     * @instance
	     * @memberOf smui.dialog
	     * @fires open
	     */
	    open: function() {
	        var me;
	
	        me = this;
	
	        this._show();
	
	        if (this.isAutoHide) {
	            setTimeout(function() {
	                me.hide();
	                me.trigger('close');
	            }, this.autoHide);
	        }
	        /**
	         * 对话框打开时触发
	         * @instance
	         * @memberOf smui.dialog
	         * @event open
	         */
	        me.trigger('open');
	    },
	
	    _show: function() {
	        if (this.isModal) {
	            this.$el.layerMask('show');
	        } else {
	            this.$el.show();
	        }
	    },
	
	    _hide: function() {
	        if (this.isModal) {
	            this.$el.layerMask('hide');
	        } else {
	            this.$el.hide();
	        }
	    },
	    /**
	     * 关闭对话框，触发close事件
	     * @public
	     * @instance
	     * @memberOf smui.dialog
	     * @fires close
	     */
	    close: function() {
	        this._hide();
	        /**
	         * dialog关闭时触发
	         * @instance
	         * @memberOf smui.dialog
	         * @event close
	         */
	        this.trigger('close');
	    },
	    /**
	     * 释放内存
	     * @alias destroy
	     * @instance
	     * @memberOf smui.dialog
	     */
	    _destroy: function() {
	
	        var $el = this.$el;
	
	        $el.layerMask('destroy');
	
	    }
	
	
	
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 轮播组件
	 * @author Guo Mingli (mingli.guo@shenma-inc.com）
	 * @date 2015-1-20
	 * @version 0.0.1
	 * @class smui.carousel
	 */
	
	var ns = __webpack_require__(1),
	
	    tools = ns.Tools;
	
	__webpack_require__(6);
	
	__webpack_require__(8);
	
	
	ns.widget('carousel', {
	    /**
	     * 设置组件初始化参数
	     * @type {Object}
	     * @memberOf smui.carousel
	     * @instance
	     * @property {Object}   slider           选填,设置slider参数,请参照smui.slider组件
	     * @property {Boolean}  isAutoPlay       是否自动开始切换,若为true,则isLoop自动设为true
	     * @property {Object}   autoPlay         自动播放的参数{speed:500,direction:'r2l'}。 自动切换时的方向。l2r,r2l,t2b,b2t;
	     * @property {Number}   current          当前显示的索引 从0开始
	     * @property {Boolean}  isLoop           是否无缝循环切换
	     * @property {Number}   loopSpeed        无缝循环时，第一个和最后一个之前的切换时间
	     * @property {Boolean}  orientation      是否支持转屏时重新定位
	     */
	    options: {
	
	
	
	        slider: {
	            supportSwipe: false
	        },
	        isAutoPlay: false,
	
	        autoPlay: {
	
	            speed: 3000,
	
	            direction: 'l2r'
	        },
	
	
	        current: 0,
	
	        isLoop: false,
	
	        loopSpeed: 300,
	
	        orientation: true
	
	    },
	    _init: function() {
	        var opts, me, $el, $items, $carouselList, $carouselContainer, wh, eventNS, orientationName;
	
	        me = this;
	
	        $el = this.$el;
	
	        opts = this.options;
	
	        eventNS = this.eventNS;
	
	        $carouselList = $el.find('[data-carousel-list]');
	
	        this.$carouselList = $carouselList;
	
	        $carouselContainer = $el.find('[data-carousel-container]');
	
	        this.$carouselContainer = $carouselContainer;
	
	        this.speed = this.loopSpeed; //opts.slider.transition && opts.slider.transition.speed || 500;
	
	        //当前索引
	        this.currentIndex = opts.current;
	
	        this.reviseIndex = null;
	
	        $items = $el.find('[data-carousel-item]');
	
	        this.$next = $el.find('[data-carousel-next]');
	
	        this.$prev = $el.find('[data-carousel-prev]');
	
	        this.total = $items.length - 1;
	
	        opts.isLoop = opts.isAutoPlay ? opts.isAutoPlay : opts.isLoop;
	
	
	        if (ns.isExistWidget('slider')) {
	
	            $carouselList.slider(opts.slider);
	
	            //是否水平方向轮放
	            this.isHorizontal = $carouselList.slider('isHorizontal');
	
	        } else {
	            throw new Error('The lack of dependent files "smui.slider.js"')
	        }
	
	
	        if (opts.isLoop) {
	
	            //克隆第一个元素和最后一个元素到列表中               
	
	            $items.eq(0).before($items.eq($items.length - 1).clone());
	
	            $carouselList.append($items.eq(0).clone());
	
	            this.total += 2;
	
	        }
	
	        this.$items = $el.find('[data-carousel-item]');
	        this._calculateListSize();
	
	
	        this.sliderTo(opts.isLoop ? this.currentIndex + 1 : this.currentIndex, 0);
	
	        $el.off(eventNS).on('click' + eventNS, '[data-carousel-next]', function(e) {
	
	            me.next();
	
	        }).on('click' + eventNS, '[data-carousel-prev]', function(e) {
	
	            me.prev();
	
	        }).on('t-end' + eventNS, '[data-carousel-list]', function(e, oe, pos, direction) {
	            var absPos, _size, index,
	
	                abs = Math.abs(pos);
	
	            _size = me.containerSize;
	
	            //根据位置计算当前索引
	            index = abs / _size;
	
	            if (direction) {
	                index = Math.floor(index);
	            } else {
	                index = Math.ceil(index);
	            }
	
	            me.index = index;
	
	            me.sliderTo(me.index);
	        });
	
	        //转屏重新定位
	        if (opts.orientation) {
	            orientationName = "onorientationchange" in window ? 'orientationchange' : 'resize';
	            $(window).off('window' + eventNS).on(orientationName + '.window' + eventNS, function(e) {
	
	                me._calculateListSize();
	                me.sliderTo(me.currentIndex);
	
	            });
	        }
	
	        //自动播发
	        if (opts.isAutoPlay) {
	
	            setTimeout(function() {
	
	                if (opts.autoPlay.direction == 'l2r' || opts.autoPlay.direction === 't2b') {
	                    me.next();
	                } else {
	                    me.prev();
	                }
	                setTimeout(arguments.callee, opts.autoPlay.speed);
	
	            }, opts.autoPlay.speed);
	        }
	
	
	    },
	
	    _reviseIndex: function() {
	        var _i, me;
	        me = this;
	        _i = me.reviseIndex;
	        if (typeof _i != 'undefined') {
	            // _size = me.containerSize;
	            //me.$carouselList.slider('moveTo', (_size * _i) * -1, 0);
	            setTimeout(function() {
	                me._move(_i, 0);
	                setTimeout(function() {
	                    me.$carouselList.transition('setDuration', me.speed);
	                    /*{
	                                               '-webkit-transition-duration': me.speed / 1000 + 's'
	                                           })*/
	                }, 100);
	            }, 300);
	
	        }
	    },
	
	    _move: function(i, speed) {
	        var _size, pos, opts, _i, me;
	
	        me = this;
	
	        _size = this.containerSize;
	
	        pos = _size * i;
	
	        opts = this.options;
	
	        this.currentIndex = i;
	
	        this.$carouselList.slider('moveTo', -pos, speed);
	    },
	    /**
	     * 切换到指定索引位置
	     * @memberOf smui.carousel
	     * @instance
	     * @param  {Number} i 轮播索引
	     * @param  {Number} speed 指定的切换动画时间。
	     * @fires  slider
	     */
	    sliderTo: function(i, speed) {
	
	        var _size, pos, opts, _i, me;
	
	        _size = this.containerSize;
	
	        me = this;
	
	        opts = this.options;
	
	        this._move(i, speed);
	
	        //无缝循环切换时，要计算新的index
	        if (opts.isLoop) {
	
	            _i = getNewIndex(i);
	
	            this.reviseIndex = _i != i ? _i : undefined;
	        } else {
	
	            this.reviseIndex = undefined;
	
	            if (i == 0) {
	                this.$prev.hide();
	            } else if (i == this.total) {
	                this.$next.hide();
	            } else {
	                this.$prev.show();
	                this.$next.show();
	            }
	
	        }
	
	        me._reviseIndex();
	
	
	        /**
	         * 轮播切换时触发
	         * @instance
	         * @memberOf smui.carousel
	         * @event slider
	         */
	        me.trigger('slider', opts.isLoop ? (me.reviseIndex || this.currentIndex) - 1 : this.currentIndex);
	
	        function getNewIndex(n) {
	            if (n == me.total) {
	                return 1;
	            }
	
	            if (n == 0) {
	                return me.total - 1;
	            }
	
	            return n;
	        }
	
	    },
	    /**
	     * 切换到下一个索引位置
	     * @memberOf smui.carousel
	     * @instance
	     * @fires  slider
	     */
	    next: function() {
	        var i;
	        i = this.currentIndex + 1;
	        if (i > this.total) {
	            i = this.total;
	        }
	        i != this.currentIndex && this.sliderTo(i);
	    },
	    /**
	     * 切换到上一个索引位置
	     * @memberOf smui.carousel
	     * @instance
	     * @fires  slider
	     */
	    prev: function() {
	        var i;
	        i = this.currentIndex - 1;
	        if (i < 0) {
	            i = 0;
	        }
	        i != this.currentIndex && this.sliderTo(i);
	    },
	
	    _calculateListSize: function($items) {
	
	        var opts, len, size, _size, prop, $items;
	
	        $items = this.$items;
	
	        len = $items.length;
	
	        prop = this.isHorizontal ? "width" : "height";
	
	        _size = this.$carouselContainer[prop]();
	
	        this.containerSize = _size;
	
	        $items[prop](_size);
	
	        this.$carouselList[prop](_size * len);
	
	
	    },
	    /**
	     * 释放内存
	     * @alias destroy
	     * @instance
	     * @memberOf smui.carousel
	     */
	    _destroy: function() {
	
	        var eventNS = this.eventNS;
	
	        $(window).off('window' + eventNS);
	
	        this.$carouselList.slider('destroy');
	    }
	
	
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file tab组件或Navigator组件，具体可由css来控制，如果[data-items]的宽度或高度小于或等于.smui-tab的宽或高的话，slider的滑动会失效
	 * @author Guo Mingli (mingli.guo@shenma-inc.com）
	 * @date 2015-1-20
	 
	 * @version 0.0.1 
	 * @class smui.tab  
	 * 
	 **/
	
	
	var ns = __webpack_require__(1);
	__webpack_require__(8);
	__webpack_require__(4);
	ns.widget('tab', {
	
	    /**
	     * 设置组件初始化参数
	     * @memberOf smui.tab
	     * @instance
	     * @type {Object}
	     * @property {String}  current              当前选中项的标示
	     * @property {null | Object}  slider        是否支持滑动 具体参数值参考smui.slider.js
	     * @property {boolean}  supportHistory      是否支持选项卡与浏览器历史的前进后退关联在一起
	     */
	    options: {
	        current: 'current',
	
	        slider: null,
	
	        supportHistory: false
	    },
	    /**
	     * 初始化组件
	     * @private
	     * @memberOf smui.tab
	     */
	    _init: function() {
	
	        var me, $el, opts, eventNS, current;
	
	        me = this;
	
	        $el = this.$el;
	
	        opts = me.options;
	
	        eventNS = me.eventNS;
	
	        current = opts.current.replace(/^\./, ''),
	
	            this.$tab = $el.find('[data-items]')
	
	        this.$tabs = $el.find('[data-item]');
	
	        //根据用户设定的当前标示，设定当前索引
	        this.index = $.inArray($el.find('.' + current).get(0), this.$tabs);
	
	        //如果用户没有指定当前标示，则默认选中第一个
	        if (this.index === -1) {
	
	            this.$tabs.eq(0).addClass('current');
	
	            this.index = 0;
	
	        }
	
	
	        $el.off(eventNS).on('click' + eventNS, '[data-Item]', function(e) {
	            /* me.$tab.slider('moveToElement',$(this));*/
	            !opts.supportHistory && me._switchTo($(this).index(), e);
	
	        });
	
	        //支持slider,则注册。
	        if ($.isPlainObject(opts.slider)) {
	
	            me._openSlider(opts.slider);
	
	        }
	
	        if (opts.supportHistory) {
	            me._openHistory();
	        }
	    },
	
	    /**
	     * 使组件支持slider
	     * @private
	     */
	    _openSlider: function(options) {
	        var $el, opts, $tab, eventNS, me;
	
	        me = this;
	
	        $el = this.$el;
	
	        opts = this.options;
	
	        $tab = this.$tab;
	
	        eventNS = this.eventNS;
	
	        if (!this.isSlider) {
	            $tab.slider(options || {});
	
	            $tab.off(eventNS).on('t-start' + eventNS, function(e, pos, flag) {
	
	                me.trigger('t-start', [pos, flag]);
	
	            }).on('t-move' + eventNS, function(e, pos, flag) {
	
	                me.trigger('t-start', [pos, flag]);
	
	            }).on('t-end' + eventNS, function(e, pos, flag) {
	
	                me.trigger('t-end', [pos, flag]);
	
	            }).on('swipeRight' + eventNS, function(e, pos) {
	
	                me.trigger('swipeRight', pos);
	
	            }).on('swipeLeft' + eventNS, function(e, pos) {
	
	                me.trigger('swipeLeft', pos);
	
	            }).on('pulling' + eventNS, function(e, flag) {
	                console.log(flag);
	            }).on('pulled' + eventNS, function(e, flag) {
	                console.log(flag);
	            });
	        }
	
	        this.isSlider = true;
	    },
	    /**
	     * 使得选项卡与浏览器历史的前进后退关联在一起
	     * @private
	     */
	    _openHistory: function() {
	        var me, $el, eventNS;
	
	        me = this,
	
	            $el = this.$el,
	
	            eventNS = this.eventNS;
	
	        me.history = true;
	
	        if (ns.isExistWidget('history')) {
	
	            $el.history();
	
	            $el.on('history' + eventNS, this.options.tabs, function(e, i, h) {
	
	                me._switchTo(i, e);
	
	            });
	            //$el.history('hashChange');              
	
	        } else {
	            throw new Error('The lack of dependent files smui.history.js');
	        }
	    },
	    /**
	     * 切换到指定的选项
	     * @private
	     * @param {Number} index 序号
	     *
	     */
	    _switchTo: function(i, e, triggerHistory) {
	        var me = this,
	            $scope = this.$el,
	            opts = me.options,
	            current = opts.current.replace(/^\./, ''),
	            eventNS = this.eventNS,
	            $tab = me.getTabByIndex(i);
	
	
	
	        if ($tab.length == 0) {
	            throw new Error('The tab index is out of range');
	        }
	
	        $.isPlainObject(opts.slider) && me.$tab.slider('moveToElement', $tab, null, true);
	
	        this.index = i;
	
	        /**
	         * 切换tab完成前触发
	         * @event beforeSelect
	         * @memberOf smui.tab
	         */
	        me.trigger('beforeSelect', [$tab, i]);
	
	        me.$tabs.removeClass(current);
	
	
	        //
	
	        $tab.addClass(current);
	
	        /**
	         * 切换tab完成后触发
	         * @event select
	         * @instance
	         * @memberOf smui.tab
	         */
	        me.trigger('select', [$tab, i]);
	    },
	    /**
	     * 切换到导航栏的某一项
	     * @param {Number} index 序号
	     * @public
	     * @instance
	     * @fires beforeSelect
	     * @fires select
	     * @memberOf smui.tab
	     * @example
	     * $('.smui-tab').tab("switchTo",3);
	     * //或
	     * var tab = new smui.tab($('.smui-tab'),{});
	     * tab.switchTo(3);
	     */
	    switchTo: function(index) {
	        return this._switchTo(index);
	    },
	    /**
	     * 获取当前选中的序号
	     * @memberOf smui.tab
	     * @instance
	     * @return {Number} 当前选中项的索引
	     */
	    getIndex: function() {
	        return this.index;
	    },
	    /**
	     * 获取所有的tab
	     * @memberOf smui.tab
	     * @instance
	     * @return {Array} 所有的tab
	     */
	    getTabs: function() {
	        return this.$tabs;
	    },
	    /**
	     * 根据索引号获取tab
	     * @memberOf smui.tab
	     * @instance
	     * @param  {Number} i 索引号
	     * @return {Object}   指定的tab的DOM对像
	     */
	    getTabByIndex: function(i) {
	        var tabs = this.$tabs;
	        if (i > tabs.length || i < 0) {
	            return null;
	        }
	        return tabs.eq(i);
	    },
	    /**
	     * 获取当前tab
	     * @memberOf smui.tab
	     * @instance
	     * @return {Object} 当前tab的DOM对像
	     */
	    getCurrentTab: function() {
	        var index = this.getIndex();
	        return this.getTabByIndex(index);
	    },
	    /**
	     * 切换至下一个tab
	     * @instance
	     * @memberOf smui.tab
	     */
	    next: function() {
	        var index = this.getIndex() + 1
	            //index < this.getLen() && this.switchTo(index);
	            //
	        index < this.getLen() && this.getTabByIndex(index).trigger('click');
	
	    },
	    /**
	     * 切换至上一个tab
	     * @instance
	     * @memberOf smui.tab
	     */
	    prev: function() {
	        var index = this.getIndex() - 1
	            //index >= 0 && this.switchTo(index);
	        index >= 0 && this.getTabByIndex(index).trigger('click');
	    },
	    /**
	     * 获取tab的个数
	     * @instance
	     * @memberOf smui.tab
	     */
	    getLen: function() {
	        return this.getTabs().length;
	    },
	    /**
	     * 释放内存
	     * @alias destroy
	     * @instance
	     * @memberOf smui.tab
	     */
	    _destroy: function() {
	        var eventNS = this.eventNS;
	
	        this.$tab.off(eventNS);
	
	        this.historyTool && this.historyTool.destroy();
	
	        this.isSlider && this.$tab.slider('destroy');
	    }
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 弹出式侧边栏
	 * @author Guo Mingli (mingli.guo@shenma-inc.com）
	 * @date 2015-1-20
	 * @version 0.0.1
	 * @class smui.aside
	 * @example
	 * //Html代码
	 * <div class = 'aside'>
	 *     //你的侧边栏内容
	 * </div>
	 * //Js代码
	 * $('.aside').aside()
	 *
	 * // 或者使用实例化对像的方式
	 *
	 * var aside = new smui.aside($('.aside'),{});
	 *
	 **/
	
	var ns = __webpack_require__(1);
	
	__webpack_require__(3);
	__webpack_require__(2);
	__webpack_require__(7);
	
	var offsetObj = function($el, _css) {
	
	    var css = {};
	
	    _css = $.isPlainObject(_css) ? _css : {};
	
	    return {
	
	        hoz: function(size, isLeft) {
	
	            var distance, symbol;
	
	
	            css = {
	
	                'top': _css.top || '0px',
	
	                'bottom': _css.bottom || '0px',
	
	                'width': size || $el.width()
	
	            }
	            if (isLeft) {
	
	                css['left'] = '0px';
	
	                symbol = -1;
	            } else {
	                css['right'] = '0px';
	
	                symbol = 1;
	            }
	
	            $el.css(css);
	
	            distance = symbol * $el.width();
	
	            $el.transform('translate', distance);
	
	
	            return distance;
	
	        },
	
	        ver: function(size, isTop) {
	
	            var distance;
	
	            /*$.extend(css, {
	
	                'left': '0px',
	
	                'right': '0px',
	
	                'height': size || $el.height()
	
	            });*/
	
	            css = {
	
	                'left': _css.left || '0px',
	
	                'right': _css.right || '0px',
	
	                'height': size || $el.height()
	
	
	            }
	
	
	            if (isTop) {
	
	                css['top'] = '0px';
	
	                symbol = -1;
	
	            } else {
	
	                css['bottom'] = '0px';
	
	                symbol = 1;
	            }
	
	            distance = symbol * $el.height();
	
	
	
	            $el.transform('translate', 0, distance);
	
	            $el.css(css);
	
	            return distance;
	
	        },
	
	        l2r: function(size) {
	            return this.hoz(size, true);
	
	        },
	
	        r2l: function(size) {
	            return this.hoz(size, false);
	
	        },
	
	        t2b: function(size) {
	            return this.ver(size, true);
	
	        },
	
	        b2t: function(size) {
	            return this.ver(size, false);
	
	        },
	
	        move: function(direction, distance) {
	
	            direction === 'l2r' || direction === 'r2l' ? $el.transform('translate', distance) : $el.transform('translate', 0, distance);
	
	        }
	    }
	
	}
	
	
	
	ns.widget('aside', {
	    /**
	     * 设置组件初始化参数
	     * @type {Object}
	     * @memberOf smui.aside
	     * @instance
	     * @property {String}  direction  侧边栏弹出的方向：l2r：从左向右,r2l：从右向左,t2b：从上向下,b2t：从下向上;
	     * @property {Number}  speed      侧边栏弹出的速度，单位ms
	     * @property {String}  size       侧边栏的大小，具体是width或height与侧边栏弹出方向有关，水平方向，则代表width。
	     * @property {Object | Boolean}   modal 是否出现遮着层,若为fasle 则没有遮罩层，若为{} 则有，具体参数参见{ @link layermask}。
	     * @property {Object | Boolean}   position 定位侧边样，top，bottom 只在侧边栏从水平方向出现时有效;left , right 只在侧边栏从垂直方向出现时有效
	     * @property {Dom | Zepto | selector} contentWrap 主体内容dom，若不传，则默认为aside的next节点
	     * @property {String} display     可选值：('overlay' | 'push') aside出现模式，overlay表示浮层，push表示aside将content推出
	     */
	    options: {
	
	        direction: 'r2l',
	
	        speed: 500,
	
	        size: '50%',
	
	        display: 'overlay',
	
	        contentWrap: '',
	
	        modal: {
	            supportFadeInOut: false,
	
	            css: {
	                'opacity': 0.5
	            }
	        },
	        position: {
	
	            'position': 'fixed',
	
	            'top': '0px',
	
	            'bottom': '0px',
	
	            'left': '0px',
	
	            'right': '0px'
	        }
	    },
	    /**
	     * 初始化组件
	     * @private
	     */
	    _init: function() {
	        var $el, opts, eventNS, me;
	
	        me = this;
	
	        $el = this.$el
	
	        opts = this.options;
	
	        this.display = opts.display;
	
	        this.state = 0;
	
	        eventNS = this.eventNS;
	
	        this._initElement();
	
	        setTimeout(function() {
	            $el.transition({
	                speed: opts.speed,
	
	                delay: 0,
	
	                property: 'transform'
	            });
	        }, opts.speed);
	
	
	        $el.transform();
	
	        if (opts.modal) {
	
	            $el.layerMask($.isPlainObject(opts.modal) ? opts.modal : {});
	
	            $el.off(eventNS).on('maskClick' + eventNS, function(e) {
	                me.hide();
	            });
	        }
	
	        this.$contentWrap = $(opts.contentWrap || $el.next());
	
	    },
	    /**
	     * 初始化组件的DOM
	     * @private
	     */
	    _initElement: function() {
	
	        var $el, css, opts, direction;
	
	        $el = this.$el;
	
	        opts = this.options;
	
	        direction = opts.direction;
	
	        $el.css('position', opts.position.position);
	
	        this.offsetObj = this.offsetObj || offsetObj($el, opts.position);
	
	        //如果DOM元表没有显示的话，是没有办法计算盒计模型的，导至过渡属性不能正常使用
	        $el.show();
	
	        this.distance = this.offsetObj[direction](opts.size);
	
	
	    },
	    /**
	     * 移动DOM
	     * @private
	     */
	    _translate: function(distance, offset) {
	
	        offset = offset || this.offsetObj;
	
	        offset.move(this.options.direction, distance);
	
	    },
	    /**
	     * 显示侧边栏，触发open事件
	     * @public
	     * @instance
	     * @memberOf smui.aside
	     * @fires open
	     */
	    show: function(display) {
	
	        var me = this;
	
	        this.state = !this.state;
	
	        display = display || this.options.display;
	
	        setTimeout(function() {
	
	            me._translate(0);
	
	
	        }, 16);
	
	        if (me.options.modal) {
	
	            me.$el.layerMask('show');
	
	        } else {
	
	            me.$el.show();
	
	        }
	
	        this._displayContentWrap(display, -this.distance);
	
	
	
	        /**
	         * 侧边栏打开时触发
	         * @instance
	         * @memberOf smui.aside
	         * @event open
	         */
	
	
	
	        this.trigger('open', this.distance);
	
	    },
	
	    _displayContentWrap: function(display, distance) {
	        var me = this,
	            opts = this.options;
	
	        this.display = display || this.display;
	
	        if (this.display === 'push') {
	
	            if (!this._contentWrapOffsetObj) {
	                this.$contentWrap.transition({
	                    speed: opts.speed,
	
	                    delay: 0,
	
	                    property: 'transform'
	                });
	                this.$contentWrap.transform();
	
	                this._contentWrapOffsetObj = offsetObj(this.$contentWrap);
	            }
	
	            this._translate(distance, this._contentWrapOffsetObj);
	        }
	    },
	
	    /**
	     * 隐藏侧边栏，触发close事件
	     * @public
	     * @instance
	     * @memberOf smui.aside
	     * @fires open
	     */
	    hide: function(display) {
	
	        var $el = this.$el,
	            me = this;
	
	
	        this.state = !this.state;
	
	        this._translate(this.distance);
	
	        setTimeout(function() {
	            if (me.options.modal) {
	                $el.layerMask('hide');
	            } else {
	                $el.hide();
	            }
	
	
	        }, this.options.speed);
	
	        this._displayContentWrap(display, 0);
	
	        /**
	         * 侧边栏隐藏时触发
	         * @instance
	         * @memberOf smui.aside
	         * @event close
	         */
	        this.trigger('close', this.distance);
	
	    },
	    /**
	     * 释放内存
	     * @alias destroy
	     * @instance
	     * @memberOf smui.aside
	     */
	    _destroy: function() {
	
	        var $el = this.$el;
	
	        this.mask.off(this.eventNS);
	
	        $el.layerMask('destroy');
	
	        $el.translate('destroy');
	
	        $el.transform('destroy');
	
	    },
	    /**
	     * 显示或隐藏侧边栏
	     * @instance
	     * @memberOf smui.aside
	     */
	    toggle: function(display) {
	
	
	        this.state ? this.hide(display) : this.show(display);
	    }
	
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=smui.debug.js.map