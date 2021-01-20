import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { db, auth } from './firebase';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import logo from './image/xiaohongpu_logo.png';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);

        if(authUser.displayName) {
          // dont update username
        } else {
          // if we just created someone
          return authUser.updateProfile({
            displayName: username
          });
        }
      } else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
    .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault(); // it doesn't do weird stuffs and refresh
    
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
      open={open}
      onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img
              className="app_headerImage"
              src={logo}
              alt=""
            />
          </center>
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signUp}>注册</Button>
        </form>
      </div>
      </Modal>

      <div className="app__header">
        <div>
          <center>
            <img
              className="app__headerImage"
              src={logo}
              alt=""
            />
            <h4>加拿大最简单的闲置约🔥平台</h4>
          </center>
        </div>
        <div>
          {user ? (
            <React.Fragment>
              <Button onClick={()=> auth.signOut()}>🔥 离开</Button>
            </React.Fragment>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={()=> setOpenSignIn(true)}>🔥 登录</Button>
              <Button onClick={()=> setOpen(true)}>🔥 注册</Button>
            </div>
          )}
        </div>
      </div>
      <div className="app__posts">
          <div className="app__postsLeft">
            {
              posts.map(({id, post}) =>(
                <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
              ))
            }
          </div>
      </div>
      <div className="app__version">
        <h4>Beta Version 1.0.4</h4>
      </div>
      <div className="app__poster">
        {user?.displayName ? ( // react optional chaining
          <ImageUpload username={user.displayName}/>
        ) : (
          <h3>想发布闲置或者约🔥么？请先注册或者登录哦</h3>
        )}
        <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img
                  className="app_headerImage"
                  src={logo}
                  alt=""
                />
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>登录</Button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;
