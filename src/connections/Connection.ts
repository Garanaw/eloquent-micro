import Record from '../data/Record'
import Records from '../data/Records'
// import RootState from '../modules/contracts/RootState'
// import State from '../modules/contracts/State'

export default class Connection {
  /**
   * The connection name.
   */
  connection: string

  /**
   * The entity name.
   */
  entity: string

  /**
   * The root state.
   */
  //rootState: RootState

  /**
   * The entity state.
   */
  //state: State

  /**
   * Create a new connection instance.
   */
  constructor(connection: string, entity: string) {
    this.connection = connection
    this.entity = entity
    // this.rootState = new RootState()
    // this.state = this.rootState[entity]
  }

  /**
   * Insert the given record.
   */
  // @ts-ignore
  insert(record: Record): void {
    //this.state.data = { ...this.state.data, [record.$id]: record }
  }

  /**
   * Insert the given records.
   */
  // @ts-ignore
  insertRecords(records: Records): void {
    //this.state.data = { ...this.state.data, ...records }
  }

  /**
   * Delete records that matches the given id.
   */
  // @ts-ignore
  delete(id: string[]): void {
    // const data: Records = {}
    //
    // for (const i in this.state.data) {
    //   if (!id.includes(i)) {
    //     data[i] = this.state.data[i]
    //   }
    // }
    //
    // this.state.data = data
  }
}
