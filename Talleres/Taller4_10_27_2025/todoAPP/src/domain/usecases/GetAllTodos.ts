import { Todo } from "../entities/todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class GetAllTodos {
    constructor(private repository: TodoRepository) {}

    async execute(): Promise<Todo[]> {
        return await this.repository.getAll();
    }
}