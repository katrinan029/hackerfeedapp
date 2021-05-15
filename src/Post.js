import React from 'react'
import {FaRegBookmark, FaBookmark} from 'react-icons/fa'

class Post extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      bookmarked: false,
    }

    this.handleBookmark = this.handleBookmark.bind(this);
  }

  handleBookmark() {
    this.setState({
      bookmarked: !this.state.bookmarked,
    })
  }

  renderComments() {
    const { post } = this.props;
    
    if (post.comments && post.comments.length) {
      return post.comments
        .map(comment => (
          <p>{comment?.text}</p>
        ))
    }

    return null
  }

  render() {
    return (
      <div className="post-container">
        <p className="post-title">
          <a href={this.props.post?.url} target="_blank" rel="noreferrer">{`${this.props.post?.title}`}</a>
        </p>
        <p key={this.props.post?.id}> <a href={`https://news.ycombinator.com/user?id=${this.props.post?.by}`} target="_blank" rel="noreferrer">{`by ${this.props.post?.by}`}</a> {` ${new Date(this.props.post?.time * 1000).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric'})}`} &nbsp;{`${this.props.post?.descendants > 0 ? this.props.post?.descendants : 0} comments`} &nbsp; 
        {!this.state.bookmarked ? 
          <FaRegBookmark style={{ cursor: 'pointer' }} onClick={this.handleBookmark}/> :
          <FaBookmark style={{ cursor: 'pointer' }} onClick={this.handleBookmark}/>}
        </p>
        {this.renderComments()}
      </div>
    )
  }

}

export default Post
