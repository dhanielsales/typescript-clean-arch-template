export function getClassMock<T>(model: unknown): jest.Mocked<T> {
  const ModelMock = model as jest.Mock<T>;
  return new ModelMock() as jest.Mocked<T>;
}
