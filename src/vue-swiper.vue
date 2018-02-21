<template>
    <div class="swiper"
         :class="{vertical}"
         @touchstart="onTouchstart"
         @mousedown="onTouchstart"
         @touchcancel="onTouchcancel">
        <div class="swiper-track" :style="{
             'transform' : 'translate3d(' + translateX + 'px,' + translateY + 'px, 0)',
             'transition-duration': transitionDuration + 'ms'
         }" @transitionend="onTransitionend">
            <div class="swiper-item-help b2" v-if="loop && addonBefore2" v-html="addonBefore2" :style="addonStyle"></div>
            <div class="swiper-item-help b1" v-if="loop && addonBefore" v-html="addonBefore" :style="addonStyle"></div>
            <slot></slot>
            <div class="swiper-item-help a1" v-if="loop && addonAfter" v-html="addonAfter" :style="addonStyle"></div>
            <div class="swiper-item-help a2" v-if="loop && addonAfter2" v-html="addonAfter2" :style="addonStyle"></div>
        </div>
        <div class="swiper-indicators" v-if="indicators">
            <div :class="{'swiper-dot': true, 'is-active': index === activeIndex}" :key="index"
                 v-for="(item, index) in childrenList"
                 @click.stop="_transitionToPage(index)">
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'vueSwiper',
        props: {
            // the swiper item show index, start with 0
            showIndex: {
                type: Number,
                default: 0
            },
            // the swiper autoplay interval time，accept Number, unit ms
            auto: {
                type: Number,
                default: 0
            },
            // the swiper defaultDuration for transitionDuration
            defaultDuration: {
                type: Number,
                default: 300
            },
            // set whether you need loop
            loop: {
                type: Boolean,
                default: false
            },
            // set whether you need a vertical swiper
            vertical: {
                type: Boolean,
                default: false
            },
            // set swiper base width, unit px. default width is swiper's width,
            // but when you init a swiper with invisible, default width can not be set right,
            // you need set base width in this time.
            baseWidth: {
                type: Number,
                default: 0
            },
            // set swiper base height, unit px. need when vertical, default height is swiper's height,
            // but when you init a swiper with invisible, default height can not be set right,
            // you need set base height in this time.
            baseHeight: {
                type: Number,
                default: 0
            },
            // set swiper base width and height with a dom or a selector. default size is swiper's size,
            // but when you init a swiper with invisible, default width and height can not be set right,
            // you need set base size dom in this time, base width and height will according to this dom.
            baseSizeDom: {},
            // set whether you need indicators
            indicators: {
                type: Boolean,
                default: false
            },
            // the limit of swiper slide change, unit px
            limit: {
                type: Number,
                default: 20
            },
            // whether use lazyload
            uselazyload: {
                type: Boolean,
                default: false
            },
            // lazyload preload number
            preload: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                addonBefore: '',
                addonBefore2: '',
                addonAfter: '',
                addonAfter2: '',
                translateX: 0,
                translateY: 0,
                timer: 0,
                activeIndex: 0,
                oldActiveIndex: this.showIndex,
                slotsList: [],
                childrenList: [],
                style: {
                    height: '',
                    paddingBottom: ''
                },
                addonStyle: {
                    width: 100 + '%',
                    height: 'auto'
                },
                transitionDuration: this.defaultDuration
            }
        },
        watch: {
            auto() {
                this._setTimer();
            },
            showIndex(val) {
                setTimeout(() => {
                    this._transitionToPage(val);
                }, 30);
            }
        },
        updated: throttle(function() {
            this._handleUpdate();
        }, 300),
        created() {
            this.childrenList = this.$children;
            this.onTouchMove = this.onTouchMove.bind(this);
            this.onTouchEnd = this.onTouchEnd.bind(this);
        },
        mounted() {
            this.activeIndex = this.showIndex;
            this._setTimer();
            // this._resize();
            setTimeout(() => {   //mounted不能保证dom已存在
                this._resize();
            }, 0)
            this._handleUpdate();
            this.$on('childUpdate', throttle(function() {
                this._handleUpdate();
            }, this.defaultDuration));
            window.addEventListener('resize', this._resize);
            document.addEventListener('touchmove', this.onTouchMove, {passive: false}, false);
            document.addEventListener('touchend', this.onTouchEnd, {passive: false}, false);
            document.addEventListener('mousemove', this.onTouchMove, {passive: false}, false);
            document.addEventListener('mouseup', this.onTouchEnd, {passive: false}, false);
        },
        destoryed() {
            window.removeEventListener('resize', this._resize);
            this._clearTimer();
        },

        methods: {
            _handleUpdate() {
                this.slotsList = this.$slots.default;
                this._setSlideActive();
                this._setHelperDOM();
                this._lazyLoad();
            },
            onTouchstart(e) {
                if (this.slotsList.length == 1) {
                    return;
                }
                this.transitionDuration = 0;
                var pos = this._getTouchPos(e);
                this.x = pos.x;
                this.y = pos.y;
                this._clearTimer();
                this.touchStart = true;
            },
            onTouchMove(e) {
                if (!this.touchStart) {
                    return;
                }
                var pos = this._calculatePos(e);
                if (!this.vertical && pos.absX > pos.absY) {
                    e.preventDefault();
                    this._slid(this.activeIndex, pos.deltaX);
                }

                if (this.vertical) {
                    e.preventDefault();
                    this._slid(this.activeIndex, pos.deltaY);
                }
            },
            onTouchEnd(e) {
                if (!this.touchStart) {
                    return;
                }
                var {loop, slotsList, limit, activeIndex} = this;
                var pos = this._calculatePos(e);
                var newIndex = activeIndex;
                if (pos.abs > limit) {
                    newIndex = newIndex + pos.abs / pos.delta;
                    if (!loop) {
                        newIndex = Math.max(Math.min(newIndex, slotsList.length - 1), 0);
                    }
                }
                this._transitionToPage(newIndex);
                this.touchStart = false;
            },
            onTouchcancel(e) {
                this._transitionToPage(this.activeIndex);
            },
            onTransitionend(e) {
                if(this.loop && (this.activeIndex === 0 || this.activeIndex === this.slotsList.length - 1)){
                    this.transitionDuration = 0;
                    this._slid(this.activeIndex, 0);
                }
                this.$emit('slide-end', this.activeIndex);
                if (this.oldActiveIndex !== this.activeIndex) {
                    this.$emit('slide-change', this.activeIndex, this.oldActiveIndex);
                    this.$emit('update:showIndex', this.activeIndex);
                    this.oldActiveIndex = this.activeIndex;
                }
            },
            _lazyLoad() {
                if (!this.uselazyload) {
                    return;
                }
                let i = 0;
                while (i <= this.preload) {
                    let child = this.slotsList[this.activeIndex + i] || {};
                    let $el = child.elm;
                    if ($el) {
                        let lazy = $el.querySelectorAll('.lazy');
                        for (let k = 0; k < lazy.length; k++) {
                            let item = lazy[k];
                            item.setAttribute('src', item.dataset.src);
                            item.classList.remove('lazy');
                        }
                    }
                    i++;
                }
            },
            _setSlideActive() {
                this.slotsList.forEach(($slot, index) => {
                    $slot.componentInstance._setActive(index, this.activeIndex);
                })
            },
            _setHelperDOM() {
                var len = this.slotsList.length;
                if (len > 1 && this.loop) {
                    this.addonBefore = this.slotsList[len - 1].elm.innerHTML;
                    this.addonBefore2 = this.slotsList[len - 2].elm.innerHTML;
                    this.addonAfter = this.slotsList[0].elm.innerHTML;
                    this.addonAfter2 = this.slotsList[1].elm.innerHTML;

                }
            },
            _slid(index, displacement) {
                var {loop, slotsList} = this;
                var len = slotsList.length;
                if (len === 0) {
                    return;
                }
                if (len === 1) {
                    loop = false;
                }
                if (!loop) {
                    index = (index + len) % len;
                }
                var translate = -this._getTranslateOfPage() * (index + (loop ? 2 : 0)) - displacement;
                this._setTranslate(translate);
                this.activeIndex = (index + len) % len;
            },

            _calculatePos(e) {
                var pos = this._getTouchPos(e);
                var x = pos.x;
                var y = pos.y;
                var xd = this.x - x;
                var yd = this.y - y;
                var axd = Math.abs(xd);
                var ayd = Math.abs(yd);
                var absName = this.vertical ? 'absY' : 'absX';
                var deltaName = this.vertical ? 'deltaY' : 'deltaX';
                var res = {
                    deltaX: xd,
                    deltaY: yd,
                    absX: axd,
                    absY: ayd
                }
                res.abs = res[absName];
                res.delta = res[deltaName];
                return res;
            },
            _setTimer() {
                var {auto, slotsList} = this;
                var len = slotsList.length;
                if (auto && len > 1) {
                    this.timer = setInterval(() => {
                        this._transitionToPage(this.activeIndex + 1)
                    }, auto)
                }
            },
            _clearTimer() {
                if (this.timer) {
                    clearInterval(this.timer);
                }
            },
            _transitionToPage(index, duration) {
                this._clearTimer();
                this.transitionDuration = duration || this.defaultDuration;
                this._slid(index, 0);
                this._setTimer();
            },
            _getTouchPos(e) {
                var x = 0;
                var y = 0;
                if (e.changedTouches) {
                    x = e.changedTouches[0].clientX;
                    y = e.changedTouches[0].clientY;
                } else {
                    x = e.clientX;
                    y = e.clientY;
                }
                return {x: x, y: y}
            },
            _resize() {
                let width = 0;
                let height = 0;
                let baseSizeDomWidth = 0;
                let baseSizeDomHeight = 0;
                let baseSizeDom = this.baseSizeDom;
                if (baseSizeDom) {
                    if (typeof baseSizeDom === 'string') {
                        baseSizeDom = document.querySelector(baseSizeDom) || {style: {width: 0, height: 0}};
                    }
                    baseSizeDomWidth = baseSizeDom.offsetWidth || parseInt(baseSizeDom.style.width) || 0;
                    baseSizeDomHeight = baseSizeDom.offsetHeight || parseInt(baseSizeDom.style.height) || 0;
                }

                if (this.baseWidth) {
                    width = this.baseWidth;
                } if(baseSizeDomWidth) {
                    width = baseSizeDomWidth;
                } else {
                    width = this.$el.offsetWidth;
                }
                if (width !== 0) {
                    this.width = width;
                    this.addonStyle.width = width + 'px';
                }

                if (this.vertical) {
                    if (this.baseHeight) {
                        height = this.baseHeight;
                    } if(baseSizeDomHeight) {
                        height = baseSizeDomHeight;
                    } else {
                        height = this.$el.offsetHeight;
                    }
                    if (height !== 0) {
                        this.height = height;
                        this.addonStyle.height = height + 'px';
                    }
                }

                if (width !== 0 || height !== 0) {
                    for (let children of this.$children) {
                        children.$emit('sizeResized', {width, height});
                    }
                }

                this.$nextTick(function afterResize() {
                    this._transitionToPage(this.activeIndex, '0');
                }, this)
            },
            _setTranslate(value) {
                var translateName = this.vertical ? 'translateY' : 'translateX';
                this[translateName] = value;
            },
            _getTranslate() {
                var translateName = this.vertical ? 'translateY' : 'translateX';
                return this[translateName];
            },
            _getTranslateOfPage() {
                var translateName = this.vertical ? 'height' : 'width';
                return this[translateName];
            }
        },

    }

    function throttle(fn, delay) {
        var timer = null;
        var time = new Date().getTime();
        return function() {
            var context = this, args = arguments;
            clearTimeout(timer);
            time = new Date().getTime();
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, delay);
        };
    }
</script>
<style lang="less" rel="stylesheet/less">
    .swiper {
        width: 100%;
        overflow: hidden;
        position: relative;
        &-track {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            position: relative;
            top: 0;
            left: 0;
        }
        &-indicators {
            position: absolute;
            height: 0;
            bottom: 20px;
            left: 0;
            width: 100%;
            text-align: center;
        }
        &-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            margin: 3px;
            border-radius: 100%;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.5);
            transition: all .5s ease;
            &.is-active {
                background: #05B4FF;
            }
        }
        &.vertical {
            .swiper-track {
                flex-direction: column;
            }
            .swiper-indicators {
                left: auto;
                right: 20px;
                bottom: auto;
                top: 50%;
                width: 8px;
                height: auto;
                transform: translate3d(0, -50%, 0);
            }
        }
    }
</style>