import React from 'react';
import { Router, navigate } from '@reach/router';
import Home from './Home';
import Welcome from './Welcome';
import Navigation from './Navigation';
import firebase from './Firebase';
import Login from './Login';
import Register from './Register';
import Meetings from './Meetings';
import Checkin from './Checkin';
import Attendees from './Attendees';

import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      displayName: null,
      userID: null,
    };
    this.logoutUser = this.logoutUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.addMeeting = this.addMeeting.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((FBUser) => {
      if (FBUser) {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid,
        });
        const meetingsRef = firebase.database().ref(`meetings/${FBUser.uid}`);
        meetingsRef.on('value', (snapshot) => {
          const meetings = snapshot.val();
          const meetingsList = [];

          for (const item in meetings) {
            meetingsList.push({
              meetingID: item,
              meetingName: meetings[item].meetingName,
            });
          }
          this.setState({
            meetings: meetingsList,
            howManyMeetings: meetingsList.length,
          });
        });
      } else {
        this.setState({
          user: null,
        });
      }
    });
  }

  registerUser(userName) {
    firebase.auth().onAuthStateChanged((FBUser) => {
      FBUser.updateProfile({
        displayName: userName,
      }).then(() => {
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid,
        });
        navigate('/meetings');
      });
    });
  }

  logoutUser(e) {
    e.preventDefault();
    this.setState({
      displayName: null,
      userID: null,
      user: null,
    });
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate('/login');
      });
  }

  addMeeting(meetingName) {
    const ref = firebase.database().ref(`meetings/${this.state.user.uid}`);
    ref.push({ meetingName });
  }

  render() {
    return (
      <div>
        <Navigation user={this.state.user} logoutUser={this.logoutUser} />
        {this.state.user && (
          <Welcome
            userName={this.state.displayName}
            logoutUser={this.logoutUser}
          />
        )}
        <Router>
          <Home path="/" user={this.state.user} />
          <Login path="/login" />
          <Meetings
            path="/meetings"
            addMeeting={this.addMeeting}
            meetings={this.state.meetings}
            userID={this.state.userID}
          />
          <Attendees
            path="/attendees/:userID/:meetingID"
            adminUser={this.state.userID}
          />
          <Checkin path="/checkin/:userID/:meetingID" />
          <Register path="/register" registerUser={this.registerUser} />
        </Router>
      </div>
    );
  }
}

export default App;
