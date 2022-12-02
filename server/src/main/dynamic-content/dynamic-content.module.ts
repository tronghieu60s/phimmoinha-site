import { Module } from '@nestjs/common';
import { DynamicContentService } from './dynamic-content.service';
import { DynamicContentResolver } from './dynamic-content.resolver';

@Module({
  providers: [DynamicContentService, DynamicContentResolver],
})
export class DynamicContentModule {}
