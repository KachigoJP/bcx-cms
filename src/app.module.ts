import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Source
import { typeOrmConfig } from '@config/db';
import AuthModule from '@apps/auth/auth.module';
import ProfileModule from '@apps/profile/profile.module';
import UserModule from '@apps/user/user.module';
import ProviderModule from '@apps/providers/provider.module';
import SettingModule from '@apps/settings/settings.module';
import ServiceModule from '@apps/services/module';
import TestimonialModule from '@apps/testimonials/module';
import PageCategoriesModule from '@apps/categories/page_categories.module';
import PageTagsModule from '@apps/tags/tags.module';
import PageMetadatasModule from '@apps/page_metadatas/page_metadatas.module';
import PageModule from '@apps/pages/pages.module';
import LanguageModule from '@apps/languages/languages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProviderModule,
    AuthModule,
    ProfileModule,
    UserModule,
    SettingModule,
    ServiceModule,
    TestimonialModule,
    PageCategoriesModule,
    PageTagsModule,
    PageMetadatasModule,
    PageModule,
    LanguageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
