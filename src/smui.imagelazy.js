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


var ns = require('./smui.js');

require('./smui.fadeInOut');

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