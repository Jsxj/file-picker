interface WxConfig {
    appId?: string;
    timestamp?: number;
    nonceStr?: string;
    signature?: string;
    jsApiList?: Array<string>
}

export interface FilePickerOptions {
    multiple?: boolean;
    accept?: string;
    wxConfig?: WxConfig;
    resType?: 'file' | 'base64';
    onChange?: (files: Array<string | File>) => void
    onError?: (err: string) => void
}

export interface UaType {
    wx: boolean;
    ios: boolean;
}
