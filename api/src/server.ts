import { buildApp } from './app';

const app = buildApp();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function bootstrap() {
  try {
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Dependar Full Backend API IS RUNNING ON PORT ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
