import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const foundGames = await this.repository
      .createQueryBuilder("games")
      .where("games.title ILIKE :titleToCompare", {
        titleToCompare: `%${param}%`,
      })
      .getMany();

    return foundGames;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const totalGames = await this.repository.query(
      "SELECT COUNT(*) FROM games"
    );

    return totalGames;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const foundUsersByGameId = await this.repository
      .createQueryBuilder()
      .select("users")
      .from(User, "users")
      .innerJoin("users.games", "game", "game.id = :game_id", { game_id: id })
      .getMany();

    return foundUsersByGameId;
  }
}
