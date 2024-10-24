import React from 'react';
import './Overview.css';

function Overview({ projects }) {
  return (
    <div className="overview-container">
      <h3>Overview</h3>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="project-overview">
            <h4>{project.title}</h4>
            {project.taskLists.map((list) => (
              <div key={list.id}>
                <h5>{list.title}</h5>
                {list.tasks.length === 0 ? (
                  <p>No tasks available.</p>
                ) : (
                  list.tasks.map((task) => (
                    <div key={task.id} className="task-overview">
                      <h6>{task.name}</h6>
                      <p>{task.description}</p>
                      <p>Deadline: {task.deadline}</p>
                      <p>Priority: {task.priority}</p>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Overview;
