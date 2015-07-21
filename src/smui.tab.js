/**
 * @file tab组件或Navigator组件，具体可由css来控制，如果[data-items]的宽度或高度小于或等于.smui-tab的宽或高的话，slider的滑动会失效
 * @author Guo Mingli (mingli.guo@shenma-inc.com）
 * @date 2015-1-20
 
 * @version 0.0.1 
 * @class smui.tab  
 * 
 **/


var ns = require('./smui.js');
require('./smui.slider');
require('./smui.history');
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