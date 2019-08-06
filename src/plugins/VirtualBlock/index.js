import VirtualBlock from './VirtualBlock.vue';

const plugin = {
    install(Vue) {
        Vue.component("VirtualBlock", VirtualBlock);
    }
}

export default plugin;