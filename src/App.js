import React, { useState, useEffect } from 'react';
import firebase from "./firebase";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 1000px;
  border: 1px solid red;
  text-align: center;
`;

const Title = styled.div`
  margin-top: 100px;
  display: inline-block;
  width: 350px;
  border: 1px solid blue;
`;

const TableBody = styled.div`
  margin-top: 100px;
  height: 300px;
  border : 1px solid green;
`;

const TableBodyInBox = styled.div`
  display: flex;
  justify-content: space-around;
`;

const TableBox = styled.div`
  display: flex;
  justify-content: space-around;
`

const InputBox = styled.input`
  width: 150px;
  height: 20px;
  margin: 0 50px 50px 0;
`;

const ButtonBox = styled.button`
  width: 100px;
  height: 50px;
  margin-bottom: 100px;
`;

function App() {
  const [userInfo, setUserInfo] = useState(); // 인증시 필요한 유저정보담는 변수 
  const [newName, setNewName] = useState([]); // 시설이름 변수
  
  useEffect(() => {
    
    const fetchData = async () => {
      const auth = firebase.auth();
      // const db = firebase.firestore();
      const db = firebase.database();
      // const docRef = db.collection("board_list").doc("test");
      const authProvider = new firebase.auth.GoogleAuthProvider();
      
      auth.onAuthStateChanged((user) => { // Auth
        if (user) {
          // 인증 성공부
          console.log("success");
          console.log(user);
          // 보더리스트 출력
          setUserInfo(user);  
          // getBoardList(user);
          getBoardList();
        } else {
          // 인증 실패부
          auth.signInWithPopup(authProvider);
        }
      });
      
      // const getBoardList = (userInfo) => { // 목록가져오기
        const getBoardList = () => {
          const userId = firebase.auth().currentUser.uid;
          return firebase.database().ref('board_list/'+userId).once('value').then((snapshot) => {
            const name = (snapshot.val() && snapshot.val().name) || 'Anonymous';
            console.log('aaaaaaaaaa',name);
          });
        // console.log(userInfo.uid);
        // console.log(db);
        // const boardRef = db.ref('board_list/', userInfo.uid);
        // console.log(boardRef);
        // boardRef.on('child_added', (data) => {
        //   console.log("database 접근");
        //   console.log(data);
        // });
      }
    }

    
    fetchData();
    // createNewData(0, "야구장");
    
  }, []);
  
  const createNewData = (placeName) => {  // 저장
    // const postData = {
    //   uid: uid,
    // };
    const newKey = firebase.database().ref().child('board_list').push().key;
    firebase.database().ref('board_list/' + placeName).set({
      id: 1,
      uid: newKey, 
      placeName: placeName,
    });
    console.log("저장 성공 ~ !");
  };

  const updateData = () => {   // 수정
    // const newPostKey = firebase.database().ref().child('posts').push().key;
    
    // const updates = {};
    // updates['/posts/' + newPostKey] = postData;
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    // return firebase.database().ref().update(updates);
  };

  const deleteData = () => {  // 삭제

  };

  const onChange = (e) => {
    setNewName(e);
  }

  // const onCreate = () => {
  // //  const db = firebase.firestore();
  // const db = firebase;
  // //  console.log(db);
  // //  db.collection("board_list").add({ name: newName});
  //   console.log("collection~~~~",db);
  // };

  return (
    <Wrapper>
      <Title>
        필드쉐어
      </Title>
      <TableBody>
        <TableBodyInBox>
          <span>ID</span>
          <span>시설</span>
        </TableBodyInBox>
        <TableBox>
          <span>uid</span>
          <span>name</span>
        </TableBox>
      </TableBody>
      <span>시설이름</span>
      <InputBox
        value={newName}
        onChange={e => onChange(e.target.value)}
        name="place"
      />
      <div>
        <ButtonBox onClick={() => createNewData(newName)}>저장</ButtonBox>
      </div>
    </Wrapper>
  );
}

export default App;
