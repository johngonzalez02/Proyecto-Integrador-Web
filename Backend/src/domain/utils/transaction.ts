import { PoolClient } from "pg";
import { pool } from "../../config/database";

/**
 * Ejecuta varias consultas dentro de una transacción.
 * Si algo falla, se revierte todo (ROLLBACK).
 */
export async function withTransaction<T>(callback: (db: PoolClient) => Promise<T>): Promise<T> {
  const db = await pool.connect();
  try {
    await db.query("BEGIN");
    const result = await callback(db);
    await db.query("COMMIT");
    return result;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  } finally {
    db.release();
  }
}