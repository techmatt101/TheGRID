import mongoose = require('mongoose');
import DbHelpers = require('../helpers/DbHelpers');

import Categories = require('../models/Games/Categories');

module CategoriesDbService {

    export interface ICategoriesDoc extends Categories, mongoose.Document {}

    var Schema = new mongoose.Schema({
        categories: [],
    });

    var Model : mongoose.Model<ICategoriesDoc> = mongoose.model<ICategoriesDoc>('categories', Schema);


    export function getCategories () : Promise<ICategoriesDoc> {
        return DbHelpers.queryToPromise(
            Model.findOne({})
        );
    }
}

export = CategoriesDbService;