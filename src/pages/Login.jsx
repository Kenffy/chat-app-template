import { useContext, useRef, useState } from "react";
import styles from "../assets/css/login.module.css";
import { loginAsync } from "../services/authServices";
import { getUserAsync } from "../services/services";
import { signInUser } from "../context/Actions";
import { Context } from "../context/Context";

export const Login = () => {
  const { dispatch } = useContext(Context);

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
    if (!emailRef?.current || !passwordRef?.current) {
      setError("Please provide your username and password.");
      return;
    }

    setLoading(true);

    const creds = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await loginAsync(creds);
      if (res?.user) {
        const currUser = await getUserAsync(res.user.uid);
        console.log(currUser);
        if (currUser) {
          dispatch(signInUser({ user: res.user, currentUser: currUser }));
          clearData();
          setLoading(false);
        }
      }
    } catch (err) {
      var message = err.code;
      setError(message);
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.heading}>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <span className={styles.errormsg}>{error}</span>}
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
          <span className={styles.link}>
            <a href="/register">No account? Register here.</a>
          </span>
        </form>
      </div>
    </div>
  );
};
