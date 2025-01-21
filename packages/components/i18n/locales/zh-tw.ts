import { ThyI18nLocale, ThyI18nLocaleConfig } from '../type';

export const zhTwLocale: ThyI18nLocaleConfig = {
    id: ThyI18nLocale.zhTw,
    translations: {
        inProgress: '進行中',
        completed: '已完成',
        count: '個',
        forbidDropInEntry: '不能到達此列',
        expandedAll: '全部展開',
        foldUpAll: '全部收起',
        lane: '泳道',
        wipLimitStatistics: '共 {{count}} 個 / 在制品限制 {{wipLimit}} 個',
        countStatistics: '共 {{count}} 個',
        foldUp: '收起',
        expand: '展開',
        emptyGroup: '未分組',

        getSMSCode: '獲取短信驗證碼',
        sended: '已發送，<span class="text-primary">{{ seconds }}</span> 秒後重新獲取',

        imageErrorMessage: '圖片加載錯誤',
        upload: '上傳',
        reupload: '重新上傳',
        preview: '預覽',
        cancel: '取消',
        ok: '確定',
        uploading: '上傳中',
        image: '圖片',
        uploadTips: '最佳尺寸120 x 120像素',

        notify: '通知',
        help: '幫助',
        setting: '設置',
        secondaryTitle: '二級標題',

        speed: '倍速',
        audioFormatError: '該音頻暫不支持預覽，請升級瀏覽器版本或下載查看',
        networkError: '當前網絡異常，請刷新後重試',
        videoFormatError: '該視頻暫不支持預覽，請升級瀏覽器版本或下載查看'
    }
};
