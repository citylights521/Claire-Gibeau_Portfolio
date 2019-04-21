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
            parallaxElements[id].height = $(parallaxElements[id].elm).height();
        }
    });


    // get parallax elements straight away as they wont change
    // this will minimise DOM interactions on scroll events
    $('.parallax').each(function(){

        $elm = $(this);
        var id = $elm.data('id');

        // use data-id as key
        parallaxElements[id] = {
            id: $elm.data('id'),
            start: $elm.data('start'),
            stop: $elm.data('stop'),
            speed: $elm.data('speed'),
            elm: $elm[0],
            initialOffsetY: $elm.offset().top,
            height: $elm.height(),
            width: $elm.outerWidth()
        };

    });
});


//////////////////////////
/////parallax scroll/////
////////////////////////

function parallax(scrollTop) {

    for (var id in parallaxElements) {

        // distance of element from top of viewport
        var viewportOffsetTop = parallaxElements[id].initialOffsetY - scrollTop;

        // distance of element from bottom of viewport
        var viewportOffsetBottom = windowHeight - viewportOffsetTop;

        if ((viewportOffsetBottom >= parallaxElements[id].start) 
        && (viewportOffsetBottom <= parallaxElements[id].stop)
        ){
            // element is now active, fix the position so when we scroll it stays fixed

            var speedMultiplier = parallaxElements[id].speed || 1;
            var pos = (windowHeight - parallaxElements[id].start);

            $(parallaxElements[id].elm)
                .css({
                    position: 'fixed',
                    top: 50 +'px',
                    left: '50%',
                    marginLeft: -(parallaxElements[id].width/2) +'px'
                });

        } else if (viewportOffsetBottom > parallaxElements[id].stop) {
            // scrolled past the stop value, make position relative again

            $(parallaxElements[id].elm)
                .css({
                    position: 'relative',
                    top: (parallaxElements[id].stop-parallaxElements[id].start)+'px',
                    left: 'auto',
                    marginLeft: 'auto'
                });

        } else if (viewportOffsetBottom < parallaxElements[id].start) {
            // scrolled up back past the start value, reset position

            $(parallaxElements[id].elm)
                .css({
                    position: 'relative',
                    top: 0,
                    left: 'auto',
                    marginLeft: 'auto'
                });

        }
    }
}


