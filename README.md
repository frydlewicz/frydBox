# frydBox 1.0.4
Plugin for jQuery library being a free and lightweight (~9kB) alternative for Lightbox or Fancybox. Compatible with jQuery since version 1.7 and 99% browsers, mobile friendly. Embedded lazy loading. You can specify prefix of the class, background opacity, modal size, border radius, navigation images and other parameters; frydBox doesn't include any external CSS file. It's free also in commercial use. Since version 1.0.3 you have access to callback functions.

## Installation
Include it after jQuery script:
```html
<script src="jquery.frydBox.min.js"></script>
```
You can use our cdn hosting:
```html
<script src="https://cdn.frydlewicz.pl/app/frydBox/jquery.frydBox.min.js"></script>
```

## Use
Single photo:
```html
<a href="photo_big.jpg" id="photo"><img src="photo_min.jpg"></a>
```
```html
<script>
$("#photo").frydBox();
</script>
```

Group of photos:
```html
<a href="photo1_big.jpg" class="photo"><img src="photo1_min.jpg"></a>
<a href="photo2_big.jpg" class="photo"><img src="photo2_min.jpg"></a>
<a href="photo3_big.jpg" class="photo"><img src="photo3_min.jpg"></a>
```
```html
<script>
$(".photo").frydBox();
</script>
```

## Configuration
You can set optional parameters:
```html
<script>
$(".photo").frydBox({
   // custom prefix
   prefix: 'frydBox_',

   // enable lazy loading
   lazyLoading: true,
   lazyLoadingStart: 1000,
   lazyLoadingDelay: 100,

   // fade and move duration
   fadeDuration: 500,
   moveDuration: 700,
   fadeWhenMove: true,

   // appearance settings
   screenPercent: 0.88,
   backOpacity: 0.6,
   shadowOpacity: 0.6,
   shadowSize: 18,
   borderSize: 10,
   borderColor: '#fff',
   borderRadius: 8,

   // show animated loader
   showLoader: true,

   // hide scroll bars
   scrollBars: false,

   // navigation images
   prevImage: 'prev.png',
   nextImage: 'next.png',
   closeImage: 'close.png'

   // callback functions
   onClickLink: function(galleryIndex, imageIndex, src) {},
   onClickPrev: function(src) {},
   onClickNext: function(src) {},
   onImageLoaded: function(src) {},
   onImageShowed: function(src) {},
   onHide: function() {},
   onLazyLoadingStart: function() {},
   onLazyLoadingEnd: function() {}
});
</script>
```
If you want to hide previous, next or close navigation images, just type false.

## Examples
* [Single photo](https://frydlewicz.pl/app/frydBox/examples/single.html)
* [Group of photos](https://frydlewicz.pl/app/frydBox/examples/group.html)
* [Configuration](https://frydlewicz.pl/app/frydBox/examples/conf.html)

## License
[MIT License](LICENSE.txt)
