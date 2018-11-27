class App extends React.Component {
  componentDidMount = () => {
    const { store } = this.props;
    store.dispatch(handleLoadData(this));
    store.subscribe(() => this.forceUpdate());
  };

  render() {
    const { store } = this.props;
    const { todos, goals, loading } = store.getState();

    if (loading) return <h3>Loading fake api data</h3>;

    return (
      <div>
        <Todos todos={todos} store={store} />
        <Goals goals={goals} store={store} />
      </div>
    );
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
    this.props.store.dispatch(handleAddTodo(this.input.value, () => (this.input.value = '')));
  };

  removeItem = todo => {
    this.props.store.dispatch(handleDeleteTodo(todo));
  };

  toggleItem = id => {
    this.props.store.dispatch(handleToggleTodo(id));
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
    e.preventDefault();
    this.props.store.dispatch(handleAddGoal(this.input.value, () => (this.input.value = '')));
  };

  removeItem = goal => {
    this.props.store.dispatch(handleDeleteGoal(goal));
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
