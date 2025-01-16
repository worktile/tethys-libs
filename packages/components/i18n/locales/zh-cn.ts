import { ThyI18nLocale, ThyI18nLocaleConfig } from '../type';

export const zhCnLocale: ThyI18nLocaleConfig = {
    id: ThyI18nLocale.zhCn,
    translations: {
        inProgress: '进行中',
        completed: '已完成',
        count: '个',
        forbidDropInEntry: '不能到达此列',
        expandedAll: '全部展开',
        foldUpAll: '全部展开',
        lane: '泳道',
        wipLimitStatistics: '共 {{count}} 个 / 在制品限制 {{wipLimit}} 个',
        countStatistics: '共 {{count}} 个',
        foldUp: '收起',
        expand: '展开',
        emptyGroup: '未分组',

        getSMSCode: '获取短信验证码',
        sended: '已发送',

        imageErrorMessage: '图片加载错误',
        upload: '上传',
        reupload: '重新上传',
        preview: '预览',
        cancel: '取消',
        ok: '确定',
        uploading: '上传中',
        image: '图片',
        uploadTips: '最佳尺寸 120 x 120 像素',

        notify: '通知',
        help: '帮助',
        setting: '设置',
        secondaryTitle: '二级标题',

        speed: '倍速',
        audioFormatError: '该音频暂不支持预览，请升级浏览器版本或下载查看',
        networkError: '当前网络异常，请刷新后重试',
        videoFormatError: '该视频暂不支持预览，请升级浏览器版本或下载查看'
    }
};
