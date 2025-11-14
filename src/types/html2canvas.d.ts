declare module 'html2canvas' {
  interface Html2CanvasOptions {
    width?: number;
    height?: number;
    scale?: number;
    useCORS?: boolean;
    logging?: boolean;
    backgroundColor?: string | null;
  }

  function html2canvas(element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
  export default html2canvas;
}

