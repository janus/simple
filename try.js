const {MADD} = require('./constants');

console.log(MADD);

function goon() {
    let foo = 90;

    {
        let foo = 7777;
        console.log(foo);
    }
    console.log(foo);
}

goon();