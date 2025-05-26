/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'full',
    title: 'TETHYS PRO',
    siteProjectName: 'tethys',
    description: '',
    docsDir: 'docs',
    repoUrl: 'git+https://github.com/worktile/tethys-libs.git',
    logoUrl: 'https://cdn.worktile.com/open-sources/ngx-tethys/logos/tethys.png?100',
    navs: [
        null,
        {
            title: '组件',
            path: 'components',
            lib: 'tethys',
            locales: {}
        }
    ],
    defaultLocale: 'zh-cn',
    locales: [
        {
            key: 'zh-cn',
            name: '中文'
        },
        {
            key: 'en-us',
            name: 'English'
        }
    ],
    libs: [
        {
            name: 'tethys',
            rootDir: 'packages/components',
            include: [],
            apiMode: 'automatic',
            categories: []
        }
    ],
    switchTheme: true
};
