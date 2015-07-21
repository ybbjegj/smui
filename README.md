## 介绍
smui是基于Zepto.js的移动端组件库，将在开发中经常用到的功能也做为一个组件，开发人员在利用smui做开发时不仅可以直接使用，而且在扩展UI组件时也可以使用已有的组件。同时smui组件支持插件，可以方便的对UI组件做扩展。目前提供的组件可以分为两类，纯js的功能组件和UI组件。

## 使用方法
> 组件的使用和大部分的组件库一样，有两种不同的方式。挂载在DOM节点上和面向对象

```js
    $('#aside').aside();

    $('#aside').aside('hide'); //调用组件的方法。

    //或者 
    
    var aside = new smui.aside();
    aside.show();

```

## UI组件
> 依赖css，html的组件。smui中主要有：aside,carousel,dialog,tab,imagelazy。

#### aside组件
说明：弹出式侧边栏

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
| direction | String | 侧边栏弹出的方向：l2r：从左向右,r2l：从右向左,t2b：从上向下,b2t：从下向上;| 
|speed|Number|侧边栏弹出的速度，单位ms|
|size|String|侧边栏的大小，具体是width或height与侧边栏弹出方向有关，水平方向，则代表width。|
|modal|Object,Boolean|是否出现遮着层,若为fasle 则没有遮罩层，若为{} 则有，具体参数参见layermask组件。|
|position|Object,Boolean|定位侧边样，top，bottom 只在侧边栏从水平方向出现时有效;left , right 只在侧边栏从垂直方向出现时有效|
|contentWrap|Dom,Zepto,selector|主体内容dom，若不传，则默认为aside的next节点|
|display|String|可选值：('overlay' , 'push') aside出现模式，overlay表示浮层，push表示aside将content推出|

2.Methods

| Name | 参数 | 说明 | 
| ------ | ---- | ------ |
|destroy| 无 |释放内存 |
|hide| string:指定显示隐藏的方式，参见Parameter中display |隐藏侧边栏，触发close事件|
|show|同hide|显示侧边栏，触发open事件|
|toggle|同hide|显示或隐藏侧边栏|

3.Events

| Name | Type | 
| ------ | ---- |
|close| 侧边栏隐藏时触发 |
|open|侧边栏打开时触发|

4.example

```html
    <aside class='s-aside'>
        你自己决定显示什么了
    </aside>
    <div class="content">
        你页面要显示的
        <a class='push'>push方式</a>
        <a class='overlay'>overlay方式</a>
    </div>
```

```js
    var $aside = $('.s-aside');
    $aside.aside();
    $('body').on('click','a',function(e){
        $aside.aside('toggle',$(this).attr('class'));
    });
```


#### carousel组件

说明：轮播图组件

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
|slider| Object |选填,设置slider参数,请参照slider组件 |
|isAutoPlay| Boolean |是否自动开始切换,若为true,则isLoop自动设为true |
|autoPlay| Object |自动播放的参数{speed:500,direction:'r2l'}。 自动切换时的方向。l2r,r2l,t2b,b2t; |
|current| Number |当前显示的索引 从0开始 |
|isLoop| Boolean |是否无缝循环切换 |
|loopSpeed| Number |无缝循环时，第一个和最后一个之前的切换时间 |
|orientation| Boolean |是否支持转屏时重新定位 |

2.Methods

| Name | 参数 | 说明 | 
| ------ | ---- | ------ |
|destroy| 无 |释放内存 |
|next| 无 |切换到下一个索引位置|
|prev|无|切换到下一个索引位置|
|sliderTo|i,speed|切换到指定索引位置|

3.Events

| Name | Type | 
| ------ | ---- |
|slider| 轮播切换时触发 |

4.html上识别的data-
data-carousel-container 轮播图容器，
data-carousel-list      轮播图列表
data-carousel-item      轮播图片
data-carousel-next      下一张
data-carousel-prev      上一张

```html
<div class="smui-carousel" data-carousel>
        <a href="javascript:;" class="smui-nav-btn smui-nav-left" data-carousel-prev></a>

        <div data-carousel-container  class="smui-carousel-content">
            <ul data-carousel-list>
                <li data-carousel-item  class="smui-carousel-hastitle smui-lazy-img"  >
                   
                </li>

                <li data-carousel-item class="smui-carousel-hastitle smui-lazy-img" >
                   
                </li> 
            </ul>
        </div>
        <a href="javascript:;" class="smui-nav-btn smui-nav-right" data-carousel-next></a>
    </div>
```


#### dialog

说明：弹出框组件

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
|autoHide| Boolean |是否自动消失 ,若为true时，默认2000ms自动|
|modal| Boolean |是否是模态,可以设置为{} 参数请参照smui.layermask |


2.Methods

| Name | 参数 | 说明 | 
| ------ | ---- | ------ |
|destroy| 无 |释放内存 |
|close| 无 |关闭对话框，触发close事件|
|open|无|打开对话框，触发open事件|


3.Events

| Name | Type | 
| ------ | ---- |
|cancel| 点击取消时触发 |
|close| dialog关闭时触发|
|confirm|点击确定时触发|
|open|对话框打开时触发|

4.html上识别的data-
data-confirm 确认，
data-cancel  取消
data-close   关闭

```html
 <div  class='smui-dialog ' data-dialog>
        <div class='smui-dialog-header'>
            <span class='smui-dialog-title' >提醒</span>
            <a href="javascript:;" class='smui-dialog-close' data-close></a>
        </div>
        <div class='smui-dialog-content' >
            
        </div>
        <div class='smui-dialog-btns'>
            <a href="javascript:;" class='smui-dialog-confirm' data-confirm>确定</a>
            <a href="javascript:;" class='smui-dialog-cancel' data-cancel>取消</a>
        </div>
    </div>
```

#### tab

说明：选项卡组件，tab组件或Navigator组件，具体可由css来控制，如果[data-items]的宽度或高度小于或等于.smui-tab的宽或高的话，slider的滑动会失效

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
|current| String |当前选中项的标示|
|slider| null，Object  |是否支持滑动 具体参数值参考slider|
|supportHistory| boolean  |是否支持选项卡与浏览器历史的前进后退关联在一起|

2.Methods

| Name | 参数 | 说明 | 
| ------ | ---- | ------ |
|destroy| 无 |释放内存 |
|getCurrentTab| 无 |获取当前tab,返回DOM对像|
|getIndex|无|获取当前选中的序号|
|getLen|无|获取tab的个数|
|getTabByIndex|i,索引号|根据索引号获取tab，返回DOM对像|
|getTabs|无|获取所有的tab|
|next|无|切换至下一个tab|
|prev|无|切换至上一个tab|
|switchTo|i,索引号|切换到导航栏的某一项|

3.Events

| Name | Type | 
| ------ | ---- |
|beforeSelect| 切换tab完成前触发 |
|select| 切换tab完成后触发|

```
//Html代码
 <div class="smui-tab ">
            <ul data-items >
                <li class=" " data-hash='#a1' data-item>
                    <a data-href="#catelog_abstract" >摘要</a>
                </li>
                <li data-hash='#b1'  data-item>
                    <a data-href="#catelog_infobox">基本信息</a>
                </li>
                <li class="" data-hash='#c1' data-item>
                    <a data-href="#catelog_1">简介</a>
                </li>               
            </ul>
        </div>
//Js代码
$('.smui-tab').tab({
            slider: {
                direction:"x"
            },
            supportHistory: true
        });
        $('body').on('select','.smui-tab',function(e,$tab,i){
            
            var pane=$('.tab-page').removeClass('current').eq(i);
            
            pane.addClass('current');
        
        }).on('beforeSelect','.smui-tab',function(e,tab,i){
            var pane=$('.tab-page').eq(i);
            
            if(i!=0 && typeof pane.data('loaded')=='undefined'){
                pane.html('正在加载'+i+'号tab……');
                ~function(i){setTimeout(function(){
                    pane.html(i+'号tab欢迎您');
                    pane.data('loaded','loaded');
                }, 3000)}(i);            
        }
    });

```


#### lazyImage

说明：图片的懒加载

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
|effect| Object |当前选中项的标示|
|loading| Object  |图片loading的淡隐淡出参数 |
|isScrollLoad| boolean  |是否支持选项卡与浏览器历史的前进后退关联在一起|

loading参数：
```
    speed: 100, //Number  淡隐淡出的时间（速度）

    opacity: [1, 0], //Array   淡隐淡出的透明度     

    easing: 'ease', //String  缓动函数

    delay: 0 //Number  淡隐淡出的延迟时间

```

2.example
```
<div class="smui-lazy-img"  >
    <img data-lazy-img data-src="http://s2.zimgs.cn/ims?kt=url&amp;at=ori&amp;tv=0_0&amp;sign=yx:H04ZQvxARNg7plzPP0uv6kEXsgo=&amp;key=aHR0cDovL2E0LmF0dC5odWRvbmcuY29tLzA3Lzg4LzAxMzAwNTQyNTcwMzkwMTQwNzc1ODgwMDY4NTEzX3MuanBn&amp;x.jpg">
    <span class="loading" data-img-loading> <i>正在加载</i>
    </span>
</div>

 $('body').lazyImage();

```

3.html上识别的data-
data-lazy-img 确认，
data-img-loading  取消

## 功能组件
> 纯js实现的交互行为的组件。smui中有fadeInOut,history,transform,transition,layermask,slider

#### fadeInOut

说明：淡隐淡出效果

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
|easing| String |缓动函数|
|speed|Number |淡隐淡出的时间（速度）|
|opacity| Array  |淡隐淡出的透明度 [start,end]|
|delay|Number|淡隐淡出的延迟时间|
2.Methods

| Name | 参数 | 说明 | 
| ------ | ---- | ------ |
|destroy| 无 |释放内存 |
|hide| 无 |淡入或淡出，由options.opacity确定|
|show|无|淡入或淡出，由options.opacity确定|
|toggle|无|淡入或淡出，由options.opacity确定|

3.Events

| Name | Type | 
| ------ | ---- |
|fadeCompleted| 效果完成后触发 |

#### history

说明：用于实现组件与浏览器前进后退相关联

1.Events

| Name | Type | 
| ------ | ---- |
|history| 前进后退时解发 |

#### layerMask

说明：遮罩效果

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
|css| String |设置遮罩层的参数|
|supportFadeInOut|Boolean |遮罩层是否支技淡隐淡出|
|fadeInOut| Object  |设置淡隐淡出的参数|

2.Methods

| Name | 参数 | 说明 | 
| ------ | ---- | ------ |
|destroy| 无 |释放内存 |
|hide| 无 |隐藏遮罩层同时会把应用遮罩层的DOM隐藏|
|show|无|显示遮罩层同时会把应用遮罩层的DOM显示出来|
|toggle|无|显示或隐藏遮罩层|

3.Events

| Name | Type | 
| ------ | ---- |
|maskClose| 遮罩层关闭后触发 |
|maskClick| 点击遮罩层时触发 |
|maskBeforeLoad| 遮罩层显示前触发 |
|maskLoad| 遮罩层显示后触发 |

#### slider

说明：实现DOM元素的滑动

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
|direction |  String | 方向, 默认水平。horizontal:水平方向，vertical:垂直方向
|tackCursor | Boolean |是否跟随光标/手指移动
|transition | Object|  动画设置{speed:500,easing:'ease',delay:0}
|moveDistance  |  Number | slider移动的距离,默认为父节点的宽高
|supportSwipe  |  Boolean| 是否支持swipe事件
|slope |  Number | 用于计算slider的有效区域，取值0-1,不推荐修改
|swipe |  Object | swipe事件的触发临界值{timeout:500,distance:30}

2.Methods

| Name | 参数 | 说明 | 
| ------ | ---- | ------ |
|destroy| 无 |释放内存 |
|goLeftOrUp| 无 |向左或向上移动指定的距离|
|goRightOrDown|无|向右或向下移动指定的距离|
|isHorizontal|无|获取slider是否是水平方向移动|
|moveTo|pos|移动到指定的位置|
3.Events

| Name | Type | 
| ------ | ---- |
|pulled| 在两端拉动完成触发 |
|pulling| 在两端拉动过程中触发 |
|swipe| swipe事件 |
|t-end| 元素触发touchend事件是触发,这里用于组件利用t-end做扩展 |
|t-move| 元素触发touchmove事件是触发,这里用于组件利用t-move做扩展 |
|t-start| 元素触发touchstart事件是触发,这里用于组件利用t-start做扩展 |

```js
$('.test').on('pulling',function(e,flag){
    //flag = 1 是在顶部 或 左侧 
    //flag = 1 是在底部 或 右侧
})
$('slider').on('swipe',function(e,oe,pos,dir){
    //dir 是方向 1:right或down -1:up或left
})
```

#### transform

说明：DOM元素的变形，同css3的transform。

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
|is3d   |Boolean  |是否是3D版的属性，默认true|

2.Methods

| Name | 参数 | 说明 | 
| ------ | ---- | ------ |
|rotate| 参考CSS3 |参考CSS3|
|scale|参考CSS3|参考CSS3|
|skew|参考CSS3|倾斜是二维变形，不能在三维空间变形。元素可能会在X轴和Y轴倾斜，然后转化为三维，但它们不能在Z轴倾斜。|
|translate|参考CSS3|参考CSS3|

#### transform

说明：DOM元素的过渡属性，同css3的transform。

1.Parameter

| Name | Type | Description |
| ------ | ---- |-----------------|
|speed  | speed  | 参考CSS3 transition-duration|
|property |  String | 参考CSS3 transition-property， 无素添加前缀|
|easing  |String|  参考CSS3 transition-timing-function|
|delay  | Number | 参考CSS3 transition-delay|

2.Methods

| Name | 参数 | 说明 | 
| ------ | ---- | ------ |
|setDelay| String |css属性，参考transition-delay |
|setDuration|Number|css属性，参考transition-duration|
|setEasing|参考CSS3|css属性，参考transition-timing-function|
|setProperty|参考CSS3|css属性，参考transition-property|