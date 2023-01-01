export default class Expression
{
  protected $value: any;

  constructor(value: any) {
    this.$value = value;
  }

  getValue() {
    return this.$value;
  }

  toString() {
    return this.getValue().toString();
  }
}
