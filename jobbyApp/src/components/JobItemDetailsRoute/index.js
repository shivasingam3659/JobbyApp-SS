import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {GrShare} from 'react-icons/gr'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarListRoute from '../SimilarListRoute'
import './index.css'

const apiJobItemDetailsStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobItemDetailsRoute extends Component {
  state = {
    jobDetailsData: '',
    similarJobs: [],
    skillsList: [],
    companyLife: '',
    apiJobItemStatus: apiJobItemDetailsStatus.initial,
  }

  componentDidMount = () => {
    this.getJobDetails()
  }

  onRetryJobItemDetailsFailure = () => {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiJobItemStatus: apiJobItemDetailsStatus.loading})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const detailResponse = await fetch(url, options)

    if (detailResponse.ok === true) {
      const jobDetailsResponse = await detailResponse.json()
      const formattedJobDetails = {
        companyLogoUrl: jobDetailsResponse.job_details.company_logo_url,
        companyWebsiteUrl: jobDetailsResponse.job_details.company_website_url,
        employmentType: jobDetailsResponse.job_details.employment_type,
        id: jobDetailsResponse.job_details.id,
        jobDescription: jobDetailsResponse.job_details.job_description,
        location: jobDetailsResponse.job_details.location,
        packagePerAnnum: jobDetailsResponse.job_details.package_per_annum,
        rating: jobDetailsResponse.job_details.rating,
        title: jobDetailsResponse.job_details.title,
      }
      const formattedCompanyLife = {
        description: jobDetailsResponse.job_details.life_at_company.description,
        imageUrl: jobDetailsResponse.job_details.life_at_company.image_url,
      }

      const formattedSkillsList = jobDetailsResponse.job_details.skills.map(
        eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        }),
      )

      const formattedSimilarList = jobDetailsResponse.similar_jobs.map(
        eachSimilar => ({
          companyLogoUrl: eachSimilar.company_logo_url,
          employmentType: eachSimilar.employment_type,
          id: eachSimilar.id,
          jobDescription: eachSimilar.job_description,
          location: eachSimilar.location,
          rating: eachSimilar.rating,
          title: eachSimilar.title,
        }),
      )

      this.setState({
        jobDetailsData: formattedJobDetails,
        similarJobs: formattedSimilarList,
        skillsList: formattedSkillsList,
        companyLife: formattedCompanyLife,
        apiJobItemStatus: apiJobItemDetailsStatus.success,
      })
    } else {
      this.setState({apiJobItemStatus: apiJobItemDetailsStatus.failure})
    }
  }

  onJobDetailsFailureView = () => (
    <div className="job-item-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something went wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        onClick={this.onRetryJobItemDetailsFailure}
        type="button"
        className="failure-retry-button"
      >
        Retry
      </button>
    </div>
  )

  onJobDetailsLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onJobDetailsSuccessView = () => {
    const {jobDetailsData, skillsList, companyLife, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
    } = jobDetailsData
    const {description, imageUrl} = companyLife
    return (
      <>
        <div className="job-details-success-container">
          <div className="job-details-row-container">
            <img
              className="job-detail-company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div>
              <h1 className="job-details-heading">{title}</h1>
              <p className="job-details-rating">
                <BsFillStarFill className="rating-star-icon" /> {rating}
              </p>
            </div>
          </div>
          <div className="job-detail-address-section">
            <div className="job-details-row-container">
              <p className="address-section-container">
                <MdLocationOn className="address-icons" /> {location}
              </p>
              <p className="address-section-container">
                <BsBriefcaseFill className="address-icons" /> {employmentType}
              </p>
            </div>
            <p className="salary-container">{packagePerAnnum}</p>
          </div>
          <div>
            <hr className="line" />
          </div>
          <div className="job-detail-address-section">
            <h1 className="job-details-heading">Description</h1>
            <button type="button" className="visit-button">
              <a
                className="anchor-section"
                href={companyWebsiteUrl}
                target="__blank"
              >
                Visit <GrShare className="visit-icon" />
              </a>
            </button>
          </div>
          <p>{jobDescription}</p>
          <h1 className="job-details-heading">Skills</h1>
          <ul className="skills-ul-container">
            {skillsList.map(eachSkillItem => (
              <li key={eachSkillItem.name} className="skills-list-container">
                <img
                  className="skills-logo"
                  src={eachSkillItem.imageUrl}
                  alt={eachSkillItem.name}
                />
                <p className="skills-title">{eachSkillItem.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="job-details-heading">Life at Company</h1>
          <div className="job-details-row-container">
            <p className="company-life-description">{description}</p>
            <img
              className="company-life-image"
              src={imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-job-details-heading">Similar Jobs</h1>
        <ul className="similar-jobs-ul-container">
          {similarJobs.map(eachSimilarJob => (
            <SimilarListRoute
              key={eachSimilarJob.id}
              eachSimilarJobData={eachSimilarJob}
            />
          ))}
        </ul>
      </>
    )
  }

  onJobItemDetailsRenderView = () => {
    const {apiJobItemStatus} = this.state
    switch (apiJobItemStatus) {
      case apiJobItemDetailsStatus.success:
        return this.onJobDetailsSuccessView()
      case apiJobItemDetailsStatus.failure:
        return this.onJobDetailsFailureView()
      case apiJobItemDetailsStatus.loading:
        return this.onJobDetailsLoadingView()
      default:
        return null
    }
  }

  render() {
    const {jobDetailsData, similarJobs, skillsList, companyLife} = this.state
    console.log(jobDetailsData, skillsList, similarJobs, companyLife)
    return (
      <div className="job-details-container">
        <Header />
        {this.onJobItemDetailsRenderView()}
      </div>
    )
  }
}

export default JobItemDetailsRoute
