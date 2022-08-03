import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import List from "./components/list";

const App = () => {
    return (
        <div class="container-fluid">
            <Navbar />
            <Routes>
                <Route exact path="/" element={ <List /> } />
            </Routes>
        </div>
    );
};

export default App;