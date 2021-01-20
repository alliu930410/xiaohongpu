import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { storage, db } from './firebase';
import firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import './ImageUpload.css';


function ImageUpload(username) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload= () => {
        const imageId = uuidv4();

        const uploadTask = storage.ref(`images/${imageId}`).put(image)

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function ...
                storage
                    .ref("images")
                    .child(imageId)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username.username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        )
    };

    return (
        <div className="imageupload">
            <h3>{username.username} 您已登录</h3>
            <h3>你可以请上传图片发布闲置</h3>
            <h3>或者浏览约🔥</h3>
            <input className="imageupload__text" type="text" placeholder='请输入闲置信息， 联系方式...' onChange={event => setCaption(event.target.value)} value={caption} />
            <input className="imageupload__file" type="file" onChange={handleChange} />
            <progress className="imageupload__progress" value={progress} max="100"></progress>
            <Button
                onClick={handleUpload}  
            >
                点击上传图片
            </Button>
        </div>
    )
}

export default ImageUpload
