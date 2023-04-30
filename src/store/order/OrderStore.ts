import { makeAutoObservable } from 'mobx'

import Character from '../character/Character'
import Order, { OrderType } from './Order'

export default class OrderStore {
  private _orders: Order[] = []

  constructor() {
    makeAutoObservable(this)
  }

  create(type: OrderType, from: Character) {
    let order = this._orders.find((order) => order.active === false)

    if (order) {
      order.type = type
    } else {
      order = new Order(this._orders.length, type, from)
      this._orders.push(order)
    }

    order.active = true

    return order
  }

  findById(orderId: integer) {
    return this._orders.find((order) => order.id === orderId)
  }

  forEach(callback: (order: Order, index: integer, array: Order[]) => void) {
    this._orders.forEach(callback)
  }

  remove(orderID: integer) {
    const order = this._orders.find((order) => order.id === orderID)
    if (order) {
      order.active = false
    }
  }
}
