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


## 功能组件
> 纯js实现的交互行为的组件。smui中有fadeInOut,history,transform,transition,layermask,slider
