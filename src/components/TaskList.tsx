import { useState, useEffect } from 'react'

import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare } from 'react-icons/fi'

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  function saveTasks(localTasks: Task[]) {
    localStorage.setItem('tasks', JSON.stringify(localTasks));
    setTasks(localTasks);
  }

  function handleCreateNewTask() {
    if (!newTaskTitle) return false;

    const task = {
      id: new Date().getTime(),
      title: newTaskTitle,
      isComplete: false,
    }

    saveTasks([...tasks, task]);
    setNewTaskTitle('');
  }

  function handleToggleTaskCompletion(id: number) {
    const newTasks = [...tasks];
    const task = newTasks.find(task => task.id === id);
    if (!task) return false;
    task.isComplete = !task.isComplete;
    saveTasks(newTasks);
  }

  function handleRemoveTask(id: number) {
    const tasksFiltered = tasks.filter(task => task.id !== id);
    saveTasks(tasksFiltered);
  }

  async function recoveryTasks() {
    const stringTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    if (!(Object.keys(stringTasks).length === 0)) return setTasks(stringTasks);
  }

  useEffect(() => {
    (async () => { await recoveryTasks(); })();
  }, [])

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </section>
  )
}