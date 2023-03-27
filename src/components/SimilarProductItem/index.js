import './index.css'

const SimilarProductItem = props => {
  const {object} = props
  const {title, price, rating, brand, imageUrl} = object

  return (
    <li className="similar-product-card">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <div className="similar-product-typo">
        <p className="similar-product-title">{title}</p>
        <p className="similar-product-brand">by {brand}</p>
        <div className="price-and-rating-container">
          <p className="similar-product-price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="similar-product-rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="similar-rating-star-icon"
            />
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
