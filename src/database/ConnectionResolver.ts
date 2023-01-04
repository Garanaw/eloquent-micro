import ConnectionResolverInterface from './ConnectionResolverInterface';
import ConnectionInterface from './ConnectionInterface';

export default class ConnectionResolver implements ConnectionResolverInterface
{
  protected $connections: Record<string, ConnectionInterface> = {};

  protected $default: string = '';

  constructor($connections: Record<string, ConnectionInterface> = {}) {
    for (let $connection in $connections) {
      this.addConnection($connection, $connections[$connection]);
    }
  }

  connection($name: string|null = null): ConnectionInterface {
    if ($name === null) {
      $name = this.getDefaultConnection();
    }

    return this.$connections[$name];
  }

  addConnection($name: string, $connection: ConnectionInterface): void {
    this.$connections[$name] = $connection;
  }

  hasConnection($name: string): boolean {
    return this.$connections[$name] !== undefined;
  }

  getDefaultConnection(): string {
    return this.$default;
  }

  setDefaultConnection($name: string): void {
    this.$default = $name;
  }
}
