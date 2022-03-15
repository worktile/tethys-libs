import * as shell from 'shelljs';

const packages = ['components'];

async function sync() {
    for (const pkg of packages) {
        console.log(`sync @tethys/${pkg} styles ...`);
        shell.exec(`cd packages/${pkg} && cpx '**/*.scss' '../../dist/@tethys/${pkg}'`);
        console.log(`sync @tethys/${pkg} styles done.`);
    }
}

sync();
