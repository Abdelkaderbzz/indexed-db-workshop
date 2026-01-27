import Dexie, { Table } from 'dexie';
import type { Todo } from './types';
class TodoDatabase extends Dexie {
  todos!: Table<Todo, number>;

  constructor() {
    super('todo_db');
    this.version(1).stores({
      todos: '++id,text,completed',
    });
  }
}

const db = new TodoDatabase();

export type TodoType = Omit<Todo, 'id'>;

// Function to get all todos
export const getTodos = async (): Promise<Todo[]> => {
  return await db.todos.toArray();
};

// Function to add a new todo
export const addTodo = async (todo: Omit<Todo, 'id'>): Promise<number> => {
  return await db.todos.add(todo as Todo);
};

export const deleteTodo = async (id: number): Promise<void> => {
  await db.todos.delete(id);
};

export const searchTodos = async (searchTerm: string): Promise<Todo[]> => {
  return await db.todos
    .filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .toArray();
};

export const toggleTodoCompleted = async (id: number): Promise<void> => {
  const todo = await db.todos.get(id); // Get the todo by id
  if (todo) {
    await db.todos.update(id, { completed: !todo.completed });
  }
};

export const filterTodosByCompleted = async (
  isCompleted: boolean,
): Promise<Todo[]> => {
  return await db.todos
    .filter((todo) => todo.completed === isCompleted)
    .toArray();
};
