module.exports = {
    allowBranch: ['master'],
    bumpFiles: ['package.json'],
    skip: {
        changelog: true
    },
    commitAll: true,
    hooks: {
        prepublish: 'yarn build && yarn pub-only',
        postreleaseBranch: 'lerna version {{version}} && git add .'
    }
};
