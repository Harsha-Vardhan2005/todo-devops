const express = require('express');
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all todos for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create todo
router.post('/', authMiddleware, async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      userId: req.user.uid
    });
    
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update todo
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete todo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.uid 
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;