import {Role} from './role';
export class User {
  id?: string;
  employeeId: string='';
  name: string='';
  role: Role=Role.User;
  status: string='';
  token: string='';
}
