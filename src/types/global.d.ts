declare module '*.json' {
  const value: any;
  export default value;
}

declare global {
  interface Window {
    worldMap?: import('maplibre-gl').Map;
  }
}

export {};
