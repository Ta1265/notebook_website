import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class Task extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			task_id        : null,
			info           : '',
			completed      : false,
			belongsToNote  : null,
			needInfoUpdate : false,
			beingEdited    : false,
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
			beingEdited    : false,
			needInfoUpdate : true,
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
				task_id        : this.props.task_id,
				info           : this.props.info,
				completed      : this.state.beingEdited,
				belongsToNote  : this.props.belongsToNote,
				needInfoUpdate : true,
			});
		}
	}

	getTasks() {
		if (this.state.needInfoUpdate) {
			var url = `http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/get-task/${this.state
				.task_id}/`;
			fetch(url).then((response) => response.json()).then((data) =>
				this.setState({
					task_id        : data.id,
					info           : data.info,
					completed      : data.completed,
					belongsToNote  : data.belongsToNote,
					needInfoUpdate : false,
				}),
			);
		}
	}

	changeComplete() {
		console.log('clicked');
		this.setState({
			completed : !this.state.completed,
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
			beingEdited : !this.state.beingEdited,
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

class Note extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			note_id         : null,
			title           : '',
			belongsToBoard  : null,
			needTasksUpdate : false,
			tasksList       : [],
			addingTask      : false,
		};

		this.getTasks = this.getTasks.bind(this);
		this.updateNoteProps = this.updateNoteProps.bind(this);
		this.getCookie = this.getCookie.bind(this);
		this.createTask = this.createTask.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.updateTask = this.updateTask.bind(this);
	}
	updateTask(task_id, info) {
		var url = `http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/update-task/${task_id}/`;

		fetch(url, {
			method  : 'POST',
			headers : { 'Content-type': 'application/json' },
			body    : JSON.stringify({
				id            : task_id,
				info          : info,
				completed     : false,
				belongsToNote : this.state.note_id,
			}),
		})
			.then(() => {
				console.log('update went through?');
				this.setState({
					needTasksUpdate : true,
				});
			})
			.catch((error) => {
				console.log('caught error updating task =', error);
			});
	}

	deleteItem(task_id) {
		var task_to_delete = task_id;
		var csrftoken = this.getCookie('csrftoken');
		var url = `http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/delete-task/${task_to_delete}/`;
		var context = {
			method  : 'DELETE',
			headers : { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
		};
		fetch(url, context).then(() =>
			this.setState({
				needTasksUpdate : true,
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
				note_id         : this.props.note_id,
				title           : this.props.title,
				belongsToBoard  : this.props.belongsToBoard,
				needTasksUpdate : true,
				tasksList       : [],
			});
		}
	}

	getTasks() {
		if (this.state.needTasksUpdate) {
			var url = `http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/list-tasks/${this.state
				.note_id}/`;
			fetch(url).then((response) => response.json()).then((data) =>
				this.setState({
					tasksList       : data,
					needTasksUpdate : false,
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

		var url = 'http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/create-task/';
		console.log('note id =', nid, 'info = ', info, 'complete = ', complete);
		fetch(url, {
			method  : 'POST',
			headers : { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
			body    : JSON.stringify({ belongsToNote: nid, info: info, completed: complete }),
		})
			.then((response) => response.json())
			.then((data) =>
				this.setState({
					needTasksUpdate : true,
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

				{tasks.reverse().map(function(task, index) {
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

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			board_id        : null,
			owner_id        : null,
			needNotesUpdate : false,
			notesList       : [],
			editing         : false,
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
		var url = `http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/delete-note/${del}/`;
		fetch(url, {
			method  : 'DELETE',
			headers : { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
		}).then(() =>
			this.setState({
				needNotesUpdate : true,
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
				board_id        : this.props.board_id,
				owner_id        : this.props.owner_id,
				needNotesUpdate : true,
			});
		}
	}

	getNotes() {
		if (this.state.needNotesUpdate)
			var url = `http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/list-notes/${this.state
				.board_id}/`;
		fetch(url).then((response) => response.json()).then((data) =>
			this.setState({
				notesList       : data,
				needNotesUpdate : false,
			}),
		);
	}

	createNote(e) {
		e.preventDefault();
		var title = e.target[0].value;
		var csrftoken = this.getCookie('csrftoken');
		var bid = this.state.board_id;

		console.log('title = ', title);
		var url = 'http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/create-note/';
		fetch(url, {
			method  : 'POST',
			headers : { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
			body    : JSON.stringify({ title: title, belongsToBoard: bid }),
		})
			.then((response) => response.json())
			.then((data) =>
				this.setState({
					needNotesUpdate : true, //reset everything and update notes
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
					{notes.map(function(note, index) {
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

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			logged_in       : false,
			username        : null,
			user_id         : null,
			display         : 'home',
			needGetBoard    : false,
			needPropsUpdate : false,
			boardList       : null,
		};
		this.getCookie = this.getCookie.bind(this);
		this.render_Display = this.render_Display.bind(this);
		this.set_display = this.set_display.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.login_logout = this.login_logout.bind(this);

		this.createBoard = this.createBoard.bind(this);
		this.getBoard = this.getBoard.bind(this);
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

	handleRegister(e) {
		e.preventDefault(e);
		var username = e.target[0].value;
		var password = e.target[1].value;
		console.log(e.target[0].value);
		console.log(e.target[1].value);

		var csrftoken = this.getCookie('csrftoken');

		var url = 'http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/register/';
		fetch(url, {
			method  : 'POST',
			headers : { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
			body    : JSON.stringify({ username: username, email: 'none', password: password }),
		})
			.then((response) => response.json())
			.then(() =>
				this.setState({
					logged_in       : false,
					username        : null,
					user_id         : null,
					display         : 'reg_success',
					needGetBoard    : false,
					needPropsUpdate : false,
					boardList       : null,
				}),
			)
			.catch(function(error) {
				console.log('ERROR occured in registration -> ', error);
				alert('An error occured during registration, please try again');
			});
	}

	handleLogin(e) {
		e.preventDefault();
		var username = e.target[0].value;
		var password = e.target[1].value;
		console.log(e.target[0].value);
		console.log(e.target[1].value);
		var csrftoken = this.getCookie('csrftoken');
		var url = 'http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/login/';
		fetch(url, {
			method  : 'POST',
			headers : { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
			body    : JSON.stringify({ username: username, password: password }),
		})
			.then((response) => response.json())
			.then((data) =>
				this.setState({
					username     : data.username,
					user_id      : data.id,
					logged_in    : true,
					display      : 'login_success',
					boardList    : null,
					needGetBoard : true,
				}),
			)
			.catch(function(error) {
				console.log(error);
				alert('An error occured during login, please try again');
			});
	}

	login_logout() {
		if (this.state.logged_in) {
			return (
				<a className="nav-link" href="#" onClick={() => this.handleLogout()}>
					LOGOUT
				</a>
			);
		} else {
			return (
				<a className="nav-link" href="#" onClick={() => this.set_display('login')}>
					LOGIN/REGISTER
				</a>
			);
		}
	}

	handleLogout() {
		this.setState({
			logged_in    : false,
			display      : 'home',
			username     : null,
			user_id      : null,
			boardlist    : null,
			needGetBoard : false,
		});
	}

	set_display(disp) {
		this.setState({
			display : disp,
		});
	}

	getBoard() {
		if (this.state.needGetBoard)
			var url = `http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/get-board/${this.state
				.user_id}/`;
		fetch(url)
			.then((response) => response.json())
			.then((data) =>
				this.setState({
					boardList    : data, // list but is only 1 board so .map and stuff didnt work
					needGetBoard : false,
				}),
			)
			.catch((error) => console.log('error getting board', error));
	}

	createBoard() {
		var id = this.state.user_id;
		var csrftoken = this.getCookie('csrftoken');
		var url = 'http://back-notebook-env.eba-am2s9iym.us-east-1.elasticbeanstalk.com/create-board/';
		fetch(url, {
			method  : 'POST',
			headers : { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
			body    : JSON.stringify({ owner: id }),
		})
			.then((response) => response.json())
			.then((data) =>
				this.setState({
					needGetBoard : true,
				}),
			)
			.catch((error) => console.log('error creating board', error));
	}

	render_Display() {
		if (this.state.display === 'home') {
			if ((this.state.boardList !== null) & this.state.logged_in) {
				console.log(this.state.boardList);
				return (
					<div>
						<Board board_id={this.state.boardList.id} owner_id={this.state.boardList.owner} />
					</div>
				);
			} else if (this.state.logged_in && this.state.boardList === null) {
				return (
					<div class="car-body p-2">
						<h5 class="title text-xl-center font-weight-bold p-2">Logged in as - {this.state.username}</h5>
						<h3 class="title text-xl-center font-weight-bold p-2">You don't have a board yet</h3>
						<div class="bottom-container text-center">
							<div class="btn" onClick={() => this.createBoard()}>
								Click here to create your notebook
							</div>
						</div>
					</div>
				);
			} else {
				return (
					<div class="car-body p-4">
						<div class="loginContainer bg-dark">
							<h5>WELCOME!</h5>
							<h2>Please login or register to continue</h2>
							<div class="bottom-container text-center">
								<div class="btn" onClick={() => this.set_display('login')}>
									Go to login/register
								</div>
							</div>
						</div>
					</div>
				);
			}
		}
		if (this.state.display === 'login') {
			return (
				<div>
					<div class="card-body p-4">
						<h5 class="title text-xl-center font-weight-bold p-2">Login in</h5>
						<div class="loginContainer bg-dark">
							<form onSubmit={this.handleLogin} id="form">
								<input type="username" name="username" placeholder="Username" required />
								<input type="password" name="password" placeholder="Password" required />
								<input id="submit" type="submit" value="Login" className="btn" />
								<div class="bottom-container text-center">
									<div onClick={() => this.set_display('register')} class="btn">
										Register
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			);
		}
		if (this.state.display === 'register') {
			return (
				<div>
					<div class="car-body p-4">
						<h5 class="title text-xl-center font-weight-bold p-2">Register</h5>
						<div class="loginContainer bg-dark">
							<form onSubmit={this.handleRegister} id="form">
								<div className="input-container">
									<input type="username" name="username" placeholder="Username" required />
									<input type="password" name="password" placeholder="Password" required />
									<input id="submit" type="submit" value="register" class="btn" />
								</div>
							</form>
						</div>
					</div>
				</div>
			);
		}
		if (this.state.display === 'login_success') {
			return (
				<div>
					<div class="car-body p-4">
						<div class="loginContainer bg-dark">
							<h5 class="title text-xl-center font-weight-bold p-2">Successfully Logged in</h5>
							<div class="bottom-container text-center">
								<div class="btn" onClick={() => this.set_display('home')}>
									Go to Home
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
		if (this.state.display === 'reg_success') {
			return (
				<div>
					<div class="car-body p-4">
						<h5 class="title text-xl-center font-weight-bold p-2">Successfully registered</h5>
						<h5 class="title text-xl-center font-weight p-2">Please login to continue</h5>
						<div class="bottom-container text-center">
							<div class="btn" onClick={() => this.set_display('login')}>
								Go Login
							</div>
						</div>
					</div>
				</div>
			);
		}
	}

	render() {
		this.getBoard();
		return (
			<div>
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top navbar-collapse mb-5 shadow">
					<div className="container">
						<div class="navbar-brand">Notebook </div>
						<button
							class="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarResponsive"
							aria-controls="navbarResponsive"
							aria-expanded="false"
							aria-label="Toggle navigation">
							<span class="navbar-toggler-icon" />
						</button>
						<div class="navbar-brand ml-auto"> {this.state.username}</div>
						<button
							class="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarResponsive"
							aria-controls="navbarResponsive"
							aria-expanded="false"
							aria-label="Toggle navigation">
							<span class="navbar-toggler-icon" />
						</button>
						<div class="collapse navbar-collapse" id="navbarResponsive">
							<ul class="navbar-nav ml-auto">
								<li class="nav-item ">
									<a class="nav-link" href="#" onClick={() => this.set_display('home')}>
										HOME
									</a>
								</li>
								<li class="nav-item">{this.login_logout()}</li>
							</ul>
						</div>
					</div>
				</nav>
				{this.render_Display()}
			</div>
		);
	}
}

export default App;
