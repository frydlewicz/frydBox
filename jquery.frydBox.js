/*
 * frydBox - jQuery plugin
 * Free and lightweight Lightbox or Fancybox alternative
 *
 * Copyright (c) 2017 Kamil Frydlewicz
 * www.frydlewicz.pl
 *
 * Version: 1.0.6
 * Requires: jQuery v1.7+
 *
 * MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

if (typeof jQuery == 'undefined') {
    throw new Error('frydBox requires jQuery')
}

(function ($) {
    var name = 'frydBox';

    var css = {
        'display': 'block',
        'box-sizing': 'border-box',
        'padding': '0',
        'margin': '0',
        'background': 'none',
        'border': 'none',
        'outline': 'none',
        'opacity': '1',
        'cursor': 'default'
    }

    var cssBack = $.extend({}, css, {
        'display': 'none',
        'position': 'fixed',
        'left': '0',
        'top': '0',
        'z-index': '999999995',
        'width': '100%',
        'height': '100%'
    });

    var cssLoader = $.extend({}, css, {
        'display': 'none',
        'position': 'fixed',
        'left': '50%',
        'top': '50%',
        'z-index': '999999998',
        'width': '80px',
        'height': '80px',
        'margin': '-50px 0 0 -50px',
        'border': '10px solid rgba(255,255,255,.4)',
        'border-top-color': '#fff',
        'border-radius': '50%',
        'opacity': '0'
    });

    var cssCont = $.extend({}, css, {
        'display': 'none',
        'position': 'fixed',
        'z-index': '999999996',
        'opacity': '0'
    });

    var cssPrev = $.extend({}, css, {
        'position': 'absolute',
        'left': '0',
        'top': '25%',
        'z-index': '999999997',
        'width': '50%',
        'height': '50%',
        'overflow': 'hidden',
        'background': 'no-repeat left 20px center',
        'font-size': '10000px',
        'cursor': 'pointer',
        'opacity': '0',
        'filter': 'drop-shadow(0 0 5px #000)'
    });

    var cssNext = $.extend({}, css, {
        'position': 'absolute',
        'right': '0',
        'top': '25%',
        'z-index': '999999997',
        'width': '50%',
        'height': '50%',
        'overflow': 'hidden',
        'background': 'no-repeat right 20px center',
        'font-size': '10000px',
        'cursor': 'pointer',
        'opacity': '0',
        'filter': 'drop-shadow(0 0 5px #000)'
    });

    var cssClose = $.extend({}, css, {
        'position': 'absolute',
        'right': '-10px',
        'top': '-10px',
        'z-index': '999999997',
        'width': '50px',
        'height': '50px',
        'overflow': 'hidden',
        'background': 'no-repeat right top',
        'cursor': 'pointer',
        'opacity': '0',
        'filter': 'drop-shadow(0 0 5px #000)'
    });

    var cssImg = $.extend({}, css, {
        'display': 'none',
        'width': '100%',
        'height': 'auto'
    });

    var config = {
        prefix: 'frydBox_',
        lazyLoading: true,
        lazyLoadingStart: 1000,
        lazyLoadingDelay: 100,
        fadeDuration: 500,
        moveDuration: 750,
        fadeWhenMove: true,
        screenPercent: 0.9,
        backOpacity: 0.6,
        shadowOpacity: 0.6,
        shadowSize: 18,
        borderSize: 10,
        borderColor: '#fff',
        borderRadius: 8,
        showLoader: true,
        scrollBars: false
    };

    var $body;
    var $back;
    var $loader;
    var $currentCont = false;
    var screenWidth;
    var screenHeight;
    var maxWidth;
    var maxHeight;
    var overflow;
    var path;
    var locked = false;

    /**************************************************************/

    (function () {
        var scriptUrl = location.href;
        var currentScript = document.currentScript;

        if (currentScript) {
            scriptUrl = currentScript.src;
        }
        else {
            $('script').each(function () {
                var src = $(this).attr('src');
                if (src.indexOf(name) > -1) {
                    scriptUrl = src;
                }
            });
        }

        var lastIndexOf = scriptUrl.lastIndexOf('/');
        if (lastIndexOf >= 0) {
            path = scriptUrl.substring(0, lastIndexOf + 1);
        }
        else {
            path = scriptUrl.substring(0, scriptUrl.lastIndexOf('\\') + 1);
        }
    })();

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
                clickPrev();
                break;
            case 39:
                clickNext();
                break;
        }
    }

    function injectCSS(styles, $element) {
        for (var key in styles) {
            $element.css(key, styles[key]);
        }
    }

    function build() {
        console.log(name + ': powered by www.frydlewicz.pl');

        $body = $('body');
        overflow = $body.css('overflow');

        $(window).on('resize', resize);
        $(document).on('keydown', keyDown);

        resize();
        appendBack();
        appendLoader();
    }

    /**************************************************************/

    function appendBack() {
        $back = $('<div id="' + config.prefix + 'back" class="' + config.prefix + 'back"></div>');
        injectCSS(cssBack, $back);

        $back.on('click', function () {
            hideBox();
        });
        $body.append($back);
    }

    function appendLoader() {
        if (!config.showLoader) {
            return;
        }

        $loader = $('<div id="' + config.prefix + 'loader" class="' + config.prefix + 'loader"></div>');
        injectCSS(cssLoader, $loader);
        $body.append($loader);
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
        $prev.on('mouseenter', function () {
            if ($('.' + config.prefix + 'active').prev('.' + config.prefix + 'img').length) {
                $(this).css('opacity', 1);
            }
        });
        $prev.on('mouseleave', function () {
            $(this).css('opacity', 0);
        });
        $prev.on('click', function () {
            clickPrev();
        });
        $cont.append($prev);

        var $next = $('<span id="' + config.prefix + 'next-' + indexCont + '" class="' + config.prefix + 'next' + '">&nbsp;</span>');
        injectCSS(cssNext, $next);
        $next.on('mouseenter', function () {
            if ($('.' + config.prefix + 'active').next('.' + config.prefix + 'img').length) {
                $(this).css('opacity', 1);
            }
        });
        $next.on('mouseleave', function () {
            $(this).css('opacity', 0);
        });
        $next.on('click', function () {
            clickNext();
        });
        $cont.append($next);

        var $close = $('<span id="' + config.prefix + 'close-' + indexCont + '" class="' + config.prefix + 'close' + '">&nbsp;</span>');
        injectCSS(cssClose, $close);
        $close.on('mouseenter', function () {
            $(this).css('opacity', 1);
        });
        $close.on('mouseleave', function () {
            $(this).css('opacity', 0);
        });
        $close.on('click', function () {
            hideBox();
        });
        $cont.append($close);
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

        if (!width || !height) {
            return {
                left: (screenWidth - maxWidth) / 2,
                top: (screenHeight - maxWidth) / 2
            };
        }

        var newWidth = width;
        var newHeight = height;

        if (width > maxWidth || height > maxHeight) {
            if (width / height > screenWidth / screenHeight) {
                newWidth = maxWidth;
                newHeight = maxWidth * height / width;
            } else {
                newHeight = maxHeight;
                newWidth = maxHeight * width / height;
            }
        }

        $cont.css('width', Math.round(newWidth) + 'px');
        $cont.css('height', Math.round(newHeight) + 'px');

        return {
            left: (screenWidth - newWidth) / 2,
            top: (screenHeight - newHeight) / 2
        };
    }

    function showLoader() {
        if (!config.showLoader) {
            return;
        }

        $loader.css('display', 'block');
        $loader.animate({
            opacity: 1
        }, {
            duration: config.fadeDuration,
            queue: false
        });

        (function animateLoader() {
            $loader.animate({
                rotation: '+=360'
            }, {
                duration: 1000,
                easing: 'linear',
                queue: false,
                step: function (now) {
                    var angle = now % 360;
                    var value = 'rotate(' + angle + 'deg)';

                    $loader.css({
                        '-webkit-transform': value,
                        '-ms-transform': value,
                        'transform': value
                    });
                },
                complete: animateLoader
            });
        })();
    }

    function hideLoader() {
        if (!config.showLoader) {
            return;
        }

        $loader.animate({
            opacity: 0
        }, {
            duration: config.fadeDuration,
            queue: false,
            complete: function () {
                $loader.stop();
                $loader.css('display', 'none');
            }
        });
    }

    function hideBox() {
        hideLoader();

        $img = $('.' + config.prefix + 'active');
        if ($img.length) {
            $img.off();
            $img.removeClass(config.prefix + 'active');
        }

        if ($currentCont) {
            $currentCont.stop().animate({
                opacity: 0
            }, {
                duration: config.fadeDuration,
                queue: false,
                complete: function () {
                    $currentCont.find('.' + config.prefix + 'img').each(function () {
                        $(this).hide();
                    });
                    $currentCont.css('display', 'none');
                    $currentCont = false;
                }
            });
        }

        $back.fadeOut(config.fadeDuration, function () {
            if (!config.scrollBars) {
                $body.css('overflow', overflow);
            }
            locked = false;
        });

        if (typeof config.onClose == 'function') {
            config.onClose();
        }
    }

    /**************************************************************/

    function clickLink(e) {
        e.preventDefault();

        if ($currentCont || locked) {
            return;
        }

        var indexCont = $(this).attr('data-cont');
        var indexImg = $(this).attr('data-img');

        var $cont = $currentCont = $('#' + config.prefix + 'cont-' + indexCont);
        var $img = $('#' + config.prefix + 'img-' + indexCont + '-' + indexImg);

        var src = $img.attr('data-src');

        $img.off('load').on('load', function () {
            if (typeof config.onImageLoaded == 'function') {
                config.onImageLoaded(src);
            }

            var offset = setSizeAndGetPos($cont, $img);
            $cont.css('left', Math.round(offset.left) + 'px');
            $cont.css('top', Math.round(offset.top) + 'px');

            $img.show();
            hideLoader();

            $cont.css('display', 'block');
            $cont.animate({
                opacity: 1
            }, {
                duration: config.fadeDuration,
                queue: false,
                complete: function () {
                    locked = false;

                    if (typeof config.onImageShowed == 'function') {
                        config.onImageShowed(src);
                    }
                }
            });
        });

        if (!config.scrollBars) {
            $body.css('overflow', 'hidden');
        }

        showLoader();
        $back.fadeIn(config.fadeDuration);
        locked = true;

        if ($img.attr('src') != src) {
            $img.attr('src', src);
        }
        else {
            $img.trigger('load');
        }

        $img.addClass(config.prefix + 'active');

        if (typeof config.onClickLink == 'function') {
            config.onClickLink(indexCont, indexImg, src);
        }
    }

    function clickPrev() {
        if (!$currentCont || locked) {
            return;
        }

        var $img = $currentCont.find('.' + config.prefix + 'active');
        if (!$img.length) {
            return;
        }

        var $imgPrev = $img.prev('.' + config.prefix + 'img');
        if (!$imgPrev.length) {
            return;
        }

        var src = $imgPrev.attr('data-src');

        $imgPrev.off('load').on('load', function () {
            if (typeof config.onImageLoaded == 'function') {
                config.onImageLoaded(src);
            }

            if (config.fadeWhenMove) {
                $currentCont.animate({
                    opacity: 0
                }, {
                    duration: config.fadeDuration,
                    queue: false
                });
            }

            $currentCont.animate({
                left: screenWidth + 'px'
            }, {
                duration: config.moveDuration,
                queue: false,
                complete: function () {
                    $currentCont.css('left', -screenWidth + 'px');

                    $img.hide();
                    $imgPrev.show();

                    if (!$imgPrev.prev('.' + config.prefix + 'img').length) {
                        $currentCont.find('.' + config.prefix + 'prev').css('opacity', 0);
                    }

                    var offset = setSizeAndGetPos($currentCont, $imgPrev);
                    $currentCont.css('top', Math.round(offset.top) + 'px');

                    hideLoader();

                    if (config.fadeWhenMove) {
                        var waitMilisec = 0;
                        if (config.moveDuration > config.fadeDuration) {
                            waitMilisec = config.moveDuration - config.fadeDuration;
                        }

                        setTimeout(function () {
                            $currentCont.animate({
                                opacity: 1
                            }, {
                                duration: config.fadeDuration,
                                queue: false
                            });
                        }, waitMilisec);
                    }

                    $currentCont.animate({
                        left: Math.round(offset.left) + 'px'
                    }, {
                        duration: config.moveDuration,
                        queue: false,
                        complete: function () {
                            locked = false;

                            if (typeof config.onImageShowed == 'function') {
                                config.onImageShowed(src);
                            }
                        }
                    });
                }
            });
        });

        showLoader();
        locked = true;

        if ($imgPrev.attr('src') != src) {
            $imgPrev.attr('src', src);
        }
        else {
            $imgPrev.trigger('load');
        }

        $img.removeClass(config.prefix + 'active');
        $imgPrev.addClass(config.prefix + 'active');

        if (typeof config.onClickPrev == 'function') {
            config.onClickPrev(src);
        }
    }

    function clickNext() {
        if (!$currentCont || locked) {
            return;
        }

        var $img = $currentCont.find('.' + config.prefix + 'active');
        if (!$img.length) {
            return;
        }

        var $imgNext = $img.next('.' + config.prefix + 'img');
        if (!$imgNext.length) {
            return;
        }

        var src = $imgNext.attr('data-src');

        $imgNext.off('load').on('load', function () {
            if (typeof config.onImageLoaded == 'function') {
                config.onImageLoaded(src);
            }

            if (config.fadeWhenMove) {
                $currentCont.animate({
                    opacity: 0
                }, {
                    duration: config.fadeDuration,
                    queue: false
                });
            }

            $currentCont.animate({
                left: -screenWidth + 'px'
            }, {
                duration: config.moveDuration,
                queue: false,
                complete: function () {
                    $currentCont.css('left', screenWidth + 'px');

                    $img.hide();
                    $imgNext.show();

                    if (!$imgNext.next('.' + config.prefix + 'img').length) {
                        $currentCont.find('.' + config.prefix + 'next').css('opacity', 0);
                    }

                    var offset = setSizeAndGetPos($currentCont, $imgNext);
                    $currentCont.css('top', Math.round(offset.top) + 'px');

                    hideLoader();

                    if (config.fadeWhenMove) {
                        var waitMilisec = 0;
                        if (config.moveDuration > config.fadeDuration) {
                            waitMilisec = config.moveDuration - config.fadeDuration;
                        }

                        setTimeout(function () {
                            $currentCont.animate({
                                opacity: 1
                            }, {
                                duration: config.fadeDuration,
                                queue: false
                            });
                        }, waitMilisec);
                    }

                    $currentCont.animate({
                        left: Math.round(offset.left) + 'px'
                    }, {
                        duration: config.moveDuration,
                        queue: false,
                        complete: function () {
                            locked = false;

                            if (typeof config.onImageShowed == 'function') {
                                config.onImageShowed(src);
                            }
                        }
                    });
                }
            });
        });

        showLoader();
        locked = true;

        if ($imgNext.attr('src') != src) {
            $imgNext.attr('src', src);
        }
        else {
            $imgNext.trigger('load');
        }

        $img.removeClass(config.prefix + 'active');
        $imgNext.addClass(config.prefix + 'active');

        if (typeof config.onClickNext == 'function') {
            config.onClickNext(src);
        }
    }

    /**************************************************************/

    function lazyLoading(array) {
        function loadImage(index) {
            if (index >= array.length) {
                if (typeof config.onLazyLoadingEnd == 'function') {
                    config.onLazyLoadingEnd();
                }

                return;
            }

            var img = new Image();
            img.onload = function () {
                setTimeout(loadImage, config.lazyLoadingDelay, index + 1);
            };
            img.src = array[index];
        }

        setTimeout(function () {
            if (typeof config.onLazyLoadingStart == 'function') {
                config.onLazyLoadingStart();
            }

            loadImage(0);
        }, config.lazyLoadingStart);
    }

    window[name] = {
        count: 0
    };

    $.fn.frydBox = function (options) {
        $.extend(config, options);

        cssBack['background'] = 'rgba(0,0,0,' + config.backOpacity + ')';

        if (typeof config.prevImage == 'undefined') {
            config.prevImage = path + 'prev.png';
        }
        if (config.prevImage !== false) {
            cssPrev['background'] = 'url(' + config.prevImage + ') ' + cssPrev['background'];
        }

        if (typeof config.nextImage == 'undefined') {
            config.nextImage = path + 'next.png';
        }
        if (config.nextImage !== false) {
            cssNext['background'] = 'url(' + config.nextImage + ') ' + cssNext['background'];
        }

        if (typeof config.closeImage == 'undefined') {
            config.closeImage = path + 'close.png';
        }
        if (config.closeImage !== false) {
            cssClose['background'] = 'url(' + config.closeImage + ') ' + cssClose['background'];
        }

        cssImg['border'] = config.borderSize + 'px solid ' + config.borderColor;
        cssImg['border-radius'] = config.borderRadius + 'px';
        cssImg['box-shadow'] = '0 0 ' + config.shadowSize + 'px rgba(0,0,0,' + config.shadowOpacity + ')';

        if (!window[name].count) {
            build();
        }

        var $cont = appendCont(window[name].count);
        appendNavi($cont, window[name].count);

        var indexImg = 0;
        var array = [];

        var result = $(this).each(function () {
            var href = $(this).attr('href');
            array.push(href);

            var $img = appendImg($cont, href, window[name].count, indexImg);

            $(this).attr('data-cont', window[name].count);
            $(this).attr('data-img', indexImg);
            $(this).off('click').on('click', clickLink);

            ++indexImg;
        });

        if (config.lazyLoading) {
            if (document.readyState == 'complete') {
                lazyLoading(array);
            } else {
                $(window).on('load', function () {
                    lazyLoading(array);
                });
            }

        }

        ++window[name].count;

        return result;
    };
}(jQuery));