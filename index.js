var scrollElements = [];
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
                updateFloaters(val);
            });
    }

    $(window)
        .bind('scroll', function(e) {
            var val = $(this).scrollTop();
            updateFloaters(val);
        });

    // update vars used in parallax calculations on window resize
    $(window).resize(function() {
        windowHeight = $(this).height();

        for (var id in scrollElements) {
            scrollElements[id].initialOffsetY = $(scrollElements[id].elm).offset().top;
            scrollElements[id].height = scrollElements[id].initialOffsetY + $(scrollElements[id].elm).outerHeight();
            scrollElements[id].floater.height(windowHeight);
        }

        updateFloaters($(this).scrollTop());
    });

    $('.scroller').each(function(){

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

        floaterElm.height(windowHeight);

        // use data-id as key
        scrollElements[id] = {
            id: $elm.data('id'),
            floater: floaterElm,
            elm: $elm[0],
            initialOffsetY: $elm.offset().top,
            height: $elm.offset().top + $elm.outerHeight(),
            width: $elm.outerWidth()
        };

    });
});

function updateFloaters(scrollTop) {

    for (var id in scrollElements) {

        var element = scrollElements[id];
        var elementTop = element.initialOffsetY;
        var elementBottom = element.height;

        var viewportTop = scrollTop;
        var viewportBottom = viewportTop + windowHeight;

        var floaterTop = 0;

        if (elementTop <= viewportTop && elementBottom > viewportBottom) {
            floaterTop = viewportTop - elementTop;
        }
        else if (elementBottom <= viewportBottom) {
            floaterTop = (elementBottom - windowHeight) - elementTop;
        }

        element.floater.css(
            {                    
                top: floaterTop
            }
        );
    }
}


