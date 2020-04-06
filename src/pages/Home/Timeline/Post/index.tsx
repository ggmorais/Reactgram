import React, { useState, useEffect } from 'react';
import { MdMoreHoriz, MdAccountCircle } from 'react-icons/md';
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark } from 'react-icons/fi';

import api from '../../../../services/api';

import { ActionBar, Container, PostImage, TitleBar } from './style';
import './styles.css';

export function Post(props: IPost) {

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([] as IUser[]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([] as IComment[]);

  const user: IUser = JSON.parse(localStorage.getItem('auth') || '');
  
  const handleLike = async () => {
    
    if (liked === true) {
      for (let lks in likes) {
        setLikes(likes.filter(() => likes[lks].username !== user.username));
      }
    }

    if (!likes.length && liked === false) {
      setLikes([...likes, user]);
    }

    setLiked(liked ? false : true);

    try {
      await api.post('/posts/like', {
        userId: user._id,
        postId: props._id
      });

    } catch(err) {
      alert('Sorry, we could not manage your like now, please try again later.')
    }
  }

  const handleComment = async (e: any) => {
    e.preventDefault();

    try {
      api.post('/posts/comment', {
        postId: props._id,
        userId: user._id,
        body: comment
      });
    } catch(err) { console.log(err) }
  }

  const handleShare = async () => {}

  const handleMark = async () => {}

  useEffect(() => {
    if (!likes.length) setLikes(props.likes);
    if (props.comments) setComments(props.comments);

    console.log(props.comments)

    for (let like of props.likes) {
      if (like.username == user.username) {
        setLiked(true);
      }
    }

  }, []);

  return (
    <Container>
      <TitleBar>

        {props.user.image 
          ? <img src={props.user.image} width="36px" style={{ borderRadius: '50px', marginLeft: '15px' }} />
          : <MdAccountCircle size={36} style={{ marginLeft: '10' }} />
        }
        <p>{props.user.username}</p>

        <MdMoreHoriz size={22} style={{ marginLeft: 'auto', marginRight: '15px' }} />
      </TitleBar>

      <PostImage src={props.image} />

      <ActionBar>
        <FiHeart
          className="btn-like"
          size={28} 
          onClick={handleLike}
          fill={liked ? '#ed4956' : 'transparent'} 
          color={liked ? '#ed4956' : 'inherit'}
        />
        <FiMessageCircle size={28} onClick={handleComment} style={{ marginLeft: '10px' }} />
        <FiShare2 size={28} onClick={handleShare} style={{ marginLeft: '10px' }} />
        <FiBookmark size={28} onClick={handleMark} style={{ marginLeft: 'auto' }} />
      </ActionBar>

      {likes.length > 0 && (
        <p style={{ marginLeft: '15px' }}>
          Liked by <strong>{likes[0].username}</strong>

          {likes.length > 1 && (
            <span>and <strong>another {likes.length} people</strong></span>
          )}
        </p>
      )}

      {comments.length > 0 && (
        <div>
          <p><strong>{comments[0].user.username}</strong>{comments[0].body}</p>
          {comments.length > 1 && (
            <>
              {comments.length > 3 && <span>See all {comments.length} commentaries</span>}
              <p><strong>{comments[comments.length].user.username}</strong>{comments[comments.length].body}</p>
              <p><strong>{comments[comments.length -1].user.username}</strong>{comments[comments.length -1].body}</p>
            </>
          )}
          <span>{props.date} ago</span>
        </div>
      )}

      <form onSubmit={handleComment} className="newcomment-container">
        <textarea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder="Add a commentary" 
        />
        <button 
          disabled={comment ? false : true} 
          style={{ opacity: comment ? 1 : .4 }}
        >
          Publish
        </button>
      </form>
    </Container>
  );
};
