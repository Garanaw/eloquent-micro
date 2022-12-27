export default interface ConnectionInterface
{
  table($table: string, $as?: string|null): unknown;

  selectOne($query: string, $bindings: unknown[]): unknown;

  select($query: string, $bindings: unknown[]): unknown;

  insert($query: string, $bindings: unknown[]): unknown;

  update($query: string, $bindings: unknown[]): unknown;

  delete($query: string, $bindings: unknown[]): unknown;
}
