class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (config === undefined) throw Error();
    this.initialState = config.initial;
    this.currentState = config.initial;
    this.undoState = [];
    this.redoState = [];
    this.states = config.states;
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.currentState;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (this.states[state] === undefined) throw Error();

    this.undoState.push(this.currentState);
    this.currentState = state;
    this.redoState = [];
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    if (this.states[this.currentState].transitions[event] === undefined)
      throw Error();

    this.undoState.push(this.currentState);
    this.currentState = this.states[this.currentState].transitions[event];

    this.redoState = [];
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.currentState = this.initialState;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    const result = [];
    const states = Object.keys(this.states);
    if (event === undefined) {
      return states;
    } else {
      states.forEach(state => {
        if (this.states[state].transitions[event] !== undefined)
          result.push(state);
      });
    }

    return result;
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    const previousState = this.undoState.pop();
    if (previousState === undefined) return false;

    this.redoState.push(this.currentState);
    this.currentState = previousState;
    return true;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    const nextState = this.redoState.pop();
    if (nextState === undefined) return false;

    this.undoState.push(this.currentState);
    this.currentState = nextState;
    return true;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.undoState = [];
    this.redoState = [];
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
