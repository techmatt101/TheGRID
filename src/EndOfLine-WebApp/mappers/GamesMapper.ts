import MCRoutes = require('master-control');

module GamesMapper {
    export function games(data :  MCRoutes.Games.List.Return) : IGame[] {
        return data.games.map<IGame>(game);
    }

    export function game (x : any) {
        return {
            name: x.name,
            link: x.link = 'games/' + x.name.toLowerCase().replace(' ', '_')
        };
    }
}

export = GamesMapper;