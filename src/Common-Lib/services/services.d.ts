//TODO: generate this file dynamically

declare module services {
    module MasterControlService {
        function requestLeaderboardScores(data: MCRoutes.Leaderboard.Scores.Data, callback: (err?, data?: MCRoutes.Leaderboard.Scores.Return) => void): void;
    }
}

declare module MCRoutes {
    export module Leaderboard {
        export module Scores {
            export interface Data {
                id: number;
            }
            export interface Return {
                scores: any[];
            }
        }
    }
}

declare module "services" {
    export = services;
}