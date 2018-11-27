class App extends React.Component {
  componentDidMount = () => {
    const { store } = this.props;

    Promise.all([API.fetchTodos(), API.fetchGoals()]).then(([todos, goals]) => {
      store.dispatch(receiveDataAction(todos, goals));
    });

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
    return API.saveTodo(this.input.value)
      .then(todo => {
        this.input.value = '';
        this.props.store.dispatch(addTodoAction(todo));
      })
      .catch(() => alert('Api add todo mock error caught succesfully, item not added to store.'));
  };

  removeItem = todo => {
    const { dispatch } = this.props.store;
    // Optimistic update for faster ui response
    dispatch(removeTodoAction(todo.id));
    return API.deleteTodo(todo.id).catch(() => {
      dispatch(addTodoAction(todo));
      alert('Api removal mock error caught succesfully, todo item added back to store.');
    });
  };

  toggleItem = id => {
    const { dispatch } = this.props.store;
    dispatch(toggleTodoAction(id));
    return API.saveTodoToggle(id).catch(() => {
      dispatch(toggleTodoAction(id));
      alert('Api toggle mock error caught succesfully, toggle state reverted.');
    });
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
    return API.saveGoal(this.input.value)
      .then(goal => {
        this.input.value = '';
        this.props.store.dispatch(addGoalAction(goal));
      })
      .catch(() => alert('Api add goal mock error caught succesfully, item not added to store.'));
  };

  removeItem = goal => {
    const { dispatch } = this.props.store;
    // Optimistic update for faster ui response
    dispatch(removeGoalAction(goal.id));
    return API.deleteGoal(goal.id).catch(() => {
      dispatch(addGoalAction(goal));
      alert('Api removal mock error caught succesfully, goal item added back to store.');
    });
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
