import { strncmp } from '../../polyfills/string';
import Collection from '../../data/Collection';

export default class HasAttributes
{
    protected $attributes: Record<string, any> = {};

    protected $original: Record<string, any> = {};

    protected $casts: Record<string, any> = {};

    protected $dates: Record<string, any> = {};

    protected $timestamps: boolean = true;

    protected static $primitiveCastTypes = [
        'array',
        'bool',
        'boolean',
        'collection',
        'custom_datetime',
        'date',
        'datetime',
        'decimal',
        'double',
        'float',
        'int',
        'integer',
        'json',
        'object',
        'real',
        'string',
        'timestamp',
    ];

    public CREATED_AT: string = 'created_at';

    public UPDATED_AT: string = 'updated_at';

    public getAttribute(key: string | null | undefined): any {
        if (!key) {
            return null;
        }

        const keys: string[] = Object.keys(this.$attributes);
        const casts: string[] = Object.keys(this.$casts);

        if (
            keys.includes(key) ||
            casts.includes(key) ||
            this.hasGetMutator(key)
        ) {
            return this.getAttributeValue(key);
        }

        return this.$attributes[key];
    }

    public getAttributeValue(key: string): any {
        return this.getAttributes()[key];
    }

    public getAttributeFromArray(key: string): any {
        return this.$attributes[key] ?? null;
    }

    protected mutateAttribute(key: string, value: any): any {
        return this['get' + this.studly(key) + 'Attribute'](value);
    }

    public hasGetMutator(key: string): boolean {
      return typeof this['get' + this.studly(key) + 'Attribute'] === 'function';
    }

    public getAttributes(): Record<string, any> {
        return this.$attributes;
    }

    public syncOriginal(): void {
        this.$original = this.getAttributes();
    }

    public setAttribute(key: string, value: any): any {
        if (this.hasSetMutator(key)) {
            return this.setMutatedAttributeValue(key, value);
        }

        if (value && this.isDateAttribute(key)) {
            value = this.fromDateTime(value);
        }

        // @TODO: Implement castAttribute

        this.$attributes[key] = value;

        return this;
    }

    public hasSetMutator(key: string): boolean {
        return typeof this['set' + this.studly(key) + 'Attribute'] === 'function';
    }

    public isDateAttribute(key: string): boolean {
        return Object.keys(this.$dates).includes(key)
            || this.isDateCastable(key);
    }

    protected setMutatedAttributeValue(key: string, value: any): any {
      return this['set' + this.studly(key) + 'Attribute'](value);
    }

    public isDirty($attributes: string|string[]|null|undefined = null): boolean {
        return this.hasChanges(
          this.getDirty() as any[],
          $attributes
        );
    }

    public castAttribute($key: string, $value: any): any {
        const type = this.getCastType($key);

        if ($value === null && HasAttributes.$primitiveCastTypes.includes(type)) {
            return $value;
        }

        switch (type) {
          case 'int':
          case 'integer':
            return parseInt($value);
          case 'real':
          case 'float':
          case 'double':
            return this.fromFloat($value);
          case 'decimal':
            return this.asDecimal($value, this.getCasts()[$key].split(':')[1]);
          case 'string':
            return $value.toString();
          case 'bool':
          case 'boolean':
            return !!$value;
          case 'object':
          case 'array':
          case 'json':
            return this.fromJson($value);
          case 'collection':
            let collection = this.fromJson($value);
            return Array.isArray(collection) ? collection : [collection] as Collection;
          case 'date':
            return this.asDate($value);
          case 'datetime':
          case 'custom_datetime':
            return this.asDateTime($value);
          case 'timestamp':
            return this.asTimestamp($value);
        }

        return $value;
    }

    public asJson($value: any): string {
        return JSON.stringify($value);
    }

    public fromJson($value: string): Record<any, any> {
        return JSON.parse($value);
    }

    public fromFloat($value: string)
    {
        switch ($value.toString()) {
            case 'Infinity':
                return Number.POSITIVE_INFINITY;
            case '-Infinity':
                return Number.NEGATIVE_INFINITY;
            case 'NaN':
                return Number.NaN;
            default:
                return parseFloat($value);
        }
    }

    protected asDecimal($value: number, $decimals: number): string {
        return $value.toFixed($decimals);
    }

    protected asDate($value: string): Date {
        return new Date(
          this.asDateTime($value).setUTCHours(0, 0, 0, 0)
        );
    }

    protected asDateTime($value: any): Date {
        if ($value instanceof Date) {
            return $value;
        }

        if (typeof $value === 'string') {
            return new Date($value);
        }

        if (typeof $value === 'number') {
            return new Date($value);
        }

        return new Date($value);
    }

    protected asTimestamp($value: any): number {
        return this.asDateTime($value).getTime();
    }

    public isClean(): boolean {
        return ! this.isDirty();
    }

    protected hasChanges(changes: any[], attributes: string|string[]|null): boolean {
        if (attributes === null) {
            return changes.length > 0;
        }

        if (typeof attributes === 'string') {
            attributes = [attributes];
        }

        for (const key in changes) {
            if (changes[key] !== attributes[key]) {
                return true;
            }
        }

        return false;
    }

    protected getCastType($key: string): string {
        const castType = this.getCasts()[$key];

        if (this.isCustomDateTimeCast(castType)) {
            return 'custom_datetime';
        }

        if (this.isDecimalCast(castType)) {
            return 'decimal';
        }

        return castType.toLowerCase().trim();
    }

    protected isCustomDateTimeCast($cast: string): boolean
    {
        return strncmp($cast, 'date:', 5) === 0 ||
            strncmp($cast, 'datetime:', 9) === 0;
    }

    protected isDecimalCast($cast: string): boolean
    {
        return strncmp($cast, 'decimal:', 8) === 0;
    }

    public getDirty(): Record<string, any> {
        const dirty: Record<string, any> = {};

        for (const key in this.getAttributes()) {
            if (this.originalIsEquivalent(key)) {
                dirty[key] = this.$attributes[key];
            }
        }

        return dirty;
    }

    public originalIsEquivalent(key: string): boolean {
        return this.$original[key] !== this.$attributes[key];
    }

    public fromDateTime(value: any): any {
        if ([undefined, null, ''].includes(value)) {
            return value;
        }

        // @TODO: Implement date parsing
        return value;
    }

    public hasCast($key: string, $types: string|string[]|null = null): boolean {
        if (!Object.keys(this.getCasts()).includes($key)) {
            return false;
        }

        if ($types === null) {
            return true;
        }

        return Object.values($types).includes(this.getCastType($key));
    }

    public getCasts(): Record<string, any> {
        return this.$casts;
    }

    public isDateCastable($key: string): boolean {
        return this.hasCast($key, ['date', 'datetime']);
    }

    public isClassCastable($key: string): boolean {
        const casts = this.getCasts();
        const cast = casts[$key];

        if (!cast) {
            return false;
        }

        try {
            new cast();
        } catch (e) {
            return false;
        }

        return !HasAttributes.$primitiveCastTypes.includes(cast);
    }

    public transformModelValue($key: string, $value: any): any {
        if (this.hasGetMutator($key)) {
            return this.mutateAttribute($key, $value);
        }

        if (this.hasCast($key)) {
            return this.castAttribute($key, $value);
        }

        if ($value !== null && this.getDates().includes($key)) {

        }
    }

    public getDates(): Record<string, any> {
        if (!this.usesTimestamps()) {
            return this.$dates;
        }

        const defaults: string[] = [
            this.getCreatedAtColumn(),
            this.getUpdatedAtColumn()
        ];

        return this.$dates.concat(defaults);
    }

    public touch(): boolean
    {
        if (!this.usesTimestamps()) {
          return false;
        }

        this.updateTimestamps();

        // @ts-ignore
        return this.save();
    }

    protected updateTimestamps(): void
    {
        const time = this.freshTimestamp();

        const updatedAtColumn = this.getUpdatedAtColumn();

        if (updatedAtColumn !== null && ! this.isDirty(updatedAtColumn)) {
            this.setUpdatedAt(time);
        }

        const createdAtColumn = this.getCreatedAtColumn();

        // @ts-ignore
        if (! this.exists && ! createdAtColumn === null && ! this.isDirty(createdAtColumn)) {
            this.setCreatedAt(time);
        }
    }

    public setCreatedAt($value: any): this
    {
        this[this.getCreatedAtColumn()] = $value;

        return this;
    }

    public setUpdatedAt($value: any): this
    {
      this[this.getUpdatedAtColumn()] = $value;

      return this;
    }

    public freshTimestamp()
    {
      return Date.now();
    }

    public usesTimestamps()
    {
      return this.$timestamps;
    }

    public getCreatedAtColumn()
    {
      return this.CREATED_AT;
    }

    public getUpdatedAtColumn()
    {
      return this.UPDATED_AT;
    }

    protected studly(key: string): string {
        return key
            .replace('_', ' ')
            .replace('-', ' ')
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}
