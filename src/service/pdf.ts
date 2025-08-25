import { pdfjs } from 'react-pdf';
export const confPdfjs = () => {
  import('react-pdf/dist/esm/Page/AnnotationLayer.css');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
};