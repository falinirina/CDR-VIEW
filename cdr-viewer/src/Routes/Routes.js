import { Route, BrowserRouter, Routes } from "react-router-dom";
import AdminNavBar from "../Pages/NavBar";
import Home from "../Pages/Home";
import SignIn from "../Pages/Connection";

const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<SignIn />} />
                    <Route path='admin'element={<AdminNavBar />}>
                        <Route index element={<Home />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes