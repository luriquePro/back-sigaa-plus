import { IIndexHelloWorldEntryDTO, IIndexHelloWorldReturn, IIndexHelloWorldUsecase } from './hello-world.interface.ts';
import { validateIndexHelloWorld } from './hello-world.validation.ts';

class IndexHelloWorldUsecase implements IIndexHelloWorldUsecase {
  constructor() {}
  async execute(params: IIndexHelloWorldEntryDTO): Promise<IIndexHelloWorldReturn> {
    validateIndexHelloWorld(params);

    const message = params.message ?? 'Hello World';

    return { message };
  }
}

export { IndexHelloWorldUsecase };
