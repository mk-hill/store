const Context = React.createContext();

//
// ─── CREATE ABSTRACTION OVER REDUX AND CONTEXT ──────────────────────────────────
// * Provider: Pass state into context
// * Connect: Render any component, passing that component any data it needs from the store

class Provider extends React.Component {
  render() {
    return <Context.Provider value={this.props.store}>{this.props.children}</Context.Provider>;
  }
}

// Connect will return a new function which takes in a component
function connect(mapStateToProps) {
  return Component => {
    class Receiver extends React.Component {
      componentDidMount() {
        const { subscribe } = this.props.store;

        this.unsubscribe = subscribe(() => this.forceUpdate());
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        const { dispatch, getState } = store;
        const state = getState();
        const stateNeeded = mapStateToProps(state);
        // Passing each component dispatch in addition to the state it needs
        return <Component {...stateNeeded} dispatch={dispatch} />;
      }
    }

    class ConnectedComponent extends React.Component {
      render() {
        return <Context.Consumer>{store => <Receiver store={store} />}</Context.Consumer>;
      }
    }
    return ConnectedComponent;
  };
}

class App extends React.Component {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(handleLoadData(this));
  };

  render() {
    const { loading } = this.props;

    if (loading) return <h3>Loading fake api data</h3>;

    return (
      <div>
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    );
  }
}

// class ConnectedApp extends React.Component {
//   render() {
//     return <Context.Consumer>{store => <App store={store} />}</Context.Consumer>;
//   }
// }

// Invoke connect, passing it a function which it will invoke
// Connect will pass in the state to that function, mapping required parts of the state
// to the component's props
const ConnectedApp = connect(state => ({
  loading: state.loading,
}))(App);

const List = ({ items, remove, toggle }) => (
  <ul>
    {items.map(item => (
      <li onClick={() => (toggle ? toggle(item.id) : null)} key={item.id}>
        <span style={{ textDecoration: item.complete ? 'line-through' : 'none' }}>{item.name}</span>
        <button onClick={() => remove(item)}>X</button>
      </li>
    ))}
  </ul>
);

class Todos extends React.Component {
  addItem = e => {
    e.preventDefault();
    // Passing callback to reset input
    this.props.dispatch(handleAddTodo(this.input.value, () => (this.input.value = '')));
  };

  removeItem = todo => {
    this.props.dispatch(handleDeleteTodo(todo));
  };

  toggleItem = id => {
    this.props.dispatch(handleToggleTodo(id));
  };

  render() {
    return (
      <section>
        <h2>Todo List</h2>
        <input type="text" placeholder="Add Todo" ref={input => (this.input = input)} />
        <button onClick={this.addItem}>Add Todo</button>
        <List toggle={this.toggleItem} remove={this.removeItem} items={this.props.todos} />
      </section>
    );
  }
}

// class ConnectedTodos extends React.Component {
//   render() {
//     return (
//       <Context.Consumer>
//         {store => {
//           const { todos } = store.getState();
//           return <Todos todos={todos} dispatch={store.dispatch} />;
//         }}
//       </Context.Consumer>
//     );
//   }
// }

const ConnectedTodos = connect(state => ({ todos: state.todos }))(Todos);

class Goals extends React.Component {
  addItem = e => {
    e.preventDefault();
    this.props.dispatch(handleAddGoal(this.input.value, () => (this.input.value = '')));
  };

  removeItem = goal => {
    this.props.dispatch(handleDeleteGoal(goal));
  };

  render() {
    return (
      <section>
        <h2>Goal List</h2>
        <input type="text" placeholder="Add Goal" ref={input => (this.input = input)} />
        <button onClick={this.addItem}>Add Goal</button>
        <List remove={this.removeItem} items={this.props.goals} />
      </section>
    );
  }
}

// class ConnectedGoals extends React.Component {
//   render() {
//     return (
//       <Context.Consumer>
//         {store => {
//           const { goals } = store.getState();
//           return <Goals goals={goals} dispatch={store.dispatch} />;
//         }}
//       </Context.Consumer>
//     );
//   }
// }

const ConnectedGoals = connect(state => ({ goals: state.goals }))(Goals);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('react'),
);
