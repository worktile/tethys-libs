import { inject, Injectable, Signal, signal, WritableSignal, computed } from '@angular/core';
import { ThyI18nLocale, ThyI18nTranslation } from './type';
import { zhCnLocale } from './locales/zh-cn';
import { deDeLocale } from './locales/de-de';
import { jaJpLocale } from './locales/ja-jp';
import { ruRuLocale } from './locales/ru-ru';
import { zhTwLocale } from './locales/zh-tw';
import { enUsLocale } from './locales/en-us';
import { THY_I18N_DEFAULT_LOCALE_TOKEN } from './constant';

@Injectable({ providedIn: 'root' })
export class ThyI18nService {
    private locales: { [key in ThyI18nLocale]: ThyI18nTranslation } = {
        [ThyI18nLocale.zhCn]: zhCnLocale.translations,
        [ThyI18nLocale.zhTw]: zhTwLocale.translations,
        [ThyI18nLocale.enUs]: enUsLocale.translations,
        [ThyI18nLocale.deDe]: deDeLocale.translations,
        [ThyI18nLocale.jaJp]: jaJpLocale.translations,
        [ThyI18nLocale.ruRu]: ruRuLocale.translations
    };

    private defaultLocale: ThyI18nLocale = inject(THY_I18N_DEFAULT_LOCALE_TOKEN, { optional: true }) || this.getDefaultLocaleId();

    private locale: WritableSignal<ThyI18nTranslation> = signal(this.locales[this.defaultLocale]);

    private normalizeLocale(id: string) {
        return (id?.toLowerCase() as ThyI18nLocale) ?? ThyI18nLocale.zhCn;
    }

    private getDefaultLocaleId(): ThyI18nLocale {
        let defaultLocaleId = ThyI18nLocale.zhCn;
        const allLocales = [
            ThyI18nLocale.zhCn,
            ThyI18nLocale.zhTw,
            ThyI18nLocale.enUs,
            ThyI18nLocale.jaJp,
            ThyI18nLocale.deDe,
            ThyI18nLocale.ruRu
        ];
        if (typeof window !== 'undefined' && window?.navigator?.language) {
            defaultLocaleId = window.navigator?.language?.toLowerCase() as ThyI18nLocale;
        }
        return allLocales.includes(this.normalizeLocale(defaultLocaleId) as ThyI18nLocale) ? defaultLocaleId : ThyI18nLocale.zhCn;
    }

    /**
     * 设置语言
     * @param id
     */
    setLocale(id: string) {
        const localeId: ThyI18nLocale = this.normalizeLocale(id);

        const translations = this.locales[localeId] ?? this.locales[this.defaultLocale];
        this.locale.set(translations);
    }

    /**
     * 获取当前语言
     */
    getLocale(): Signal<ThyI18nTranslation> {
        return this.locale;
    }
}

export function injectLocale(): Signal<ThyI18nTranslation> {
    const i18nService = inject(ThyI18nService);
    return i18nService.getLocale();
}
