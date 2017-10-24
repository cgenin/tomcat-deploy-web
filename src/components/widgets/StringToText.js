import React from 'react';
import PropTypes from 'prop-types';

const StringToText = (props) => {
  const text = (props.value && props.value.length > 0 ) ? props.value : '';
  const regexp = /([^\n]+)[\r]{0,1}\n/g;
  const txt = [];
  let exec;
  while ((exec = regexp.exec(text)) !== null) {
    console.log(exec[1])
    txt.push((<span>{exec[1]}<br/></span>))
  }
  return (<div>{txt}</div>);
};

StringToText.propTypes = {value: PropTypes.string.isRequired};

export default StringToText;

