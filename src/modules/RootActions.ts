import Item from '../data/Item'
import Collection from '../data/Collection'
import Collections from '../data/Collections'
import Model from '../model/Model'
import Query from '../query/Query'
import ActionsContract from './contracts/RootActions'
import ActionContext from './contracts/RootActionContext'
import OptionsBuilder from './support/OptionsBuilder'
import * as Payloads from './payloads/RootActions'
import Database from '@/database/Database';

/**
 * Create new data with all fields filled by default values.
 */
async function newRecord(
  _context: ActionContext,
  payload: Payloads.New
): Promise<Model> {
  return new Query(payload.entity).new()
}

/**
 * Save given data to the store by replacing all existing records in the
 * store. If you want to save data without replacing existing records,
 * use the `insert` method instead.
 */
async function create(
  _context: ActionContext,
  payload: Payloads.Create
): Promise<Collections> {
  const entity = payload.entity
  const data = payload.data
  const options = OptionsBuilder.createPersistOptions(payload)

  return new Query(entity).create(data, options)
}

/**
 * Insert given data to the state. Unlike `create`, this method will not
 * remove existing data within the state, but it will update the data
 * with the same primary key.
 */
async function insert(
  _context: ActionContext,
  payload: Payloads.Insert
): Promise<Collections> {
  const entity = payload.entity
  const data = payload.data
  const options = OptionsBuilder.createPersistOptions(payload)

  return new Query(entity).insert(data, options)
}

/**
 * Update data in the store.
 */
async function update(
  _context: ActionContext,
  payload: Payloads.Update
): Promise<Item | Collection | Collections> {
  const entity = payload.entity
  const data = payload.data
  const where = payload.where || null
  const options = OptionsBuilder.createPersistOptions(payload)

  return new Query(entity).update(data, where, options)
}

/**
 * Insert or update given data to the state. Unlike `insert`, this method
 * will not replace existing data within the state, but it will update only
 * the submitted data with the same primary key.
 */
async function insertOrUpdate(
  _context: ActionContext,
  payload: Payloads.InsertOrUpdate
): Promise<Collections> {
  const entity = payload.entity
  const data = payload.data
  const options = OptionsBuilder.createPersistOptions(payload)

  return new Query(entity).insertOrUpdate(data, options)
}

/**
 * Delete records from the store. The actual name for this action is `delete`,
 * but named `destroy` here because `delete` can't be declared at this
 * scope level.
 */
async function destroy(
  _context: ActionContext,
  payload: Payloads.DeleteById
): Promise<Item>
async function destroy(
  _context: ActionContext,
  payload: Payloads.DeleteByCondition
): Promise<Collection>
async function destroy(
  _context: ActionContext,
  payload: any
): Promise<any> {
  const { entity, where } = payload

  return new Query(entity).delete(where)
}

/**
 * Delete all data from the store.
 */
async function deleteAll(
  _context: ActionContext,
  payload?: Payloads.DeleteAll
): Promise<void> {
  if (payload && payload.entity) {
    new Query(payload.entity).deleteAll()

    return
  }

  Query.deleteAll(new Database());
}

const RootActions: ActionsContract = {
  new: newRecord,
  create,
  insert,
  update,
  insertOrUpdate,
  delete: destroy,
  deleteAll
}

export default RootActions
