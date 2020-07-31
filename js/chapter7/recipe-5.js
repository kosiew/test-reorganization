$(function(){
    //Base navigation
    $(document).on("mouseenter", "ul.navigation li a.link-base", function(){
       $(this).find(".link-content").stop().animate({
          marginTop: -50
       }, 200, function(){
          $(this).parent().parent().find('.sub-nav').css({
            left: 0
         }).animate({
            opacity: 1
         });
       });
    }).on("mouseleave", "ul.navigation li a", function(){
       //Only reverse the animation if this link doesn't have a sub menu
       if ($(this).parent().find('.sub-nav').length == 0) {
          $(this).find(".link-content").stop().animate({
             marginTop: 0
         }, 200);
       }
    }).on("mouseleave", "ul.navigation li .sub-nav", function(){
       $(this).animate({
          opacity: 0
       }, 200, function(){
          $(this).css({
             left: -10000
        });
          //When the mouse leaves the sub menu, also reverse the base link animation
          $(this).parent().find('.link-content').stop().animate({
             marginTop: 0
          }, 200);
       });
    }).on("mouseenter", "ul.sub-nav li a", function(){
       $(this).find(".sub-link-content").stop().animate({
          marginLeft: -120
       }, 200);
    }).on("mouseleave", "ul.navigation li a", function(){
       $(this).find(".sub-link-content").stop().animate({
          marginLeft: 0
       }, 200);
    });
 });