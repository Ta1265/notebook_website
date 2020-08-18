import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';



class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task_id: null,
            info: '',
            completed: false,
            belongsToNote: null,
            needInfoUpdate: false,
            beingEdited: false,
        };

        this.getTasks = this.getTasks.bind(this);
        this.updateTaskProps = this.updateTaskProps.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.startEdit = this.startEdit.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.updateEditTask = this.updateEditTask.bind(this);
    }

    updateEditTask(e) {
        e.preventDefault();
        var info = e.target[0].value;
        this.props.updateTask(this.state.task_id, info);
        this.setState({
            beingEdited: false,
            needInfoUpdate: true,
        });
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

    updateTaskProps() {
        if (
            this.state.task_id != this.props.task_id ||
            this.state.info != this.props.info ||
            this.state.belongsToNote != this.state.belongsToNote
        ) {
            this.setState({
                task_id: this.props.task_id,
                info: this.props.info,
                completed: this.state.beingEdited,
                belongsToNote: this.props.belongsToNote,
                needInfoUpdate: true,
            });
        }
    }

    getTasks() {
        if (this.state.needInfoUpdate) {
            var url = `http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/get-task/${this.state.task_id}/`;
            fetch(url).then((response) => response.json()).then((data) =>
                this.setState({
                    task_id: data.id,
                    info: data.info,
                    completed: data.completed,
                    belongsToNote: data.belongsToNote,
                    needInfoUpdate: false,
                }),
            );
        }
    }

    changeComplete() {
        console.log('clicked');
        this.setState({
            completed: !this.state.completed,
        });
    }

    showInfo() {
        if (this.state.beingEdited) {
            return (
                <div className="task-wrapper flex-wrapper">
                    <form onSubmit={this.updateEditTask} id="form">
                        <div>
                            <input
                                id="title"
                                className="form-control"
                                type="text"
                                type="title"
                                name="title"
                                placeholder={this.state.info}
                                required
                            />
                        </div>
                        <div>
                            <input value="Submit Edit" id="submit" className="btn" type="submit" name="submit" />
                        </div>
                    </form>
                </div>
            );
        }
        if (this.state.completed === true) {
            return <strike class="note">{this.state.info}</strike>;
        } else {
            return <span class="note">{this.state.info}</span>;
        }
    }
    startEdit() {
        console.log('edit clicked');
        this.setState({
            beingEdited: !this.state.beingEdited,
        });
    }

    render() {
        this.updateTaskProps();
        this.getTasks();
        return (
            <div className="task-wrapper flex-wrapper">
                <div
                    onClick={() => {
                        return this.changeComplete();
                    }}
                    style={{ flex: 7 }}>
                    {this.showInfo()}
                </div>
                <div style={{ flex: 1 }}>
                    <button onClick={() => this.startEdit()} class="btn edit">
                        Edit
					</button>
                </div>
                <div style={{ flex: 1 }}>
                    <button onClick={() => this.props.deleteItem(this.state.task_id)} class="btn delete">
                        Delete{' '}
                    </button>
                </div>
            </div>
        );
    }
}

export default Task;