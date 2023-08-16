import "../assets/css/message.css";

export const Message = ({ owner }) => {
  return (
    <div className={owner ? "message owner" : "message"}>
      <div className="message-wrapper">
        <div className="image-wrapper">
          <img
            src="https://ichef.bbci.co.uk/images/ic/1200xn/p0d263np.png"
            alt=""
          />
        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <span>2 days ago</span>
    </div>
  );
};
