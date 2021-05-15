import React from 'react'
import {FaRegBookmark, FaBookmark} from 'react-icons/fa'

class Post extends React.Component {
  constructor(props){
    super(props)

    const bookmarks = JSON.parse(
      window.localStorage.getItem('bookmarks')
    );

    this.state = {
      bookmarked: bookmarks.includes(this.props.post?.id),
      comments: [],
      fetchingComments: false,
      hideComments: true,
    }

    this.handleBookmark = this.handleBookmark.bind(this);
    this.fetchComments = this.fetchComments.bind(this);
    this.hideComments = this.hideComments.bind(this);
  }

  fetchComments() {
    this.setState({
      fetchingComments: true,
    }, () => {
      const fetchedComments = this.props.post.kids.map(commentId => {
        return fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json?print=pretty`)
          .then(response => response.json())
      })
  
      Promise.all(fetchedComments).then(comments => {
        this.setState({
          comments,
          hideComments: false,
        })
      })
    })
  }

  handleBookmark() {
    this.setState({
      bookmarked: !this.state.bookmarked,
    }, () => {

      // parse local storage bookmarks
      const bookmarks = JSON.parse(window.localStorage.getItem('bookmarks'));

      // check if post id is already in bookmarks
      if (bookmarks.includes(this.props.post.id)) {
        // if bookmark is in we want to remove it
        const filtered = bookmarks.filter(bookmark => bookmark !== this.props.post.id)
        window.localStorage.setItem('bookmarks', JSON.stringify(filtered))

      } else {
        // add the bookmark to the bookmarked items
        bookmarks.push(this.props.post.id);
        window.localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
      }
    })
  }

  renderComments() {
    if(this.state.comments.length) {
      return this.state.comments.map(comment => {
        return (
          <div 
            className="comment"
            style={this.state.hideComments ? 
              { display: 'none'} : 
              { display: 'block'}
            }
          >
            <a 
              href={`https://news.ycombinator.com/user?id=${comment.by}`}
              target="_blank" 
              rel="noreferrer"
              >
              {`by ${comment.by}`}
            </a>
            <p>{comment?.text}</p>
          </div>
        )
      })
    }

    return null
  }

  hideComments() {
    this.setState({
      hideComments: !this.state.hideComments,
    })
  }
  
  render() {
    return (
      <li className="post-container">
        <p className="post-title">
          {this.props.post.url ? 
          <a href={this.props.post?.url} target="_blank" rel="noreferrer">{`${this.props.post?.title} `} &nbsp;</a> : 
          <a href={`https://news.ycombinator.com/item?${this.props.post.id}`} target="_blank" rel="noreferrer">{`${this.props.post?.title} `} &nbsp;</a> }
          {!this.state.bookmarked ? 
            <FaRegBookmark style={{ cursor: 'pointer' }} onClick={this.handleBookmark}/> :
            <FaBookmark style={{ cursor: 'pointer' }} onClick={this.handleBookmark}/>}
        </p>
        
        <p key={this.props.post?.id}>
          <a 
            href={`https://news.ycombinator.com/user?id=${this.props.post?.by}`}
            target="_blank" 
            rel="noreferrer"
          >
            {`by ${this.props.post?.by}`}
          </a>
          <span>
            {` ${new Date(this.props.post?.time * 1000).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric'})}`} &nbsp;
            {this.props.post?.kids?.length ?
              (
                !this.state.comments.length ?
                <button
                  onClick={this.fetchComments}
                  disabled={this.state.fetchingComments}
                >
                  {this.props.post.kids.length} comments
                </button> :
                <span> {this.props.post.kids.length} comments</span>
              ) :
              <span>0 comments</span>
            }

            {this.renderComments()} 
              &nbsp;
          </span>
            
          </p>
          {this.state.comments.length ? 
            <button onClick={this.hideComments}>
              {this.state.hideComments ?
                'show comments' :
                'hide comments'
              }
            </button> : 
            null
          }
      </li>
    )
  }

}

export default Post
