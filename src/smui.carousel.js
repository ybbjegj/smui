/**
 * @file 轮播组件
 * @author Guo Mingli (mingli.guo@shenma-inc.com）
 * @date 2015-1-20
 * @version 0.0.1
 * @class smui.carousel
 */

var ns = require('./smui.js'),

    tools = ns.Tools;

require('./smui.fadeInOut');

require('./smui.slider');


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