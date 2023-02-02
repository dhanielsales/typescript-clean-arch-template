import MockDate from 'mockdate';

import { MailtrapAdapter } from './mailtrap-adapter';
import { MailSender } from '@shared/infra/protocols/mail-sender';

describe('MailtrapAdapter', () => {
  beforeAll(() => MockDate.set(new Date()));
  afterAll(() => MockDate.reset());

  test("Should not throw eror when calls 'send' method", async () => {
    const sut = new MailtrapAdapter();

    Reflect.set(sut, 'transporter', {
      sendMail: async () => new Promise<void>((resolve) => resolve()),
    });

    const sendMail = jest.spyOn(sut['transporter'], 'sendMail');

    const mailParams: MailSender.Params = {
      to: 'email@email.com',
      subject: 'Sua conta foi criada com sucesso!',
      data: {
        html: `<div> Olá John Doe</div>`,
        text: `Olá John Doe`,
      },
    };

    expect(async () => await sut.send(mailParams)).not.toThrow();
    expect(sendMail).toHaveBeenCalled();
  });

  test("Should not throw eror when calls 'sendMany' method", async () => {
    const sut = new MailtrapAdapter();

    Reflect.set(sut, 'transporter', {
      sendMail: async () => new Promise<void>((resolve) => resolve()),
    });

    const sendMail = jest.spyOn(sut['transporter'], 'sendMail');

    const mailParams: MailSender.Params = {
      to: 'email@email.com',
      subject: 'Sua conta foi criada com sucesso!',
      data: {
        html: `<div> Olá John Doe</div>`,
        text: `Olá John Doe`,
      },
    };

    expect(async () => await sut.sendMany([mailParams])).not.toThrow();
    expect(sendMail).toHaveBeenCalled();
  });
});
