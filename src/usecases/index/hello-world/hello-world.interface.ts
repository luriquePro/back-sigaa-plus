interface IIndexHelloWorldUsecase {
  execute(data: IIndexHelloWorldEntryDTO): Promise<{ message: string }>;
}

interface IIndexHelloWorldEntryDTO {
  message?: string;
}

interface IIndexHelloWorldReturn {
  message: string;
}

export type { IIndexHelloWorldEntryDTO, IIndexHelloWorldReturn, IIndexHelloWorldUsecase };
