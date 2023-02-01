import React from 'react';
import './App.css';

import CodeBlock from './components/CodeBlock/CodeBlock';

function App() {
  return (
    <div className="App">
      <div className='codeBlockContainer'>
        <CodeBlock
          content={"interface IPerson {\n \tname: string \n \tage: number \n }"}
          fileName={'test.tsx'}
        />
      </div>
    </div>
  );
}

export default App;

interface IPerson {
  name: string 
  age: number 
  }
