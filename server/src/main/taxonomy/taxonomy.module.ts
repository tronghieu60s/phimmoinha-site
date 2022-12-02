import { Module } from '@nestjs/common';
import { TaxonomyResolver } from './taxonomy.resolver';
import { TaxonomyService } from './taxonomy.service';

@Module({
  providers: [TaxonomyResolver, TaxonomyService],
})
export class TaxonomyModule {}
