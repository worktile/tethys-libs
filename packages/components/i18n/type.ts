export enum ThyI18nLocale {
    zhCn = 'zh-cn',
    zhTw = 'zn-tw',
    enUs = 'en-us',
    deDe = 'de-de',
    jaJp = 'ja-jp',
    ruRu = 'ru-ru'
}

export interface ThyI18nTranslation {
    inProgress: string;
    completed: string;
    count: string;
    forbidDropInEntry: string;
    expandedAll: string;
    foldUpAll: string;
    lane: string;
    wipLimitStatistics: string;
    countStatistics: string;
    foldUp: string;
    expand: string;
    emptyGroup: string;

    getSMSCode: string;
    sended: string;

    imageErrorMessage: string;
    upload: string;
    reupload: string;
    preview: string;
    cancel: string;
    ok: string;
    uploading: string;
    image: string;
    uploadTips: string;

    notify: string;
    help: string;
    setting: string;
    secondaryTitle: string;

    speed: string;
    audioFormatError: string;
    networkError: string;
    videoFormatError: string;
}

export interface ThyI18nLocaleConfig {
    id: ThyI18nLocale;
    translations: ThyI18nTranslation;
}
