/**
 * Copyright 2025 Marcus Downing
 * Licensed under the Artistic License 2.0
 */

const EventEmitter = require('events');

export const events = new EventEmitter();

/*
class EventQueue {
  constructor() {
    this.callbacks = [];
  }

  call(...args) {
    this.callbacks.forEach(callback => {
      try {
        callback.apply(null, args);
      } catch (e) {

      }
    })
  }

  on(callback) {
    this.callbacks.push(callback);
  }
}

let createEvt = new EventQueue();
let createElementTreeEvt = new EventQueue();
let errorEvt = new EventQueue();

export class Events {
  static get createEvt() {
    return createEvt;
  }
  static get createElementTreeEvt() {
    return createElementTreeEvt;
  }
  static get errorEvt() {
    return errorEvt;
  }
}
*/
