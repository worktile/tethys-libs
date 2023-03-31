/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'full',
    title: 'TETHYS PRO',
    description: '',
    docsDir: 'docs',
    siteProjectName: 'site',
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
    libs: [
        {
            name: 'tethys',
            rootDir: './packages/components',
            include: [],
            apiMode: 'automatic',
            categories: []
        }
    ]
};
