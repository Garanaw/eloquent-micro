import BuilderContract from '../../attributes/contracts/database/eloquent/Builder';
import EloquentBuilder from '../eloquent/Builder';
import ConnectionInterface from '@/database/ConnectionInterface';
import Expression from './Expression';

export default class Builder implements BuilderContract
{
  public $connection: ConnectionInterface;

  // @ts-ignore
  public $grammar;

  // @ts-ignore
  public $processor;

  public $bindings = {
    select: [],
    from: [],
    join: [],
    where: [],
    groupBy: [],
    having: [],
    order: [],
    union: [],
    unionOrder: [],
  };

  public $columns: string[] = ['*'];

  public $distinct: boolean = false;

  public $from: string = '';

  public $wheres: {}[] = [];

  public $operators: string[] = [
    '=', '<', '>', '<=', '>=', '<>', '!=', '<=>',
    'like', 'like binary', 'not like', 'ilike',
    '&', '|', '^', '<<', '>>', '&~', 'is', 'is not',
    'rlike', 'not rlike', 'regexp', 'not regexp',
    '~', '~*', '!~', '!~*', 'similar to',
    'not similar to', 'not ilike', '~~*', '!~~*',
  ];

  constructor(
    $connection: ConnectionInterface
  ) {
    this.$connection = $connection;
  }

  public select($columns: string[]|string = ['*']): this {
    this.$columns = [];
    this.$bindings['select'] = [];

    this.$columns = Array.isArray($columns)
      ? $columns
      : Array.from(arguments);

    return this;
  }

  protected createSub($query: Builder|EloquentBuilder|Function|string): any[] {
    if ($query instanceof Function) {
      const $callback: Function = $query;
      $query = new Builder(this.$connection);
      $callback($query);
    }

    return this.parseSub($query);
  }

  protected parseSub($query: Builder|EloquentBuilder|string): any[] {
    if ($query instanceof Builder || $query instanceof EloquentBuilder) {
      return [$query.toSql(), $query.getBindings()];
    }

    return [$query, []];
  }

  public where(
    $column: string|Function|Expression|any[],
    $operator: string|null = null,
    $value: any = null,
    $boolean: string = 'and'
  ): this {
    [$value, $operator] = this.prepareValueAndOperator($value, $operator, arguments.length === 2);

    if ($column instanceof Function && $operator !== null) {
      return this.whereNested($column, $boolean);
    }

    if (this.isQueryable($column) && $operator !== null) {
      const [$sub, $bindings] = this.createSub($column as string|Function|Builder|EloquentBuilder);

      return this.addBinding($bindings, 'where')
        .where(new Expression('(' + $sub + ')'), $operator, $value, $boolean);
    }

    if (this.invalidOperator($operator)) {
      [$value, $operator] = [$operator, '='];
    }

    if ($value instanceof Function) {
      return this.whereSub(
        $column as string,
        $operator as string,
        $value,
        $boolean
      );
    }

    if ($value === null) {
      return this.whereNull($column as string, $boolean, $operator !== '=');
    }

    this.$wheres.push({
      type: 'Basic',
      column: $column,
      operator: $operator,
      value: $value,
      boolean: $boolean
    });

    return this.addBinding($value, 'where');
  }

  public prepareValueAndOperator($value: string, $operator: string|null, $useDefault: boolean = false): any[] {
    if ($useDefault) {
      return [$operator, '='];
    }

    if (this.invalidOperatorAndValue($operator || '', $value)) {
      throw new Error(`Illegal operator and value combination.`);
    }

    return [$value, $operator];
  }

  protected invalidOperatorAndValue($operator: string, $value: any): boolean {
    return $value === null
      && this.$operators.includes($operator)
      && ! ['=', '<>', '!='].includes($operator);
  }

  protected invalidOperator($operator: any): boolean {
    if (typeof $operator !== 'string') {
      return true;
    }

    return !this.$operators.includes($operator);
  }

  public whereNested($callback: Function, $boolean: string = 'and'): this {
    const $query = new Builder(this.$connection);

    $callback($query);

    return this.addNestedWhereQuery($query, $boolean);
  }

  public whereIn($column: string, $values: any[], $boolean: string = 'and', $not: boolean = false): this {
    const $type = $not ? 'NotIn' : 'In';

    if (this.isQueryable($values)) {
      const [$query, $bindings] = this.createSub($values);

      $values = [new Expression($query)];

      this.addBinding($bindings, 'where');
    }

    this.$wheres.push({
      type: $type,
      column: $column,
      values: $values,
      boolean: $boolean
    });

    return this.addBinding($values, 'where');
  }

  public whereNull($columns: string|string[], $boolean: string = 'and', $not: boolean = false): this {
    const $type = $not ? 'NotNull' : 'Null';

    $columns = Array.isArray($columns) ? $columns : [$columns];

    $columns.forEach($column => {
      this.$wheres.push({
        type: $type,
        column: $column,
        boolean: $boolean,
      });
    });

    return this;
  }

  public addNestedWhereQuery($query: Builder, $boolean: string = 'and') {
    if ($query.$wheres.length > 0) {
      this.$wheres.push({
        type: 'Nested',
        query: $query,
        boolean: $boolean
      });

      this.addBinding($query.getRawBindings()['where'], 'where');
    }

    return this;
  }

  protected whereSub($column: string, $operator: string, $callback: Function, $boolean: string): this {
    const $type = 'Sub';
    const $query = new Builder(this.$connection);

    $callback($query);

    this.$wheres.push({
      type: $type,
      column: $column,
      operator: $operator,
      query: $query,
      boolean: $boolean
    });

    return this.addBinding($query.getBindings(), 'where');
  }

  public getBindings() {
    return this.$bindings;
  }

  public getRawBindings() {
    return this.$bindings;
  }

  public addBinding($value: any, $type: string = 'where'): this {
    if (! Object.keys(this.$bindings).includes($type)) {
      throw new Error(`Invalid binding type: ${$type}`);
    }

    this.$bindings[$type] = this.$bindings[$type].concat($value);

    return this;
  }

  protected isQueryable($value: any): $value is Builder|EloquentBuilder|Function {
    return $value instanceof Builder
      || $value instanceof EloquentBuilder
      || $value instanceof Function;
  }

  public toSql(): string {
    return this.$grammar.compileSelect(this);
  }
}
