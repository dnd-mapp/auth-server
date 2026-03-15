import { appVersion } from './app-version';

describe('appVersion', () => {
    it('should return the version of the app', async () => {
        expect(await appVersion()).toEqual(expect.any(String));
    });
});
