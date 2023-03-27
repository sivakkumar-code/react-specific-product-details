import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiProductDetailsStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    heroProduct: {},
    heroProductCount: 1,
    whatToDisplay: apiProductDetailsStatus.loading,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  incrementCount = () => {
    const {heroProductCount} = this.state

    if (heroProductCount > 0) {
      this.setState(prevState => ({
        heroProductCount: prevState.heroProductCount + 1,
      }))
    }
  }

  decrementCount = () => {
    const {heroProductCount} = this.state

    if (heroProductCount > 1) {
      this.setState(prevState => ({
        heroProductCount: prevState.heroProductCount - 1,
      }))
    }
  }

  redirectToProductSection = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getProductDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id: prodId} = params
    const url = `https://apis.ccbp.in/products/${prodId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response)
    const responseData = await response.json()
    if (response.ok === true) {
      console.log(responseData)
      const updatedData = {
        id: responseData.id,
        imageUrl: responseData.image_url,
        title: responseData.title,
        brand: responseData.brand,
        totalReviews: responseData.total_reviews,
        rating: responseData.rating,
        availability: responseData.availability,
        similarProducts: responseData.similar_products,
        price: responseData.price,
        description: responseData.description,
      }
      this.setState({
        heroProduct: updatedData,
        whatToDisplay: apiProductDetailsStatus.success,
      })
    } else {
      this.setState({whatToDisplay: apiProductDetailsStatus.failure})
    }
  }

  fetchSuccess = () => {
    const {heroProduct, heroProductCount} = this.state
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
      similarProducts,
    } = heroProduct

    return (
      <>
        <div className="hero-product-details-container">
          <img src={imageUrl} alt="product" className="hero-product-image" />
          <div className="hero-product-typo-details">
            <h1 className="hero-product-heading">{title}</h1>
            <p className="hero-product-price">Rs {price} /-</p>
            <ul className="hero-product-rating-and-review-container">
              <li className="hero-product-rating">
                <p className="rating-num">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="rating-star-icon"
                />
              </li>
              <li className="hero-product-review">
                <p className="num-of-reviews">{totalReviews} Reviews</p>
              </li>
            </ul>
            <p className="hero-product-description">{description}</p>
            <p className="hero-product-availability">
              Available: {availability}
            </p>
            <p className="hero-product-brand-name">Brand: {brand}</p>
            <div className="count-container">
              <button
                className="inc-dec-btn-con"
                type="button"
                data-testid="minus"
                onClick={this.decrementCount}
              >
                <BsDashSquare className="inc-dec-btn" />
              </button>

              <p className="count-hero-product">{heroProductCount}</p>
              <button
                className="inc-dec-btn-con"
                type="button"
                data-testid="plus"
                onClick={this.incrementCount}
              >
                <BsPlusSquare className="inc-dec-btn" />
              </button>
            </div>
            <button className="add-to-cart-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1>Similar Products</h1>
          <ul className="similar-products-lists-container">
            {similarProducts.map(item => {
              const obj = {
                title: item.title,
                price: item.price,
                imageUrl: item.image_url,
                rating: item.rating,
                brand: item.brand,
              }
              return <SimilarProductItem key={item.id} object={obj} />
            })}
          </ul>
        </div>
      </>
    )
  }

  fetchFailure = () => (
    <>
      <div className="not-found-image-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="product-not-found"
        />
      </div>
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping"
        onClick={this.redirectToProductSection}
      >
        Continue Shopping
      </button>
    </>
  )

  loadingPage = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  displayContent = () => {
    const {whatToDisplay} = this.state

    switch (whatToDisplay) {
      case apiProductDetailsStatus.success:
        return this.fetchSuccess()
      case apiProductDetailsStatus.loading:
        return this.loadingPage()
      case apiProductDetailsStatus.failure:
        return this.fetchFailure()
      default:
        return null
    }
  }

  render() {
    const {heroProductCount} = this.state
    console.log(heroProductCount)
    const jwtCookie = Cookies.get('jwt_token')
    if (jwtCookie === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <div className="product-item-details-page">
        <Header />
        <div className="product-item-details-page-main">
          {this.displayContent()}
        </div>
      </div>
    )
  }
}

export default ProductItemDetails
