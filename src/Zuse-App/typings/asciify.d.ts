declare module 'asciify' {
    function asciify (msg : string, options : Object, output : (err, res) => void) : void;
    export = asciify;
}