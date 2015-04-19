/// <reference path="es6-promise/es6-promise.d.ts" />

declare module "promise-parallel" {
    function parallel(tasks : any[]) : Promise<any[]>

    export = parallel;
}