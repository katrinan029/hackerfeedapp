import React from 'react';
import Post from './Post'

class NewPosts extends React.Component {
  constructor() {
    super()
    
    this.state = {
      allPosts: [],
      posts: [],
      comments: [],
      items: 30,
      loading: false,
    };

    fetch("https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty")
      .then(res => res.json())
      .then(json => {
        // display 30 posts at a time
        const initialPosts = json.slice(0,30);   
        const fetchedPosts = initialPosts.map(id => this.getPost(id));

        Promise.all(fetchedPosts).then(posts => {
          this.setState({
            allPosts: json,
            posts,
            loading: true,
          });
        })
      });
  }

  // intersection observer is used for infinite scroll once bottom
  // is reached
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

    const postsOptions = {
      root: document.getElementById('posts-list'),
      rootMargin: "0px",
      threshold: 1.0
    };

     this.observer.observe(this.loadingRef);
  }

  handleObserver() {
    if (this.state.posts.length) {

      const next30Posts = this.state.allPosts
        .slice(this.state.items, this.state.items + 30)
        .map(id => this.getPost(id));
        
      Promise.all(next30Posts)
        .then(posts => {
          this.setState({
            posts: [...this.state.posts, ...posts],
            items: this.state.items + 30,
          })
        });
    }
  }

  getPost(id) {
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
      .then(res => res.json());
  }
  
  renderPosts(posts) {
    return posts.map(post => (
      <Post post={post} observer={this.postObserver}/>
    ));
  }

  render() {
    return(
      <div>
        {!this.state.loading ? <p className="loading">loading...</p> :
          <div>
            <ul id="posts-list">
              {this.renderPosts(this.state.posts)}
            </ul>
          </div>
        }
        <div 
          id="load-more"
          ref={loadingRef => (this.loadingRef = loadingRef)}
        >
        </div>
    </div>
    );
  }
}

export default NewPosts
