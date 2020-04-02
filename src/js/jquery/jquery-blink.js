(function($) {
    $.fn.blink = function(options) {
        var defaults = {
            delay: 500
        };
        var options = $.extend(defaults, options);

        var obj = $(this);
        obj[0].blinkId = setInterval(function() {
            if ($(obj).css("visibility") == "visible") {
                $(obj).css('visibility', 'hidden');
            }
            else {
                $(obj).css('visibility', 'visible');
                $(obj).css('color', '#FF0000');
            }
        }, options.delay);
    };
}(jQuery));