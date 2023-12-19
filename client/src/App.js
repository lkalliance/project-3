import "./App.css";
import { Bookcase, Profile, Home } from "./pages";
import { NavBar } from "./components";
import { LoginForm } from "./components";
import { SignupForm } from "./components";
import { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { QUERY_ME, QUERY_BOOKCASE } from "./utils/queries";

import Auth from "./utils/auth";

import { useQuery } from "@apollo/client";
export const SignupContext = createContext();

function App() {
  // set current year as default

  const today = new Date();
  const thisYear = parseInt(today.getFullYear());
  const [books, setBooks] = useState({
    fetched: false,
    userName: "",
    bookList: [],
  });
  const [bookCase, setBookCase] = useState({
    fetched: false,
    year: "",
    user_id: "",
    shelves: [
      { left: [], right: [] },
      { left: [], right: [] },
    ],
    unshelved: [],
  });
  const [year, setYear] = useState(thisYear.toString());
  const [uFetched, setUFetched] = useState(false);
  const [bFetched, setBFetched] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showloginModal, setShowloginModal] = useState(false);

  const setTheBooks = (data) => {
    setBooks({ ...data, fetched: true });
  };

  const setTheCase = (data) => {
    setBookCase(
      data.shelves
        ? { ...data, fetched: true }
        : {
            fetched: false,
            year: "",
            user_id: "",
            shelves: [
              { left: [], right: [] },
              { left: [], right: [] },
            ],
            unshelved: [],
          }
    );
  };

  const { loading: loadingMe, data: dataMe } = useQuery(QUERY_ME, {
    variables: { fetchMe: !books.fetched },
  });
  const { loading: loadingCase, data: dataCase } = useQuery(QUERY_BOOKCASE, {
    variables: { year, fetchMe: !bookCase.fetched },
  });

  if (Auth.loggedIn() && !loadingMe && !books.fetched) {
    try {
      setTheBooks({ ...dataMe.me });
    } catch {
      console.log("No dataMe.");
    }
  }
  if (
    Auth.loggedIn() &&
    !loadingCase &&
    !bookCase.fetched &&
    dataCase &&
    dataCase.bookcase.year === year
  ) {
    try {
      setTheCase({ ...dataCase.bookcase });
    } catch {
      console.log("No dataCase");
    }
  } else if (
    Auth.loggedIn() &&
    !loadingCase &&
    !bookCase.fetched &&
    dataCase &&
    dataCase.bookcase.year !== year
  ) {
    setBookCase({
      fetched: true,
      year: "",
      user_id: "",
      shelves: [
        { left: [], right: [] },
        { left: [], right: [] },
      ],
      unshelved: [],
    });
  }
  return (
    <SignupContext.Provider
      value={{
        showloginModal,
        setShowloginModal,
        showSignupModal,
        setShowSignupModal,
      }}
    >
      <div className="App">
        {showloginModal ? (
          <LoginForm uSetBooks={setBooks} uSetCase={setBookCase} uYear={year} />
        ) : (
          <div></div>
        )}
        {showSignupModal ? (
          <SignupForm
            uSetBooks={setBooks}
            uSetCase={setBookCase}
            uYear={year}
          />
        ) : (
          <div></div>
        )}
        <NavBar
          showLogin={setShowloginModal}
          uBooks={books}
          uSetBooks={setBooks}
          uYear={year}
          uCase={bookCase}
          uSetCase={setBookCase}
          uSetFetched={setUFetched}
          bSetFetched={setBFetched}
        />
        <Routes>
          <Route
            path="/"
            element={
              Auth.loggedIn() ? (
                <Profile
                  uBooks={books}
                  uYear={year}
                  uSetYear={setYear}
                  uCase={bookCase}
                  uSetCase={setBookCase}
                />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/profile"
            element={
              Auth.loggedIn() ? (
                <Profile
                  uBooks={books}
                  uYear={year}
                  uSetYear={setYear}
                  uCase={bookCase}
                  uSetCase={setBookCase}
                />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/bookcase"
            element={
              Auth.loggedIn() ? (
                <Bookcase
                  uBooks={books}
                  uCase={bookCase}
                  uSetBooks={setBooks}
                  uSetCase={setBookCase}
                  uYear={year}
                  uSetYear={setYear}
                />
              ) : (
                <Home />
              )
            }
          />
          <Route
            path="/*"
            element={
              Auth.loggedIn() ? (
                <Bookcase
                  uBooks={books}
                  uCase={bookCase}
                  uSetBooks={setBooks}
                  uSetCase={setBookCase}
                  uYear={year}
                />
              ) : (
                <Home />
              )
            }
          />
        </Routes>
      </div>
    </SignupContext.Provider>
  );
}

export default App;
