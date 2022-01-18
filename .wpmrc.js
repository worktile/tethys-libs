module.exports = {
    allowBranch: ['master', 'walker/*'],
    bumpFiles: ['package.json'],
    skip: {
        changelog: true,
        commit: true
    },
    commitAll: true,
    hooks: {
        prepublish: 'yarn run build',
        postreleaseBranch: 'lerna version {{version}} && git add .'
    }
};
