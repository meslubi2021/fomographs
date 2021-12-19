
$(window).on('resize', hideSidebar);
$(window).on('load', hideSidebar);

//enable-tooltips
$(window).on('load', function () {
  $('[data-toggle="tooltip"]').tooltip()
});

function hideSidebar(){
  if ($(window).height() > $(window).width()) {
    if (!$("body").hasClass("sidebar-toggled")){
      $("body").addClass("sidebar-toggled");
    } 
    if (!$(".sidebar").hasClass("toggled")){  
      $(".sidebar").addClass("toggled");
    }
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  }

  $(".sidebar").removeClass("fix-mobile-blink");
}