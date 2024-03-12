// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiCallStatusOptions = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    quantity: 1,
    apiStatus: apiCallStatusOptions.initial,
  }

  componentDidMount() {
    this.getProductDetailsAndSimilarProducts()
  }

  getProductDetailsAndSimilarProducts = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiCallStatusOptions.inProgress})

    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedProductDetails = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      const otherProducts = data.similar_products
      const formattedOtherProducts = otherProducts.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        title: each.title,
        style: each.style,
        price: each.price,
        description: each.description,
        brand: each.brand,
        totalReviews: each.total_reviews,
        rating: each.rating,
        availability: each.availability,
      }))
      this.setState({
        productDetails: formattedProductDetails,
        similarProducts: formattedOtherProducts,
        apiStatus: apiCallStatusOptions.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiCallStatusOptions.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button
          onClick={this.continueShopping}
          type="button"
          className="continue-shopping"
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderSimilarProducts = () => {
    const {similarProducts} = this.state

    return (
      <div className="sim-pro-cont">
        <h1 className="sim-pro-head">Similar Products</h1>
        <ul className="con">
          {similarProducts.map(each => (
            <SimilarProductItem eachProductDetail={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  decreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  increaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetails = () => {
    const {productDetails, quantity} = this.state

    return (
      <div>
        <Header />
        <div className="product-item-details-main-container">
          <div className="image-details-container">
            <img
              className="product-image"
              src={productDetails.imageUrl}
              alt="product"
            />
            <div className="details-container">
              <h1 className="product-head">{productDetails.title}</h1>
              <p className="product-price">{`Rs ${productDetails.price}/-`}</p>
              <div className="rating-reviews-container">
                <div className="ratings-container">
                  <p className="rating">{productDetails.rating}</p>
                  <img
                    className="star"
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                  />
                </div>
                <p className="reviews">{`${productDetails.totalReviews}Reviews`}</p>
              </div>
              <p className="product-description">
                {productDetails.description}
              </p>
              <p className="product-description">
                <span>Availability: </span>
                {productDetails.availability}
              </p>
              <p className="product-description">
                <span>Brand: </span>
                {productDetails.brand}
              </p>
              <hr />
              <div className="plus-minus-container">
                <button
                  onClick={this.decreaseQuantity}
                  className="minus-plus-button"
                  type="button"
                  data-testid="minus"
                >
                  <BsDashSquare className="minus-plus-image" />
                </button>
                <p className="quantity">{quantity}</p>
                <button
                  onClick={this.increaseQuantity}
                  className="minus-plus-button"
                  type="button"
                  data-testid="plus"
                >
                  <BsPlusSquare className="minus-plus-image" />
                </button>
              </div>
              <button className="add-to-cart-button" type="button">
                Add To Cart
              </button>
            </div>
          </div>

          {this.renderSimilarProducts()}
        </div>
      </div>
    )
  }

  renderOutput = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiCallStatusOptions.inProgress:
        return this.renderLoader()
      case apiCallStatusOptions.success:
        return this.renderProductDetails()
      case apiCallStatusOptions.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderOutput()}</>
  }
}

export default ProductItemDetails
