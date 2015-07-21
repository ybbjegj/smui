/**
 * @file DOM元素的变形CSS
 * @author Guo Mingli(mingli.guo@shenma-inc.com)
 * @date 2015-1-20
 * @version 0.0.1
 * @class smui.transform 
 * @see  {@link http://www.w3cplus.com/css3/css3-3d-transform.html}

 * @import  zepto.js smui.js 
 */ 

var ns = require('./smui.js');

 ns.widget('transform', {      
        /**
         * 设置组件初始化参数
         * @type {Object}
         * @memberOf smui.transform
         * @instance
         * @property {Boolean}  is3d   是否是3D版的属性，默认true        
         */
        options:{
            is3d : true
        },     

        /*
        ** @description 初始化组件        
        */        
        _init : function() {
           
            this.support3D = this.options.is3d;   

            this.prop = this.vendors('transform');                    
        },

        _setValue: function(str){

            var result, i, len, $el, property;

            i        = 0;

            property = this.prop;

            len      = property.length;
            
            result   = {};
            
            $el      = this.$el;          


            for (; i < len; i++) {

                result[property[i]] = str;

            }

            $el.css(result);
        },
        /**
         * 平移
         * @param  {Number} x  用来指定元素X轴方向平移距离
         * @param  {Number} y  用来指定元素Y轴方向平移距离
         * @param  {Number} z  用来指定元素Z轴方向平移距离
         * @instance
         * @memberOf smui.transform
         */
        translate: function(x,y,z) {      

            this._build('translate',x,y,z,'px',0);
           
        },
        /**
         * 缩放
         * @param  {Number} x  横向缩放比例
         * @param  {Number} y  纵向缩放比例
         * @param  {Number} z  Z轴缩放比例
         * @instance
         * @memberOf smui.transform
         */
        scale: function(x,y,z) {
          

            this._build('scale',x,y,z,'',1);
        },
         /**
         * 倾斜是二维变形，不能在三维空间变形。元素可能会在X轴和Y轴倾斜，然后转化为三维，但它们不能在Z轴倾斜。
         * @param  {Number} x  用来指定元素X轴方向倾斜的角度。
         * @param  {Number} y  用来指定元素Y轴方向倾斜的角度。         
         * @instance
         * @memberOf smui.transform
         */
        skew:function(x,y){
            this._build('skew',x,y,undefined,'deg',0,false);
        },
        /**
         * 旋转,旋转的量被定义为指定的角度；如果值为正值，元素围绕Y轴顺时针旋转；反之，如果值为负值，元素围绕Y轴逆时针旋转
         * @param  {Number} x  元素围绕X轴旋转
         * @param  {Number} y  元素围绕Y轴旋转
         * @param  {Number} z  元素围绕Z轴旋转     
         * @instance
         * @memberOf smui.transform 
         */
        rotate: function(x,y,z){
      

            this._build('rotate',x,y,z,'deg',0);
        },

        _build:function(prop,x,y,z,unit,init,is3D){
             var str,format;

             is3D = $.isUndefined(is3D) ? this.support3D :is3D;

            if (is3D) {

                format = prop + '3d({0},{1},{2})';
            } else {

                format = prop + '({0},{1})';
            }
            
           
            if (typeof x === 'undefined') {
                x = init;
            }
            if (typeof y === 'undefined') {
                y = init;
            }
            if (typeof z === 'undefined') {
                z = init;
            }

            str = ns.Tools.format(format, x+unit, y+unit, z+unit);

            this._setValue(str);
        }



    });
