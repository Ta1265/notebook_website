import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';

import Note from './Note.js';


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board_id: null,
            owner_id: null,
            needNotesUpdate: false,
            notesList: [],
            editing: false,
        };
        this.getNotes = this.getNotes.bind(this);
        this.updateProps = this.updateProps.bind(this);
        this.createNote = this.createNote.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
    }
    deleteNote(note_id) {
        var del = note_id;
        var csrftoken = this.getCookie('csrftoken');
        var url = `http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/delete-note/${del}/`;
        fetch(url, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
        }).then(() =>
            this.setState({
                needNotesUpdate: true,
            }),
        );
    }

    // for handling CSRF tokens https://www.techiediaries.com/django-react-forms-csrf-axios/
    getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === name + '=') {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    updateProps() {
        if (this.state.owner_id != this.props.owner_id || this.state.board_id != this.props.board_id) {
            this.setState({
                board_id: this.props.board_id,
                owner_id: this.props.owner_id,
                needNotesUpdate: true,
            });
        }
    }

    getNotes() {
        if (this.state.needNotesUpdate)
            var url = `http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/list-notes/${this.state.board_id}/`;
        fetch(url).then((response) => response.json()).then((data) =>
            this.setState({
                notesList: data,
                needNotesUpdate: false,
            }),
        );
    }

    createNote(e) {
        e.preventDefault();
        var title = e.target[0].value;
        var csrftoken = this.getCookie('csrftoken');
        var bid = this.state.board_id;

        console.log('title = ', title);
        var url = 'http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/create-note/';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify({ title: title, belongsToBoard: bid }),
        })
            .then((response) => response.json())
            .then((data) =>
                this.setState({
                    needNotesUpdate: true, //reset everything and update notes
                }),
            );
    }

    render() {
        this.updateProps();
        this.getNotes();
        var notes = this.state.notesList;
        var self = this;
        return (
            <div>
                <h3 class="boarder-title">This is your Notebook</h3>
                <div id="newNote-form-wrapper">
                    <form onSubmit={this.createNote} id="form">
                        <div className="flex-wrapper">
                            <div>
                                <input
                                    id="title"
                                    className="form-control"
                                    type="text"
                                    type="title"
                                    name="title"
                                    placeholder="Enter new list title"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    value="Create New List"
                                    id="submit"
                                    className="btn"
                                    type="submit"
                                    name="submit"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div class="flex-container">
                    {notes.map(function (note, index) {
                        return (
                            <div>
                                <Note
                                    key={index}
                                    note_id={note.id}
                                    title={note.title}
                                    belongsToBoard={note.belongsToBoard}
                                />
                                <button onClick={() => self.deleteNote(note.id)} class="btn-delete-note">
                                    {' '}
									DELETE LIST
								</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Board;