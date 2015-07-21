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