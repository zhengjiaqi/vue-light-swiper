[![npm](https://img.shields.io/npm/l/vue-light-swiper.svg?maxAge=2592000)](https://raw.githubusercontent.com/zhengjiaqi/vue-light-swiper/master/LICENSE)
[![npm](https://img.shields.io/npm/v/vue-light-swiper.svg?maxAge=2592000)](https://www.npmjs.com/package/vue-light-swiper)
[![GitHub release](https://img.shields.io/github/release/zhengjiaqi/vue-light-swiper.svg?maxAge=2592000)](https://github.com/zhengjiaqi/vue-light-swiper/releases)
[![GitHub issues](https://img.shields.io/github/issues/zhengjiaqi/vue-light-swiper.svg?maxAge=2592000)](https://github.com/zhengjiaqi/vue-light-swiper/issues)
[![GitHub stars](https://img.shields.io/github/stars/zhengjiaqi/vue-light-swiper.svg?style=social&label=Star&maxAge=2592000)](https://github.com/zhengjiaqi/vue-light-swiper)

[![NPM](https://nodei.co/npm/vue-light-swiper.png?downloads=true&downloadRank=true)](https://nodei.co/npm/vue-light-swiper/)

# vue-swiper
vue swiper for vue 2.0. light weight and simple

## Examples
[basic demo](http://zhengjiaqi.github.io/vue-light-swiper/demo)

## Install
```
npm install vue-light-swiper --save-dev
```

## Usage

```js
import Vue from 'vue'
import VueSwiper from 'vue-light-swiper'

new Vue({
    el: 'body',
    components: {
        vueSwiper: VueSwiper.vueSwiper,
        vueSwiperSlide: VueSwiper.vueSwiperSlide
    },
    methods: {
        slideChange(index, oldIndex){
            console.log('showIndexChange:', index, oldIndex);
        },
    }
});
```

```html
<vue-swiper indicators @slide-change="slideChange">
    <vue-swiper-slide>Page 1</vue-swiper-slide>
    <vue-swiper-slide>Page 2</vue-swiper-slide>
    <vue-swiper-slide>Page 3</vue-swiper-slide>
</vue-swiper>
```

## Use lazyload

```html
<vue-swiper uselazyload :preload="1">
    <vue-swiper-slide class="swiper-item" :key="item.src" v-for="(item, index) in bannerList">
        <img class="lazy" :data-src="item.src">
    </vue-swiper-slide>
</vue-swiper>
```


## Api
### Properties
| Name                 | Type      | Default      | Description                                                        |
|----------------------|-----------|--------------|--------------------------------------------------------------------|
| showIndex            | `Number`  | `0`          | Set the swiper item show index, can use .sync modifier.            |
| auto                 | `Number`  | `0`          | Set the swiper autoplay interval time, unit ms.                    |
| defaultDuration      | `Number`  | `300`        | Set the swiper defaultDuration for transitionDuration, unit ms.             |
| loop                 | `Boolean` | `false`      | Set whether you need swiper loop.                                  |
| vertical             | `Boolean` | `false`      | Set whether you need a vertical swiper.                            |
| indicators           | `Boolean` | `false`      | Set whether you need indicators.                                   |
| limit                | `Number`  | `20`         | Set the limit of swiper slide change, unit px.                     |
| uselazyload          | `Boolean` | `false`      | Set whether use lazyload.                                          |
| preload              | `Number`  | `0`          | Set lazyload preload number.                                       |
| baseWidth            | `Number`  | `0`          | Set swiper base width, unit px. (default width is swiper's width, but when you init a swiper with invisible, default width can not be set right, you need set base width in this time.) |
| baseHeight           | `Number`  | `0`          | Set swiper base height, unit px. (need when vertical, default height is swiper's height, but when you init a swiper with invisible, default height can not be set right, you need set base height in this time.) |
| baseSizeDom          | `String、dom`  | ``      | Set swiper base width and height with a dom or a selector.(priority is lower than baseWidth and baseHeight)          |

### Methods
| Method            | Description              |
|-------------------|--------------------------|
| next()            | Go next page.            |
| prev()            | Go previous page.        |
| setPage(`Number`) | Set current page number. |

### Events
| Name                            | Parameters | Description                                                                                                                                                  |
|--------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| slide-change       | `index, oldIndex`     | Fire when the slide changed .                                                                                        |
| slide-end          | `index`               | Fire when the slide animation end .                                                                                             |

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017-present, zhengjiaqi