module.exports = {
    allowBranch: ['master', 'walker/*'],
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
