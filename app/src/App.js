import React from 'react';
import logo from './logo.svg';

import MainText from './components/MainText';
import Annotation from './components/Annotation';

import './App.css';
import './components/textbody.css';

function App() {
  return (
    <div>
      <MainText></MainText>
      <Annotation></Annotation>
    </div>
  );
}

export default App;
