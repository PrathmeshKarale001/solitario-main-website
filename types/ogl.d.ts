declare module 'ogl' {
  export class Renderer {
    constructor(options?: {
      canvas?: HTMLCanvasElement;
      width?: number;
      height?: number;
      dpr?: number;
      alpha?: boolean;
      depth?: boolean;
      stencil?: boolean;
      antialias?: boolean;
      premultipliedAlpha?: boolean;
      preserveDrawingBuffer?: boolean;
      powerPreference?: string;
      failIfMajorPerformanceCaveat?: boolean;
    });
    setSize(width: number, height: number): void;
    render(scene: any, camera?: any): void;
    gl: WebGL2RenderingContext;
  }

  export class Program {
    uniforms: Record<string, { value: any }>;
    constructor(gl: WebGL2RenderingContext, options: {
      vertex: string;
      fragment: string;
      uniforms?: Record<string, any>;
    });
    setUniform(name: string, value: any): void;
  }

  export class Mesh {
    constructor(gl: WebGL2RenderingContext, options?: {
      geometry?: any;
      program?: Program;
      mode?: number;
    });
    setParent(parent: any): void;
    updateMatrixWorld(): void;
    draw(camera: any): void;
  }

  export class Color {
    r: number;
    g: number;
    b: number;
    a?: number;
    constructor(r?: number | string, g?: number, b?: number, a?: number);
    set(r: number | string, g?: number, b?: number, a?: number): void;
  }

  export class Plane {
    constructor(gl: WebGL2RenderingContext, options?: {
      width?: number;
      height?: number;
      widthSegments?: number;
      heightSegments?: number;
    });
  }
}

