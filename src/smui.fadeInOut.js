/**
 * @file 淡隐淡出效果
 * @author Guo Mingli(mingli.guo@shenma-inc.com)
 * @date 2015-01-20
 * @class smui.fadeInOut
 * @version 0.0.1
 * @import  zepto.js smui.js smui.transition.js
 */

var ns = require('./smui.js');

require('./smui.transition.js');

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