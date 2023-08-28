import { useRef, useState } from "react";
import "../assets/css/register.css";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearData = () => {
    if (nameRef?.current) {
      nameRef.current.value = "";
    }
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
    // if (!nameRef?.current || !emailRef?.current || !passwordRef?.current) {
    //   setError("Please provide your username and password.");
    //   return;
    // }

    // setLoading(true);

    // const creds = {
    //   username: nameRef.current.value,
    //   email: emailRef.current.value,
    //   password: passwordRef.current.value,
    // };

    // try {
    //   await registerAsync(creds);
    //   clearData();
    //   setLoading(false);
    //   navigate("/login");
    // } catch (err) {
    //   var message = err.code;
    //   setError(message);
    //   setLoading(false);
    // }
  };

  return (
    <div className="register">
      <div className="wrapper">
        <h2 className="heading">Register</h2>
        <form className="form" onSubmit={handleSubmit}>
          {error && <span className="error-msg">{error}</span>}
          <input required ref={nameRef} type="text" placeholder="Username" />
          <input required ref={emailRef} type="email" placeholder="Email" />
          <input
            required
            ref={passwordRef}
            type="password"
            placeholder="Password"
          />
          <button disabled={loading} type="submit">
            {loading ? "Loading..." : "Register"}
          </button>
          <span className="link">
            <a href="/login">Already an account? Login here.</a>
          </span>
        </form>
      </div>
    </div>
  );
}
