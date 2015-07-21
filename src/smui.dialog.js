/**
 * @file 弹出框
 * @author Guo Mingli(mingli.guo@shenma-inc.com)
 * @date 2015-1-20
 * @version 0.0.1
 * @class smui.dialog
 * @import  zepto.js smui.js smui.layermadk.js
 */



var ns = require('./smui.js');

require('./smui.layermask');

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