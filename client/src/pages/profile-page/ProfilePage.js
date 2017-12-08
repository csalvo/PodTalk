import React, {Component} from 'react';
import CommentCard from "../../components/comment-card/CommentCard";
import Header from './../../components/partials/header/Header';
import {Link} from "react-router-dom";
import List from "../../components/list/List";
import './ProfilePage.css';
import FullSearchBar from "../../components/search-bar/FullSearchBar";
import API from "./../../utils/API";
import PodcastThumbnail from "../../components/podcast-thumbnail/PodcastThumbnail";


// user profile page == all the comments they made
class ProfilePage extends Component {
  state = {
    user_podcasts: [],
    user_comments: [],
    user_data: {}
  };

  componentWillMount() {
    API.getUserData().then(res =>
      this.setState({
        user_data: res.data.data
      }, () => this.getUserStuff())
      )
     .catch(err => console.log(err));
  }

  getUserStuff = () => {
    if (this.state.user_data){
    API.getUserComments(this.state.user_data.id).then(res =>
      this.setState({
        user_comments: res.data
      })
    )
      .catch(err => console.log(err));

    API.getUserPodcasts(this.state.user_data.id).then(res =>
      this.setState({
        user_podcasts: res.data
      })
    )
      .catch(err => console.log(err)); 
    }
  }

  logout(){
    API.logout().then(
      this.setState({
        user_data: {}
      })
    );
  }

  convertTimestamp = (number) => {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var date = new Date(number);
    var temp = monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    return temp;
  }

  convertCommentTimestamp = (string) => {
    var now = Date.now();
    var then = Date.parse(string);
    var diff = Math.abs(now - then);
    var seconds = Math.floor(diff / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);

    if(hours > 24){
      return ("posted on " + this.convertTimestamp(then));
    }

    else if(hours < 24){
      if(hours < 1){
        if(minutes < 1){
          return ("posted a few seconds ago...");
        } 

        else {
          return ("posted " + minutes + " minutes ago...");
        }
      }

      else {
        return ("posted " + hours + " hours ago...");
      }
    }
  }

  render() {
    return (
      <div className="home-wrapper">
        <Header>
          <FullSearchBar placeholder="Find a podcast" label={<i className="fa fa-search" aria-hidden="true"></i>}/>
          {this.state.user_data ? (
          <Link to="/" onClick={this.logout}>Log Out</Link>
          ) : (
            <div className="links">
              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Log In</Link>
            </div>
          )}
        </Header>
        <div className="home-main">
          <div className="sidebar">
            <h1>Your Podcasts</h1>
            {this.state.user_podcasts.length == 0 ? (
              <div>
                <h3><em>No podcasts to display.</em></h3>
              </div>
            ) : (
              <div>
                <List>
                  {this.state.user_podcasts.map((podcast, index) => {
                    return (
                      <PodcastThumbnail
                        key={index}
                        image={podcast.imageUrl}
                        podcast_title={podcast.podcastName}
                      />
                    );
                  })}
                </List>
              </div>
            )}
          </div>
          <div className="feed">
            <h1>Latest Comments:</h1>
              {this.state.user_comments.length == 0 ? (
                <div>
                  <h3><em>No comments to display.</em></h3>
                </div>
              ) : (
              <div>
                <List>
                  {this.state.user_comments.map((comment, index) => {
                    return (
                      <CommentCard
                        key={index}
                        comment_timestamp={comment.createdAt}
                        message={comment.comment}
                        username={comment.username}
                        podcast_title={comment.podcastName}
                        episode_title={comment.podcastEpisodeName}
                        convertCommentTimestamp={this.convertCommentTimestamp}
                      />
                    );
                  })}
                </List>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
}

export default ProfilePage;