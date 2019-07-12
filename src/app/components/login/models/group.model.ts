import { Permission } from './permission.model';

export class Group {
  constructor(
    public id?: number,
    public name?: string,
    public permissions?: Permission[]
  ) {}
}