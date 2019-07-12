import { Group } from './group.model';

export class User {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public groups?: Group[]
  ) {}
}