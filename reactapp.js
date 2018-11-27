const Context = React.createContext();

class App extends React.Component {
  componentDidMount = () => {
    const { store } = this.props;
    store.dispatch(handleLoadData(this));
    store.subscribe(() => this.forceUpdate());
  };

  render() {
    const { loading } = this.props.store.getState();

    if (loading) return <h3>Loading fake api data</h3>;

    return (
      <div>
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    );
  }
}

class ConnectedApp extends React.Component {
  render() {
    return <Context.Consumer>{store => <App store={store} />}</Context.Consumer>;
  }
}

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

class ConnectedTodos extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {store => {
          const { todos } = store.getState();
          return <Todos todos={todos} dispatch={store.dispatch} />;
        }}
      </Context.Consumer>
    );
  }
}

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

class ConnectedGoals extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {store => {
          const { goals } = store.getState();
          return <Goals goals={goals} dispatch={store.dispatch} />;
        }}
      </Context.Consumer>
    );
  }
}

class Provider extends React.Component {
  render() {
    return <Context.Provider value={this.props.store}>{this.props.children}</Context.Provider>;
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('react'),
);
