import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { DialogActions, PersonAvatar, DeleteIconButton } from './components';

import {
  addComment,
  deleteComment,
  resetActiveCellDialog,
} from '../../../../../store/actions/ui/excel/commands';

import './ActiveCell.scss';

const CommentListItemAvatar = () => (
  <ListItemAvatar>
    <PersonAvatar />
  </ListItemAvatar>
);

const CommentActions = ({ handleRemove }) => (
  <ListItemSecondaryAction>
    <DeleteIconButton handleClick={handleRemove} />
  </ListItemSecondaryAction>
);

const CommentsListItems = ({ comments, handleRemoveComment }) =>
  comments.map(({ id, by, accountId, comment }) => {
    const handleRemove = () => handleRemoveComment(id, accountId);

    return (
      <ListItem key={id}>
        <CommentListItemAvatar />
        <ListItemText primary={comment} secondary={by} />
        <CommentActions handleRemove={handleRemove} />
      </ListItem>
    );
  });

const CommentsList = ({ comments, handleRemoveComment }) => (
  <List className="dialog__list">
    <CommentsListItems comments={comments} handleRemoveComment={handleRemoveComment} />
  </List>
);

const CommentInputSection = ({
  textFieldRef,
  handleChange,
  handleSaveComment,
  handleCloseActiveCellDialog,
}) => (
  <div className="dialog__actions">
    <hr />
    <TextField
      inputRef={textFieldRef}
      className="dialog__field"
      variant="outlined"
      multiline={true}
      onChange={handleChange}
      fullWidth
    />
    <DialogActions handleAdd={handleSaveComment} handleCancel={handleCloseActiveCellDialog} />
  </div>
);

const CommentDialog = ({ comments }) => {
  const dispatch = useDispatch();

  const { _id: accountId, firstName, lastName } = useSelector(
    ({
      domain: {
        account: { _id: accountId, firstName, lastName },
      },
    }) => ({
      _id: accountId,
      firstName,
      lastName,
    }),
    shallowEqual,
  );

  const textFieldRef = useRef();
  const [comment, setComment] = useState('');

  useEffect(() => {
    textFieldRef.current.focus();
  }, [textFieldRef]);

  const handleClick = () => textFieldRef.current.focus();
  const handleChange = ({ target: { value } }) => setComment(value);

  const handleSaveComment = useCallback(
    () =>
      dispatch(
        addComment({
          comment,
          _id: accountId,
          firstName,
          lastName,
        }),
      ),
    [dispatch],
  );
  const handleRemoveComment = useCallback(commentId => dispatch(deleteComment({ commentId })), [
    dispatch,
  ]);
  const handleCloseActiveCellDialog = useCallback(() => dispatch(resetActiveCellDialog()), [
    dispatch,
  ]);

  return (
    <div className="dialog" onClick={handleClick}>
      <Typography variant="h6" className="dialog__label">
        Comment
      </Typography>
      <CommentsList comments={comments} handleRemoveComment={handleRemoveComment} />
      <CommentInputSection
        textFieldRef={textFieldRef}
        handleChange={handleChange}
        handleSaveComment={handleSaveComment}
        handleCloseActiveCellDialog={handleCloseActiveCellDialog}
      />
    </div>
  );
};

export default CommentDialog;
