import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Dictionary } from 'ngx-tethys/types';

enum Theme {
    light = 'light',
    dark = 'dark',
    system = 'system'
}

const THY_PRO_THEME_KEY = 'thy_pro_theme';

@Component({
    selector: 'app-theme-selector',
    templateUrl: './theme-selector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSelectorComponent implements OnInit {
    theme!: Theme;

    themesMap: Dictionary<{ key: Theme; name: string; icon: string }> = {
        [Theme.light]: { key: Theme.light, name: '亮色主题', icon: 'sun' },
        [Theme.dark]: { key: Theme.dark, name: '暗黑主题', icon: 'moon' },
        [Theme.system]: { key: Theme.system, name: '跟随系统', icon: 'computer' }
    };

    themes = [this.themesMap[Theme.light], this.themesMap[Theme.dark], this.themesMap[Theme.system]];

    ngOnInit(): void {
        this.setTheme(this.getTheme());
    }

    isDarkTheme(): boolean {
        return (
            (this.theme === Theme.system && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
            this.theme === Theme.dark
        );
    }

    getTheme(): Theme {
        const cacheTheme = window.localStorage.getItem(THY_PRO_THEME_KEY) as Theme;
        if (cacheTheme && [Theme.light, Theme.dark, Theme.system].includes(cacheTheme)) {
            return cacheTheme;
        } else {
            return Theme.light;
        }
    }

    setTheme(theme: Theme) {
        this.theme = theme;
        window.localStorage.setItem(THY_PRO_THEME_KEY, theme);

        if (this.isDarkTheme()) {
            document.documentElement.setAttribute('theme', Theme.dark);
            document.documentElement.style.setProperty('color-scheme', 'dark');
        } else {
            document.documentElement.removeAttribute('theme');
            document.documentElement.style.removeProperty('color-scheme');
        }
    }
}
