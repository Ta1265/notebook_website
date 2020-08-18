import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import Board from './components/Board.js'


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			logged_in: false,
			username: null,
			user_id: null,
			display: 'home',
			needGetBoard: false,
			needPropsUpdate: false,
			boardList: null,
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

		var url = 'http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/register/';
		fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
			body: JSON.stringify({ username: username, email: 'none', password: password }),
		})
			.then((response) => response.json())
			.then(() =>
				this.setState({
					logged_in: false,
					username: null,
					user_id: null,
					display: 'reg_success',
					needGetBoard: false,
					needPropsUpdate: false,
					boardList: null,
				}),
			)
			.catch(function (error) {
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
		var url = 'http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/login/';
		fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
			body: JSON.stringify({ username: username, password: password }),
		})
			.then((response) => response.json())
			.then((data) =>
				this.setState({
					username: data.username,
					user_id: data.id,
					logged_in: true,
					display: 'login_success',
					boardList: null,
					needGetBoard: true,
				}),
			)
			.catch(function (error) {
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
			logged_in: false,
			display: 'home',
			username: null,
			user_id: null,
			boardlist: null,
			needGetBoard: false,
		});
	}

	set_display(disp) {
		this.setState({
			display: disp,
		});
	}

	getBoard() {
		if (this.state.needGetBoard)
			var url = `http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/get-board/${this.state.user_id}/`;
		fetch(url)
			.then((response) => response.json())
			.then((data) =>
				this.setState({
					boardList: data, // list but is only 1 board so .map and stuff didnt work
					needGetBoard: false,
				}),
			)
			.catch((error) => console.log('error getting board', error));
	}

	createBoard() {
		var id = this.state.user_id;
		var csrftoken = this.getCookie('csrftoken');
		var url = 'http://back-notebook-env-2.us-east-1.elasticbeanstalk.com/create-board/';
		fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', 'X-CSRFToken': csrftoken },
			body: JSON.stringify({ owner: id }),
		})
			.then((response) => response.json())
			.then((data) =>
				this.setState({
					needGetBoard: true,
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
