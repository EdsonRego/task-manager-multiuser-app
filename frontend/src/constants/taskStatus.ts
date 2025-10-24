/**
* 🎯 Lista de status de tarefas padronizada com o backend
*
* Valores devem corresponder exatamente aos aceitos pelo banco (chk_tasks_status):
*  - PENDING
*  - IN_PROGRESS
*  - DONE
*
* A propriedade `label` define como o status será exibido na interface.
*/
export const TASK_STATUS = [
{ value: "PENDING", label: "Pending" },
{ value: "IN_PROGRESS", label: "In Progress" },
{ value: "DONE", label: "Done" },
];
