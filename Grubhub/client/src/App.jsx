import React from "react";
import Main from "./components/Main";
import { Provider } from "react-redux";
import store from "./js/store"

//App Component
const App = () => {
  return (
    //Use Browser Router to route to different pages
    <Provider store={store}>
      <div>
        <Main />
      </div>
    </Provider>
  );
};
//Export the App component so that it can be used in index.js
export default App;
