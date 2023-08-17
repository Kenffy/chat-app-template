import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css/register.module.css";
import { registerAsync } from "../services/authServices";

export const Register = () => {
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearData = () => {
    if (emailRef?.current) {
      emailRef.current.value = "";
    }
    if (usernameRef?.current) {
      usernameRef.current.value = "";
    }
    if (passwordRef?.current) {
      passwordRef.current.value = "";
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameRef?.current || !emailRef?.current || !passwordRef?.current) {
      setError("Please provide your username and password.");
      return;
    }

    setLoading(true);

    const creds = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await registerAsync(creds);
      clearData();
      setLoading(false);
      navigate("/login");
    } catch (err) {
      var message = err.code;
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.heading}>Register</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <span className={styles.errormsg}>{error}</span>}
          <input
            required
            ref={usernameRef}
            type="text"
            placeholder="Username"
          />
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
          <span className={styles.link}>
            <a href="/login">Already an account? Login here.</a>
          </span>
        </form>
      </div>
    </div>
  );
};
