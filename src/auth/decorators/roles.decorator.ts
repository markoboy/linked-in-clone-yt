import { SetMetadata } from '@nestjs/common';
import { ERole } from '../models/role.enum';

export const ROLES_META_KEY = 'auth_roles';

export const Roles = (...roles: ERole[]) => SetMetadata(ROLES_META_KEY, roles);
