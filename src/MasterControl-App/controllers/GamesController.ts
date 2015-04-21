import GamesDb = require('../services/GamesDbService');
import CategoriesDb = require('../services/CategoriesDbService');
import GamesMapper = require('../mappers/GamesMapper');

import Game = require('../models/Games/Game');
import NewGame = require('../models/Games/NewGame');
import UpdateGame = require('../models/Games/UpdateGame');
import Categories = require('../models/Games/Categories');

module GamesController {

    export module Info {

        export var PATH = 'game/info';

        export interface Data {
            id: string
        }

        export interface Return extends Game {
        }

        export function handler (data : Data) : Promise<Return> {
            return GamesDb.getGame(data.id)
                .then((game) => GamesMapper.mapDbGameToGame(game));
        }
    }

    export module List {

        export var PATH = 'game/list';

        export interface Data {
            ids : string[]
        }

        export interface Return {
            games: Game[]
        }

        export function handler (data : Data) : Promise<Return> {
            return GamesDb.getGames(data.ids)
                .then((games) => games.map((game) => GamesMapper.mapDbGameToGame(game)))
                .then((games) => {
                    return { games: games };
                });
        }
    }

    export module Search {

        export var PATH = 'game/search';

        export interface Data {
            search : string
            maxResults? : number
        }

        export interface Return {
            games: Game[]
        }

        export function handler (data : Data) : Promise<Return> {
            return GamesDb.searchPublishedGames(data.search, data.maxResults)
                .then((games) => games.map((game) => GamesMapper.mapDbGameToGame(game)))
                .then((games) => {
                    return { games: games };
                });
        }
    }

    export module Create {

        export var PATH = 'game/create';

        export interface Data extends NewGame {
        }

        export function handler (data : Data) : Promise<string> {
            return GamesDb.createGame(GamesMapper.mapNewGameToDbGame(data))
                .then((game) => game._id);
        }
    }

    export module Delete {

        export var PATH = 'game/delete';

        export interface Data {
            id : string
        }

        export function handler (data : Data) : Promise<void> {
            return Promise.resolve()
                .then(() => {
                    GamesDb.deleteGame(data.id);
                });
        }
    }

    export module Update {

        export var PATH = 'game/update';

        export interface Data {
            id : string
            updatedData : UpdateGame
        }

        export function handler (data : Data) : Promise<void> {
            return Promise.resolve(data.updatedData)
                .then((updatedData) => GamesMapper.mapUpdateGameToDbGame(updatedData))
                .then<void>((updatedData) => GamesDb.updateGame(data.id, updatedData));
        }
    }

    export module Categories {

        export var PATH = 'game/categories';

        export interface Return extends Categories {
        }

        export function handler () : Promise<Return> {
            return CategoriesDb.getCategories();
        }
    }
}

export = GamesController;