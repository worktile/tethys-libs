import * as path from 'path';
import * as fs from 'fs';
import { spawnSync } from 'child_process';

const packagesPath = path.resolve(__dirname, '../dist/@tethys');

async function publish() {
    if (!fs.existsSync(packagesPath)) {
        throw new Error(`Publish directory not found: ${packagesPath}. Did you run build first?`);
    }
    const packages = fs.readdirSync(packagesPath).filter((name) => fs.statSync(path.resolve(packagesPath, name)).isDirectory());

    const argsBase = ['publish', '--access', 'public'];
    const isNext = process.argv.includes('--next');
    const tagArgs = isNext ? ['--tag', 'next'] : [];

    for (const pkg of packages) {
        console.log(`@tethys/${pkg} publishing ...`);
        const cwd = path.resolve(packagesPath, pkg);
        const result = spawnSync('npm', [...argsBase, ...tagArgs], {
            cwd,
            stdio: 'inherit'
        });
        if (result.error) {
            throw result.error;
        }
        if (typeof result.status === 'number' && result.status !== 0) {
            process.exit(result.status);
        }
        console.log(`@tethys/${pkg} published.`);
    }
}

publish();
