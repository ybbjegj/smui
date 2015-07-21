/**
 * @file 实现DOM元素的滑动
 * @author Guo Mingli(mingli.guo@shenma-inc.com)
 * @date 2015-1-20
 * @class smui.slider
 * @version 0.0.1
 * @import smui.js smui.transition.js smui.transform.js
 */

var ns = require('./smui.js'),

    tools = ns.Tools;

require('./smui.transform');

require('./smui.transition');



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