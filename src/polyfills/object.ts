function isObject(value: any): value is Object {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export {
  isObject
}
