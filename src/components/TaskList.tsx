import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "../styles/tasklist.scss";

import { FiTrash, FiCheckSquare } from "react-icons/fi";

interface Task {
	id: string;
	title: string;
	isComplete: boolean;
}

export function TaskList() {
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [tasks, setTasks] = useState<Task[]>(() => {
		const storagedTasks = localStorage.getItem("@SaveTask:Tasks");

		if (storagedTasks) {
			return JSON.parse(storagedTasks);
		}

		return [];
	});

	useEffect(() => {
		localStorage.setItem("@SaveTask:Tasks", JSON.stringify(tasks));
	}, [tasks]);

	function handleCreateNewTask() {
		if (!newTaskTitle) return;

		const newTaks = {
			id: uuidv4(),
			title: newTaskTitle,
			isComplete: false,
		};

		setTasks((oldState) => [...oldState, newTaks]);
		setNewTaskTitle("");
	}

	function handleToggleTaskCompletion(id: string) {
		const completeTaks = tasks.map((task) =>
			task.id === id
				? {
						...task,
						isComplete: !task.isComplete,
				  }
				: task
		);

		setTasks(completeTaks);
	}

	function handleRemoveTask(id: string) {
		const filteredTaks = tasks.filter((task) => task.id !== id);

		setTasks(filteredTaks);
	}

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
					<button
						type="submit"
						data-testid="add-task-button"
						onClick={handleCreateNewTask}
					>
						<FiCheckSquare size={16} color="#fff" />
					</button>
				</div>
			</header>

			<main>
				<ul>
					{tasks.map((task) => (
						<li key={task.id}>
							<div
								className={task.isComplete ? "completed" : ""}
								data-testid="task"
							>
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

							<button
								type="button"
								data-testid="remove-task-button"
								onClick={() => handleRemoveTask(task.id)}
							>
								<FiTrash size={16} />
							</button>
						</li>
					))}
				</ul>
			</main>
		</section>
	);
}
