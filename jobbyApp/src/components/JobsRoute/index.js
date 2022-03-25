import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import JobsListsRoute from '../JobsListsRoute'
import './index.css'

const apiJobsListDataStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobsRoute extends Component {
  state = {
    searchInput: '',
    jobsList: [],
    apiJobListStatus: apiJobsListDataStatus.initial,
    employmentList: [],
    salaryRange: '',
  }

  componentDidMount = () => {
    this.getJobsList()
  }

  getJobsList = async () => {
    this.setState({apiJobListStatus: apiJobsListDataStatus.loading})
    const {employmentList, salaryRange, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentList.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`
    console.log(url)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const jobsDataResponse = await fetch(url, options)
    if (jobsDataResponse.ok === true) {
      const jobsResponseList = await jobsDataResponse.json()

      const formattedJobsList = jobsResponseList.jobs.map(eachJobData => ({
        id: eachJobData.id,
        companyLogoUrl: eachJobData.company_logo_url,
        employmentType: eachJobData.employment_type,
        jobDescription: eachJobData.job_description,
        location: eachJobData.location,
        packagePerAnnum: eachJobData.package_per_annum,
        rating: eachJobData.rating,
        title: eachJobData.title,
      }))
      this.setState({
        jobsList: formattedJobsList,
        apiJobListStatus: apiJobsListDataStatus.success,
      })
    } else {
      this.setState({apiJobListStatus: apiJobsListDataStatus.failure})
    }
  }

  onRetryJobRouteFailure = () => {
    this.getJobsList()
  }

  onJobsListFailureView = () => (
    <div className="jobs-list-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something went wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        onClick={this.onRetryJobRouteFailure}
        type="button"
        className="failure-retry-button"
      >
        Retry
      </button>
    </div>
  )

  onJobsListLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onJobsListRenderView = () => {
    const {apiJobListStatus} = this.state
    switch (apiJobListStatus) {
      case apiJobsListDataStatus.success:
        return this.onJobsListSuccessView()
      case apiJobsListDataStatus.failure:
        return this.onJobsListFailureView()
      case apiJobsListDataStatus.loading:
        return this.onJobsListLoadingView()
      default:
        return null
    }
  }

  onJobsListSuccessView = () => {
    const {jobsList} = this.state
    return jobsList.length === 0 ? (
      <div className="no-jobs-section">
        <img
          className="no-job-image"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    ) : (
      <ul className="employment-container">
        {jobsList.map(eachJobData => (
          <JobsListsRoute key={eachJobData.id} jobsData={eachJobData} />
        ))}
      </ul>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchButton = () => {
    this.getJobsList()
  }

  render() {
    const {searchInput, employmentList} = this.state
    const {employmentTypesList, salaryRangesList} = this.props

    return (
      <div className="jobs-route-container">
        <Header />
        <div className="jobs-display-container">
          <div className="left-column-container">
            <ProfileDetails />
            <div>
              <hr className="line" />
            </div>
            <h1 className="employment-heading">Type of Employment</h1>
            <ul className="employment-container">
              {employmentTypesList.map(eachEmployement => {
                const onCheckBoxElement = () => {
                  const formattedEmployee = [
                    ...employmentList,
                    eachEmployement.employmentTypeId,
                  ]
                  const removeDuplicates = [...new Set(formattedEmployee)]
                  this.setState(
                    {
                      employmentList: removeDuplicates,
                    },
                    this.getJobsList,
                  )
                }
                return (
                  <li
                    onClick={onCheckBoxElement}
                    className="employment-list"
                    key={eachEmployement.employmentTypeId}
                  >
                    <input
                      className="checkbox-element"
                      type="checkbox"
                      id={eachEmployement.label}
                    />
                    <label
                      className="employment-label"
                      htmlFor={eachEmployement.label}
                    >
                      {eachEmployement.label}
                    </label>
                  </li>
                )
              })}
            </ul>
            <div>
              <hr className="line" />
            </div>
            <h1 className="employment-heading">Salary Range</h1>
            <ul className="employment-container">
              {salaryRangesList.map(eachSalary => {
                const onSalaryButton = () => {
                  this.setState(
                    {salaryRange: eachSalary.salaryRangeId},
                    this.getJobsList,
                  )
                }
                return (
                  <li onClick={onSalaryButton} key={eachSalary.salaryRangeId}>
                    <input
                      name="salary"
                      className="checkbox-element"
                      type="radio"
                      id={eachSalary.label}
                    />
                    <label
                      className="employment-label"
                      htmlFor={eachSalary.label}
                    >
                      {eachSalary.label}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="right-column-container">
            <div className="search-items-container">
              <input
                onChange={this.onChangeSearchInput}
                value={searchInput}
                type="search"
                placeholder="Search"
                className="search-container"
              />
              <button
                onClick={this.onSearchButton}
                className="search-button"
                type="button"
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.onJobsListRenderView()}
          </div>
        </div>
      </div>
    )
  }
}

export default JobsRoute
