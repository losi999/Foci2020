declare module 'aws-xray-sdk' {
  export function captureAWSClient<T>(client: T): T;
  export function captureHTTPsGlobal<T>(http: T): T;

}
