# Installation
You can install it by NPM:
```javascript
npm i @shexj/file-picker
```

Also available on [jsdelivr](https://cdn.jsdelivr.net/npm/@shexj/file-picker/dist/index.umd.js), [unpkg](https://unpkg.com/@shexj/file-picker@1.0.0/dist/index.umd.js) :

```javascript
<script src="https://cdn.jsdelivr.net/npm/@shexj/file-picker/dist/index.umd.js"></script>
```
# Usage
### Used in native HTML, initializes the instance:
```html
// The element that triggers to pick files 
<button onclick="choose()">test</button>

<script type="text/javascript">
const filePicker = new FilePicker({
    resType: 'base64',
    onChange: (base64s) => {
        console.log(base64s[0])
    },
    onError: (err) => {
        console.error(err)
    }
})

function choose() {
    filePicker.choose()
}
</script>
```

### Used in vue3（not yet support vue2）:
#### Global register component in ```main.ts``` :
```javascript
import FilePicker from 'file-picker/dist/index.vue.js'

const app = createApp(App)
app.use(FilePicker)
```
#### Use component in ```.vue``` file:
```html
<template>
  <div class="home">
    <file-picker :multiple="false" accept="image/*" @change="onChange">
        <button>test</button>
    </file-picker>
    <img :src="imgUrl" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const imgUrl = ref("");
const onChange = (base64s: Array<string>) => {
    imgUrl.value = base64s[0];
}
</script>
```

### Used in the wechat browser environment:
In the wechat browser environment, it will call the relevant api of wechat sdk to evoke the image selection function, so you must make sure that JSSDK is used correctly and provide the correct configuration parameter ```wxConfig```.

```javascript
const filePicker = new FilePicker({
    wxConfig: {
        appId: "xxxxxxxxxxxx",
        nonceStr: "xxxxxxxxxxxx",
        timestamp: 1514519281,
        signature: "xxxxxxxxxxxxxxxxxxxxxxxx"
    },
    // ...other config
})
```
For questions about JSSDK using or ```wxConfig``` parameters, go here: [https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#3]

# Options
| Name  | Type | Default | Description |
| :---: | :---: | :---: | :---: |
| multiple | boolean | false | Whether to select multiple options. **Invalid in wechat environment, fixed ```false```**.
| accept | string | * | Follow the attribute criteria for native ```Input[type=file]```, which can be viewed: [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/file#accept]. **Invalid in wechat environment**. |
| resType | 'file' \| 'base64' | 'base64' |  The format of the parameter of the ```onChange``` callback function. **Invalid in wechat environment, fixed ```'base64'```** |
| onChange | (files:Array<string\|File>)=>void || The callback after the file is selected successfully. |
| onError | (err:string)=>void || The callback when the file is selected fails. |

# Apis
| Name  | Usage | Description |
| :---: | :---: | :---: |
| choose | filePicker.choose() | To pick files |