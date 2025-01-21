import { SetMetadata } from '@nestjs/common';

interface RoleMetaDataItemsShape {
  role: string;
  context: string;
}

export const Roles = (...roles: RoleMetaDataItemsShape[]) =>
  SetMetadata('roles', roles);
