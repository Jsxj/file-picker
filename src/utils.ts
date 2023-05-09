import extend from 'extend'
import loadImage from 'blueimp-load-image'

export function fileToBase64(file: File | Blob, options): Promise<any> {
    const baseOptions = {
        orientation: true,
        canvas: true,
        quality: 0.8
    }
    const isImage = (/(jpeg|png)$/i).test(file.type)
    return new Promise((resolve, reject) => {
        if (isImage) {
            options = extend(true, {}, baseOptions, options)
            loadImage(file, (canvas) => {
                if ((canvas as Event).type === 'error') {
                    reject('convert image file to base64 failed')
                } else {
                    resolve((canvas as HTMLCanvasElement).toDataURL(file.type, options.quality))
                }
            }, options)
        } else {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
            fileReader.onerror = () => {
                reject('convert file to base64 failed')
            }
        }
    })
}