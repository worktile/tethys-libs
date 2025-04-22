module.exports = {
    allowBranch: ['master', 'release-*', 'release-auto-*', 'v18.x'],
    bumpFiles: [
        'package.json',
        './packages/auth/package.json',
        './packages/cache/package.json',
        {
            filename: './packages/components/version.ts',
            type: 'code'
        }
    ],
    skip: {
        changelog: true,
        confirm: true
    },
    commitAll: true,
    hooks: {
        prepublish: 'yarn build',
        postreleaseBranch: 'lerna version {{version}} && git add .'
    }
};
