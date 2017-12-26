// var expect = require('chai').expect;
import {createVue, destroyVM} from '../util.js';
import {vueSwiper, vueSwiperSlide} from '../../../src/index.js';


describe('Swiper', function() {
    let vm;
    afterEach(() => {
        // destroyVM(vm);
    });
    it('create', done => {
        const elm = document.createElement('div');
        vm = createVue({
            template: `
                <div>
                    <vue-swiper>
                        <vue-swiper-slide v-for="item in 3" :key="item">{{ item }}</vue-swiper-slide>
                    </vue-swiper>
                </div>
            `,
            components: {
                vueSwiper,
                vueSwiperSlide
            }
        }, true);
        vm.$nextTick(() => {
            expect(vm.$el.querySelectorAll('.swiper-item').length).to.equal(3);
            done()
        })
    });

    it('auto play', done => {
        vm = createVue({
            template: `
                <div>
                    <vue-swiper :auto="500">
                        <vue-swiper-slide v-for="item in 3" :key="item">{{ item }}</vue-swiper-slide>
                    </vue-swiper>
                </div>
            `,
            components: {
                vueSwiper,
                vueSwiperSlide
            }
        }, true);
        vm.$nextTick(() => {
            const items = vm.$el.querySelectorAll('.swiper-item');
            expect(items[0].classList.contains('is-active')).to.true;
            setTimeout(() => {
                expect(items[1].classList.contains('is-active')).to.true;
                done();
            }, 1000);
        })
    });

    it('initial index', done => {
        vm = createVue({
            template: `
                <div>
                    <vue-swiper :show-index="1">
                        <vue-swiper-slide v-for="item in 3" :key="item">{{ item }}</vue-swiper-slide>
                    </vue-swiper>
                </div>
            `,
            components: {
                vueSwiper,
                vueSwiperSlide
            }
        }, true);

        setTimeout(() => {
            expect(vm.$el.querySelectorAll('.swiper-item')[1].classList.contains('is-active')).to.true;
            done();
        }, 10);
    });

    it('change', done => {
        vm = createVue({
            template: `
                <div>
                    <vue-swiper :auto="500" :show-index="1" @slide-change="slideChange">
                        <vue-swiper-slide v-for="item in 3" :key="item">{{ item }}</vue-swiper-slide>
                    </vue-swiper>
                </div>
            `,
            data() {
                return {
                    index: -1,
                    oldIndex: -1
                };
            },
            methods: {
                slideChange(index, oldIndex){
                    this.index = index;
                    this.oldIndex = oldIndex;
                }
            },
            components: {
                vueSwiper,
                vueSwiperSlide
            }
        }, true);

        setTimeout(() => {
            expect(vm.index).to.equal(2);
            expect(vm.oldIndex).to.equal(1);
            done();
        }, 900);
    });

    it('indicators', done => {
        vm = createVue({
            template: `
                <div>
                    <vue-swiper :show-index="1" indicators>
                        <vue-swiper-slide v-for="item in 3" :key="item">{{ item }}</vue-swiper-slide>
                    </vue-swiper>
                </div>
            `,
            components: {
                vueSwiper,
                vueSwiperSlide
            }
        }, true);
        
        setTimeout(() => {
            const items = vm.$el.querySelectorAll('.swiper-dot');
            expect(items[1].classList.contains('is-active')).to.true;
            done();
        }, 10);
    });

    describe('manual control', () => {
        it('click', done => {
            vm = createVue({
                template: `
                <div>
                    <vue-swiper :show-index="1" indicators>
                        <vue-swiper-slide v-for="item in 3" :key="item">{{ item }}</vue-swiper-slide>
                    </vue-swiper>
                </div>
            `,
                components: {
                    vueSwiper,
                    vueSwiperSlide
                }
            }, true);

            setTimeout(() => {
                const items = vm.$el.querySelectorAll('.swiper-item');
                vm.$el.querySelectorAll('.swiper-dot')[2].click();
                setTimeout(() => {
                    expect(items[2].classList.contains('is-active')).to.true;
                    done();
                }, 400);
            }, 10);
            
        });
    });
});