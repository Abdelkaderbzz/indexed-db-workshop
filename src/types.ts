export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export type CreateTodoInput = Omit<Todo, 'id'>;
