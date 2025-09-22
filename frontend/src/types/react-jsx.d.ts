declare module 'react' {
  export interface Attributes { }
  export interface ReactNode {}
  export const Fragment: any;
  export function createElement(...args: any[]): any;
  export default any;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function jsxDEV(type: any, props: any, key?: any): any;
}
