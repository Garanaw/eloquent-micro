import Connection from '../connections/Connection'
import RootState from './contracts/RootState'
import MutationsContract from './contracts/RootMutations'
import * as Payloads from './payloads/RootMutations'

/**
 * Execute generic mutation. This method is used by `Model.commit` method so
 * that user can commit any state changes easily through models.
 */
function $mutate(
  state: RootState,
  payload: Payloads.$Mutate
): void {
  payload.callback(state[payload.entity])
}

/**
 * Insert the given record.
 */
function insert(state: RootState, payload: any): void {
  const { entity, record } = payload
  new Connection(state.$name, entity).insert(record)
}

/**
 * Insert the given records.
 */
function insertRecords(state: RootState, payload: any): void {
  const { entity, records } = payload
  new Connection(state.$name, entity).insertRecords(records)
}

/**
 * Delete records from the store. The actual name for this mutation is
 * `delete`, but named `destroy` here because `delete` can't be declared at
 * this scope level.
 */
function destroy(state: RootState, payload: any): void {
  const { entity, id } = payload
  new Connection(state.$name, entity).delete(id)
}

const RootMutations: MutationsContract = {
  $mutate,
  insert,
  insertRecords,
  delete: destroy
}

export default RootMutations
