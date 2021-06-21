import React from 'react'
import Header from './Header'
import NewPosts from './NewPosts'
import { BrowserRouter, Route, Switch } from 'react-router-dom';


class App extends React.Component {
  constructor() {
    super()

    // initialize bookmarks in local storage if first time running
    // or local storage was cleared
    if (!window.localStorage.getItem('bookmarks')) {
      window.localStorage.setItem('bookmarks', JSON.stringify([]));
    }

    // initialize seen posts in local storage if first time running
    // or local storage was cleared
    if (!window.localStorage.getItem('seenPosts')) {
      window.localStorage.setItem('seenPosts', JSON.stringify([]))
    }
  }

  render () {
    return (
      <BrowserRouter>
        <Header />
        <Switch>
           <Route path="/">
             <div>
               <NewPosts />
             </div>
           </Route>
        </Switch>
      </BrowserRouter> 
    )
  }
}

export default App
