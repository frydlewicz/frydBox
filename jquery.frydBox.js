/*
 * frydBox - jQuery plugin
 * Free and lightweight Lightbox or Fancybox alternative
 * 
 * Copyright (c) 2017 Kamil Frydlewicz
 * www.frydlewicz.pl
 * 
 * Version: 1.0.0
 * Requires: jQuery v1.2+
 *
 * MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
    var name = 'frydBox';

    var css = {
        'box-sizing': 'border-box',
        'padding': '0',
        'margin': '0',
        'outline': 'none',
        'opacity': '1'
    }

    var cssBack = $.extend({
        'display': 'none',
        'position': 'fixed',
        'left': '0',
        'top': '0',
        'z-index': '999999997',
        'width': '100%',
        'height': '100%',
        'border': 'none'
    }, css);

    var cssCont = $.extend({
        'display': 'none',
        'position': 'fixed',
        'z-index': '999999998',
        'border': 'none'
    }, css);

    var cssPrev = $.extend({
        'position': 'absolute',
        'left': '0',
        'top': '25%',
        'z-index': '999999999',
        'width': '50%',
        'height': '50%',
        'overflow': 'hidden',
        'font-size': '10000px',
        'cursor': 'pointer'

    }, css);

    var cssNext = $.extend({
        'position': 'absolute',
        'right': '0',
        'top': '25%',
        'z-index': '999999999',
        'width': '50%',
        'height': '50%',
        'overflow': 'hidden',
        'font-size': '10000px',
        'cursor': 'pointer',
    }, css);

    var cssImg = $.extend({
        'display': 'none',
        'width': '100%',
        'height': 'auto'
    }, css);

    var config = {
        prefix: 'frydBox_',
        lazyLoading: true,
        lazyLoadingDelay: 100,
        fadeDuration: 400,
        moveDuration: 800,
        screenPercent: 0.88,
        backOpacity: 0.6,
        shadowOpacity: 0.6,
        shadowSize: 18,
        borderSize: 13,
        borderColor: 'white',
        borderRadius: 8,
        scrollBars: false
    };

    var $body;
    var $back;
    var $currentCont = undefined;
    var screenWidth;
    var screenHeight;
    var maxWidth;
    var maxHeight;
    var overflow;

    /**************************************************************/

    function resize() {
        screenWidth = $(window).width();
        screenHeight = $(window).height();

        maxWidth = config.screenPercent * screenWidth;
        maxHeight = config.screenPercent * screenHeight;
    }

    function keyDown(e) {
        switch (e.which) {
            case 27:
                hideBox();
                break;
            case 37:
                clickPrev($currentCont);
                break;
            case 39:
                clickNext($currentCont);
                break;
        }
    }

    function injectCSS(styles, $element) {
        for (var key in styles) {
            $element.css(key, styles[key]);
        }
    }

    function build() {
        console.log(name + ": powered by www.frydlewicz.pl");

        $body = $('body');
        overflow = $body.css('overflow');

        $(window).bind('resize', resize);
        $(document).bind('keydown', keyDown);

        resize();
        appendBack();
    }

    /**************************************************************/

    function appendBack() {
        $back = $('<div id="' + config.prefix + 'back" class="' + config.prefix + 'back"></div>');
        injectCSS(cssBack, $back);
        $back.css('background', 'rgba(0, 0, 0, ' + config.backOpacity + ')');

        $back.bind('click', function() {
            hideBox();
        });
        $body.append($back);
    }

    function appendCont(indexCont) {
        var $cont = $('<div id="' + config.prefix + 'cont-' + indexCont + '" class="' + config.prefix + 'cont"></div>');
        injectCSS(cssCont, $cont);
        $body.append($cont);

        return $cont;
    }

    function appendNavi($cont, indexCont) {
        var $prev = $('<span id="' + config.prefix + 'prev-' + indexCont + '" class="' + config.prefix + 'prev">&nbsp;</span>');
        injectCSS(cssPrev, $prev);
        $prev.bind('click', function() {
            clickPrev($cont);
        });
        $cont.append($prev);

        var $next = $('<span id="' + config.prefix + 'next-' + indexCont + '" class="' + config.prefix + 'next' + '">&nbsp;</span>');
        injectCSS(cssNext, $next);
        $next.bind('click', function() {
            clickNext($cont);
        });
        $cont.append($next);
    }

    function appendImg($cont, src, indexCont, indexImg) {
        var $img = $('<img id="' + config.prefix + 'img-' + indexCont + '-' + indexImg + '" class="' + config.prefix + 'img">');
        injectCSS(cssImg, $img);
        $img.attr('data-src', src);
        $cont.append($img);

        return $img;
    }

    /**************************************************************/

    function setSizeAndGetPos($cont, $img) {
        var width = parseInt($img[0]['naturalWidth']) + 2 * config.borderSize;
        var height = parseInt($img[0]['naturalHeight']) + 2 * config.borderSize;

        if (width === 0 || height === 0) {
            return {
                left: (screenWidth - maxWidth) / 2,
                top: (screenHeight - maxWidth) / 2
            };
        }

        var newWidth = width;
        var newHeight = height;

        if (width / height > screenWidth / screenHeight) {
            if (width > screenWidth) {
                newWidth = maxWidth;
                newHeight = maxWidth * height / width;
            }
        } else {
            if (height > screenHeight) {
                newHeight = maxHeight;
                newWidth = maxHeight * width / height;
            }
        }

        $cont.css({
            width: Math.round(newWidth) + 'px',
            height: Math.round(newHeight) + 'px'
        });

        return {
            left: (screenWidth - newWidth) / 2,
            top: (screenHeight - newHeight) / 2
        };
    }

    function hideBox() {
        $('.' + config.prefix + 'cont').fadeOut(config.fadeDuration, function() {
            var $img = $(this).find('.' + config.prefix + 'img');

            $img.hide();
            $img.removeClass(config.prefix + 'active');
        });

        $back.fadeOut(config.fadeDuration, function() {
            if (!config.scrollBars) {
                $body.css('overflow', overflow);
            }
        });

        $currentCont = undefined;
    }

    /**************************************************************/

    function clickLink(e) {
        e.preventDefault();

        var indexCont = $(this).attr('data-cont');
        var indexImg = $(this).attr('data-img');

        var $cont = $('#' + config.prefix + 'cont-' + indexCont);
        var $img = $('#' + config.prefix + 'img-' + indexCont + '-' + indexImg);

        $img.unbind('load').bind('load', function() {
            var offset = setSizeAndGetPos($cont, $img);
            $cont.css({
                'left': Math.round(offset.left) + 'px',
                'top': Math.round(offset.top) + 'px'
            });

            $img.show();
            $cont.fadeIn(config.fadeDuration);
        });

        if (!config.scrollBars) {
            $body.css('overflow', 'hidden');
        }

        $back.fadeIn(config.fadeDuration, function() {
            var src = $img.attr('data-src');

            $img.attr('src', src);
            $img.addClass(config.prefix + 'active');
        });

        $currentCont = $cont;
    }

    function clickPrev($cont) {
        if (typeof $cont === 'undefined') {
            return;
        }

        var $img = $cont.find('.' + config.prefix + 'active');
        if ($img.length === 0) {
            return;
        }

        var $imgPrev = $img.prev('.' + config.prefix + 'img');
        if ($imgPrev.length === 0) {
            return;
        }

        $imgPrev.unbind('load').bind('load', function() {
            $cont.animate({
                'left': screenWidth + 'px'
            }, config.moveDuration, function() {
                $cont.css('left', -screenWidth + 'px');

                $img.hide();
                $imgPrev.show();

                var offset = setSizeAndGetPos($cont, $imgPrev);
                $cont.css('top', Math.round(offset.top) + 'px');

                $cont.animate({
                    'left': Math.round(offset.left) + 'px'
                }, config.moveDuration);
            });
        });

        var src = $imgPrev.attr('data-src');
        $imgPrev.attr('src', src);

        $img.removeClass(config.prefix + 'active');
        $imgPrev.addClass(config.prefix + 'active');
    }

    function clickNext($cont) {
        if (typeof $cont === 'undefined') {
            return;
        }

        var $img = $cont.find('.' + config.prefix + 'active');
        if ($img.length === 0) {
            return;
        }

        var $imgNext = $img.next('.' + config.prefix + 'img');
        if ($imgNext.length === 0) {
            return;
        }

        $imgNext.unbind('load').bind('load', function() {
            $cont.animate({
                'left': -screenWidth + 'px'
            }, config.moveDuration, function() {
                $cont.css('left', screenWidth + 'px');

                $img.hide();
                $imgNext.show();

                var offset = setSizeAndGetPos($cont, $imgNext);
                $cont.css('top', Math.round(offset.top) + 'px');

                $cont.animate({
                    'left': Math.round(offset.left) + 'px'
                }, config.moveDuration);
            });
        });

        var src = $imgNext.attr('data-src');
        $imgNext.attr('src', src);

        $img.removeClass(config.prefix + 'active');
        $imgNext.addClass(config.prefix + 'active');
    }

    /**************************************************************/

    function lazyLoading(array) {
        function loadImage(index) {
            if (index >= array.length) {
                return;
            }

            var img = new Image();
            img.onload = function() {
                setTimeout(loadImage, config.lazyLoadingDelay, index + 1);
            };
            img.src = array[index];
        }

        setTimeout(loadImage, config.lazyLoadingDelay, 0);
    }

    window[name] = {
        count: 0
    };

    $.fn.frydBox = function(options) {
        $.extend(config, options);

        if (window[name].count === 0) {
            build();
        }

        var $cont = appendCont(window[name].count);
        appendNavi($cont, window[name].count);

        var indexImg = 0;
        var array = [];

        var result = $(this).each(function() {
            var href = $(this).attr('href');
            array.push(href);

            var $img = appendImg($cont, href, window[name].count, indexImg);
            $img.css('border', config.borderSize + 'px solid ' + config.borderColor);
            $img.css('border-radius', config.borderRadius + 'px');
            $img.css('box-shadow', '0 0 ' + config.shadowSize + 'px rgba(0, 0, 0, ' + config.shadowOpacity + ')');

            $(this).attr('data-cont', window[name].count);
            $(this).attr('data-img', indexImg);
            $(this).unbind('click').bind('click', clickLink);

            ++indexImg;
        });

        if (config.lazyLoading) {
            if (document.readyState === 'complete') {
                lazyLoading(array);
            } else {
                $(window).bind('load', function() {
                    lazyLoading(array);
                });
            }

        }

        ++window[name].count;

        return result;
    };
}(jQuery));