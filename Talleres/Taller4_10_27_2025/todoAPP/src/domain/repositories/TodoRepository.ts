//Contrato define que operaciones existen, no como se implementan 
// esta es la clavee de clena architecture

import { Todo, CreateTodoDTO, UpdateTodoDTO } from "../entities/Todo";

export interface TodoRepository {
    getAll(): Promise<Todo[]>;
    getById(id: string): Promise<Todo | null>;
    create(todo: CreateTodoDTO): Promise<Todo>;
    update(todo: UpdateTodoDTO): Promise<Todo>;
    delete(id: string): Promise<void>;
}