import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Desafio } from './interfaces/desafio.interface';
import { ClientProxySmartRanking } from './proxyrmq/proxyrmq.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Jogador } from './interfaces/jogador.interface';
import { lastValueFrom } from 'rxjs';
import HTML_NOTIFICACAO_ADVERSARIO from './static/html-notificacao-adversario';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly clientAdminBackend: ClientProxy;
  private EMAIL_SENDER: string;

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private readonly mailService: MailerService,
    private readonly config: ConfigService,
  ) {
    this.clientAdminBackend =
      this.clientProxySmartRanking.getClientProxyAdminBackendInstance();
    this.EMAIL_SENDER = this.config.get<string>('SMTP_EMAIL_SENDER');
  }

  async enviarEmailParaAdversario(desafio: Desafio): Promise<void> {
    try {
      /**
       * identificar o ID do adversario
       */
      let idAdversario = '';
      let adversario: Jogador;
      let solicitante: Jogador;

      desafio.jogadores.forEach((jogador) => {
        if (jogador != desafio.solicitante) {
          idAdversario = jogador;
        }
      });

      // consultar as informações adicionais dos jogadores
      if (idAdversario !== '') {
        adversario = await lastValueFrom(
          this.clientAdminBackend.send('consultar-jogadores', idAdversario),
        );
        solicitante = await lastValueFrom(
          this.clientAdminBackend.send(
            'consultar-jogadores',
            desafio.solicitante,
          ),
        );
        if (!adversario && !adversario._id) {
          throw new NotFoundException(
            'jogador desafiante não encontrado para a partida!',
          );
        }

        if (!solicitante && !solicitante._id) {
          throw new NotFoundException(
            'Jogador solicitante não encontrado para a partida!',
          );
        }

        let markup = '';

        markup = HTML_NOTIFICACAO_ADVERSARIO;
        markup = markup.replace(/#NOME_ADVERSARIO/g, adversario.nome);
        markup = markup.replace(/#NOME_SOLICITANTE/g, solicitante.nome);
        this.mailService
          .sendMail({
            to: `${adversario.email}`,
            from: `"SMART RANKING" <${this.EMAIL_SENDER}>`,
            subject: 'Notificação de Desafio',
            html: markup,
          })
          .then((success) => {
            this.logger.log(success);
          })
          .catch((err) => {
            this.logger.error(err);
          });
      } else {
        throw new BadRequestException(
          'o id do adversário deve constar no desafio',
        );
      }
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
