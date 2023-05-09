import {defineComponent, h} from 'vue'
import { WxConfig } from '../typings';
import FilePicker from './index';

export default defineComponent({
    data(){
        return {
            filePicker: {}
        }
    },
    props: {
        multiple: {
            type: Boolean,
            default: true
        },
        accept: {
            type: String,
            default: '*'
        },
        resType: {
            type: String,
            default: 'base64' as 'file' | 'base64'
        },
        wxConfig: {
            type: Object,
            default: () => ({} as WxConfig)
        }
    },
    created() {
        this.filePicker = new FilePicker({
            multiple: this.multiple,
            accept: this.accept,
            resType: this.resType as 'file' | 'base64',
            wxConfig: this.wxConfig,
            onChange: (files) => {
                this.$emit('change', files)
            },
            onError: (err) => {
                this.$emit('error', err)
            }
        })
    },
    methods: {
        handlePick() {
            (this.filePicker as FilePicker).choose()
        }
    },
    render() {
        return h('div', {
            onClick: this.handlePick
        },
        [this.$slots.default && this.$slots.default()])
    }
})