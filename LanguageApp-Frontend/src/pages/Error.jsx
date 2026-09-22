import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div>
      404 Not found
      <button>
        <Link to="/">Home</Link>
      </button>
    </div>
  );
}

export default ErrorPage;
