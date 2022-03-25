import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', isError: false, errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({isError: true, errorMsg: errMsg})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const loginData = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(loginData.jwt_token)
    } else {
      this.onSubmitFailure(loginData.error_msg)
    }
  }

  render() {
    const {username, password, isError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.onSubmitLoginForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-image"
          />
          <label className="label-text" htmlFor="name">
            USERNAME
          </label>
          <input
            onChange={this.onChangeUsername}
            className="input-text"
            type="text"
            placeholder="Username"
            id="name"
            value={username}
          />
          <label className="label-text" htmlFor="password">
            PASSWORD
          </label>
          <input
            onChange={this.onChangePassword}
            className="input-text"
            type="password"
            placeholder="Password"
            id="password"
            value={password}
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {isError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
