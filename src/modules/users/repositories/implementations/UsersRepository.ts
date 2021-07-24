import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const foundUser = (await this.repository.findOne({
      where: { id: user_id },
      relations: ["games"],
    })) as unknown;

    return foundUser as User;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const foundUsers = await this.repository.query(
      "SELECT * FROM users ORDER BY first_name"
    );
    return foundUsers;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const foundUser = await this.repository.query(
      `SELECT * FROM users WHERE LOWER(first_name) = LOWER('${first_name}') AND LOWER(last_name) = LOWER('${last_name}')`
    );

    return foundUser;
  }
}
