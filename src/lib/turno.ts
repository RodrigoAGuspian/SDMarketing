export interface Turno {
    id: string;
    finalizado: false;
    desde: {
      seconds: 0;
      nanoseconds: 0;
    };
    hasta: {
      seconds: 0;
      nanoseconds: 0;
    };
    ganancias: {
      [key: string]: 0;
    };
    modelo: string;
}