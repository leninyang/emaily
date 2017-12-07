// SurveyField contains logic to render a single label and text input
import React from 'react';

export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      {/* Object with all the keys and values that in it */}
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }} />
      {/* Boolean statement - If touched and theres an error */}
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};
