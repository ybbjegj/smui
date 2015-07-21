/**
 * @author @author Guo Mingli(mingli.guo@shenma-inc.com)
 * @date 2015-1-20
 * @version 0.0.1
 * @file DOM元素的过渡属性
 * @class  smui.transition
 * @see  {@link http://www.w3cplus.com/content/css3-transition}
 * @import  zepto.js smui.js
 */



var ns = require('./smui.js');
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