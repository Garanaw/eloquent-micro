import Record from '../data/Record'
import Records from '../data/Records'
import ConnectionInterface from '../database/ConnectionInterface';
import Builder from '../database/query/Builder';
import QueryGrammar from '../database/query/grammars/Grammar';
import Processor from '../database/query/processors/Processor';

export default class Connection implements ConnectionInterface {

  protected $database: string;

  protected $prefix: string;

  protected $config: Record = {};

  protected $queryGrammar: unknown;

  protected $postProcessor: unknown;

  constructor(database: string, prefix: string, config: Record) {
    this.$database = database;
    this.$prefix = prefix;

    this.$config = config;

    this.useDefaultQueryGrammar();

    this.useDefaultPostProcessor();
  }

  public useDefaultQueryGrammar(): void {
    this.$queryGrammar = this.getDefaultQueryGrammar();
  }

  protected getDefaultQueryGrammar(): QueryGrammar {
    return new QueryGrammar();
  }

  public useDefaultPostProcessor(): void {
    this.$postProcessor = this.getDefaultPostProcessor();
  }

  protected getDefaultPostProcessor(): Processor {
    return new Processor();
  }

  // @ts-ignore
  insert(record: Record): void {

  }

  // @ts-ignore
  insertRecords(records: Records): void {

  }

  // @ts-ignore
  delete(id: string[]): void {

  }

  table($table: string, $as?: string | null): unknown {
    return this.query().from($table, $as);
  }

  query(): Builder {
    // @ts-ignore
    return new Builder(this);
  }

  // @ts-ignore
  select($query: string, $bindings: unknown[]): unknown {
    return undefined;
  }

  // @ts-ignore
  selectOne($query: string, $bindings: unknown[]): unknown {
    return undefined;
  }

  // @ts-ignore
  update($query: string, $bindings: unknown[]): unknown {
    return undefined;
  }
}
