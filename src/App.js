import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import SignIn from "./pages/signin.js";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import { createClient } from "@supabase/supabase-js";
import Search from "./pages/Search";
const supabase = createClient(
    "https://hiiwioouscmwdgfhobom.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyODA0MTA5NiwiZXhwIjoxOTQzNjE3MDk2fQ.uMF3eAqCD2zgJnJJL6h2rKYSH-d2H6rsGrXGF74X-70"
);

function App() {
    console.log(supabase.auth.user().id);
    return (
        <Router>
            {supabase.auth.user().id == undefined ? <Redirect to='/signin'></Redirect> : <div></div>}
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div className='page'>
                    <Switch>
                        <Route path='/signin'>
                            <h1>SIGN IN</h1>
                            <SignIn></SignIn>
                        </Route>
                        <Route path='/home'>
                            <Home></Home>
                        </Route>
                        <Route path='/create'>
                            <Create></Create>
                        </Route>
                        <Route path='/search'>
                            <Search></Search>
                        </Route>
                        <Route path='/'>
                            <Home></Home>
                        </Route>
                    </Switch>
                </div>
                <Navbar></Navbar>
            </div>
        </Router>
    );
}

export default App;
