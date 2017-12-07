// SurveyNew shows SurveyForm and SurveyFormReview
import React, { Component } from 'react';
import { reduxForm } from 'redux-form'; // Clears out form except on next/back
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component {
  // constructor(props) {
  //   super(props)
  //
  //   this.state = { showFormReview: false };
  // }
  state = { showFormReview: false };

  renderContent() {
    // If true
    if (this.state.showFormReview) {
      return (
        <SurveyFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }
    // else
    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return (
      <div>
        {/* <SurveyForm /> */}
        {this.renderContent()}
      </div>
    );
  }
}

// Clears out form except on next/back
// If SurveyNew is unmounted, clear all the forms. This is the default behavior of redux-form
export default reduxForm({
  form: 'surveyForm'
})(SurveyNew);
