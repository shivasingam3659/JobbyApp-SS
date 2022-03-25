import {Link} from 'react-router-dom'
import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobsListsRoute = props => {
  const {jobsData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobsData
  return (
    <Link className="jobs-link-item" to={`/jobs/${id}`}>
      <li className="job-lists-container">
        <div className="job-company-row">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <p>
              <BsFillStarFill className="rating-color" /> {rating}
            </p>
          </div>
        </div>
        <div className="job-details-address">
          <div className="job-company-row">
            <p className="job-lists-address">
              <MdLocationOn className="icons" /> {location}
            </p>
            <p className="job-lists-address">
              <BsBriefcaseFill className="icons" /> {employmentType}
            </p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <div>
          <hr className="hr-line" />
        </div>
        <h1 className="job-title">Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobsListsRoute
