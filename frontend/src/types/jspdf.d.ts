// Minimal TypeScript declarations for jspdf used in this project.
// Prefer installing @types/jspdf in the future.

declare module 'jspdf' {
  export class jsPDF {
    // Keep constructor permissive but avoid 'any' linter complaint
    constructor(...args: unknown[]);
    internal: {
      pageSize: {
        getWidth(): number;
        getHeight(): number;
      };
    };
    setFontSize(size: number): void;
    setTextColor(r: number, g?: number, b?: number): void;
    text(text: string | string[], x: number, y: number): void;
    splitTextToSize(text: string, maxWidth: number): string[];
    addPage(): void;
    setDrawColor(r: number, g: number, b: number): void;
    line(x1:number,y1:number,x2:number,y2:number): void;
    getNumberOfPages(): number;
    setPage(n:number): void;
    save(filename:string): void;
  }
  export default jsPDF;
}
