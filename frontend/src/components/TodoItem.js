import React from 'react';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
return (
  <div className="todo-item">
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={(e) => onUpdate(todo._id, e.target.checked)}
      className="todo-checkbox"
    />
    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
      {todo.text}
    </span>
    <button 
      onClick={() => onDelete(todo._id)}
      className="delete-btn"
    >
      Delete
    </button>
  </div>
);
};

export default TodoItem;