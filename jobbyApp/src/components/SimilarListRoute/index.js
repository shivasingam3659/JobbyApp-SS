import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarListRoute = props => {
  const {eachSimilarJobData} = props
  console.log(eachSimilarJobData)
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = eachSimilarJobData
  return (
    <li className="similar-job-container">
      <div className="similar-job-row">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-logo"
        />
        <div>
          <h1 className="similar-job-title">{title}</h1>
          <p className="similar-job-title">
            <BsFillStarFill className="similar-job-rating-icon" /> {rating}
          </p>
        </div>
      </div>
      <h1 className="similar-job-title">Description</h1>
      <p>{jobDescription}</p>
      <div className="similar-job-row">
        <p className="similar-job-address">
          <MdLocationOn className="similar-job-icons" /> {location}
        </p>
        <p className="similar-job-address">
          <BsBriefcaseFill className="similar-job-icons" /> {employmentType}
        </p>
      </div>
    </li>
  )
}

export default SimilarListRoute
