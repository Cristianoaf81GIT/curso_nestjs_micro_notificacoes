import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory } from "@nestjs/microservices"

@Injectable()
export class ClientProxySmartRanking {

  constructor(private configService: ConfigService) {}

  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport:+this.configService.get<string>('TRANSPORT_LOCAL'),
      options: {
        urls: [`${this.configService.get<string>('SERVER_URL_LOCAL')}`],
        queue: this.configService.get<string>('QUEUE_NAME_LOCAL')
      }
    });
  }


  getClientProxyDesafiosInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport:+this.configService.get<string>('TRANSPORT_LOCAL'),
      options: {
        urls: [`${this.configService.get<string>('SERVER_URL_LOCAL')}`],
        queue: this.configService.get<string>('CHALLENGES_QUEUE_NAME')
      }
    });
  }

  getClientProxyRankingsInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport:+this.configService.get<string>('TRANSPORT_LOCAL'),
      options: {
        urls: [`${this.configService.get<string>('SERVER_URL_LOCAL')}`],
        queue: this.configService.get<string>('RANKINGS_QUEUE_NAME')
      }
    });
  }

}
