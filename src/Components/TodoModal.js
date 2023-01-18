import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import DatePicker from 'react-date-picker';
import { TextField } from '@material-ui/core';
import { addTodo, updateTodo } from '../slices/todoSlice';
import styles from '../styles/modules/modal.module.scss';
import Button from './Button';

const dropIn = {
  hidden: {
    opacity: 0,
    transform: 'scale(0.9)',
  },
  visible: {
    transform: 'scale(1)',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: 'scale(0.9)',
    opacity: 0,
  },
};

function TodoModal({ type, modalOpen, setModalOpen, todo }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('incomplete');
  // added for
  const [date, setDate] = useState(new Date());
  const dispatch = useDispatch();

  useEffect(() => {
    if (type === 'update' && todo) {
      setTitle(todo.title);
      setStatus(todo.status);
      setDate(todo.date);
    } else {
      setTitle('');
      setStatus('incomplete');
      setDate(null);
    }
  }, [type, todo, modalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // add todo
    if (title === '') {
      toast.error('Please enter a title.');
      return;
    }
    if (title && status) {
      if (type === 'add') {
        dispatch(
          addTodo({
            id: uuid(),
            // if key and value are the same, no need to specify, same for status
            title,
            status,
            time: new Date().toLocaleDateString(),
            date,
          })
        );
        // close window after adding item
        toast.success('Task Added Successfully');
      }
      if (type === 'update') {
        // checking updated value against old value
        if (
          todo.title !== title ||
          todo.status !== status ||
          todo.date !== date
        ) {
          dispatch(
            updateTodo({
              ...todo,
              title,
              status,
              date,
            })
          );
        } else {
          toast.error('No changes made');
          return;
        }
      }
      // auto close the modal
      setModalOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initialState={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onClick={() => setModalOpen(false)}
              onKeyDown={() => setModalOpen(false)}
              tabIndex={0}
              role="button"
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>
            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
              <h1 className={styles.formTitle}>
                {' '}
                {type === 'update' ? 'Update' : 'Add'} Task
              </h1>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label htmlFor="status">
                Status
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="complete">Complete</option>
                </select>
              </label>

              <label htmlFor="date">
                Due Date
                <DatePicker
                  value={typeof date === 'string' ? new Date(date) : date}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </label>

              <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary">
                  {type === 'update' ? 'Update' : 'Add'} Task
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setModalOpen(false)}
                  onKeyDown={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TodoModal;
