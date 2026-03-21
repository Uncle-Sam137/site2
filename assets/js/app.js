/*
=====================
JS Table of Conttent 
=====================
01. Mobile Menu 
04. AOS Animation

*/

(function ($) {
  "use strict";




 /*
  ------------------------  
  01. Mobile Menu 
  --------------------------
  */
  $(".mobile-toggle").on("click", function () {
    $(this).toggleClass("open");
    $(".toggle-menu-class").toggleClass("mobile-device-active");
  });
  $(".toggle").on("click", function () {
    if ($(this).text().includes("-")) {
      $(this).text("+")
    } else {
      $(this).text("-")
    }
    $(this).parent().siblings(".submenu").slideToggle();
  });


   /*
  ------------------------  
  02. Sticky Header
  --------------------------
  */
  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 150) {
      $(".header-bottombar").addClass("header-sticky");
    } else {
      $(".header-bottombar").removeClass("header-sticky");
    }
  });
 








  document.querySelectorAll(".copy-text").forEach(function(copyText) {
    copyText.querySelector("button").addEventListener("click", function () {
      let input = copyText.querySelector("input.text");
      input.select();
      document.execCommand("copy");
      copyText.classList.add("active");
      window.getSelection().removeAllRanges();
      setTimeout(function () {
        copyText.classList.remove("active");
      }, 2500);
    });
  });
  
  


}(jQuery));



