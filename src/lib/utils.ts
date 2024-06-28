import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import type { Modelo } from './modelo'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? updaterOrValue(ref.value)
    : updaterOrValue
}



export const modelosPrev: Modelo[] = [
  {
    idModelo: 1,
    nombre: "Camila",
    username: "Camila1234",
    jornada: "Mañana",
    plataformas: [],
    turnos: [],
    ganancias: []
  },
  {
    idModelo: 2,
    nombre: "Ana",
    username: "Ana1234",
    jornada: "Tarde",
    plataformas: [],
    turnos: [],
    ganancias: []
  },
  {
    idModelo: 3,
    nombre: "Camila",
    username: "Camila1234",
    jornada: "Mañana",
    plataformas: [],
    turnos: [],
    ganancias: []
  },
  {
    idModelo: 4,
    nombre: "Camila",
    username: "Camila1234",
    jornada: "Mañana",
    plataformas: [],
    turnos: [],
    ganancias: []
  },
  {
    idModelo: 5,
    nombre: "Camila",
    username: "Camila1234",
    jornada: "Mañana",
    plataformas: [],
    turnos: [],
    ganancias: []
  },
]