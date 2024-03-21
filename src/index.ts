import extend from 'extend'
import {fileToBase64} from './utils'
import {FilePickerOptions, UaType} from '../typings/index'

const baseOpt: FilePickerOptions = {
    multiple: true,
    accept: '*',
    wxConfig: {
        jsApiList: ['chooseImage', 'getLocalImgData']
    },
    resType: 'base64'
}
// 处理非微信环境文件选择返回结果
const handleFile = async (files: FileList, type: FilePickerOptions['resType']): Promise<Array<string | File>> => {
    try {
        const result: Array<File> = Array.from(files)
        if (type === 'base64') {
            const promiseList = result.map(f => fileToBase64(f, { quality: 0.5 }))
            return await Promise.all(promiseList)
        }
        return result
    } catch (err) {
        throw err
    }
}

// 非微信环境，创建input[type=file]
const createFileInput = (options: FilePickerOptions) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    const {multiple, accept, onChange, resType, onError} = options
    if (multiple) {
        input.multiple = true;
    }
    if (accept) {
        input.accept = accept;
    }
    input.addEventListener('change', async (e) => {
        const files = (e.target as HTMLInputElement).files as FileList
        if (files.length === 0) {
            return
        }
        try {
            const result = await handleFile(files, resType)
            if (typeof onChange === 'function') {
                onChange(result)
            }
        } catch (err) {
            if (typeof onError === 'function') {
                onError(String(err))
            }
        } finally {
            input.value = ''
        }
    })
    document.body.appendChild(input);
    return input
}

// 微信环境，仅支持选择图片，调用jssdk
const handleWxImageChoose = (options: FilePickerOptions, ua: UaType) => {
    const {wxConfig, onChange, onError} = options
    const wx = window.wx
    try {
        if (typeof wx !== 'undefined' && typeof wx.chooseImage === 'function') {
            let isRun = false
            wx.config(wxConfig)
            wx.ready(() => {
                isRun = true;
                wx.chooseImage({
                    count: 1,
                    sourceType: ['album', 'camera'],
                    success: function (tempFilePaths) {
                        const localId = tempFilePaths.localIds[0];
                        wx.getLocalImgData({
                            localId: localId,
                            success: function (res) {
                                let base64Str = '';
                                const localData = res.localData;
                                try {
                                    if (ua.ios) {
                                        const base64SplitArray = localData.split(',');
                                        // ios 转换出来的 base64 格式是 jgp，此处做个兼容
                                        base64SplitArray[0] = base64SplitArray[0].replace('image/jgp', 'image/jpeg');
                                        base64Str = base64SplitArray.join(',');
                                    } else {
                                        base64Str = `data:image/jpeg;base64,${localData.replace(/\n/g, '')}`;
                                    }
                                    if (typeof onChange === 'function') {
                                        onChange([base64Str])
                                    }
                                } catch (e) {
                                    throw new Error(e as string);
                                }
                            },
                            fail: function (res) {
                                throw new Error(res);
                            }
                        });
                    },
                    fail(res) {
                        throw new Error(res);
                    }
                })
            })
            wx.error((res) => {
                throw new Error(res);
            })
            if (!isRun) {
                throw new Error('config:fail! 请检查wxConfig');
            }
        } else {
            throw new Error('微信JS-SDK未加载！请安装npm包：weixin-js-sdk 或在页面引入官方JS文件，详情请移步：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#3')
        }
    } catch (err) {
        typeof onError === 'function' && onError(String(err))
    }
}

class FilePicker {
    options: FilePickerOptions;
    inputEl: HTMLInputElement | null;
    ua: UaType

    constructor(options: FilePickerOptions = {}) {
        this.options = extend(true, {}, baseOpt, options)
        this.inputEl = null
        this.ua = {
            wx: (/micromessenger/i).test(window.navigator.userAgent),
            ios: (/iPhone OS/i).test(window.navigator.userAgent)
        }
        if (!this.ua.wx) {
            this.inputEl = createFileInput(this.options)
        }
    }
    choose() {
        if (this.ua.wx) {
            handleWxImageChoose(this.options, this.ua)
        } else {
            this.inputEl?.click()
        }
    }
}

if (!window.FilePicker) {
    window.FilePicker = FilePicker
}

export default FilePicker