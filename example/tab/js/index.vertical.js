   /*$('.smui-tab').tab({
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
       });  */

   var tab = new smui.tab($('.smui-tab'), {
       slider: {
           direction: "vertical",
           tackCursor     : true 
       },
       supportHistory: true
   });

   tab.on('select', function($tab, i) {
       var pane = $('.tab-page').removeClass('current').eq(i);

       pane.addClass('current');
   });
   tab.on('beforeSelect', function(tab, i) {
       var pane = $('.tab-page').eq(i);

       if (i != 0 && typeof pane.data('loaded') == 'undefined') {
           pane.html('正在加载' + i + '号tab……');
           ~ function(i) {
               setTimeout(function() {
                   pane.html(i + '号tab欢迎您');
                   pane.data('loaded', 'loaded');
               }, 3000)
           }(i);
       }
   });