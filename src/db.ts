import { openDB } from 'idb';
import { Todo } from './App';

const DB_NAME = 'todo_db';
const STORE_NAME = 'todos';

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    },
  });
};

export const getTodos = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const addTodo = async (todo:Omit<Todo, 'id'>) => {
  const db = await initDB();
  return db.add(STORE_NAME, todo);
};

export const deleteTodo = async (id:number) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

// New function to search todos based on a search term
export const searchTodos = async (searchTerm:string) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  const allTodos = await store.getAll();

  return allTodos.filter((todo) =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
