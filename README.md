# frydBox 1.0.1
Plugin for jQuery library being a free and lightweight alternative for Lightbox or Fancybox. Compatible with jQuery since version 1.2.0 and 99% browsers, mobile friendly. Embedded lazy loading. You can specify prefix of the class, background opacity, modal size, border radius and other parameters. It's free also in commercial use.

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
If you want to hide previous, next or close navigation images, just type false.

## Configuration
You can set optional parameters:
```html
<script>
$(".photo").frydBox({
   prefix: 'frydBox_',
   lazyLoading: true,
   lazyLoadingDelay: 100,
   fadeDuration: 500,
   moveDuration: 700,
   fadeWhenMove: true,
   screenPercent: 0.88,
   backOpacity: 0.6,
   shadowOpacity: 0.6,
   shadowSize: 18,
   borderSize: 10,
   borderColor: '#fff',
   borderRadius: 8,
   scrollBars: false,
   prevImage: 'prev.png',
   nextImage: 'next.png',
   closeImage: 'close.png'
});
</script>
```

## Examples
* [Single photo](https://frydlewicz.pl/app/frydBox/examples/single.html)
* [Group of photos](https://frydlewicz.pl/app/frydBox/examples/group.html)
* [Configuration](https://frydlewicz.pl/app/frydBox/examples/conf.html)

## License
[MIT License](LICENSE.txt)
