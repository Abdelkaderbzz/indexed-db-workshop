import { useState, useEffect } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  searchTodos,
  toggleTodoCompleted,
  filterTodosByCompleted,
} from './dexie';
import './App.css';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const savedTodos = await getTodos();
      setTodos(savedTodos);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const todo: Omit<Todo, 'id'> = { text: newTodo, completed: false };
      await addTodo(todo);
      setTodos(await getTodos());
      setNewTodo('');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    setTodos(await getTodos());
  };

  const handleSearch = async (searchTerm: string) => {
    setSearch(searchTerm);
    if (searchTerm.trim() === '') {
      setTodos(await getTodos());
    } else {
      const searchedTodos = await searchTodos(searchTerm);
      setTodos(searchedTodos);
    }
  };
  const handleCompleted = async (id: number) => {
    await toggleTodoCompleted(id);
    setTodos(await getTodos());
  };
  const handleFilterTodos = async (type: string) => {
    setFilterType(type);
    if (type === 'all') {
      setTodos(await getTodos());
    } else if (type === 'todo') {
      setTodos(await filterTodosByCompleted(false));
    } else {
      setTodos(await filterTodosByCompleted(true));
    }
  };

  return (
    <div style={{ padding: '20px', margin: 'auto' }}>
      <h1 style={{ width: '100%' }}>To-Do List</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <div style={{ display: 'flex' }}>
          <p>all</p>
          <input
            checked={filterType === 'all'}
            onClick={() => handleFilterTodos('all')}
            type='checkbox'
            name=''
            id=''
          />
        </div>
        <div style={{ display: 'flex' }}>
          <p>todo</p>
          <input
            checked={filterType === 'todo'}
            onClick={() => handleFilterTodos('todo')}
            type='checkbox'
            name=''
            id=''
          />
        </div>
        <div style={{ display: 'flex' }}>
          <p>completed</p>
          <input
            checked={filterType === 'completed'}
            onClick={() => handleFilterTodos('completed')}
            type='checkbox'
            name=''
            id=''
          />
        </div>
      </div>
      <input
        type='text'
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder='Search tasks...'
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input
        type='text'
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder='New task...'
        style={{ width: '100%', padding: '10px' }}
      />
      <button
        onClick={handleAddTodo}
        style={{ width: '100%', marginTop: '10px' }}
      >
        Add Todo
      </button>

      <ul style={{ marginTop: '20px', listStyleType: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              borderBottom: '1px solid #ddd',
            }}
          >
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => handleCompleted(todo.id)}
              name=''
              id=''
            />
            <div
              style={{
                width: '100%',
                justifyContent: 'space-between',
                paddingLeft: '10px ',
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
              }}
            >
              <span>{todo.text}</span>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
