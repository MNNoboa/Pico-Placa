import { fireEvent, render, screen } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('renders without crashing', () =>{
  const div = document.createElement('div');
  render(<App />, div);
  unmountComponentAtNode(div);
})

test('renders app and datetime div', () => {
  render(<App />);
  const dateElement = screen.getByText(/date time:/i);
  expect(dateElement).toBeInTheDocument();
});

test('writes on plate number input and checks warning', ()=>{
  render(<App/>);
  fireEvent.change(screen.getByPlaceholderText(/plate numbers/i),{target:{value:'aaaa'}});
  const warningElement = screen.getByText(/please enter a correct plate/i);
  expect(warningElement).toBeInTheDocument();
});

test('writes on date input and checks warning', ()=>{
  render(<App/>);
  fireEvent.change(screen.getByPlaceholderText(/[MM/dd/YYYY]/),{target:{value:'baacs-a'}});
  const warningElement = screen.getByText(/please enter a correct date/i);
  expect(warningElement).toBeInTheDocument();
});
