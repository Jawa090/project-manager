import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { signOut } from '../store/authSlice';
import Overview from './Overview';
import { FaTrash, FaEdit, FaSun, FaMoon } from 'react-icons/fa'; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { saveProjects } from '../store/projectsSlice'; 


function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.projects);
  const [newTaskListTitle, setNewTaskListTitle] = useState('');
  const [taskInput, setTaskInput] = useState({}); 
  const [taskStatus, setTaskStatus] = useState({}); 
  const [showOverview, setShowOverview] = useState(false);
  const [theme, setTheme] = useState('light');
  const [editingTask, setEditingTask] = useState(null); // State for editing tasks

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme; 
  }, []);

  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/signin');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); 
    document.body.className = newTheme;
  };

  const handleAddTaskList = () => {
    if (newTaskListTitle.trim()) {
      const newProject = {
        title: newTaskListTitle,
        id: Date.now(),
        taskLists: [
          { title: 'To Do', id: Date.now() + 1, tasks: [] },
          { title: 'In Progress', id: Date.now() + 2, tasks: [] },
          { title: 'Completed', id: Date.now() + 3, tasks: [] }
        ]
      };

      const updatedProjects = [...projects, newProject];
      dispatch(saveProjects(updatedProjects)); // Save to Redux
      setNewTaskListTitle('');
      
      setTaskInput((prev) => ({
        ...prev,
        [newProject.id]: ['', '', '', '']
      }));
      
      setTaskStatus((prev) => ({
        ...prev,
        [newProject.id]: ['To Do', 'In Progress', 'Completed']
      }));
    }
  };

  const handleDeleteProject = (projectId) => {
    const updatedProjects = projects.filter((project) => project.id !== projectId);
    dispatch(saveProjects(updatedProjects));
    
    const { [projectId]: _, ...remainingInputs } = taskInput;
    setTaskInput(remainingInputs);
    
    const { [projectId]: __, ...remainingStatuses } = taskStatus;
    setTaskStatus(remainingStatuses);
  };

  const handleAddTask = (projectId, listId) => {
    const projectIndex = projects.findIndex(project => project.id === projectId);
    const listIndex = projects[projectIndex].taskLists.findIndex(list => list.id === listId);
    
    const details = taskInput[projectId] ? taskInput[projectId][listIndex] : {};
    if (details[0] && details[1] && details[2] && details[3]) {
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
          const updatedTaskLists = project.taskLists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: [
                  {
                    name: details[0],
                    description: details[1],
                    deadline: details[2],
                    priority: details[3],
                    status: taskStatus[projectId][listIndex],
                    id: Date.now()
                  },
                  ...list.tasks,
                ]
              };
            }
            return list;
          });
          return {
            ...project,
            taskLists: updatedTaskLists
          };
        }
        return project;
      });
      dispatch(saveProjects(updatedProjects)); // Save to Redux
      setTaskInput((prev) => ({
        ...prev,
        [projectId]: {
          ...(prev[projectId] || {}),
          [listIndex]: ['', '', '', ''] // Clear input for the specific list
        }
      }));
    }
  };

  const handleDeleteTask = (projectId, listId, taskId) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          taskLists: project.taskLists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: list.tasks.filter((task) => task.id !== taskId)
              };
            }
            return list;
          })
        };
      }
      return project;
    });
    dispatch(saveProjects(updatedProjects));
  };

  const handleEditTask = (projectId, listId, taskId, updatedTask) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          taskLists: project.taskLists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === taskId ? { ...task, ...updatedTask } : task
                )
              };
            }
            return list;
          })
        };
      }
      return project;
    });
    dispatch(saveProjects(updatedProjects));
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const projectIndex = projects.findIndex(project => project.taskLists.some(list => list.id === parseInt(source.droppableId)));
    const sourceListIndex = projects[projectIndex].taskLists.findIndex(list => list.id === parseInt(source.droppableId));
    const destinationListIndex = projects[projectIndex].taskLists.findIndex(list => list.id === parseInt(destination.droppableId));

    const draggedTask = {
      ...projects[projectIndex].taskLists[sourceListIndex].tasks.find(task => task.id === parseInt(draggableId))
         }; // Make a shallow copy of the task

    
    const updatedSourceList = {
      ...projects[projectIndex].taskLists[sourceListIndex],
      tasks: projects[projectIndex].taskLists[sourceListIndex].tasks.filter(task => task.id !== parseInt(draggableId))
    };

    const updatedDestinationList = {
      ...projects[projectIndex].taskLists[destinationListIndex],
      tasks: [
        ...projects[projectIndex].taskLists[destinationListIndex].tasks.slice(0, destination.index),
        draggedTask,
        ...projects[projectIndex].taskLists[destinationListIndex].tasks.slice(destination.index)
      ]
    };

   // Create a new projects array
   const updatedProjects = projects.map((project, index) => {
    if (index === projectIndex) {
        return {
            ...project,
            taskLists: project.taskLists.map((list, listIndex) => {
                if (listIndex === sourceListIndex) {
                    return updatedSourceList;
                }
                if (listIndex === destinationListIndex) {
                    return updatedDestinationList;
                }
                return list;
            })
        };
    }
    return project;
});

dispatch(saveProjects(updatedProjects)); 
};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="welcome-message">Welcome {user.name}!</p>
        <div className="button-container">
          <button className="dashboard-button" onClick={handleSignOut}>
            Sign Out
          </button>
          <button className="dashboard-button" onClick={() => setShowOverview((prev) => !prev)}>
            {showOverview ? 'Hide Overview' : 'Show Overview'}
          </button>
        </div>

        {showOverview && <Overview projects={projects} />}

        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        <div className="new-tasklist-placeholder">
          <input
            type="text"
            value={newTaskListTitle}
            onChange={(e) => setNewTaskListTitle(e.target.value)}
            placeholder="Enter Project name"
            className="tasklist-input"
          />
          <button onClick={handleAddTaskList} className="add-tasklist-button">
            New Project
          </button>
        </div>
      </div>

      <div className="projects">
        {projects.map((project) => (
          <div key={project.id} className="project">
            <div className="task-list-header">
              <h3 className="project-name">{project.title}</h3>
              <button onClick={() => handleDeleteProject(project.id)} className="delete-project-button">
                <FaTrash />
              </button>
            </div>
            <div className="task-lists">
              {project.taskLists.map((list, listIndex) => (
                <Droppable key={list.id} droppableId={`${list.id}`}>
                  {(provided) => (
                    <div
                      className="task-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <div className="task-list-header">
                        <h4>{list.title}</h4>
                      </div>
                      {/* Add Task Section */}
                      <div className="add-task-container">
                        <input
                          type="text"
                          placeholder="Task Name"
                          value={taskInput[project.id] ? taskInput[project.id][listIndex][0] : ''}
                          // value={taskInput[project.id]?.[listIndex]?.[0] || ''}
                          onChange={(e) => {
                            const updatedTaskInput = {
                              ...taskInput,
                              [project.id]: {
                                ...(taskInput[project.id] || {}),
                                [listIndex]: [
                                  e.target.value, 
                                  taskInput[project.id]?.[listIndex]?.[1] || '', 
                                  taskInput[project.id]?.[listIndex]?.[2] || '', 
                                  taskInput[project.id]?.[listIndex]?.[3] || ''
                                ]
                              }
                            };
                            setTaskInput(updatedTaskInput);
                          }}
                        />
                        <textarea
                          placeholder="Enter task description..."
                          value={taskInput[project.id] ? taskInput[project.id][listIndex][1] : ''}
                          // value={taskInput[project.id]?.[listIndex]?.[1] || ''}
                          onChange={(e) => {
                            const updatedTaskInput = {
                              ...taskInput,
                              [project.id]: {
                                ...(taskInput[project.id] || {}),
                                [listIndex]: [
                                  taskInput[project.id]?.[listIndex]?.[0] || '', 
                                  e.target.value, 
                                  taskInput[project.id]?.[listIndex]?.[2] || '', 
                                  taskInput[project.id]?.[listIndex]?.[3] || ''
                                ]
                              }
                            };
                            setTaskInput(updatedTaskInput);
                          }}
                          rows={4} 
                          className="description-input" 
                        />
                        <input
                          type="date"
                          placeholder="Deadline"
                          value={taskInput[project.id] ? taskInput[project.id][listIndex][2] : ''}
                          onChange={(e) => {
                            const updatedTaskInput = {
                              ...taskInput,
                              [project.id]: {
                                ...(taskInput[project.id] || {}),
                                [listIndex]: [
                                  taskInput[project.id]?.[listIndex]?.[0] || '', 
                                  taskInput[project.id]?.[listIndex]?.[1] || '', 
                                  e.target.value, 
                                  taskInput[project.id]?.[listIndex]?.[3] || ''
                                ]
                              }
                            };
                            setTaskInput(updatedTaskInput);
                          }}
                        />
                        <select
                          value={taskInput[project.id] ? taskInput[project.id][listIndex][3] : ''}
                          onChange={(e) => {
                            const updatedTaskInput = {
                              ...taskInput,
                              [project.id]: {
                                ...(taskInput[project.id] || {}),
                                [listIndex]: [
                                  taskInput[project.id]?.[listIndex]?.[0] || '', 
                                  taskInput[project.id]?.[listIndex]?.[1] || '', 
                                  taskInput[project.id]?.[listIndex]?.[2] || '', 
                                  e.target.value
                                ]
                              }
                            };
                            setTaskInput(updatedTaskInput);
                          }}
                        >
                          <option value="">Select Priority</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                        <button onClick={() => handleAddTask(project.id, list.id)}>Add Task</button>
                      </div>

                      {list.tasks.map((task, taskIndex) => {
                        const isEditing = editingTask?.id === task.id;
                        const editName = isEditing ? editingTask.name : task.name;
                        const editDescription = isEditing ? editingTask.description : task.description;
                        const editDeadline = isEditing ? editingTask.deadline : task.deadline;
                        const editPriority = isEditing ? editingTask.priority : task.priority;

                        return (
                          <Draggable key={task.id} draggableId={`${task.id}`} index={taskIndex}>
                            {(provided) => (
                              <div
                                className="task"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="task-details">
                                  {isEditing ? (
                                    <>
                                      <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                                      />
                                      <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                      />
                                      <input
                                        type="date"
                                        value={editDeadline}
                                        onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                                      />
                                      <select
                                        value={editPriority}
                                        onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                                      >
                                        <option value="">Select Priority</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                      </select>
                                    </>
                                  ) : (
                                    <>
                                      <h5>{task.name}</h5>
                                      <p>{task.description}</p>
                                    </>
                                  )}
                                  <p>Deadline: {isEditing ? editDeadline : task.deadline}</p>
                                  <p>Priority: {isEditing ? editPriority : task.priority}</p>
                                </div>
                                <div className="task-actions">
                                  <button onClick={() => handleDeleteTask(project.id, list.id, task.id)}>
                                    <FaTrash />
                                  </button>
                                  <button onClick={() => {
                                    if (isEditing) {
                                      handleEditTask(project.id, list.id, task.id, {
                                        name: editName,
                                        description: editDescription,
                                        deadline: editDeadline,
                                        priority: editPriority
                                      });
                                      setEditingTask(null); 
                                    } else {
                                      setEditingTask({ id: task.id, name: task.name, description: task.description, deadline: task.deadline, priority: task.priority });
                                    }
                                  }}>
                                    <FaEdit />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

export default Dashboard;
