import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
import Task from './Task';

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            note_id: null,
            title: '',
            belongsToBoard: null,
            needTasksUpdate: false,
            tasksList: [],
            addingTask: false,
        };

        this.getTasks = this.getTasks.bind(this);
        this.updateNoteProps = this.updateNoteProps.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.createTask = this.createTask.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.updateTask = this.updateTask.bind(this);
    }
    updateTask(task_id, info) {
        var url = `http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/update-task/${task_id}/`;

        fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                id: task_id,
                info: info,
                completed: false,
                belongsToNote: this.state.note_id,
            }),
        })
            .then(() => {
                console.log('update went through?');
                this.setState({
                    needTasksUpdate: true,
                });
            })
            .catch((error) => {
                console.log('caught error updating task =', error);
            });
    }

    deleteItem(task_id) {
        var task_to_delete = task_id;
        var csrftoken = this.getCookie('csrftoken');
        var url = `http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/delete-task/${task_to_delete}/`;
        var context = {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
        };
        fetch(url, context).then(() =>
            this.setState({
                needTasksUpdate: true,
            }),
        );
    }

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

    updateNoteProps() {
        if (
            this.state.note_id != this.props.note_id ||
            this.state.title != this.props.title ||
            this.state.belongsToBoard != this.props.belongsToBoard
        ) {
            this.setState({
                note_id: this.props.note_id,
                title: this.props.title,
                belongsToBoard: this.props.belongsToBoard,
                needTasksUpdate: true,
                tasksList: [],
            });
        }
    }

    getTasks() {
        if (this.state.needTasksUpdate) {
            var url = `http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/list-tasks/${this.state.note_id}/`;
            fetch(url).then((response) => response.json()).then((data) =>
                this.setState({
                    tasksList: data,
                    needTasksUpdate: false,
                }),
            );
        }
    }

    createTask(e) {
        e.preventDefault();
        var info = e.target[0].value;
        var csrftoken = this.getCookie('csrftoken');
        var nid = this.state.note_id;
        var complete = false;

        var url = 'http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/create-task/';
        console.log('note id =', nid, 'info = ', info, 'complete = ', complete);
        fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
            body: JSON.stringify({ belongsToNote: nid, info: info, completed: complete }),
        })
            .then((response) => response.json())
            .then((data) =>
                this.setState({
                    needTasksUpdate: true,
                }),
            );
    }

    render() {
        this.updateNoteProps();
        this.getTasks();
        var tasks = this.state.tasksList;
        var self = this;
        return (
            <div>
                <div class="note-title">
                    {this.state.title}
                    <div className="task-wrapper flex-wrapper">
                        <form onSubmit={this.createTask} id="form">
                            <div>
                                <input
                                    id="title"
                                    className="form-control"
                                    type="text"
                                    type="title"
                                    name="title"
                                    placeholder="Enter new task"
                                    required
                                />
                            </div>
                            <div>
                                <input value="Add Task" id="submit" className="btn" type="submit" name="submit" />
                            </div>
                        </form>
                    </div>
                </div>

                {tasks.reverse().map(function (task, index) {
                    return (
                        <Task
                            key={index}
                            updateTask={self.updateTask}
                            deleteItem={self.deleteItem}
                            task_id={task.id}
                            info={task.info}
                            completed={task.completed}
                            belongsToNote={task.belongsToNote}
                        />
                    );
                })}
            </div>
        );
    }
}

export default Note;