import BuilderContract from '../../attributes/contracts/database/eloquent/Builder';
import QueryBuilder from '../query/Builder';
import Model from '../../model/Model';

export default class Builder implements BuilderContract
{
  protected $query: QueryBuilder;

  // @ts-ignore
  protected $model: Model;

  protected $eagerLoad: any[] = [];

  constructor(query: QueryBuilder)
  {
    this.$query = query;
  }

  public whereKey($id: any): this
  {
    if ($id instanceof Model) {
      $id = $id.getKey();
    }

    if (Array.isArray($id)) {
      this.$query.whereIn(this.$model.getQualifiedKeyName(), $id);

      return this;
    }

    if ($id !== null && this.$model.getKeyType() === 'string') {
      $id = $id.toString();
    }

    return this.where(this.$model.getQualifiedKeyName(), '=', $id);
  }

  public where($column: string|Function, $operator: string|null = null, $value: any = null, $boolean: string = 'and'): this
  {
    if ($column instanceof Function && $operator === null) {
      const $query = this.$model.newQueryWithoutRelationships();
      $column($query);

      this.$query.addNestedWhereQuery($query.getQuery(), $boolean);
    } else {
      // @ts-ignore
      this.$query.where($column, $operator, $value, $boolean);
    }

    return this;
  }

  public whereNot($column: string|Function, $operator: string|null = null, $value: any = null, $boolean: string = 'and'): this
  {
    return this.where($column, $operator, $value, $boolean + ' not');
  }

  public with($relations: string|string[]|Function, $callback: Function|string|null = null): this
  {
    let $eagerLoad;

    if ($callback instanceof Function) {
      $eagerLoad = this.parseWithRelations({
        [$relations as string]: $callback
      });
    } else {
      $eagerLoad = this.parseWithRelations(
        typeof $relations === 'string'
          ? arguments
          : $relations
      );
    }

    if ($eagerLoad !== undefined) {
      this.$eagerLoad.concat($eagerLoad);
    }

    return this;
  }

  protected parseWithRelations($relations: {}[]|{}): {}
  {
    if (Array.isArray($relations) && $relations.length === 0) {
      return {};
    }

    return $relations;
  }

  // @ts-ignore
  public hydrate($items: any[]): Model[]
  {

  }

  public getQuery(): QueryBuilder
  {
    return this.$query;
  }

  public setQuery($query: QueryBuilder): this
  {
    this.$query = $query;

    return this;
  }

  public setModel(model: Model): this
  {
    this.$model = model;

    return this;
  }

  public toSql(): string {
    return this.$query.toSql();
  }

  public getBindings() {
    return this.$query.getBindings();
  }
}
