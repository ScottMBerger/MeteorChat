import React, { Component, PropTypes } from 'react';
import { Mongo } from 'meteor/mongo';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import AccountsUIWrapper from './Accounts.jsx';
import { Meteor } from 'meteor/meteor';

export const Tasks = new Mongo.Collection('tasks');
export default class Task extends Component {

  render() {
    return (
      <li>
        <span className="text">
          <strong>{this.props.task.username ? this.props.task.username : "Anon"}</strong>: {this.props.task.text}
        </span></li>
    );
  }
}
 
Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
};

export default class App extends React.Component {
  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }
  componentDidMount(){
    var node = ReactDOM.findDOMNode(this.refs.chat);
    node.scrollTop = node.scrollHeight + 600;    
  }
  componentWillUpdate() {
    var node = ReactDOM.findDOMNode(this.refs.chat);
    console.log(node.scrollTop);
    console.log(node.scrollHeight);
    this.shouldScrollBottom = node.scrollHeight - node.scrollTop < 650;
  }
 

  componentDidUpdate() {
    if (this.shouldScrollBottom) {

      var node = ReactDOM.findDOMNode(this.refs.chat);
      node.scrollTop = node.scrollHeight;
    }

  }
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    var name = Meteor.user() ? Meteor.user().username : "Anon";
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: name,  // username of logged in user
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  
  render() {

    return (
      <div className="container">
        <header>
          <h1>CHAT</h1> <AccountsUIWrapper />
        </header>
        
        <div className="chat" ref="chat">
          <ul>
            {this.renderTasks()}
          </ul>
        </div>
        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input type="text" ref="textInput"/>
        </form>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  return {
    tasks: Tasks.find({}).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
