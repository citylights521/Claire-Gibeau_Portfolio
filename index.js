var parallaxElements = [];
var windowHeight = 0;

$(document).ready(function() {

    windowHeight = $(window).height();
    $('html,body').scrollTop(1); // auto scroll to top

    var touchSupported = (('ontouchstart' in window) ||
                            window.DocumentTouch && document instanceof DocumentTouch);

    // if touch events are supported, tie our animation to the position to these events as well
    if (touchSupported) {

        $(window)
            .bind('touchmove', function(e) {
                var val = e.currentTarget.scrollY;
                parallax(val);
            });
    }

    $(window)
        .bind('scroll', function(e) {
            var val = $(this).scrollTop();
            parallax(val);
        });

    // update vars used in parallax calculations on window resize
    $(window).resize(function() {
        windowHeight = $(this).height();

        for (var id in parallaxElements) {
            parallaxElements[id].initialOffsetY = $(parallaxElements[id].elm).offset().top;
            parallaxElements[id].height = parallaxElements[id].initialOffsetY + $(parallaxElements[id].elm).outerHeight();
        }
    });


    // get parallax elements straight away as they wont change
    // this will minimise DOM interactions on scroll events
    $('.testScroll').each(function(){

        var $elm = $(this);
        var id = $elm.data('id');

        var floater = $elm.data('floatid');

        if (!floater) {
            return;
        }


        var floaterElm = $("#" + floater);

        if (!floaterElm) {
            return;
        }

        // use data-id as key
        parallaxElements[id] = {
            id: $elm.data('id'),
            floater: floaterElm,
            elm: $elm[0],
            initialOffsetY: $elm.offset().top,
            height: $elm.offset().top + $elm.outerHeight(),
            width: $elm.outerWidth()
        };

    });
});


//////////////////////////
/////parallax scroll/////
////////////////////////

function parallax(scrollTop) {

    for (var id in parallaxElements) {

        var element = parallaxElements[id];
        var elementTop = element.initialOffsetY;
        var elementBottom = element.height;

        var viewportTop = scrollTop;
        var viewportBottom = viewportTop + windowHeight;

        var floaterTop = viewportTop - elementTop;

        //console.log("Test");

        // lets check to see if the elements top is in the viewport
        if (elementTop > viewportTop) {
            element.floater.css(
                {                    
                    top: 0
                }
            );
        }
        else if (elementTop <= viewportTop && elementBottom > viewportBottom) {
            element.floater.css(
                {                    
                    top: floaterTop
                }
            );
        }
        else if (elementBottom <= viewportBottom) {
            element.floater.css(
                {                    
                    bottom: 0
                }
            );
        }
    }
}


