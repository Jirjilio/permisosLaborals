import { of } from 'rxjs';
import { Permisos } from './permisos';

describe('Permisos', () => {
  it('should create', () => {
    const component = new Permisos(
      {
        getAll: () => of([]),
        create: () => of({}),
        update: () => of({}),
        delete: () => of(undefined),
      } as never,
      {
        getAll: () => of([]),
      } as never,
      { navigate: () => Promise.resolve(true) } as never,
      {
        success: () => undefined,
        error: () => undefined,
        warning: () => undefined,
        info: () => undefined,
      } as never
    );

    expect(component).toBeTruthy();
  });
});
