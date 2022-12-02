import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import {
  ForgotPasswordInput,
  ForgotPasswordResponse,
  SignInInput,
  SignInResponse,
  SignUpInput,
  SignUpResponse,
} from './auth.entity';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(private service: AuthService) {}

  @Mutation(() => SignInResponse)
  async signIn(@Args('input') input: SignInInput) {
    return this.service.signIn(input);
  }

  @Mutation(() => SignUpResponse)
  async signUp(@Args('input') input: SignUpInput) {
    return this.service.signUp(input);
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(@Args('input') input: ForgotPasswordInput) {
    return this.service.forgotPassword(input);
  }
}
