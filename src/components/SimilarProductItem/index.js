// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProductDetail} = props
  const {imageUrl, title, price, brand, rating} = eachProductDetail

  return (
    <li className="similar-card">
      <div className="image-align">
        <img
          className="similar-image"
          src={imageUrl}
          alt={`similar product ${title}`}
        />
      </div>
      <h1 className="similar-head">{title}</h1>
      <p className="brand-name">{brand}</p>
      <div className="price-rating-container">
        <p className="price">{`Rs${price}/-`}</p>
        <div className="rating-container">
          <p className="rating-text">{rating}</p>
          <img
            className="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
