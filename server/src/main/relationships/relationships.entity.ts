import { Field, ObjectType } from '@nestjs/graphql';
import { Permission } from '../permission/permission.entity';
import { Role } from '../role/role.entity';

@ObjectType()
export class RolePermissionRelationship {
  @Field(() => Role)
  Role: Role;

  @Field(() => Permission)
  Permission: Permission;
}
