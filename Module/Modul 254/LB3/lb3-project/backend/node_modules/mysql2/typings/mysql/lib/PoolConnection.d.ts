import { Connection } from './Connection.js';
import { Pool as PromisePool } from 'mysql2/promise';

declare class PoolConnection extends Connection {
  connection: Connection;
  release(): void;
  promise(promiseImpl?: PromiseConstructor): PromisePool;
}

export { PoolConnection };
