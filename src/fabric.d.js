import 'fabric';

declare module 'fabric' {
  namespace fabric {
    interface TextOptions {
      objectType?: string; // opcional ou não, dependendo do seu uso
    }
  }
}