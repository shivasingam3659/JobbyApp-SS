import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const apiProfileStatusData = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProfileDetails extends Component {
  state = {profileData: '', apiProfileStatus: apiProfileStatusData.initial}

  componentDidMount = () => {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({apiProfileStatus: apiProfileStatusData.loading})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const profileResponse = await fetch(url, options)
    if (profileResponse.ok === true) {
      const profileData = await profileResponse.json()
      const formattedProfile = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileData: formattedProfile,
        apiProfileStatus: apiProfileStatusData.success,
      })
    } else {
      this.setState({apiProfileStatus: apiProfileStatusData.failure})
    }
  }

  onProfileFailureRetry = () => {
    this.getProfile()
  }

  onProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} className="profile-image" alt="profile" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  onProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        onClick={this.onProfileFailureRetry}
        type="button"
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  onProfileLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onProfilesRenderView = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiProfileStatusData.success:
        return this.onProfileSuccessView()
      case apiProfileStatusData.failure:
        return this.onProfileFailureView()
      case apiProfileStatusData.loading:
        return this.onProfileLoadingView()
      default:
        return null
    }
  }

  render() {
    return this.onProfilesRenderView()
  }
}

export default ProfileDetails
