import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogoutButton = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="navbar-container">
      <Link to="/">
        <img
          className="logo-image"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="navbar-small-container">
        <Link className="link-item" to="/">
          <li className="navbar-heading">Home</li>
        </Link>
        <Link className="link-item" to="/jobs">
          <li className="navbar-heading">Jobs</li>
        </Link>
      </ul>
      <ul>
        <li className="navbar-heading">
          <button
            onClick={onLogoutButton}
            type="button"
            className="logout-button"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
