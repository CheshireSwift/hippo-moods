import Vector from './Vector';

describe('a vector', () => {
  it('adds by adding the components', () => {
    expect(new Vector(1, 2).add(new Vector(3, 4))).toEqual(
      new Vector(1 + 3, 2 + 4),
    );
  });

  it('multiplies by multiplying the components', () => {
    expect(new Vector(1, 2).multiply(5)).toEqual(new Vector(1 * 5, 2 * 5));
  });

  it('converts to a string by joining the components', () => {
    expect(`${new Vector(1, 2)}`).toEqual('1 2');
  });
});
