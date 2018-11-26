/**
 * The store should have four parts
 * 1. The state
 * 2. Get the state
 * 3. Listen to changes on the state
 * 4. Update the state
 */

/**
 * Notes:
 * - Define possible events that occur which can change the state (action?)
 * - In order to ensure predictability, the function that takes in the action that occurred
 * and returns the new state will need to be a pure function (reducer?)
 * -- Pure function:
 * --- Alywas return the same result if the same arguments are passed in
 * --- Depend only on the arguments passed into them, behave same regardless of state
 * --- Never produce any side effects (changing vars outside its scope, making ajax calls etc)
 */

//
// ─── GENERAL STATE MANAGEMENT CODE ──────────────────────────────────────────────
//

function createStore(reducer) {
  let state;
  let listeners = [];

  const getState = () => state;

  // When state changes, functions passed into subscribe need to be called
  // Will return an unsubscribe function that can be invoked when needed
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      // Remove listener function that had been passed in when subscribing
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const dispatch = (action) => {
    // call todos with current state and the action which was passed in, update state
    state = reducer(state, action);
    // Loop over listeners, invoke each when state is updated
    listeners.forEach(listener => listener());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}

//
// ─── APP SPECIFIC CODE ──────────────────────────────────────────────────────────
//

//* Constants
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

//* Action Creators
const addTodoAction = todo => ({
  type: ADD_TODO,
  todo,
});

const removeTodoAction = id => ({
  type: REMOVE_TODO,
  id,
});

const toggleTodoAction = id => ({
  type: TOGGLE_TODO,
  id,
});

const addGoalAction = goal => ({
  type: ADD_GOAL,
  goal,
});

const removeGoalAction = id => ({
  type: REMOVE_GOAL,
  id,
});

//* Reducers
// Set initial state if undefined in reducer
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      // Using concat instead of push to not mutate original state
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      // New state to be returns includes all other todos as they were
      // and todo with matching id has its complete bool inverted
      // Using Object.assign so as to not hard code other properties, just flip complete
      return state.map(todo => (todo.id !== action.id ? todo : Object.assign({}, todo, { complete: !todo.complete })));
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id);
    default:
      return state;
  }
}

// Root reducer to set state as obj with arr for each reducer under it
function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  };
}

// const store = createStore(app);
// store.subscribe(() => {//cb});
// const unsubscribe = store.subscribe(() => {//same function});
// unsubscribe();
// store.dispatch({//action object})

/*
const actionStructure = {
  ADD_TODO: {
    type: 'ADD_TODO',
    todo: {
      id: 0,
      name: 'Learn Redux',
      complete: false,
    },
  },

  REMOVE_TODO: {
    type: 'REMOVE_TODO',
    id: 0,
  },

  TOGGLE_TODO: {
    type: 'TOGGLE_TODO',
    id: 0,
  },

  ADD_GOAL: {
    type: 'ADD_GOAL',
    goal: {
      id: 0,
      name: 'Run a Marathon',
    },
  },

  REMOVE_GOAL: {
    type: 'REMOVE_GOAL',
    id: 0,
  },
};
*/
