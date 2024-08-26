import { useEffect, useState } from "react";
import "./login.css";
import { useLocation, useNavigate } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);

export default function Login() {
  const code = useQuery().get("code");
  const token = localStorage.getItem("githubtoken")
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    } else if (code) {
      fetch("https://nls.natlang.online").then(d => {
        console.log(d);
      });
      setLoading(true);
      fetch(`https://nls.natlang.online/oauth?code=${code}`, { method: "POST" })
        .then(async (res) => {
          const data = await res.json();
          console.log("->", data);
          if (res.status != 200)
            throw Error("Failed to authenticate.");

          localStorage.setItem("githubtoken", JSON.stringify(data));
          setLoading(false);
          navigate("/");
        });
    }
  }, [code]);

  const redirectToGitHub = () => {
    const client_id = "Ov23lilAe90yeY8J0BOT";
    const redirect_uri = "http://localhost:5173/login";
    const scope = "read:user";
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  return loading ? <h4>Loading...</h4> : (
    <>
      <div className="login-container">
        <h2>Login</h2>
        <button className="github-button" onClick={redirectToGitHub}>
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          Login with GitHub
        </button>
      </div>
    </>
  );
}