import * as shell from 'shelljs';

async function sync() {
    console.log('sync @tethys/pro styles ...');
    shell.exec("cd packages/components && cpx '**/*.scss' '../../dist/@tethys/pro'");
    console.log('sync @tethys/pro styles done.');
}

sync();
