import NativeDocViewer from './src/specs/NativeDocViewer';
import type {Spec, FileInfo, Callback} from './src/specs/NativeDocViewer';

class DocViewers implements Spec {
  openDoc(fileParams: FileInfo[], callback: Callback): void {
    console.log('Opening document with params:', NativeDocViewer);
    NativeDocViewer?.openDoc(fileParams, callback);
  }
  openDocBinaryinUrl(fileParams: FileInfo[], callback: Callback): void {
    NativeDocViewer?.openDocBinaryinUrl(fileParams, callback);
  }
  openDocb64(fileParams: FileInfo[], callback: Callback): void {
    NativeDocViewer?.openDocb64(fileParams, callback);
  }
}

export default new DocViewers();
