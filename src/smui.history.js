/**
 * @file 用于实现组件与浏览器前进后退相关联,主要利用hashChange来实现
 * @author Guo Mingli(mingli.guo@shenma-inc.com)
 * @date 2015-01-20
 * @class smui.history
 * @version 0.0.1
 * @import smui.js
 */


var ns = smui = require('./smui.js');
ns.widget('history', {

    options: {
        renderTo: 'li'
    },

    _init: function() {

        var $els, me, eventNS;

        me = this;

        eventNS = this.eventNS;

        $els = this.$els = this.$el.find(this.options.renderTo);

        this.eleHasHash();

        $(window).on('hashchange', function(e) {

            me.hashChange();

        }).on('hash', function(e, h) {

            if (h) {

                $els.each(function(i, v) {

                    var _hash = me.getHash($(this));

                    if (_hash.indexOf('#') != 0) {

                        _hash = '#' + _hash;

                    }

                    if (_hash == h) {

                        $(this).trigger("history", [i, h]);
                    }

                });
            } else {

                $els.eq(0).trigger("history", [0, me.getHash($els.eq(0))]);

            }
            me.hash = h;

        })

        $els.off(eventNS).on('click' + eventNS, function(e) {
            location.hash = me.getHash($(this));
        });


        this.hashChange();

    },
    /*
     ** @description 检测是用户是否有data-hash,没有则用newId生成唯一hash
     */
    eleHasHash: function() {
        var $els, me;

        $els = this.$els;

        me = this;

        $els.each(function(i, v) {
            var hash, $v;

            $v = $(v);

            hash = me.getHash($v);

            if (!hash) {

                $v.data('hash', ns.Tools.newId());

            }

        });

    },

    hashChange: function() {
        var h = location.hash;

        if (this.hash != h) {

            //解决hashChange解发，但有些处理逻辑没有加载的问题，                
            setTimeout(function() {
                $(window).trigger('hash', h);
            }, 16);

        }
    },

    getHash: function($el) {
        var _h = $el.data('hash') || $el.data('href');

        return $.type(_h) === 'number' ? _h + '' : _h;
    },
    _destroy: function() {
        $(window).off('hashchange').off('hash');
    }

});