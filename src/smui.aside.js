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

var ns = require('./smui.js');

require('./smui.transform');
require('./smui.transition');
require('./smui.layermask');

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