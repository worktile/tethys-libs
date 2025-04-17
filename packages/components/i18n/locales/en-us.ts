import { ThyI18nLocale, ThyI18nLocaleConfig } from '../type';

export const enUsLocale: ThyI18nLocaleConfig = {
    id: ThyI18nLocale.enUs,
    translations: {
        inProgress: 'In progress',
        completed: 'Completed',
        count: '',
        forbidDropInEntry: 'Cannot reach this entry',
        expandedAll: 'Expand all',
        foldUpAll: 'Fold up all',
        lane: 'Lane',
        wipLimitStatistics: 'Total {{count}} pcs / WIP limit {{wipLimit}} pcs',
        countStatistics: 'Total {{count}} pcs',
        foldUp: 'Fold up',
        expand: 'Expand',
        emptyGroup: 'Ungrouped',

        getSMSCode: 'Get SMS verification code',
        sended: 'Sent, retrieve again in <span class="text-primary">{{ seconds }}</span> seconds',

        imageErrorMessage: 'Image loading error',
        upload: 'Upload',
        reupload: 'Re-upload',
        preview: 'Preview',
        cancel: 'Cancel',
        ok: 'OK',
        uploading: 'Uploading',
        image: 'Image',
        uploadTips: 'Optimal size 120 x 120 pixels',

        notify: 'Notify',
        help: 'Help',
        setting: 'Settings',
        secondaryTitle: 'Secondary title',

        speed: 'speed',
        audioFormatError: 'This audio is not supported for preview. Please upgrade your browser version or download to view.',
        networkError: 'The current network is abnormal. Please refresh and try again.',
        videoFormatError: 'This video is not supported for preview. Please upgrade your browser version or download to view.'
    }
};
