class App extends React.Component {
  componentDidMount = () => {
    const { store } = this.props;

    store.subscribe(() => this.forceUpdate());
  };

  render() {
    const { store } = this.props;
    const { todos, goals } = store.getState();

    return (
      <div>
        <h1>React</h1>
        <Todos todos={todos} store={store} />
        <Goals goals={goals} store={store} />
      </div>
    );
  }
}

const List = ({ items, remove, toggle }) => (
  <ul>
    {items.map(item => (
      <li onClick={() => (toggle ? toggle(item) : null)} key={item.id}>
        <span style={{ textDecoration: item.complete ? 'line-through' : 'none' }}>{item.name}</span>
        <button onClick={() => remove(item)}>X</button>
      </li>
    ))}
  </ul>
);

class Todos extends React.Component {
  addItem = e => {
    const { dispatch } = this.props.store;
    e.preventDefault();
    const name = this.input.value;
    this.input.value = '';
    dispatch(
      addTodoAction({
        id: generateId(),
        name,
        complete: false,
      }),
    );
  };

  removeItem = todo => {
    this.props.store.dispatch(removeTodoAction(todo.id));
  };

  toggleItem = todo => {
    this.props.store.dispatch(toggleTodoAction(todo.id));
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

class Goals extends React.Component {
  addItem = e => {
    const { dispatch } = this.props.store;
    e.preventDefault();
    const name = this.input.value;
    this.input.value = '';
    dispatch(
      addGoalAction({
        id: generateId(),
        name,
      }),
    );
  };

  removeItem = goal => {
    this.props.store.dispatch(removeGoalAction(goal.id));
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

ReactDOM.render(<App store={store} />, document.getElementById('react'));
