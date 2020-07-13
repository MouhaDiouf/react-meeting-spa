import React, { Component } from 'react';
import firebase from './Firebase';
export default class Meetings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingName: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState({ [itemName]: itemValue });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.addMeething(this.state.meetingName);
    this.setState({ meetingName: '' });
  }
  render() {
    return (
      <div className="text-center mt-3">
        <h1 className="text-primary">Meetings</h1>
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1 className="font-weight-light">Add a Meeting</h1>
              <div className="card bg-light">
                <div className="card-body text-center">
                  <form className="formgroup" onSubmit={this.handleSubmit}>
                    <div className="input-group input-group-lg">
                      <input
                        type="text"
                        className="form-control"
                        name="meetingName"
                        placeholder="Meeting name"
                        aria-describedby="buttonAdd"
                        value={this.state.meetingName}
                        onChange={this.handleChange}
                      />
                      <div className="input-group-append">
                        <button
                          type="submit"
                          className="btn btn-sm btn-info"
                          id="buttonAdd"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
