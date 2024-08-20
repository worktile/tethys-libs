module.exports = {
    allowBranch: ['master', 'release-*'],
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
        changelog: true
    },
    commitAll: true,
    hooks: {
        prepublish: 'yarn build',
        postreleaseBranch: 'lerna version {{version}} && git add .'
    }
};
