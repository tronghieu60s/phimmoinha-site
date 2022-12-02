import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetResolver } from './asset.resolver';

@Module({
  providers: [AssetService, AssetResolver],
})
export class AssetModule {}
