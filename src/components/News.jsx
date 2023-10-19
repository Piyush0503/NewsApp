import React, { Component } from "react";
import Newsitem from "./Newsitem";
import Spinner from "./Spinning";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    // ("this is the constructor from News Component");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
    document.title = `${this.props.category}-News App`;
  }

  async updatePage() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pagesize=${this.props.pagesize}`;
    this.setState({ loading: true });
    this.props.setProgress(30);
    let data = await fetch(url);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updatePage();
  }

  /* handelPrevClick = async () => {
        this.setState({ page: this.state.page - 1 });
        this.updatePage();
    }
    handelNextClick = async () => {
        this.setState({ page: this.state.page + 1 });
        this.updatePage();
    } <==used for prev and next function*/

  fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${
      this.props.country
    }&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${
      this.state.page + 1
    }&pagesize=${this.props.pagesize}`;
    this.setState({ page: this.state.page + 1 });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
    });
  };

  render() {
    return (
      <>
        <h2
          className="text-center"
          style={{ margin: "35px 0px", marginTop: "90px" }}
        >
          News - Top Headlines
        </h2>
        {/* this.state.loading && <Spinner /> /* used for spinner */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length <= this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {
                /* !this.state.loading && used for spinner*/ this.state.articles.map(
                  (element) => {
                    return (
                      <div className="col-md-3" key={element.url}>
                        <Newsitem
                          title={
                            element.title ? element.title.slice(0, 35) : ""
                          }
                          description={
                            element.description
                              ? element.description.slice(0, 88)
                              : "tap for more"
                          }
                          imageUrl={element.urlToImage}
                          newsUrl={element.url}
                          author={element.author}
                          date={element.publishedAt}
                          source={element.source.name}
                        />
                      </div>
                    );
                  }
                )
              }
            </div>
          </div>
        </InfiniteScroll>

        {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handelPrevClick}>&laquo; previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / 20)} type="button" className="btn btn-dark" onClick={this.handelNextClick}>next &raquo;</button>
                </div> <== used for prev and next */}
      </>
    );
  }
}
