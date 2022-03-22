export abstract class BaseAPIResponse<
  TransformedData,
  M = Record<string, unknown>,
> {
  abstract meta: M;

  abstract data: TransformedData;
}
