import { of } from 'rxjs';
import { Empleats } from './empleats';

describe('Empleats', () => {
  it('should create', () => {
    const component = new Empleats({
      getAll: () => of([]),
      create: () => of({}),
      update: () => of({}),
      delete: () => of(undefined),
    } as never);

    expect(component).toBeTruthy();
  });
});
