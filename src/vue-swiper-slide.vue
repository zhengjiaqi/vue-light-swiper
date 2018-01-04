<template>
    <div class="swiper-item" :style="style"
         :class="{
            'is-active': active
        }">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'vueSwiperSlide',
        created: function() {
            let me = this;
            let width = this.$parent.width;
            let height = this.$parent.height;
            width && (this.style.width = width + 'px');
            height && (this.style.height = height + 'px');
            this.$on('sizeResized', function({width, height}) {
                width && (me.style.width = width + 'px');
                height && (me.style.height = height + 'px');
            });
        },
        data() {
            return {
                style: {
                    width: 100 + '%',
                    height: 'auto'
                },
                active: false
            }
        },
        methods: {
            _setActive(index, activeIndex) {
                this.active = index === activeIndex;
            }
        },
        updated(val,oldval) {
            this.$parent.$emit('childUpdate');
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .swiper {
        &-item, &-item-help {
            width: 1200px;
            box-sizing: border-box;
            flex-shrink: 0;
            display: flex;
            height: 100%;
        }
    }

</style>
