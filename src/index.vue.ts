import {App, Plugin} from 'vue'
import FilePicker from './file-picker'


const plugin: Plugin = {
    install: (app: App) => {
        app.component('filePicker', FilePicker)
    }
}
  
export default plugin