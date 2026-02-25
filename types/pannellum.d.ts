declare module "pannellum" {
  export function viewer(
    container: string | HTMLElement,
    config: Record<string, unknown>,
  ): {
    destroy?: () => void;
  };
}

