import { ThyI18nLocale, ThyI18nLocaleConfig } from '../type';

export const jaJpLocale: ThyI18nLocaleConfig = {
    id: ThyI18nLocale.jaJp,
    translations: {
        inProgress: '進行中',
        completed: '完了しました',
        count: '個',
        forbidDropInEntry: 'この列に到達できません',
        expandedAll: 'すべて展開',
        foldUpAll: 'すべて閉じる',
        lane: 'レーン',
        wipLimitStatistics: '合計 {{count}} 個/仕掛品制限 {{wipLimit}} 個',
        countStatistics: '合計 {{count}} 個',
        foldUp: 'しまって',
        expand: '展開',
        emptyGroup: 'グループ化されていません',
        getSMSCode: 'sms認証コードを取得します',
        sended: '送信済み、<span class="text-primary">{{ seconds }}</span> 秒後に再取得',
        imageErrorMessage: '画像ロードエラー',
        upload: 'アップロード',
        reupload: '再アップロード',
        preview: 'プレビュー',
        cancel: 'キャンセル',
        ok: '確定',
        uploading: 'アップロード中',
        image: '画像',
        uploadTips: '最適サイズ 120 x 120 画素',
        notify: '通知',
        help: 'ヘルプ',
        setting: '設定',
        secondaryTitle: '二級タイトル',
        speed: '倍速',
        audioFormatError:
            'このオーディオはプレビューをサポートしていません。ブラウザのバージョンをアップグレードするか,ダウンロードして表示してください。',
        networkError: '現在のネットワークに異常があるので,更新後に再試行してください',
        videoFormatError:
            'このビデオはプレビューをサポートしていません。ブラウザのバージョンをアップグレードするか,ダウンロードして表示してください'
    }
};
