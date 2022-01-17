#!/usr/bin/env node

const path = require('path');
const ngPackage = require('ng-packagr');
const fs = require('fs');

const packagesPath = path.resolve(__dirname, '../packages');
const packages = fs.readdirSync(packagesPath).filter((name) => fs.statSync(path.resolve(packagesPath, name)).isDirectory());

async function buildPackages() {
    for (const pkg of packages) {
        const target = path.resolve(__dirname, `../packages/${pkg}`);
        await ngPackage
            .ngPackagr()
            .forProject(path.resolve(target, 'ng-package.json'))
            .withTsConfig(path.resolve(target, 'tsconfig.json'))
            .build()
            .then()
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    }
}

buildPackages();
