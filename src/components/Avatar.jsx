import NoAvatar from "../assets/images/avatar.png";

export default function Avatar({ src, username, height, width }) {
  const style = {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  };
  return (
    <div style={style}>
      <img
        src={src ? src : NoAvatar}
        alt=""
        style={{
          height: `${height}px`,
          width: `${width}px`,
          objectFit: `cover`,
          borderRadius: `0.5rem`,
        }}
      />
      {username && (
        <span style={{ fontSize: "1rem", fontWeight: "500" }} className="usern">
          {username ? username : "John Doe"}
        </span>
      )}
    </div>
  );
}
