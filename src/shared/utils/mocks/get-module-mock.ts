export function createModuleMock<U, T>(mock: { new (arg: U): T }, arg: U): jest.Mocked<unknown> {
  const ModelMock = mock as jest.Mock<T>;

  return new ModelMock(arg) as jest.Mocked<unknown>;
}
