import { Permisos } from './permisos';

describe('Permisos', () => {
  it('should be created', () => {
    const service = new Permisos({} as never);

    expect(service).toBeTruthy();
  });
});
