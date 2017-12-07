// SurveyForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form'; // allows communication with redux store || Similar to connect function
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields'; // Array of data

class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      // map takes in FIELD array and returns a new array
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {/* <Field type="text" name="surveytitle" component="input" /> */}
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat left white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}
// Takes a single argument of values - Object containing all the diff values that are coming off of our form. This allows us to inspect each value
function validate(values) {
  const errors = {};

  // if (!values.title) {
  //   errors.title = 'You must provide a title';
  // }

  errors.recipients = validateEmails(values.recipients || '');

  _.each(formFields, ({ name }) => {
    // [] - means on run time
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

// Provides props.handleSubmit || If we pass in a function under the key "validate" - That function will be automatically ran anytime user attempts to submit the form.
export default reduxForm({
  validate: validate,
  form: 'surveyForm',
  destroyOnUnmount: false // If true - Destroy form anytime it's no longer shown on screen
})(SurveyForm);
