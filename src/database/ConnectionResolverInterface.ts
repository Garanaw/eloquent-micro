import ConnectionInterface from './ConnectionInterface';

export default interface ConnectionResolverInterface
{
  connection(name?: string|null): ConnectionInterface;

  getDefaultConnection(): string;

  setDefaultConnection(name: string): void;
}
