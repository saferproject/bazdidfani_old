export default interface APIResponseData<T> {
  data: T;
  message: string;
  success: boolean;
}