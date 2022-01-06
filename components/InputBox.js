import { useState, useRef } from "react";
//"import Image from "next/image""
//import { useSession } from "next-auth/react"
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
import { db, storage } from "../Firebase";
import firebase from "firebase";

function InputBox() {
  //const [session] =useSession();
  const inputRef = useRef(null);
  const filepickerRef = useRef(null);
  const [postImg, setPostImg] = useState();

  const sendPost = (e) => {
    e.preventDefault();
    if (!inputRef.current.value) return;

    db.collection("posts")
      .add({
        message: inputRef.current.value,
        // name: sessionStorage.user.name,
        // email: sessionStorage.user.email,
        // image: sessionStorage.user.image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        if (postImg) {
          const uploadTask = storage
            .ref(`posts/${doc.id}`)
            .putString(postImg, "data_url");

          removeImage();

          uploadTask.on(
            "state_change",
            null,
            (error) => console.log(error),
            () => {
              storage
                .ref("posts")
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  db.collection("posts").doc(doc.id).set(
                    {
                      postImage: url,
                    },
                    { merge: true }
                  );
                });
            }
          );
        }
      });
    inputRef.current.value = "";
  };

  const addImgToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setPostImg(readerEvent.target.result);
    };
  };

  const removeImage = () => {
    setPostImg(null);
  };

  return (
    <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
      <div className="flex space-x-4 p-4 items-center">
        {/* <Image 
                className="rounded-full"
                src={sessionStorage.user.image}
                width={40}
                height ={40}
                layout="fixed"
                /> */}
        <form className="flex flex-1">
          {/* placeholder={`What's on your mind, ${session.user.name}`}  */}
          <input
            className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
            type="text"
            ref={inputRef}
            placeholder="What's on your mind?"
          />
          <button hidden type="submit" onClick={sendPost}>
            Submit
          </button>
        </form>
        {postImg && (
          <div
            onClick={removeImage}
            className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
          >
            <img className="h-10 object-contain" src={postImg} alt="pic" />
            <p className="text-xs text-red-500 text-center">Remove</p>
          </div>
        )}
      </div>
      <div className="flex justify-evenly p-3 border-t">
        <div className="inputIcon">
          <VideoCameraIcon className="h-7 text-red-500" />
          <p className="text-xs sm:text-sm xl:text-base">Live Video</p>
        </div>
        <div
          onClick={() => filepickerRef.current.click()}
          className="inputIcon"
        >
          <CameraIcon className="h-7 text-green-400" />
          <p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
          <input
            ref={filepickerRef}
            onChange={addImgToPost}
            type="file"
            hidden
          />
        </div>
        <div className="inputIcon">
          <EmojiHappyIcon className="h-7 text-yellow-500" />
          <p className="text-xs sm:text-sm xl:text-base">Feeling Activity</p>
        </div>
      </div>
    </div>
  );
}

export default InputBox;
