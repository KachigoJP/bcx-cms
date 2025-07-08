import { NestFactory } from '@nestjs/core';

// Source
import InitData from './data';
import { AppModule } from 'src/app.module'; // Adjust path if needed
import LanguagesService from '@apps/languages/languages.service';
import ProvidersService from '@apps/providers/provider.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    await app.get(LanguagesService).initializeData(InitData.languages);
    await app.get(ProvidersService).initializeData(InitData.providers);
  } catch (error) {
    console.error('Initialization failed:', error);
  } finally {
    await app.close(); // Close the application context after initialization
  }
}

bootstrap();
