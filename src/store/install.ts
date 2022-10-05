import Database from '../database/Database'

export type Install = (
  database: Database,
  options?: Options
) => any

export interface Options {
  namespace?: string
}

export default (
  database: Database,
  options: Options = {}
): any => {
  const namespace = options.namespace || 'entities'

  return (store: any): void => {
    database.start(store, namespace)
  }
}
