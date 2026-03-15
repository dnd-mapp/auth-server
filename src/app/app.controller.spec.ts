import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    async function setupTest() {
        const app = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        return {
            controller: app.get(AppController),
        };
    }

    it('should return "Hello World!"', async () => {
        const { controller } = await setupTest();
        expect(controller.getHello()).toEqual('Hello World!');
    });
});
