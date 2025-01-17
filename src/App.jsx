import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useField } from "./hooks";

const Menu = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <div>
      <Link to={`/`} style={padding}>
        Anecdotes
      </Link>
      <Link to={`/new`} style={padding}>
        Create new
      </Link>
      <Link to={`/about`} style={padding}>
        About
      </Link>
    </div>
  );
};

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id;
  const anecdote = anecdotes.find((n) => n.id === Number(id));
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>{anecdote.author}</div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes &&
        anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            <Link to={`/anecdote/${anecdote.id}`}>{anecdote.content}</Link>
          </li>
        ))}
    </ul>
  </div>
);

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is "a story with a point."
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
    See{" "}
    <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{" "}
    for the source code.
  </div>
);

const CreateNew = (prop) => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("text");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("adding");
    console.log(content);
    console.log(author);
    console.log(info);
    prop.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    navigate("/");
  };

  const handleReset = () => {
    content.reset(), author.reset(), info.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            name="content"
            value={content.value}
            onChange={content.onChange}
            type={content.type}
          />
        </div>
        <div>
          author
          <input
            name="author"
            value={author.value}
            onChange={author.onChange}
            type={author.type}
          />
        </div>
        <div>
          url for more info
          <input
            name="info"
            value={info.value}
            onChange={info.onChange}
            type={info.type}
          />
        </div>
        <button type="submit">create</button>
        <button type="reset" onClick={handleReset}>
          Reset
        </button>
      </form>
    </div>
  );
};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState(null);

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
    setNotification(`Anecdote ${anecdote.content} was added!`);
  };

  useEffect(() => {
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, [notification]);

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        {notification && (
          <div>
            <p>{notification}</p>
          </div>
        )}
        <Routes>
          <Route
            path="/anecdote/:id"
            element={<Anecdote anecdotes={anecdotes} />}
          />
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/new"
            element={
              <CreateNew addNew={addNew} setNotification={setNotification} />
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
