export default class HasAttributes
{
    protected $attributes: Record<string, any> = {};

    protected $original: Record<string, any> = {};

    public getAttribute(key: string | null | undefined): any {
        if (!key) {
            return null;
        }

        const keys: string[] = Object.keys(this.$attributes);

        if (keys.includes(key) ) {
            return this.getAttributeValue(key);
        }

        return this.$attributes[key];
    }

    public getAttributeValue(key: string): any {
        return this.getAttributes()[key];
    }

    public getAttributes(): Record<string, any> {
        return this.$attributes;
    }

    public syncOriginal(): void {
        this.$original = this.getAttributes();
    }

    public isDirty($attributes: string|string[]|null|undefined = null): boolean {
        return this.hasChanges(
          this.getDirty() as any[],
          $attributes
        );
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
}
