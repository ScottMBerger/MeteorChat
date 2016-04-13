

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
//import '../components/accounts-config.js';
import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
import App from '../components/App.jsx';
 
Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});