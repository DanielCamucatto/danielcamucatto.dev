// Arquivo para fornecer declarações mínimas de JSX enquanto os tipos do React
// não estão presentes no ambiente local (útil para editar sem `node_modules`).
// Não substitui a instalação de `@types/react` em builds reais.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
