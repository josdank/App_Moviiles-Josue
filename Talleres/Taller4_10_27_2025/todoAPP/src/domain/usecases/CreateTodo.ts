import { Todo, CreateTodoDTO } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class CreateTodo {
    constructor(private repository: TodoRepository) {}

    async execute(data: CreateTodoDTO): Promise<Todo> {
        //Aqui podemos agregar  validaciones o reglas de negocio
        if (!data.title || data.title.trim() === "") {
            throw new Error("El título no puede estar vacío");
        }

        if (data.title.length > 200) {
            throw new Error("El título es demasiado Largo");
        }
        return await this.repository.create(data);
    }
}