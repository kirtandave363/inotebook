import React, { useState } from 'react'
import NoteContext from './noteContext'

const NoteState = (props) => {
  const host = "http://127.0.0.1:5000"
  // const s1 = {
  //   "name": "Kirtan",
  //   "class" : "7B"
  // }

  // const [state, setState] = useState(s1);

  // const update = ()=>{
  //     setTimeout(()=>{
  //         setState({
  //           "name": "Kanu",
  //           "class" : "14B"
  //         })
  //     },1000)
  // }

  const notesinitial = []
  const [notes, setNotes] = useState(notesinitial);

  const getallnotes = async() => {
    //api call
    const response = await fetch(`${host}/api/notes/fetchallnotes`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    })
    const json = await response.json()
    console.log(json)
    setNotes(json);
  }
    


  //Add a note
  const addnote = async(title, description, tag) => {
      //api call
      const response = await fetch(`${host}/api/notes/addnote`,{
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({title, description, tag})
      });
  
    const note = await response.json();
    setNotes(notes.concat(note));
  }



  //Delete a note
  const deletenote = async (id) => {
    //API call: 
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    });
    const json = response.json();
    console.log(json)
    console.log("Deleting note with id : " + id);
    const newNote = notes.filter((note) => { return note._id !== id });
    setNotes(newNote);
  }



  //Edit a note
  const editenote = async (id, title, description, tag) => {
    //api call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({title,description,tag})
    });
    const json = response.json();
    console.log(json)

    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < notes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break
      }
    }
    setNotes(newNotes);
  }
  return (
    // <NoteContext.Provider value= {{state,update}}>
    <NoteContext.Provider value={{ notes, addnote, deletenote, editenote,getallnotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState