declare module "config" {
    class config {
        static get(key : string) : any;
        static has(key : string) : boolean;
    }

    export = config;
}