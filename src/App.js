import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [currentEditedItem, setCurrentEditedItem] = useState({});

  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem('todolist')) || [];
    const savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos')) || [];
    setTodos(savedTodo);
    setCompletedTodos(savedCompletedTodo);
  }, []);

  const handleAddTodo = () => {
    if (!newTitle || !newDescription) return; // Prevent adding empty items

    const newTodoItem = { title: newTitle, description: newDescription };
    const updatedTodoArr = [...allTodos, newTodoItem];
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
    setNewTitle('');
    setNewDescription('');
  };

  const handleDeleteTodo = (index) => {
    const reducedTodo = allTodos.filter((_, i) => i !== index);
    setTodos(reducedTodo);
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
  };

  const handleComplete = (index) => {
    const now = new Date();
    const completedOn = now.toLocaleString();
    const completedItem = { ...allTodos[index], completedOn };

    setCompletedTodos([...completedTodos, completedItem]);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos', JSON.stringify([...completedTodos, completedItem]));
  };

  const handleDeleteCompletedTodo = (index) => {
    const reducedTodo = completedTodos.filter((_, i) => i !== index);
    setCompletedTodos(reducedTodo);
    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
  };

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };

  const handleUpdateTodo = () => {
    const updatedTodos = allTodos.map((item, i) =>
      i === currentEdit ? currentEditedItem : item
    );
    setTodos(updatedTodos);
    setCurrentEdit(null);
    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
  };

  const handleInputChange = (key, value) => {
    setCurrentEditedItem((prev) => ({ ...prev, [key]: value }));
  };

  const renderTodoInput = () => (
    <div className="todo-input">
      <InputField label="Title" placeholder={"Enter Your Task Title"}  value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      <InputField label="Description" placeholder={"Enter Descriptions"} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
      <button type="button" onClick={handleAddTodo} className="primaryBtn">
        Add
      </button>
    </div>
  );

  const renderTodos = (todos, isCompleted = false) =>
    todos.map((item, index) => (
      <div className="todo-list-item" key={index}>
        <div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {isCompleted && <p><small>Completed on: {item.completedOn}</small></p>}
        </div>
        <div>
          {!isCompleted && (
            <>
              <AiOutlineDelete className="icon" onClick={() => handleDeleteTodo(index)} title="Delete?" />
              <BsCheckLg className="check-icon" onClick={() => handleComplete(index)} title="Complete?" />
              <AiOutlineEdit className="check-icon" onClick={() => handleEdit(index, item)} title="Edit?" />
            </>
          )}
          {isCompleted && (
            <AiOutlineDelete className="icon" onClick={() => handleDeleteCompletedTodo(index)} title="Delete?" />
          )}
        </div>
      </div>
    ));

  const renderEditForm = () => (
    <div className="edit__wrapper">
      <InputField
        placeholder="Updated Title"
        value={currentEditedItem.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
      />
      <textarea
        placeholder="Updated Description"
        rows={4}
        value={currentEditedItem.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
      />
      <button type="button" onClick={handleUpdateTodo} className="primaryBtn">
        Update
      </button>
    </div>
  );

  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className="todo-wrapper">
        {renderTodoInput()}
        <div className="btn-area">
          <button className={`secondaryBtn ${!isCompleteScreen && 'active'}`} onClick={() => setIsCompleteScreen(false)}>
            Todo
          </button>
          <button className={`secondaryBtn ${isCompleteScreen && 'active'}`} onClick={() => setIsCompleteScreen(true)}>
            Completed
          </button>
        </div>
        <div className="todo-list">
          {!isCompleteScreen ? renderTodos(allTodos) : renderTodos(completedTodos, true)}
        </div>
        {currentEdit !== null && renderEditForm()}
      </div>
    </div>
  );
}

const InputField = ({ label, value, onChange, placeholder }) => (
  <div className="todo-input-item">
    <label>{label}</label>
    <input type="text" value={value} onChange={onChange} placeholder={placeholder}/>
  </div>
);

export default App;

