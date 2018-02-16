import React from 'react';
import './spinner.css';


export const TimeSpinner = () => {
  return <div className="timer"/>;
};

export const TabSpinner = () => {
  return (
    <div style={{width:'100%', margin: '2em', textAlign:'center'}}>
      <i className="fa fa-spinner fa-spin fa-3x fa-fw" style={{fontSize:'5em'}}/>
    </div>
  );
};

export const TypingloaderSpinner = () => {
  return <div className="typing_loader"/>;
};
