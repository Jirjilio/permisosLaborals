import { Empleats } from './empleats';

describe('Empleats', () => {
  it('should be created', () => {
    const service = new Empleats({} as never);

    expect(service).toBeTruthy();
  });
});
