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
// ─── STATE MANAGEMENT "LIBRARY" ─────────────────────────────────────────────────
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
const RECEIVE_DATA = 'RECEIVE_DATA';

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

const receiveDataAction = (todos, goals) => ({
  type: RECEIVE_DATA,
  todos,
  goals,
});

//* Middleware attempt
// Hook into the moment after action is dispatched, before it hits the reducer
const checker = store => next => (action) => {
  if (action.type === ADD_TODO && action.todo.name.toLowerCase().includes('test')) {
    return alert('Test triggerred');
  }
  if (action.type === ADD_GOAL && action.goal.name.toLowerCase().includes('test')) {
    return alert('Test triggerred');
  }
  return next(action);
};

const logger = store => next => (action) => {
  console.group(action.type);
  console.log('The action: ', action);
  const result = next(action);
  console.log('New state: ', store.getState());
  console.groupEnd();
  return result;
};

/**
 * ES5 below
// Currying for any following middleware use
function checker(store) {
  // next will either be the next middleware in the chain or dispatch if none
  return function (next) {
    return function (action) {
      // Middleware goes here
      if (action.type === ADD_TODO && action.todo.name.toLowerCase().includes('test')) {
        return alert('Test triggerred');
      }
      if (action.type === ADD_GOAL && action.goal.name.toLowerCase().includes('test')) {
        return alert('Test triggerred');
      }
      return next(action);
    };
  };
}
 */

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
    case RECEIVE_DATA:
      // New state comes in as array on action.todos
      return action.todos;
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
    case RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
}

function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

// Root reducer sets state as obj with arr for each reducer under it
/**
function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  };
}

const store = createStore(app);
 */

// * Should work exactly the same with Redux
// ! Uncomment Redux cdn script tag in index.html before testing
// const store = Redux.createStore(app);
// * Can also use Redux.combineReducers() instead of combining them manually inn app func above
const store = Redux.createStore(
  Redux.combineReducers({ todos, goals, loading }),
  Redux.applyMiddleware(logger, checker),
);
