/**
 * @file 遮罩效果
 * @author Guo Mingli(mingli.guo@shenma-inc.com)
 * @date 2015-1-20
 * @version 0.0.1
 * @class  smui.layerMask
 * @import smui.js smui.fadeInOut.js
 */



var ns = require('./smui.js');

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
require('./smui.fadeInOut.js');