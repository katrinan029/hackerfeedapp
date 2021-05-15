import React from 'react'
import Header from './Header'
import Post from './Post'
import { BrowserRouter, Route, Switch } from 'react-router-dom';


class App extends React.Component {
  constructor() {
    super()

    // initialize bookmarks in local storage if first time running
    // or local storage was cleared
    if (!window.localStorage.getItem('bookmarks')) {
      window.localStorage.setItem('bookmarks', JSON.stringify([]));
    }

    if (!window.localStorage.getItem('seenPosts')) {
      window.localStorage.setItem('seenPosts', JSON.stringify([]))
    }

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

    const postsOptions = {
      root: document.getElementById('posts-list'),
      rootMargin: "0px",
      threshold: 1.0
    };

    this.postObserver = new IntersectionObserver(
      this.handlePostObserver.bind(this),
      postsOptions
    );

     this.observer.observe(this.loadingRef);
  }

  handlePostObserver(entries, observer) {
    console.log(entries);
  }

  handleObserver() {
    if (this.state.posts.length) {

      const next30Posts = this.state.allPosts
        .slice(this.state.items, this.state.items + 30)
        .map(id => this.getPost(id))
        
      Promise.all(next30Posts)
        .then(posts => {
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
  }
  
  renderPosts(posts) {
    return posts.map(post => (
      <Post post={post} observer={this.postObserver}/>
    ))
  }

  render () {
    return (
      <BrowserRouter>
       <Switch>
          <Route path="/seen">
            <h1>Seen Posts</h1>
          </Route>
          <Route path="/">
            <div>
              <Header />
              {!this.state.loading ? <p className="loading">loading...</p> :
                <ul id="posts-list">
                  {this.renderPosts(this.state.posts)}
                </ul>
              }
              <div 
                id="load-more"
                ref={loadingRef => (this.loadingRef = loadingRef)}
              >   
              </div>
            </div>
          </Route>
        </Switch>
      </BrowserRouter> 
    )
  }
}

export default App
