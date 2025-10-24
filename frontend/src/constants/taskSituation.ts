/**
* ⚙️ Lista padronizada de situações da tarefa
*
* Os valores devem corresponder exatamente aos aceitos pelo backend
* (check constraint ou enum da tabela `tasks`):
*   - OPEN
*   - CLOSED
*   - CANCELLED
*/
export const TASK_SITUATION = [
{ value: "OPEN", label: "Open" },
{ value: "CLOSED", label: "Closed" },
{ value: "CANCELLED", label: "Cancelled" },
];
