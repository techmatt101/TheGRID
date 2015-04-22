import MCRoutes = require('services/master-control');

module UsersMapper {
    export function mapUserToken (mcData : MCRoutes.UsersToken.New.Return) {
        return {
            token: mcData.token,
            url: "https://the-game-grid.com/login?token=" + mcData.token
        };
    }
}

export = UsersMapper;