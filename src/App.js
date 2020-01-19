import React, { useState, useEffect } from 'react';
import firebase from "./firebase";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 1000px;
  text-align: center;
`;

const Title = styled.div`
  margin-top: 60px;
  display: inline-block;
  width: 350px;
  font-size: 30px;
`;

const TableBody = styled.div`
  margin-top: 100px;
  margin-bottom: 60px;
  max-height: 300px;
  height: auto;
  overflow: auto;
`;

const TableBodyInBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`;

const TableBox = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: space-around;
  border: 2px solid gray;
  height: 30px;
  line-height: 30px;
  margin: 10px;
`

const InputBox = styled.input`
  width: 150px;
  height: 20px;
  margin-bottom: 50px;
`;

const ButtonBox = styled.button`
  width: 100px;
  height: 50px;
  margin-bottom: 50px;
`;

function App() {
  
  const [userId, setUserId] = useState(0); // id 부여
  const [listData, setListData] = useState(); // firebase DB 담기
  const [newName, setNewName] = useState([]); // 시설이름 변수

  const [isButton, setIsButton] = useState(false);
  
  useEffect(() => {
    
    const fetchData = () => {
      const auth = firebase.auth();
      const authProvider = new firebase.auth.GoogleAuthProvider();
      
      auth.onAuthStateChanged((user) => { // Auth
        if (user) {
          // 인증 성공부
          console.log("success");
          // 보더리스트 출력
          setUserInfo(user);  
        } else {
          // 인증 실패부
          auth.signInWithPopup(authProvider);
        }
      });
    }
    getBoardList();
    fetchData();
  }, []);

  const getBoardList = () => { // get List
    const database = firebase.database().ref('/').once('value');
    database.then(res => {
      setListData(res.val().board_list);
      setUserId(res.val().board_list.length);
    });
    setIsButton(false);
  };

  const getOneData = (id) => {   // get data
    setIsButton(true);
    setUserId(id);
    const rootRef = firebase.database().ref();
    rootRef.child("board_list").child(id).child("placeName").once('value', (data) => {
      setNewName(data.val());
    });
  }
  
  const createNewData = (placeName) => {  // save
    const newKey = firebase.database().ref().child('board_list').push().key;
    firebase.database().ref('board_list/' + userId).set({
      id: userId,
      uid: newKey,
      placeName: placeName,
    }, () => setUserId(userId + 1));
    getBoardList();
  };

  const updateData = (updateName, id) => {   // update
    const rootRef = firebase.database().ref();
    rootRef.child("board_list").child(id).update({
      placeName: updateName,
    });
    setIsButton(false);
    getBoardList();
  };

  const deleteData = (id) => {  // delete
    const rootRef = firebase.database().ref();
    rootRef.child("board_list").child(id).remove();
    setIsButton(false);
    getBoardList();
  };

  const onChange = (e) => {
    setNewName(e);
  }

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
          {
            listData ?
            (
              listData.map((list) => (
                <TableBox key={list.uid}
                  onClick={() => {getOneData(list.id)}}
                >
                 <span>{list.uid}</span>
                 <span>{list.placeName}</span>
               </TableBox>
              ))
            )
                :
            (
              <div>데이터를 불러오는 중입니다.</div>
            )
          }
      </TableBody>
      <span style={{marginRight: "10px"}}>시설 이름</span>
      <InputBox
        value={newName}
        onChange={e => onChange(e.target.value)}
        name="place"
      />
      {
        isButton ?
        (
          <div>
            <button
              style={{
                width: "100px",
                height: "50px"
              }}
              onClick={() => getBoardList()}
            >취소
            </button>

            <button
              style={{
                margin: "10px",
                width: "100px",
                height: "50px"
              }}
              onClick={() => updateData(newName, userId)}
            >수정
            </button>
            
            <button
              style={{
                width: "100px",
                height: "50px"
              }}
              onClick={() => deleteData(userId)}
            >삭제
            </button>
          </div>
        )
          :
        (
          <div>
            <ButtonBox onClick={() => createNewData(newName)}>저장</ButtonBox>
          </div> 
        )
      }
      
    </Wrapper>
  );
}

export default App;
