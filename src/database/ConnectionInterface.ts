import Builder from '../attributes/contracts/database/query/Builder';

export default interface ConnectionInterface
{
  table($table: string, $as?: string|null): unknown;

  query(): Builder;

  selectOne($query: string, $bindings: unknown[]): unknown;

  select($query: string, $bindings: unknown[]): unknown;

  insert($query: string, $bindings: unknown[]): unknown;

  update($query: string, $bindings: unknown[]): unknown;

  delete($query: string, $bindings: unknown[]): unknown;
}
