import { CustomError } from "../errors/custom.error";

export class Validators {

  static id(value: unknown, field = "id"): number {
    const n = Number(value);
    if (value === null || value === undefined || !Number.isInteger(n) || n <= 0) {
      throw CustomError.badRequest(`${field} inválido`);
    }
    return n;
  }

  static text(value: unknown, field: string, max = 150): string {
    if (typeof value !== "string" || value.trim() === "") {
      throw CustomError.badRequest(`${field} es obligatorio`);
    }
    const text = value.trim();
    if (text.length > max) {
      throw CustomError.badRequest(`${field} no puede superar ${max} caracteres`);
    }
    return text;
  }

  static optionalText(value: unknown, field: string): string | null {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string") throw CustomError.badRequest(`${field} inválido`);
    return value.trim();
  }

  static int(value: unknown, field: string, min = 0): number {
    const n = Number(value);
    if (value === null || value === undefined || value === "" || !Number.isInteger(n) || n < min) {
      throw CustomError.badRequest(`${field} debe ser un entero mayor o igual a ${min}`);
    }
    return n;
  }

  static email(value: unknown, field = "correo"): string {
    const text = Validators.text(value, field, 150).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      throw CustomError.badRequest(`${field} no es un correo válido`);
    }
    return text;
  }

  static oneOf<T extends string>(value: unknown, field: string, allowed: readonly T[]): T {
    if (typeof value !== "string" || !allowed.includes(value as T)) {
      throw CustomError.badRequest(`${field} debe ser uno de: ${allowed.join(", ")}`);
    }
    return value as T;
  }

  static date(value: unknown, field: string): Date {
    const date = new Date(String(value));
    if (value === undefined || value === null || value === "" || isNaN(date.getTime())) {
      throw CustomError.badRequest(`${field} debe ser una fecha válida`);
    }
    return date;
  }

  static boolean(value: unknown, field: string): boolean {
    if (typeof value !== "boolean") {
      throw CustomError.badRequest(`${field} debe ser verdadero o falso`);
    }
    return value;
  }

}