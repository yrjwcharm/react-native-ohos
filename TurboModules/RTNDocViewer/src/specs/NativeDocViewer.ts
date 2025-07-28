import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
export type Callback = (err: string, url: string) => void;
export interface FileInfo {
  url?: string;
  fileName?: string;
  fileType?: string;
  cache?: boolean;
  base64?: string;
}

export interface Spec extends TurboModule {
  openDoc(fileParams: FileInfo[], callback: Callback): void;
  openDocBinaryinUrl(fileParams: FileInfo[], callback: Callback): void;
  openDocb64(fileParams: FileInfo[], callback: Callback): void;
}

export default TurboModuleRegistry.get<Spec>('RNDocViewer') as Spec;
