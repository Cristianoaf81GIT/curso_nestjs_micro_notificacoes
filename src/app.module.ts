import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfig } from './config/mailer.config';

// https://gitlab.com/dfs-treinamentos/smart-ranking/smart-ranking-microservices/micro-notificacoes/-/tree/aula-micro-notificacoes/src
// https://nest-modules.github.io/mailer/docs/mailer.html

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({useClass: MailerConfig}),
    ProxyrmqModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
