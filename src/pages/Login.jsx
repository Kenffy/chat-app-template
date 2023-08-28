import { useRef, useState } from "react";
import "../assets/css/login.css";

export default function Login({ setUser }) {
  //const { dispatch } = useContext(Context);

  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearData = () => {
    if (emailRef?.current) {
      emailRef.current.value = "";
    }
    if (passwordRef?.current) {
      passwordRef.current.value = "";
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUser(true);
    // if (!emailRef?.current || !passwordRef?.current) {
    //   setError("Please provide your username and password.");
    //   return;
    // }

    // setLoading(true);

    // const creds = {
    //   email: emailRef.current.value,
    //   password: passwordRef.current.value,
    // };

    // try {
    //   const res = await loginAsync(creds);
    //   if (res?.user) {
    //     const currUser = await getUserAsync(res.user.uid);
    //     if (currUser) {
    //       dispatch(signInUser({ user: res.user, currentUser: currUser }));
    //       clearData();
    //       setLoading(false);
    //     }
    //   }
    // } catch (err) {
    //   var message = err.code;
    //   setError(message);
    //   setLoading(false);
    // }
  };

  return (
    <div className="login">
      <div className="wrapper">
        <h2 className="heading">Login</h2>
        <form className="form" onSubmit={handleSubmit}>
          {error && <span className="error-msg">{error}</span>}
          <input required ref={emailRef} type="email" placeholder="Email" />
          <input
            required
            ref={passwordRef}
            type="password"
            placeholder="Password"
          />
          <button disabled={loading} type="submit">
            {loading ? "Loading..." : "Login"}
          </button>
          <span className="link">
            <a href="/register">No account? Register here.</a>
          </span>
        </form>
      </div>
    </div>
  );
}
