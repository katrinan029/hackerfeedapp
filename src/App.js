import React from 'react'
import Header from './Header'
import Post from './Post'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      allPosts: [],
      posts: [],
      comments: [],
      items: 30,
      loading: false,
    }

    fetch("https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty")
      .then(res => res.json())
      .then(json => {
        const initialPosts = json.slice(0,30);   
        const fetchedPosts = initialPosts.map(id => this.getPost(id));

        Promise.all(fetchedPosts).then(posts => {
          console.log(posts);

          this.setState({
            allPosts: json,
            posts,
            loading: true,
          });
        })
      });
  }

  componentDidMount() {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    };

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );

    this.observer.observe(this.loadingRef);
  }

  handleObserver(entities, observer) {
    console.log('observed!')

    if (this.state.posts.length) {

      const next30Posts = this.state.allPosts
        .slice(this.state.items, this.state.items + 30)
        .map(id => this.getPost(id))
        
      Promise.all(next30Posts)
        .then(posts => {
          console.log(posts);

          this.setState({
            posts: [...this.state.posts, ...posts],
            items: this.state.items + 30,
          })
        })
    }
  }

  getPost(id) {
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
      .then(res => res.json())
      .then(json => {
        const maybeComments = json.kids;

        if (maybeComments && maybeComments.length) {
          const maybeCommentPromises = maybeComments.map(commentId => {
            return fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json?print=pretty`)
              .then(res => res.json());
          })

          return Promise.all(maybeCommentPromises)
            .then(comments => {
              return Promise.resolve({
                ...json,
                comments,
              });
            });
        }

        return Promise.resolve(json);
      });
  }
  
  renderPosts(posts) {
    return posts.map(post => (
      <Post post={post}/>
    ))
  }

  render () {
    return (
      <div>
        <Header />
        {!this.state.loading ? <p>loading...</p> : this.renderPosts(this.state.posts)}
        <div 
          id="load-more"
          ref={loadingRef => (this.loadingRef = loadingRef)}
        >          
        </div>
      </div>
    )
  }
}

export default App
