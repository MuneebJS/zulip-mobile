import { foregroundColorFromBackground, colorHashFromName } from '../color';

describe('foregroundColorFromBackground', () => {
  test('returns "black" for light backgrounds', () => {
    expect(foregroundColorFromBackground('#ffffff')).toEqual('black');
    expect(foregroundColorFromBackground('lightgray')).toEqual('black');
    expect(foregroundColorFromBackground('#b0b0b0')).toEqual('black');
  });

  test('returns "white" for dark backgrounds', () => {
    expect(foregroundColorFromBackground('#000000')).toEqual('white');
    expect(foregroundColorFromBackground('#333333')).toEqual('white');
    expect(foregroundColorFromBackground('#0000f0')).toEqual('white');
  });
});

describe('colorHashFromName', () => {
  test('returns a 6 digit hex number to use as a color ', () => {
    const hash = colorHashFromName('John Doe');
    expect(hash).toHaveLength(7);
  });

  test('produces the same output for the same input', () => {
    const hash1 = colorHashFromName('John Doe');
    const hash2 = colorHashFromName('John Doe');
    expect(hash1).toEqual(hash2);
  });
});
