import React, {  useState, useEffect } from 'react'
import axios from 'axios'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
const HomeScreen = () => {

  const [showMenu, setShowMenu] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState('');
  const [status, setStatus] = useState('');
  const [tasks, setTasks] = useState([]);


  const navigate = useNavigate()
 
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo'); 
    navigate('/login'); 
    toast.success('Logged out successfully'); 
  };


  const addTaskHandler = async (e) => {
    e.preventDefault();
    try {
      const userDataString = localStorage.getItem('userInfo'); 
      const userData = JSON.parse(userDataString);
      const token = userData.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      const data = await axios.post('/api/users/createTask', { task, status }, config);
      setTasks(prevTasks => [...prevTasks, data.data]);
      toast.success('Task added successfully');
      toggleModal();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Error adding task');
    }
  };


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/users/showTask");
        const { tasks } = response.data;
        console.log("response", tasks)
        setTasks(tasks);  
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    try {
      await axios.put(`/api/users/${taskId}`, { status: newStatus });
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

 
 
  return (
    <div className='lg:grid md:grid-cols-6 text-white'>
      <div className='md:col-span-1 md:flex md:justify-center'>
        <nav>
          <div className='flex justify-between items-center'>
            <a href="/" className='text-2xl m-4'>Trello</a>
            <div className='px-4 cursor-pointer md:hidden' onClick={toggleMenu}>
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
              </svg>
            </div>
          </div>
          <ul className={`text-sm mt-6 ${showMenu ? 'block' : 'hidden'} md:block`}>
            <li className='p-3'>
              <a href="/" className="flex items-center">
                <svg className='w-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                <span className='pl-3'>Board</span>
              </a>
            </li>
            <li className='p-3'>
              <a href="/" className="flex items-center">
                <svg className='w-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span className='pl-3'>Home</span>
              </a>
            </li>
            <li className='p-3'> 
              <a href="/" className="flex items-center">
                <svg className='w-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span className='pl-3'>Mail</span>
              </a>
            </li> 
            <li className='p-3'>
              <a href="/" className="flex items-center">
                <svg className='w-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
                <span className='pl-3'>Feed</span>
              </a>
            </li>
            {localStorage.getItem('userInfo') ? (
              <li className='p-3'>
                <a href="/" className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button className='btn border-2 hover:bg-white hover:text-black' onClick={logoutHandler}>Logout</button>
                  </div>
                </a>
              </li>
            ) : (
              <> </>
            )}
          </ul>
        </nav>
      </div>
  
      <main className='px-6 py-6 md:col-span-5'> 
        <div className='flex justify-center md:justify-end'>
          {localStorage.getItem('userInfo') ? (
            <>
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                </svg>
                <a href="/" className='btn ml-2'>Calendar</a>
              </div>
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <a href="/" className='btn ml-2'>Notification</a>
              </div>
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                </svg>
                <a href="/" className='btn ml-2'>Inbox</a>
              </div>
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                <a href="/" className='btn ml-2'>Leave</a>
              </div>
              <div className="flex flex-col items-center">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                <a href="/" className='btn ml-2'>Attendance</a>
              </div>
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <a href="/login" className='btn border-2 hover:bg-white hover:text-black'>Log in</a>
              </div>
              <div className="flex flex-col items-center">
                <a href="/register" className='btn border-2 hover:bg-white hover:text-black ml-2'>Sign up</a>
              </div>
            </>
          )}
        </div>

        <header className="flex justify-between items-center pt-3">
          <h2 className='text-xl font-bold'>My Board</h2>
          <div className='btn bg-gray-800'>
            <span>filter</span>
          </div>
        </header>

        <div className='mt-8 grid lg:grid-cols-4 gap-5'>
          {/* <!-- cards go here --> */}
          <div
            className='card'
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, '1')}
          > 
            <div className="flex justify-between items-center">
              <h1 className='m-4'>To Do</h1>
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {tasks?.filter(task => task.status === '1').map(filteredTask => (
                <div
                  className='m-4 bg-gray-500 p-4 mb-4'
                  key={filteredTask._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, filteredTask._id)}
                >
                  <span>{filteredTask.task}</span>
                </div>
              ))}
            </div> 
          </div>

          <div
            className='card'
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, '2')}
          > 
            <div className="flex justify-between items-center">
              <h1 className='m-4'>Doing</h1>
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {tasks?.filter(task => task.status === '2').map(filteredTask => (
                <div
                  className='m-4 bg-gray-500 p-4 mb-4'
                  key={filteredTask._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, filteredTask._id)}
                >
                  <span>{filteredTask.task}</span>
                </div>
              ))}
            </div> 
          </div>

          <div
            className='card'
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, '3')}
          > 
            <div className="flex justify-between items-center">
              <h1 className='m-4'>Done</h1>
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {tasks?.filter(task => task.status === '3').map(filteredTask => (
                <div
                  className='m-4 bg-gray-500 p-4 mb-4'
                  key={filteredTask._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, filteredTask._id)}
                >
                  <span>{filteredTask.task}</span>
                </div>
              ))}
            </div> 
          </div>
          <div className='card h-10'> 
            <div className="flex justify-between items-center">
              <h1 className='m-2'>Add a Card</h1> 
              <svg onClick={toggleModal} className='w-6 pr-1 cursor-pointer' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg> 
            </div>
          </div> 
        </div> 
      </main> 
      {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-black font-semibold">Add Task</h2>
                {/* Close modal button */}
                <button className="p-2 text-black" onClick={toggleModal}>
                  &times;
                </button>
              </div>

              {/* Modal content */}
              <form onSubmit={addTaskHandler}>
                <div className="mb-4">
                  <label htmlFor="task" className="block mb-2 text-black">
                    Task:
                  </label>
                  <input
                    type="text"
                    id="task"
                    className="border rounded px-3 py-2 w-full text-black"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="status" className="block mb-2 text-black">
                    Status:
                  </label>
                  <select
                    id="status"
                    className="border rounded px-3 py-2 w-full text-black"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <button type="submit" className="btn bg-blue-500 text-white">
                  Add Task
                </button>
              </form>
            </div>
          </div>
        )}


    </div>
  ) 
}
 
export default HomeScreen