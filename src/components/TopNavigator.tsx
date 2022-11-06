import { FunctionComponent } from 'react';

export const TopNavigator: FunctionComponent = () => {
	return (<div className="topnav">
      <a className="navitem active" href="#home">Home</a>
      <a className="navitem" href="#about">About</a>
      <a className="navitem" href="#contact">Contact</a>
      <div className="search-container">
        <input type="text" placeholder="Search.." name="search" />
        <button type="submit"><i className="fa fa-search"></i></button>
      </div>
    </div>);
}