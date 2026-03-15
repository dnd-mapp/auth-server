import { parseArrayFromString } from './array';

describe('array', () => {
    describe('parseArrayFromString', () => {
        it('should parse an array from a string', () => {
            expect(parseArrayFromString([], '1,2,3,4')).toEqual(['1', '2', '3', '4']);
        });

        it(`should use the fallback when no value is provided`, () => {
            expect(parseArrayFromString(['1', '2', '3', '4'], undefined)).toEqual(['1', '2', '3', '4']);
        });
    });
});
