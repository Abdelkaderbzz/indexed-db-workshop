import Dexie, { Table } from 'dexie';
import { Todo } from './App';
class TodoDatabase extends Dexie {
  todos!: Table<Todo, number>; // Define the table and its primary key type

  constructor() {
    super('todo_db');
    this.version(1).stores({
      todos: '++id,text,completed', // Primary key and indexed fields
    });
  }
}
// Create a new database instance
const db = new TodoDatabase();


// Define the Todo type
export type TodoType = Omit<Todo, 'id'>;

// Function to get all todos
export const getTodos = async (): Promise<Todo[]> =>
{

  return await db.todos.toArray(); // Get all todos
};

// Function to add a new todo
export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  return await db.todos.add(todo); // Add a new todo
};

// Function to delete a todo
export const deleteTodo = async (id: number): Promise<void> => {
  await db.todos.delete(id); // Delete todo by id
};

// Function to search todos based on a search term
export const searchTodos = async (searchTerm: string): Promise<Todo[]> => {
  return await db.todos
    .filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .toArray();
};

// Function to toggle the completed status of a todo
export const toggleTodoCompleted = async (id: number): Promise<void> => {
  const todo = await db.todos.get(id); // Get the todo by id
  if (todo) {
    // Update the 'completed' status to its opposite value
    await db.todos.update(id, { completed: !todo.completed });
  }
};

// Function to filter todos by their completed status
export const filterTodosByCompleted = async (
  isCompleted: boolean
): Promise<Todo[]> =>
{
  // Query todos based on their completed status
  return await db.todos
    .filter((todo) => todo.completed === isCompleted)
    .toArray();
};
