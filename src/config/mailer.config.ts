import { MailerOptions, MailerOptionsFactory } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";



@Injectable()
export class MailerConfig implements MailerOptionsFactory {

  constructor(private readonly config: ConfigService) {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return  {
      transport: {
        host: this.config.get<string>('SMTP_HOST'),
        port: parseInt(this.config.get<string>('SMTP_PORT'),10),
        secure: this.config.get<string>('SMTP_SEC_OPT') === 'true',
        tls: {
          ciphers: 'SSLv3'
        },
        auth: {
          user: this.config.get<string>('SMTP_USER'),
          pass: this.config.get<string>('SMTP_PASS'),
        },
      }
    }
  }

}