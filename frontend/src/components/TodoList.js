import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';

const TodoList = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`${API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const token = await user.getIdToken();
      const response = await axios.post(`${API_URL}/todos`, 
        { text: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id, completed) => {
    try {
      const token = await user.getIdToken();
      await axios.put(`${API_URL}/todos/${id}`, 
        { completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = await user.getIdToken();
      await axios.delete(`${API_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

return (
  <div className="todo-container">
    <div className="todo-header">
      <h1>My Todo List</h1>
    </div>
    <form onSubmit={addTodo} className="todo-form">
      <input
        type="text"
        placeholder="Add a new todo..."
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        className="todo-input"
      />
      <button type="submit" className="add-btn">
        Add
      </button>
    </form>
    <div className="todos-list">
      {todos.length === 0 ? (
        <div className="empty-state">No todos yet. Add one above!</div>
      ) : (
        todos.map(todo => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        ))
      )}
    </div>
  </div>
);
};

export default TodoList;